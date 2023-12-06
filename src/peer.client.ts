import pako from 'pako';
import { EventState } from './domain/enum';
import { Constraint, Sleep } from './domain/constant';
import { LatencyManager, StreamSession } from './domain/types';
import { ClassBinding } from './decorator';
import { consumeMetadata } from './metadata';
import { SerializedStream, StreamStruct } from './pb/stream';
import { SessionTemplate } from './pb/session';
import { RequestSource } from './pb/constraint';
import { Request } from './request';

@ClassBinding
export class RTCPeerClient {
  private type: RequestSource;

  private sessionId: string;
  private roomId: string = undefined;

  private peerConnection: RTCPeerConnection = null;
  private dataChannel: RTCDataChannel = null;
  private latencyManager: LatencyManager = null;
  private stream: MediaStream = null;
  private offer: string = null;

  private streamStatus: boolean = false;
  private offerStatus: boolean = false;
  private connectStatus: boolean = false;
  private publishStatus: boolean = false;

  constructor(type: RequestSource) {
    this.type = type;
  }

  /* ========================================== */
  /*                Public Method               */
  /* ========================================== */

  public init = async (sessionId: string): Promise<void> => {
    this.sessionId = sessionId;

    this.release();
    await this.createPeerConnection();
    if (this.type !== RequestSource.REQUEST_SOURCE_MEDIA_BRIDGE) this.createDataChannel();
    if (this.type === RequestSource.REQUEST_SOURCE_DATA_BRIDGE) this.latencyManager = new LatencyManager(sessionId);
  };

  public release = () => {
    this.pause();
    this.closeDataChannel();
    this.closePeerConnection();

    this.roomId = undefined;
    this.streamStatus = false;
    this.offerStatus = false;
    this.connectStatus = false;
    this.publishStatus = false;
  };

  public isInitialized = () => this.peerConnection !== null;
  public isStreamSet = () => this.streamStatus;
  public isOfferSet = () => this.offerStatus;
  public isConnected = () => this.connectStatus;
  public isPublished = () => this.publishStatus;

  public getStream = () => this.stream;
  public getOffer = async (): Promise<string> => {
    for (let _ = 0; _ < 3000; _++) {
      if (this.offer) return this.offer;
      await Sleep(10);
    }

    throw new Error('ICE candidate failed');
  };

  public setRoomId = (roomId: string) => {
    this.roomId = roomId;
  };

