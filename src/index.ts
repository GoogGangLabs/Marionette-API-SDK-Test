import * as Enum from './enum';
import * as Decorator from './decorator';
import * as Type from './types';
import { Constraint, Sleep } from './constant';
import { RTCPeerClient } from './peer.client';
import { Request } from './request';
import { serializeMetadata } from './metadata';

export { Enum };

@Decorator.ClassBinding
export class MarionetteClient {
  private streamConfig: Type.StreamConfigurations = {};

  protected streamClient = new RTCPeerClient('stream');
  protected dataClient = new RTCPeerClient('data');
  protected metadataClient = new RTCPeerClient('metadata');

  protected roomId: string = undefined;
  protected sessionId: string = undefined;
  protected nickname: string = undefined;

  constructor(config: Type.MarionetteConfigurations) {
    Constraint.token = config.token;
    this.roomId = config.roomId || 'anonymous room';
    this.nickname = config.nickname || 'anonymous user';

    this.streamConfig.deviceId = '';
    this.streamConfig.width = 320;
    this.streamConfig.height = 240;
    this.streamConfig.frameRate = 30;

    window.onbeforeunload = () => {
      this.release();
    };
  }

  /* ========================================== */
  /*                Public Method               */
  /* ========================================== */

  @Decorator.GuardFactory(Enum.GuardFlag.PEER_CONNECTION)
  @Decorator.ErrorFactory()
  public emit(data: Type.ChatTemplate | any, target?: string[]) {
    const metadata = serializeMetadata(this.sessionId, data, target);
    this.metadataClient.emit(metadata);
  }

  public on = (name: Enum.EventState, listener: (...args: any[]) => void) => Constraint.event.on(name, listener);

  @Decorator.ErrorFactory()
  public async init(): Promise<void> {
    await this.initICECredential();
    await this.streamClient.init();
    await this.dataClient.init();
    await this.metadataClient.init();
  }

  @Decorator.GuardFactory(Enum.GuardFlag.INIT)
  @Decorator.ErrorFactory()
  public async release() {
    this.streamClient.release();
    this.dataClient.release();
    this.metadataClient.release();

    await Request({ host: `${Constraint.host}/session/leave` });
  }

  @Decorator.GuardFactory(Enum.GuardFlag.INIT)
  @Decorator.ErrorFactory()
  public async loadStream(config?: Type.StreamConfigurations): Promise<MediaStream> {
    this.setStreamConfiguration(config || {});
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: this.streamConfig.deviceId,
        width: this.streamConfig.width,
        height: this.streamConfig.height,
        frameRate: { ideal: this.streamConfig.frameRate, min: 5 },
      },
    });

    this.streamClient.setStream(stream);
    return stream;
  }

  @Decorator.GuardFactory(Enum.GuardFlag.STREAM)
  @Decorator.ErrorFactory()
  public async connect() {
    await Promise.all([this.streamClient.setOffer(), this.dataClient.setOffer(), this.metadataClient.setOffer()]);

    const [streamSdp, dataSdp, metadataSdp] = await Promise.all([
      this.streamClient.getOffer(),
      this.dataClient.getOffer(),
      this.metadataClient.getOffer(),
    ]);
    const requestPayload: Type.SignalingRequest = {
      roomId: this.roomId,
      nickname: this.nickname,
      streamSdp,
      dataSdp,
      metadataSdp,
    };

    const responsePayload: Type.SignalingResponse = await Request({
      host: `${Constraint.host}/session/join`,
      body: requestPayload,
    });

    await Promise.all([
      this.streamClient.setAnswer(responsePayload.streamSdp),
      this.dataClient.setAnswer(responsePayload.dataSdp),
      this.metadataClient.setAnswer(responsePayload.metadataSdp),
    ]);

    for (let _ = 0; _ < 3000; _++) {
      if (this.streamClient.isConnected() && this.dataClient.isConnected() && this.metadataClient.isConnected()) {
        return;
      }

      await Sleep(10);
    }

    throw new Error('ICE connection failed');
  }

  @Decorator.GuardFactory(Enum.GuardFlag.PEER_CONNECTION)
  @Decorator.ErrorFactory()
  public async publish() {
    this.streamClient.publish();
    await Request({ host: `${Constraint.host}/session/publish` });
  }

  @Decorator.GuardFactory(Enum.GuardFlag.PEER_CONNECTION)
  @Decorator.ErrorFactory()
  public async pause() {
    this.streamClient.pause();
  }

  public setRoomId = (roomId: string) => {
    this.roomId = roomId;
  };

  public setNickname = (nickname: string) => {
    this.nickname = nickname;
  };

  @Decorator.GuardFactory(Enum.GuardFlag.INIT)
  public getSessionId() {
    return this.sessionId;
  }

  public getRoomId = () => this.roomId;

  public getNickname = () => this.nickname;

  public getDevices = async () => {
    return (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === 'videoinput');
  };

  @Decorator.GuardFactory(Enum.GuardFlag.STREAM)
  public getStream() {
    return this.streamClient.getStream();
  }

  /* ========================================== */
  /*               Private Method               */
  /* ========================================== */

  private initICECredential = async (): Promise<void> => {
    if (
      !Constraint.iceCredential.username ||
      parseInt(Constraint.iceCredential.username.split(':')[0] + '000') <= Date.now() - 300000
    ) {
      const response = (await Request({
        host: `${Constraint.host}/auth/key/credential`,
      })) as Type.IceCredentialResponse;

      this.sessionId = response.sessionId;
      Constraint.iceCredential.username = response.username;
      Constraint.iceCredential.credential = response.credential;
      Constraint.iceCredential.iceHost = response.iceHost;
    }
  };

  private setStreamConfiguration = (config: Type.StreamConfigurations) => {
    this.streamConfig.deviceId = config.deviceId || this.streamConfig.deviceId;
    this.streamConfig.width = config.width || this.streamConfig.width;
    this.streamConfig.height = config.height || this.streamConfig.height;
    this.streamConfig.frameRate = config.frameRate || this.streamConfig.frameRate;
  };
}
