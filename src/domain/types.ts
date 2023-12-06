import { EventEmitter } from 'events';
import { ChatTemplate, RoomTemplate, SessionTemplate, SystemTemplate, UserTemplate } from '../pb/session';
import { PayloadType, SystemEvent, Target, UserRole, UserState } from '../pb/constraint';

export type SessionDtoTypes = UserTemplate | RoomTemplate | ChatTemplate | SystemTemplate | string;

export class SessionTemplateDto<T = SessionDtoTypes> implements SessionTemplate {
  type: PayloadType;
  targetType: Target;
  source: string;
  targets: string[];
  timestamp: number;
  data: T;

  constructor(source: string, timestamp: number) {
    this.source = source;
    this.timestamp = timestamp;
  }
}

export class UserTemplateDto implements UserTemplate {
  sessionId: string;
  nickname: string;
  role: UserRole;
  state: UserState;
}

export class RoomTemplateDto implements RoomTemplate {
  roomId: string;
  ownerId: string;
  name: string;
  timestamp: number;
  maxCount: number;
  users: UserTemplate[];
}

export class ChatTemplateDto implements ChatTemplate {
  message: string;
}

export class SystemTemplateDto implements SystemTemplate {
  type: SystemEvent;
  source: string;
  message: string;
}

export interface EventMap {
  LOAD_STREAM: MediaStream;
  ICE_CANDIDATE: RTCIceCandidateType;
  ICE_CONNECTION: RTCPeerConnectionState;
  BLENDSHAPE_EVENT: StreamSession[];
  SESSION_USER_EVENT: SessionTemplateDto<UserTemplateDto>;
  SESSION_ROOM_EVENT: SessionTemplateDto<RoomTemplateDto>;
  SESSION_CHAT_EVENT: SessionTemplateDto<ChatTemplateDto>;
  SESSION_SYSTEM_EVENT: SessionTemplateDto<SystemTemplateDto>;
  SESSION_OBJECT_EVENT: SessionTemplateDto<any>;
  ERROR: any;
}

export interface ICECredential {
  username: string;
  credential: string;
  iceHost: string;
}

export interface MarionetteConstraint {
  event: EventEmitter;
  host: string;
  token: string;
  iceCredential: ICECredential;
}

export interface MarionetteConfigurations {
  token: string;
  roomName?: string;
  nickName?: string;
}

export interface StreamConfigurations {
  deviceId?: string;
  width?: number;
  height?: number;
  frameRate?: number;
}

export type BlendshapeResult = number[];

export class StreamSession {
  sessionId: string;
  roomId: string;
  data: Buffer;
  sequence: number;
  fps: number;
  startedAt: number;
  proceededAt: number;
  dataSizes: number[];
  proceededTimes: number[];
  elapsedTimes: number[];
  blendshapes?: BlendshapeResult;
}

export class LatencyManager {
  sessionId: string;
  roomId: string;
  startedAt = Date.now();
  count: number = 0;
  sequence: number;
  fps: number[] = [];
  dataSizes: number[][] = [];
  elapsedTimes: number[][] = [];
  proceededTimes: number[][] = [];

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  setRoomId(roomId: string) {
    this.roomId = roomId;
  }
}

export class FetchConfigurations<T> {
  host: string;
  method?: 'GET' | 'POST' | 'PATCH';
  body?: T;
}
