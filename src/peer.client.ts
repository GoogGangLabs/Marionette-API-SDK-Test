import pako from 'pako';
import { EventState } from './enum';
import { Constraint, Sleep } from './constant';
import { MetadataTemplate, OptimizationSession, OptimizationSessionList, PeerType } from './types';
import { metadataTemplate, optimizationSession, serializedRoomData } from './proto';
import { ClassBinding } from './decorator';
import { consumeMetadata } from './metadata';

@ClassBinding
export class RTCPeerClient {
  private type: PeerType;

  private peerConnection: RTCPeerConnection = null;
  private dataChannel: RTCDataChannel = null;
  private stream: MediaStream = null;
  private offer: string = null;

  private streamStatus: boolean = false;
  private offerStatus: boolean = false;
  private connectStatus: boolean = false;
  private publishStatus: boolean = false;

  constructor(type: PeerType) {
    this.type = type;
  }

  /* ========================================== */
  /*                Public Method               */
  /* ========================================== */

  public init = async (): Promise<void> => {
    this.release();

    await this.createPeerConnection();
    if (this.type !== 'stream') this.createDataChannel();
  };

  public release = () => {
    this.pause();
    this.closeDataChannel();
    this.closePeerConnection();

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

  public setAnswer = async (sdp: string) => {
    await this.peerConnection.setRemoteDescription(JSON.parse(atob(sdp)));
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

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate === null) {
        this.offer = btoa(JSON.stringify(this.peerConnection.localDescription));
        this.offerStatus = true;
      }
    };

    this.peerConnection.onconnectionstatechange = (_) => {
      console.log(this.type, ':', this.peerConnection.connectionState);
      if (this.peerConnection.connectionState === 'connected') {
        this.connectStatus = true;
      }
    };
  };

  private createDataChannel = () => {
    this.dataChannel = this.peerConnection.createDataChannel('message');
    this.dataChannel.onerror = (event) => Constraint.event.emit(EventState.ERROR, event);

    if (this.type === 'data') {
      this.dataChannel.onmessage = (event) => {
        const list: OptimizationSession[] = [];
        const listMessage = serializedRoomData.decode(new Uint8Array(event.data));
        const decoded = serializedRoomData.toObject(listMessage) as OptimizationSessionList;
        for (let i = 0; i < decoded.data.length; i++) {
          const dataMessage = optimizationSession.decode(decoded.data[i]);
          const data = optimizationSession.toObject(dataMessage) as OptimizationSession;
          const decompressed = pako.inflateRaw(data.results);

          data.blendshapes = Array.from(new Float32Array(decompressed.buffer));
          list.push(data);
        }
        Constraint.event.emit(EventState.BLENDSHAPE_EVENT, list);
      };
    } else {
      this.dataChannel.onmessage = (event) => {
        const message = metadataTemplate.decode(new Uint8Array(event.data));
        const data = metadataTemplate.toObject(message) as MetadataTemplate;

        consumeMetadata(data);
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
}
