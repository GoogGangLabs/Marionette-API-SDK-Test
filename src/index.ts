import { EventEmitter } from "events";
import protobuf from "protobufjs";
import pako from "pako";

import {
  StreamConfigurations,
  SerializeLandmarks,
  StreamResponse,
  DeserializeLandmarks,
  LandmarkPoint,
  SerializeLandmark,
  MarionetteConfiguration,
  TurnCredential,
  SignalingRequest,
  SignalingResponse,
} from "./types";
import { ErrorMessage, EventStatus, CandidateType } from "./enum";
import { drawConnectors, drawLandmarks, HAND_CONNECTIONS, POSE_CONNECTIONS, FACEMESH_TESSELATION } from "./draw";

const OPTIMIZE_OFFSET = 10000;

const protoSchema = `
syntax = "proto3";

package streampackage;

message OptimizedInferenceObject {
  repeated int32 face = 1;
  repeated int32 left_hand = 2;
  repeated int32 right_hand = 3;
  repeated int32 pose = 4;
  repeated int32 pose_world = 5;
}

message StreamResponse {
  string sessionId = 1;
  string roomId = 2;
  int32 fps = 3;
  int32 sequence = 4;
  float optimizedValue = 5;
  bytes results = 6;
}
`;

const host = "https://phase3.goodganglabs.xyz";
const protobufRoot = protobuf.parse(protoSchema, { keepCase: true }).root;
const streamMessage = protobufRoot.lookupType("streampackage.StreamResponse");
const event = new EventEmitter();

function CatchError(target: any, _: any, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args: any) {
    try {
      return await method.apply(target, args);
    } catch (err) {
      event.emit(EventStatus.ERROR, err);
    }
  };
}

function PeerConnectionGuard(target: any, _: any, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  /*
    connection이 초기화 되었는 지 확인하는 decorator
    The init() method was not called.
  */
}

function StreamGuard(target: any, _: any, descriptor: PropertyDescriptor) {
  const method = descriptor.value;

  /*
    connection이 초기화 되었는 지 확인하는 decorator
    The init() method was not called.
  */
}

class MarionetteClient {
  private config: StreamConfigurations = {};

  private streamPeerConnection: RTCPeerConnection = undefined;
  private dataPeerConnection: RTCPeerConnection = undefined;
  private dataChannel: RTCDataChannel = undefined;
  private publishFlag = false;
  private stream: MediaStream = undefined;

  private token: string;

  constructor(config: MarionetteConfiguration) {
    this.config.deviceId = "";
    this.config.width = 320;
    this.config.height = 240;
    this.config.frameRate = 30;
    this.config.bitrate = 50000;
    this.config.candidateType = CandidateType.STUN;
    this.config.debug = false;

    this.token = config.token;
  }

  /* ========================================== */
  /*                Public Method               */
  /* ========================================== */

  public on = (name: EventStatus, listener: (...args: any[]) => void) => event.on(name, listener);

  @CatchError
  public async init(): Promise<void> {
    try {
      this.streamPeerConnection = await this.createPeerConnection();
      this.dataPeerConnection = await this.createPeerConnection();
      this.dataChannel = this.dataPeerConnection.createDataChannel("message");
      this.dataChannel.onmessage = (e: MessageEvent<StreamResponse>) => event.emit(EventStatus.STREAM_RESULT, e);
    } catch (err) {
      event.emit(EventStatus.ERROR, { message: ErrorMessage.UNAUTHORIZED });
    }
  }

