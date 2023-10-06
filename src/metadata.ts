import { EventState, MetadataType } from './enum';
import { ChatTemplate, MetadataTemplate, RoomTemplate, SystemTemplate, UserTemplate } from './types';
import { Constraint } from './constant';
import { metadataTemplate } from './proto';

export type MetadataTypes = UserTemplate | RoomTemplate | ChatTemplate | SystemTemplate | any;

class Metadata<T = MetadataTypes> implements MetadataTemplate {
  source: string;
  timestamp: number;
  data: T;

  constructor(source: string, timestamp: number) {
    this.source = source;
    this.timestamp = timestamp;
  }
}

export const serializeMetadata = (sessionId: string, data: ChatTemplate | object, target?: string[]): Uint8Array => {
  const metadata: MetadataTemplate = {
    source: sessionId,
    target: target || [],
  };

  if (data instanceof ChatTemplate) {
    metadata.type = MetadataType.CHAT;
    metadata.chat = data;
  } else {
    metadata.type = MetadataType.OBJECT;
    metadata.object = JSON.stringify(data);
  }

  const message = metadataTemplate.create(metadata);
  const buffer = metadataTemplate.encode(message).finish();

  return buffer;
};

export const consumeMetadata = (data: MetadataTemplate) => {
  const metadata = new Metadata(data.source, data.timestamp);
  let event: EventState;

  switch (data.type) {
    case MetadataType.ROOM:
      if (data.user) {
        metadata.data = data.user;
        event = EventState.METADATA_USER_EVENT;
      } else {
        metadata.data = data.room;
        event = EventState.METADATA_ROOM_EVENT;
      }
      break;

    case MetadataType.CHAT:
      metadata.data = data.chat;
      event = EventState.METADATA_CHAT_EVENT;
      break;

    case MetadataType.SYSTEM:
      metadata.data = data.system;
      event = EventState.METADATA_SYSTEM_EVENT;
      break;

    default:
      try {
        metadata.data = JSON.parse(data.object);
        event = EventState.METADATA_OBJECT_EVENT;
      } catch (err) {
        Constraint.event.emit(EventState.ERROR, err);
        return;
      }
  }

  Constraint.event.emit(event, metadata);
};
