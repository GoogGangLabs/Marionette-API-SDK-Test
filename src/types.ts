import { CandidateType } from "./enum";

export interface MarionetteConfiguration {
  token: string;
}

export interface TurnCredential {
  username: string;
  credential: string;
}

export interface SignalingRequest {
  roomId: string;
  webRtcSdp: string;
  dataChannelSdp: string;
}

export interface SignalingResponse {
  webRtcSdp: string;
  dataChannelSdp: string;
}

export interface StreamConfigurations {
  deviceId?: string;
  width?: number;
  height?: number;
  frameRate?: number;
  bitrate?: number;
  candidateType?: CandidateType;
  debug?: boolean;
}

export interface LandmarkPoint {
  x?: number;
  y?: number;
  z?: number;
  visibility?: number;
}

export type DeserializeLandmark = LandmarkPoint[];

export interface DeserializeLandmarks {
  face?: DeserializeLandmark;
  left_hand?: DeserializeLandmark;
  right_hand?: DeserializeLandmark;
  pose?: DeserializeLandmark;
  pose_world?: DeserializeLandmark;
}

export type SerializeLandmark = number[];

export interface SerializeLandmarks {
  face?: SerializeLandmark;
  left_hand?: SerializeLandmark;
  right_hand?: SerializeLandmark;
  pose?: SerializeLandmark;
  pose_world?: SerializeLandmark;
}

export interface StreamResponse {
  sessionId: string;
  roomId: string;
  fps: number;
  sequence: number;
  optimizedValue: number;
  result: Buffer;
}

export type LandmarkConnectionArray = Array<[number, number]>;

export type Fn<I, O> = (input: I) => O;

export interface Data {
  index?: number;
  from?: DeserializeLandmarks;
  to?: DeserializeLandmarks;
}

export interface DrawingOptions {
  color?: string | CanvasGradient | CanvasPattern | Fn<Data, string | CanvasGradient | CanvasPattern>;
  fillColor?: string | CanvasGradient | CanvasPattern | Fn<Data, string | CanvasGradient | CanvasPattern>;
  lineWidth?: number | Fn<Data, number>;
  radius?: number | Fn<Data, number>;
  visibilityMin?: number;
}
