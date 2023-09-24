import { Constraint } from "./constant";
import { EventState, GuardFlag } from "./enum";
import { RTCPeerClient } from "./peer.client";
import { CatchError, GuardFactory } from "./decorator";
import { Request } from "./request";
import * as MarionetteType from "./types";

export class MarionetteClient {
  private readonly streamConfig: MarionetteType.StreamConfigurations;

  protected readonly streamClient = new RTCPeerClient("stream");
  protected readonly dataClient = new RTCPeerClient("data");
  protected readonly metadataClient = new RTCPeerClient("metadata");

  protected roomId: string = undefined;
  protected nickname: string = undefined;

  constructor(config: MarionetteType.MarionetteConfigurations) {
    Constraint.token = config.token;
    this.roomId = config.roomId;
    this.nickname = config.nickname || "anonymous";

    this.streamConfig.deviceId = "";
    this.streamConfig.width = 320;
    this.streamConfig.height = 240;
    this.streamConfig.frameRate = 30;
  }

  /* ========================================== */
  /*                Public Method               */
  /* ========================================== */

  public on = (name: EventState, listener: (...args: any[]) => void) => Constraint.event.on(name, listener);

  @CatchError
  public async init(): Promise<void> {
    await this.initICECredential();
    await this.streamClient.init();
    await this.dataClient.init();
    await this.metadataClient.init();
  }

  @GuardFactory(GuardFlag.INIT)
  @CatchError
  public async release() {
    this.streamClient.release();
    this.dataClient.release();
    this.metadataClient.release();

    await Request({ host: `${Constraint.host}/session/leave` }).catch();
  }

  @GuardFactory(GuardFlag.INIT)
  @CatchError
  public async loadStream(config?: MarionetteType.StreamConfigurations): Promise<MediaStream> {
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

  @GuardFactory(GuardFlag.STREAM)
  @CatchError
  public async connect() {
    await Promise.all([this.streamClient.setOffer(), this.dataClient.setOffer(), this.metadataClient.setOffer()]);

    const [streamSdp, dataSdp, metadataSdp] = await Promise.all([
      this.streamClient.getOffer(),
      this.dataClient.getOffer(),
      this.metadataClient.getOffer(),
    ]);
    const requestPayload: MarionetteType.SignalingRequest = {
      roomId: this.roomId,
      nickname: this.nickname,
      streamSdp,
      dataSdp,
      metadataSdp,
    };

    const responsePayload: MarionetteType.SignalingResponse = await Request({
      host: `${Constraint.host}/session/join`,
      body: requestPayload,
    });

    await Promise.all([
      this.streamClient.setAnswer(responsePayload.streamSdp),
      this.dataClient.setAnswer(responsePayload.dataSdp),
      this.metadataClient.setAnswer(responsePayload.metadataSdp),
    ]);
  }

  @GuardFactory(GuardFlag.PEER_CONNECTION)
  @CatchError
  public async publish() {
    await Request({ host: `${Constraint.host}/session/publish` });
  }

  @GuardFactory(GuardFlag.PEER_CONNECTION)
  @CatchError
  public async pause() {
    this.streamClient.pause();
  }

  public getDevices = async () => {
    return (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === "videoinput");
  };

  @GuardFactory(GuardFlag.STREAM)
  public getStream() {
    return this.streamClient.getStream();
  }

  /* ========================================== */
  /*               Private Method               */
  /* ========================================== */

  private initICECredential = async (): Promise<void> => {
    if (
      !Constraint.iceCredential.username ||
      parseInt(Constraint.iceCredential.username.split(":")[0] + "000") <= Date.now() - 300000
    ) {
      Constraint.iceCredential = (await Request({
        method: "GET",
        host: `${Constraint.host}/auth/key/credential`,
      })) as MarionetteType.ICECredential;
    }
  };

  private setStreamConfiguration = (config: MarionetteType.StreamConfigurations) => {
    this.streamConfig.deviceId = config.deviceId || this.streamConfig.deviceId;
    this.streamConfig.width = config.width || this.streamConfig.width;
    this.streamConfig.height = config.height || this.streamConfig.height;
    this.streamConfig.frameRate = config.frameRate || this.streamConfig.frameRate;
  };
}
