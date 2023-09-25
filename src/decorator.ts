import { MarionetteClient } from "./index";
import { Constraint } from "./constant";
import { EventState, GuardFlag } from "./enum";

export const GuardFactory = (...flags: GuardFlag[]) => {
  return (_: MarionetteClient, __: string | symbol, descriptor: PropertyDescriptor) => {
    const total = flags.reduce((a, b) => a + b, 0);
    const method = descriptor.value;

    descriptor.value = function (this: MarionetteClient, ...args: any[]) {
      if (
        total & GuardFlag.INIT &&
        Constraint.token !== undefined &&
        this.roomId !== undefined &&
        (!this.streamClient.isInitialized() || !this.dataClient.isInitialized() || !this.metadataClient.isInitialized())
      ) {
        throw new Error("Marionette client is not initialized");
      }

      if (total & GuardFlag.STREAM && !this.streamClient.isStreamSet()) {
        throw new Error("MediaStream is not set");
      }
      if (
        total & GuardFlag.PEER_CONNECTION &&
        (!this.streamClient.isConnected() || !this.dataClient.isConnected() || !this.metadataClient.isConnected())
      ) {
        throw new Error("PeerConnection is not Connected");
      }

      return method.apply(this, args);
    };

    return descriptor;
  };
};

export const CatchError = (_: MarionetteClient, __: any, descriptor: PropertyDescriptor) => {
  const method = descriptor.value;

  descriptor.value = async function (this: MarionetteClient, ...args: any) {
    try {
      return await method.apply(this, args);
    } catch (err) {
      Constraint.event.emit(EventState.ERROR, err);
    }
  };
};
