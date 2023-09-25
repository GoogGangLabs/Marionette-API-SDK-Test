import { EventEmitter } from "events";

export type PeerType = "stream" | "data" | "metadata";

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

export interface OptimizationSessionList {
  data: Uint8Array[];
}

export interface OptimizationSession {
  sessionId: string;
  roomId: string;
  // fps: number; todo
  sequence: number;
  optimizedValue: number;
  results: Buffer;
}

export class FetchConfigurations<T> {
  host: string;
  method?: "GET" | "POST" | "PATCH";
  body?: T;
}

export interface SignalingRequest {
  roomId: string;
  nickname: string;
  streamSdp: string;
  dataSdp: string;
  metadataSdp: string;
}

export interface SignalingResponse {
  streamSdp: string;
  dataSdp: string;
  metadataSdp: string;
}
