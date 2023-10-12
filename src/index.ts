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

  protected mediaClient = new RTCPeerClient('media');
  protected broadcastClient = new RTCPeerClient('broadcast');
  protected sessionClient = new RTCPeerClient('session');

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
  public emit(data: Type.ChatTemplate | object, target?: string[]) {
    const metadata = serializeMetadata(this.sessionId, data, target);
    this.sessionClient.emit(metadata);
  }

  public on = <K extends keyof Type.EventMap>(name: K, listener: (event: Type.EventMap[K]) => void) => {
    return Constraint.event.on(name, listener);
  };

  @Decorator.ErrorFactory()
  public async init(): Promise<void> {
    await this.initICECredential();
    await this.mediaClient.init();
    await this.broadcastClient.init();
    await this.sessionClient.init();
  }

  @Decorator.GuardFactory(Enum.GuardFlag.INIT)
  @Decorator.ErrorFactory()
  public async release() {
    this.mediaClient.release();
    this.broadcastClient.release();
    this.sessionClient.release();

    await Request({ host: `${Constraint.host}/signal/leave` });
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

    this.mediaClient.setStream(stream);
    return stream;
  }

  @Decorator.GuardFactory(Enum.GuardFlag.STREAM)
  @Decorator.ErrorFactory()
  public async connect() {
    await Promise.all([this.mediaClient.setOffer(), this.broadcastClient.setOffer(), this.sessionClient.setOffer()]);

    const [mediaSdp, broadcastSdp, sessionSdp] = await Promise.all([
      this.mediaClient.getOffer(),
      this.broadcastClient.getOffer(),
      this.sessionClient.getOffer(),
    ]);
    const requestPayload: Type.SignalingRequest = {
      roomId: this.roomId,
      nickname: this.nickname,
      mediaSdp,
      broadcastSdp,
      sessionSdp,
    };

    const responsePayload: Type.SignalingResponse = await Request({
      host: `${Constraint.host}/signal/join`,
      body: requestPayload,
    });

    await Promise.all([
      this.mediaClient.setAnswer(responsePayload.mediaSdp),
      this.broadcastClient.setAnswer(responsePayload.broadcastSdp),
      this.sessionClient.setAnswer(responsePayload.sessionSdp),
    ]);

    for (let _ = 0; _ < 3000; _++) {
      if (this.mediaClient.isConnected() && this.broadcastClient.isConnected() && this.sessionClient.isConnected()) {
        return;
      }

      await Sleep(10);
    }

    throw new Error('ICE connection failed');
  }

  @Decorator.GuardFactory(Enum.GuardFlag.PEER_CONNECTION)
  @Decorator.ErrorFactory()
  public async publish() {
    this.mediaClient.publish();
    await Request({ host: `${Constraint.host}/signal/publish` });
  }

  @Decorator.GuardFactory(Enum.GuardFlag.PEER_CONNECTION)
  @Decorator.ErrorFactory()
  public async pause() {
    this.mediaClient.pause();
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
    return this.mediaClient.getStream();
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
