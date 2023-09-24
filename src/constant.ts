import { EventEmitter } from "events";
import { MarionetteConstraint } from "./types";

export const Constraint: MarionetteConstraint = {
  event: new EventEmitter(),
  host: "https://api.goodganglabs.xyz",
  token: undefined,
  iceCredential: {
    username: undefined,
    credential: undefined,
    iceHost: undefined,
  },
};
