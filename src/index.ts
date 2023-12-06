import * as Enum from './domain/enum';
import * as Decorator from './decorator';
import * as Type from './domain/types';
import * as HttpPayload from './domain/http';
import { Constraint, Sleep } from './domain/constant';
import { RTCPeerClient } from './peer.client';
import { Request } from './request';
import { serializeMetadata } from './metadata';
import { RequestSource } from './pb/constraint';
import { ChatTemplate } from './pb/session';

export { Enum };

@Decorator.ClassBinding
export class MarionetteClient {
  private streamConfig: Type.StreamConfigurations = {};

  protected mediaBridgeClient = new RTCPeerClient(RequestSource.REQUEST_SOURCE_MEDIA_BRIDGE);
  protected dataBridgeClient = new RTCPeerClient(RequestSource.REQUEST_SOURCE_DATA_BRIDGE);
  protected roomManagementClient = new RTCPeerClient(RequestSource.REQUEST_SOURCE_ROOM_MANAGEMENT);

  protected ownRoomId: string = undefined;
  protected joinedRoomId: string = undefined;
  protected sessionId: string = undefined;
  protected roomName: string = undefined;
  protected nickName: string = undefined;

  constructor(config: Type.MarionetteConfigurations) {
    Constraint.token = config.token;
    this.roomName = config.roomName || 'anonymous room';
    this.nickName = config.nickName || 'anonymous user';

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
  public emit(data: ChatTemplate | object, target?: string[]) {
    const metadata = serializeMetadata(this.sessionId, data, target);
    this.roomManagementClient.emit(metadata);
  }

  public on = <K extends keyof Type.EventMap>(name: K, listener: (event: Type.EventMap[K]) => void) => {
    return Constraint.event.on(name, listener);
  };

  public async debug() {
    await this.dataBridgeClient.debug();
  }

  @Decorator.ErrorFactory()
  public async init(): Promise<void> {
    await this.initICECredential();
    await this.mediaBridgeClient.init(this.sessionId);
    await this.dataBridgeClient.init(this.sessionId);
    await this.roomManagementClient.init(this.sessionId);
  }

  @Decorator.GuardFactory(Enum.GuardFlag.INIT)
  @Decorator.ErrorFactory()
  public async createRoom(roomName: string) {
    const response = await Request<HttpPayload.CreateRoomRequestDto, HttpPayload.CreateRoomResponseDto>({
      host: `${Constraint.host}/room/create`,
      body: { roomName: roomName },
    });
    this.ownRoomId = response.roomId;
    this.roomName = response.roomName;
  }

  @Decorator.GuardFactory(Enum.GuardFlag.INIT)
  @Decorator.ErrorFactory()
  public async deleteRoom() {
    await Request({ host: `${Constraint.host}/room/delete` });
    this.ownRoomId = undefined;
  }

  @Decorator.GuardFactory(Enum.GuardFlag.INIT)
  @Decorator.ErrorFactory()
  public async release() {
    this.mediaBridgeClient.release();
    this.dataBridgeClient.release();
    this.roomManagementClient.release();
    this.joinedRoomId = undefined;

    await Request({ host: `${Constraint.host}/room/leave` });
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

    this.mediaBridgeClient.setStream(stream);
    return stream;
  }

  @Decorator.GuardFactory(Enum.GuardFlag.STREAM)
  @Decorator.ErrorFactory()
  public async connect(roomId: string) {
    console.log('setOffer');
    await Promise.all([
      this.mediaBridgeClient.setOffer(),
      this.dataBridgeClient.setOffer(),
      this.roomManagementClient.setOffer(),
    ]);

    console.log('getOffer');
    const [mediaBridgeSdp, dataBridgeSdp, roomManagementSdp] = await Promise.all([
      this.mediaBridgeClient.getOffer(),
      this.dataBridgeClient.getOffer(),
      this.roomManagementClient.getOffer(),
    ]);
    console.log('joinRequestPayload');
    console.log(roomId);
    console.log(this.nickName);
    const requestPayload: HttpPayload.JoinRoomRequestDto = {
      roomId: roomId,
      nickName: this.nickName,
      mediaBridgeSdp,
      dataBridgeSdp,
      roomManagementSdp,
    };

    console.log(requestPayload);
    const responsePayload: HttpPayload.JoinRoomResponseDto = await Request({
      host: `${Constraint.host}/room/join`,
      body: requestPayload,
    });
    console.log(responsePayload);

    await Promise.all([
      this.mediaBridgeClient.setAnswer(roomId, responsePayload.mediaBridgeSdp),
      this.dataBridgeClient.setAnswer(roomId, responsePayload.dataBridgeSdp),
      this.roomManagementClient.setAnswer(roomId, responsePayload.roomManagementSdp),
    ]);

    for (let _ = 0; _ < 3000; _++) {
      if (
        this.mediaBridgeClient.isConnected() &&
        this.dataBridgeClient.isConnected() &&
        this.roomManagementClient.isConnected()
      ) {
        this.joinedRoomId = roomId;
        return;
      }

      await Sleep(10);
    }

    throw new Error('ICE connection failed');
  }

  @Decorator.GuardFactory(Enum.GuardFlag.PEER_CONNECTION)
  @Decorator.ErrorFactory()
  public async publish() {
    this.mediaBridgeClient.publish();
    // await Request({ host: `${Constraint.host}/signal/publish` });
  }

  @Decorator.GuardFactory(Enum.GuardFlag.PEER_CONNECTION)
  @Decorator.ErrorFactory()
  public async pause() {
    this.mediaBridgeClient.pause();
  }

  public setRoomName = (roomName: string) => {
    this.roomName = roomName;
  };

  public setNickname = (nickname: string) => {
    this.nickName = nickname;
  };

  @Decorator.GuardFactory(Enum.GuardFlag.INIT)
  public getSessionId() {
    return this.sessionId;
  }

  public getOwnRoomId = () => this.ownRoomId;

  public getJoinedRoomId = () => this.joinedRoomId;

  public getRoomName = () => this.roomName;

  public getNickname = () => this.nickName;

  public getDevices = async () => {
    return (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === 'videoinput');
  };

  @Decorator.GuardFactory(Enum.GuardFlag.STREAM)
  public getStream() {
    return this.mediaBridgeClient.getStream();
  }

  /* ========================================== */
  /*               Private Method               */
  /* ========================================== */

  private initICECredential = async (): Promise<void> => {
    if (
      !Constraint.iceCredential.username ||
      parseInt(Constraint.iceCredential.username.split(':')[0] + '000') <= Date.now() - 300000
    ) {
      const payload = new HttpPayload.IssueIceCredentialRequestDto();
      const response = (await Request({
        host: `${Constraint.host}/auth/key/credential`,
        body: payload,
      })) as HttpPayload.IssueIceCredentialResponseDto;

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