  public setStream = (stream: MediaStream) => {
    this.stream = stream;
    this.stream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, stream);
      track.enabled = false;
    });
    this.streamStatus = true;
  };

  public setOffer = async () => {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
  };

  public setAnswer = async (roomId: string, sdp: string) => {
    this.roomId = roomId;
    await this.peerConnection.setRemoteDescription(JSON.parse(atob(sdp)));
  };

  public debug = async () => {
    if (!this.latencyManager.count) return;
    this.latencyManager.setRoomId(this.roomId);
    await Request({ host: `${Constraint.host}/monit/latency`, body: this.latencyManager });
    this.latencyManager = new LatencyManager(this.sessionId);
  };

  public publish = () => {
    if (this.publishStatus) return;
    this.publishStatus = true;

    this.stream.getTracks().forEach((track) => (track.enabled = true));
  };

  public pause = () => {
    if (!this.publishStatus || !this.stream) return;
    this.publishStatus = false;

    this.stream.getTracks().forEach((track) => (track.enabled = false));
  };

  public emit = (buffer: Uint8Array) => {
    this.dataChannel.send(buffer);
  };

  /* ========================================== */
  /*               Private Method               */
  /* ========================================== */

  private createPeerConnection = async (): Promise<void> => {
    const iceServers = [
      { urls: [`stun:${Constraint.iceCredential.iceHost}`] },
      {
        urls: `turn:${Constraint.iceCredential.iceHost}`,
        username: Constraint.iceCredential.username,
        credential: Constraint.iceCredential.credential,
      },
    ];
    this.peerConnection = new RTCPeerConnection({ iceServers });

    this.peerConnection.onicecandidate = (_) => {
      if (!this.offerStatus) {
        this.offer = btoa(JSON.stringify(this.peerConnection.localDescription));
        this.offerStatus = true;
      }
    };

    this.peerConnection.onconnectionstatechange = (_) => {
      const type =
        this.type === RequestSource.REQUEST_SOURCE_MEDIA_BRIDGE
          ? 'Media'
          : this.type === RequestSource.REQUEST_SOURCE_DATA_BRIDGE
          ? 'Broadcast'
          : 'Session';
      console.log(`${type} : ${this.peerConnection.connectionState}`);
      if (this.peerConnection.connectionState === 'connected') {
        this.connectStatus = true;
      }
    };
  };

  private createDataChannel = () => {
    this.dataChannel = this.peerConnection.createDataChannel('message');
    this.dataChannel.onerror = (event) => Constraint.event.emit(EventState.ERROR, event);

    if (this.type === RequestSource.REQUEST_SOURCE_DATA_BRIDGE) {
      const sequenceManager: Map<string, number> = new Map();
      let lastClientTimestamp = 0;
      let lastServerTImestamp = 0;

      this.dataChannel.onmessage = (event) => {
        const now = Date.now();
        const list: StreamSession[] = [];
        const serializedStream = SerializedStream.decode(new Uint8Array(event.data));

        for (let i = 0; i < serializedStream.bytes.length; i++) {
          const streamSession = StreamStruct.decode(serializedStream.bytes[i]) as StreamSession;
          const lastSequence = sequenceManager.get(streamSession.sessionId) || 0;

          /*
            todo: 이전 sequence 데이터는 버리는 방향으로 일단 구현
            추후 우선순위 큐 구현
          */

          if (streamSession.sequence > lastSequence) {
            streamSession.blendshapes = Array.from(new Float32Array(pako.inflateRaw(streamSession.data).buffer));
            sequenceManager.set(streamSession.sessionId, streamSession.sequence);
          } else {
            continue;
          }

          list.push(streamSession);

          if (streamSession.sessionId === this.sessionId) {
            let packetLatency = 0;

            if (lastClientTimestamp > 0) {
              const diffClientTimestamp = now - lastClientTimestamp;
              const diffServerTimestamp = streamSession.proceededAt - lastServerTImestamp;
              packetLatency = Math.abs(diffClientTimestamp - diffServerTimestamp);
            }

            lastClientTimestamp = now;
            lastServerTImestamp = streamSession.proceededAt;
            streamSession.elapsedTimes.push(packetLatency);
            this.updateLatency(streamSession);
          }
        }
        Constraint.event.emit('BLENDSHAPE_EVENT', list);
      };
    } else {
      this.dataChannel.onmessage = (event) => {
        const message = SessionTemplate.decode(new Uint8Array(event.data));
        consumeMetadata(message);
      };
    }
  };

  private closePeerConnection = () => {
    if (!this.peerConnection) return;

    if (this.peerConnection.getSenders()) {
      this.peerConnection.getSenders().forEach((sender) => {
        if (sender.track) {
          sender.track.stop();
          sender = null;
        }
      });
    }

    if (this.peerConnection.getTransceivers()) {
      this.peerConnection.getTransceivers().forEach((transceiver) => {
        if (transceiver.stop) {
          transceiver.stop();
          transceiver = null;
        }
      });
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        track.stop();
        track = null;
      });
    }

    this.peerConnection.close();
    this.peerConnection.onicecandidate = null;
    this.peerConnection.oniceconnectionstatechange = null;
    this.peerConnection.ontrack = null;
    this.peerConnection = null;
    this.stream = null;
    this.offer = null;
  };

  private closeDataChannel = () => {
    if (!this.dataChannel) return;

    this.dataChannel.close();
    this.dataChannel.onopen = null;
    this.dataChannel.onclose = null;
    this.dataChannel.onerror = null;
    this.dataChannel.onmessage = null;
    this.dataChannel = null;
  };

  private updateLatency = async (streamStruct: StreamSession) => {
    if (Date.now() - this.latencyManager.startedAt < 10000) return;
    this.latencyManager.count++;
    this.latencyManager.sequence = streamStruct.sequence;
    this.latencyManager.fps.push(streamStruct.fps);
    this.latencyManager.dataSizes.push(streamStruct.dataSizes);
    this.latencyManager.elapsedTimes.push(streamStruct.elapsedTimes);
    this.latencyManager.proceededTimes.push(streamStruct.proceededTimes);
  };
}
