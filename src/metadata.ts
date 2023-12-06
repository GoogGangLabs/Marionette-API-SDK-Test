import { EventState } from './domain/enum';
import { ChatTemplateDto, SessionTemplateDto } from './domain/types';
import { Constraint } from './domain/constant';
import { ChatTemplate, SessionTemplate } from './pb/session';
import { PayloadType, Target } from './pb/constraint';

export const serializeMetadata = (sessionId: string, data: ChatTemplate | object, target?: string[]): Uint8Array => {
  const type = data instanceof ChatTemplateDto ? PayloadType.PAYLOAD_TYPE_CHAT : PayloadType.PAYLOAD_TYPE_OBJECT;
  const targetType =
    target && target.length > 1
      ? Target.TARGET_GROUP
      : target && target.length === 1
      ? Target.TARGET_SINGLE
      : Target.TARGET_BROADCAST;
  const metadata: SessionTemplate = {
    type: type,
    targetType: targetType,
    source: sessionId,
    targets: target || [],
    timestamp: 0,
  };

  if (data instanceof ChatTemplateDto) metadata.chat = data;
  else metadata.object = JSON.stringify(data);

  const message = SessionTemplate.create(metadata);
  const buffer = SessionTemplate.encode(message).finish();

  return buffer;
};

export const consumeMetadata = (data: SessionTemplate) => {
  const metadata = new SessionTemplateDto(data.source, data.timestamp);
  let event: EventState;

  switch (data.type) {
    case PayloadType.PAYLOAD_TYPE_ROOM:
      if (data.user) {
        metadata.data = data.user;
        event = EventState.SESSION_USER_EVENT;
      } else {
        metadata.data = data.room;
        event = EventState.SESSION_ROOM_EVENT;
      }
      break;

    case PayloadType.PAYLOAD_TYPE_CHAT:
      metadata.data = data.chat;
      event = EventState.SESSION_CHAT_EVENT;
      break;

    case PayloadType.PAYLOAD_TYPE_SYSTEM:
      metadata.data = data.system;
      event = EventState.SESSION_SYSTEM_EVENT;
      break;

    default:
      try {
        metadata.data = JSON.parse(data.object);
        event = EventState.SESSION_OBJECT_EVENT;
      } catch (err) {
        Constraint.event.emit(EventState.ERROR, err);
        return;
      }
  }

  Constraint.event.emit('SESSION_EVENT', metadata);
};