  @CatchError
  public async loadStream(config?: StreamConfigurations): Promise<MediaStream> {
    this.setStreamConfiguration(config || {});
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: this.config.deviceId,
        width: this.config.width,
        height: this.config.height,
        frameRate: { ideal: this.config.frameRate, min: 5 },
      },
    });
    return this.stream;
  }

  @CatchError
  public async closeStream(): Promise<void> {
    this.stream.getTracks().forEach((track) => track.stop());
    this.stream = undefined;
  }

  @PeerConnectionGuard
  @StreamGuard
  @CatchError
  public async publish(roomId: string) {
    if (this.publishFlag) return;
    this.publishFlag = true;

    this.stream.getTracks().forEach((track) => this.streamPeerConnection.addTrack(track, this.stream));

    const sender = this.streamPeerConnection.getSenders()[0];
    const parameters = sender.getParameters();

    try {
      if (!parameters.encodings) parameters.encodings = [{}];
      parameters.encodings[0].maxBitrate = this.config.bitrate;
      await sender.setParameters(parameters);
    } catch (_) {}

    await this.streamPeerConnection
      .createOffer()
      .then(async (offer) => await this.streamPeerConnection.setLocalDescription(offer));
    await this.dataPeerConnection
      .createOffer()
      .then(async (offer) => await this.dataPeerConnection.setLocalDescription(offer));

    await Promise.all([
      this.waitForGathering(this.streamPeerConnection),
      this.waitForGathering(this.dataPeerConnection),
    ]);

    const answer: SignalingResponse = await (
      await fetch(`${host}/v0/session/join`, {
        method: "POST",
        cache: "no-cache",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.token}` },
        body: JSON.stringify({
          roomId: roomId,
          webRtcSdp: btoa(JSON.stringify(this.streamPeerConnection.localDescription)),
          dataChannelSdp: btoa(JSON.stringify(this.dataPeerConnection.localDescription)),
        } as SignalingRequest),
      })
    ).json();

    this.streamPeerConnection.setRemoteDescription(JSON.parse(atob(answer.webRtcSdp)));
    this.streamPeerConnection.setRemoteDescription(JSON.parse(atob(answer.dataChannelSdp)));
  }

  @PeerConnectionGuard
  @StreamGuard
  @CatchError
  public async stop() {
    if (!this.publishFlag) return;
    this.publishFlag = false;

    // todo: PeerConnection에서 stream 삭제하는 로직 강화
    this.streamPeerConnection.getTransceivers().forEach((transceiver) => {
      transceiver.stop();
    });
    this.streamPeerConnection.getSenders().forEach((sender) => {
      if (sender.track) sender.track.stop();
    });
    this.dataChannel.close();
    this.streamPeerConnection.close();
    this.dataPeerConnection.close();
    this.dataChannel = undefined;
    this.streamPeerConnection = undefined;
    this.dataPeerConnection = undefined;
    event.removeAllListeners();
  }

  public getDevices = async () => {
    return (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === "videoinput");
  };

  @PeerConnectionGuard
  @StreamGuard
  public getStream() {
    return this.stream;
  }

  @PeerConnectionGuard
  public drawUtils(canvas: HTMLCanvasElement, result: DeserializeLandmarks) {
    const context = canvas.getContext("2d");

    context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);

    // todo: pose만 선택했을 때, 얼굴과 손 위치 좌표를 넣어야 할 듯
    if (result.pose && result.pose.length > 0) {
      for (let i = 0; i < 23; i++) {
        if (i > 10 && i < 17) continue;
        result.pose[i] = { x: 0, y: 0, z: 0, visibility: 0 };
      }
    }

    drawConnectors(context, result.pose, POSE_CONNECTIONS, { color: "#00cff7", lineWidth: 4 });
    drawLandmarks(context, result.pose, { color: "#ff0364", lineWidth: 2 });
    drawConnectors(context, result.face, FACEMESH_TESSELATION, {
      color: "#C0C0C070",
      lineWidth: 1,
    });
    drawConnectors(context, result.left_hand, HAND_CONNECTIONS, {
      color: "#eb1064",
      lineWidth: 5,
    });
    drawLandmarks(context, result.left_hand, { color: "#00cff7", lineWidth: 2 });
    drawConnectors(context, result.right_hand, HAND_CONNECTIONS, {
      color: "#22c3e3",
      lineWidth: 5,
    });
    drawLandmarks(context, result.right_hand, { color: "#ff0364", lineWidth: 2 });
  }

  /* ========================================== */
  /*               Private Method               */
  /* ========================================== */

  private getTurnCredential = async (): Promise<TurnCredential> => {
    return await (
      await fetch(`${host}/v0/session/credential`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
    ).json();
  };

  private createPeerConnection = async () => {
    const turnInfo = await this.getTurnCredential();
    const iceServers = [
      { urls: ["stun:stun.l.google.com:19302"] },
      {
        urls: "turn:turn.goodganglabs.xyz:3478",
        username: turnInfo.username,
        credential: turnInfo.credential,
      },
    ];
    return new RTCPeerConnection({ iceServers });
  };

  private waitForGathering = (peerConnection: RTCPeerConnection): Promise<void> => {
    return new Promise((resolve) => {
      if (peerConnection.iceGatheringState === "complete") {
        resolve();
      } else {
        const checkState = () => {
          if (peerConnection.iceGatheringState === "complete") {
            peerConnection.removeEventListener("icegatheringstatechange", checkState);
            resolve();
          }
        };
        peerConnection.addEventListener("icegatheringstatechange", checkState);
      }
    });
  };

  private dataHandler = (buffer: Buffer) => {
    const decompressedBuffer = pako.ungzip(buffer);
    const decoded = streamMessage.decode(decompressedBuffer);
    const data = streamMessage.toObject(decoded, {
      longs: String,
      enums: String,
      bytes: String,
    }) as StreamResponse;
  };

  private deserializeLandmark = (landmark: SerializeLandmark, length: number) => {
    if (!landmark || !landmark.length) return undefined;
    const limitFlag = length !== 33 ? 3 : 4;
    const deserialLandmarks = [];
    for (let idx = 0; idx < length; idx++) {
      const correctIndex = idx * limitFlag;
      const desirialLandmark: LandmarkPoint = {
        x: (landmark[correctIndex] - 1) / OPTIMIZE_OFFSET,
        y: (landmark[correctIndex + 1] - 1) / OPTIMIZE_OFFSET,
        z: (landmark[correctIndex + 2] - 1) / OPTIMIZE_OFFSET,
      };
      if (limitFlag === 4) desirialLandmark.visibility = (landmark[correctIndex + 3] - 1) / OPTIMIZE_OFFSET;
      deserialLandmarks.push(desirialLandmark);
    }
    return deserialLandmarks;
  };

  private deserializeResult = (result: SerializeLandmarks) => {
    return {
      face: this.deserializeLandmark(result.face, 478),
      left_hand: this.deserializeLandmark(result.left_hand, 21),
      right_hand: this.deserializeLandmark(result.right_hand, 21),
      pose: this.deserializeLandmark(result.pose, 33),
      pose_world: this.deserializeLandmark(result.pose_world, 33),
    };
  };

  private setStreamConfiguration = (config: StreamConfigurations) => {
    this.config.deviceId = config.deviceId || this.config.deviceId;
    this.config.width = config.width || this.config.width;
    this.config.height = config.height || this.config.height;
    this.config.frameRate = config.frameRate || this.config.frameRate;
    this.config.bitrate = config.bitrate || this.config.bitrate;
    this.config.candidateType = config.candidateType || this.config.candidateType;
    this.config.debug = config.debug || this.config.debug;
  };
}

export { MarionetteClient };
