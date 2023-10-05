import { EventState, MetadataType } from './enum';
import { ChatTemplate, MetadataTemplate, RoomTemplate, SystemTemplate, UserTemplate } from './types';
import { Constraint } from './constant';
import { metadataTemplate } from './proto';

export type MetadataTypes = UserTemplate | RoomTemplate | ChatTemplate | SystemTemplate | any;

class Metadata implements MetadataTemplate {
  type: MetadataType;
  source: string;
  timestamp: number;
  data: MetadataTypes;

  constructor(type: MetadataType, source: string, timestamp: number) {
    this.type = type;
    this.source = source;
    this.timestamp = timestamp;
  }
}

export const serializeMetadata = (sessionId: string, data: ChatTemplate | string, target?: string[]): Uint8Array => {
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
  const metadata = new Metadata(data.type, data.source, data.timestamp);

  switch (data.type) {
    case MetadataType.ROOM:
      if (data.user) metadata.data = data.user;
      else metadata.data = data.room;
      break;

    case MetadataType.CHAT:
      metadata.data = data.chat;
      break;

    case MetadataType.SYSTEM:
      metadata.data = data.system;
      break;

    default:
      try {
        metadata.data = JSON.parse(data.object);
      } catch (err) {
        Constraint.event.emit(EventState.ERROR, err);
        return;
      }
  }

  Constraint.event.emit(EventState.METADATA_EVENT, metadata);
};
