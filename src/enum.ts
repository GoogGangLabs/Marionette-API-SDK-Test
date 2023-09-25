const EventState = {
  LOAD_STREAM: "LOAD_STREAM",
  ICE_CANDIDATE: "ICE_CANDIDATE",
  ICE_CONNECTION: "ICE_CONNECTION",
  BLENDSHAPE_RESULT: "BLENDSHAPE_RESULT",
  ERROR: "ERROR",
} as const;
type EventState = (typeof EventState)[keyof typeof EventState];

const ErrorMessage = {
  UNAUTHORIZED: "UNAUTHORIZED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;
type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];

const GuardFlag = {
  INIT: 1,
  STREAM: 1 << 1,
  PEER_CONNECTION: 1 << 2,
};
type GuardFlag = (typeof GuardFlag)[keyof typeof GuardFlag];

export { ErrorMessage, EventState, GuardFlag };
