import { EventState } from './enum';
import { Session } from './types';
import { Constraint } from './constant';
import { DataType, TargetType } from './pb/constraint';
import { ChatTemplate, RoomTemplate, SessionTemplate, SystemTemplate, UserTemplate } from './pb/session';

export type MetadataTypes = UserTemplate | RoomTemplate | ChatTemplate | SystemTemplate | any;

export const serializeSessionData = (
  sessionId: string,
  type: DataType,
  data: ChatTemplate | object,
  target?: string[],
): Uint8Array => {
  const session: SessionTemplate = {
    type: type,
    targetType: TargetType.GLOBAL,
    source: sessionId,
    target: target || [],
    timestamp: Date.now(),
  };

  if (type === DataType.CHAT) {
    session.chat = data as ChatTemplate;
  } else {
    session.object = JSON.stringify(data);
  }

  const message = SessionTemplate.create(session);
  const buffer = SessionTemplate.encode(message).finish();

  return buffer;
};

export const consumeSessionData = (data: SessionTemplate) => {
  const session = new Session(data.source, data.timestamp);
  let event: EventState;

  switch (data.type) {
    case DataType.ROOM:
      if (data.user) {
        session.data = data.user;
        event = EventState.SESSION_USER_EVENT;
      } else {
        session.data = data.room;
        event = EventState.SESSION_ROOM_EVENT;
      }
      break;

    case DataType.CHAT:
      session.data = data.chat;
      event = EventState.SESSION_CHAT_EVENT;
      break;

    case DataType.SYSTEM:
      session.data = data.system;
      event = EventState.SESSION_SYSTEM_EVENT;
      break;

    default:
      try {
        session.data = JSON.parse(data.object);
        event = EventState.SESSION_OBJECT_EVENT;
      } catch (err) {
        Constraint.event.emit(EventState.ERROR, err);
        return;
      }
  }

  Constraint.event.emit(event, session);
};
