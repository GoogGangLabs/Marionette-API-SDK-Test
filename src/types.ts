import { EventEmitter } from 'events';
import { ChatTemplate, RoomTemplate, SessionTemplate, SystemTemplate, UserTemplate } from './pb/session';
import { DataType, TargetType } from './pb/constraint';
import { StreamStruct } from './pb/stream';

export type PeerType = 'media' | 'broadcast' | 'session';

export type SessionTypes = UserTemplate | RoomTemplate | ChatTemplate | SystemTemplate | any;

export class Session<T = SessionTypes> implements SessionTemplate {
  type: DataType;
  targetType: TargetType;
  source: string;
  target: string[];
  timestamp: number;
  data: T;

  constructor(source: string, timestamp: number) {
    this.source = source;
    this.timestamp = timestamp;
  }
}

export interface EventMap {
  LOAD_STREAM: MediaStream;
  ICE_CANDIDATE_TYPE: RTCIceCandidateType;
  CONNECTION_STATE: RTCPeerConnectionState;
  BLENDSHAPE_EVENT: OptimizationSession[];
  SESSION_USER_EVENT: Session<UserTemplate>;
  SESSION_ROOM_EVENT: Session<RoomTemplate>;
  SESSION_CHAT_EVENT: Session<ChatTemplate>;
  SESSION_SYSTEM_EVENT: Session<SystemTemplate>;
  SESSION_OBJECT_EVENT: Session<any>;
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
  roomId?: string;
  nickname?: string;
}

export interface StreamConfigurations {
  deviceId?: string;
  width?: number;
  height?: number;
  frameRate?: number;
}

export type BlendshapeResult = number[];

export interface OptimizationSession extends StreamStruct {
  sessionId: string;
  roomId: string;
  blendshapes?: BlendshapeResult;
  latency: number;
  fps: number;
  sequence: number;
  startedAt: number;
  dataSizes: number[];
  elapsedTimes: number[];
  proceededTimes: number[];
}

export class FetchConfigurations<T> {
  host: string;
  method?: 'GET' | 'POST' | 'PATCH';
  body?: T;
}

export interface IceCredentialResponse {
  sessionId: string;
  username: string;
  credential: string;
  iceHost: string;
}

export interface SignalingRequest {
  roomId: string;
  nickname: string;
  mediaSdp: string;
  broadcastSdp: string;
  sessionSdp: string;
}

export interface SignalingResponse {
  mediaSdp: string;
  broadcastSdp: string;
  sessionSdp: string;
}
