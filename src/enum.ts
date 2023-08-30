const EventStatus = {
  LOAD_STREAM: "LOAD_STREAM",
  ICE_CANDIDATE: "ICE_CANDIDATE",
  ICE_CONNECTION: "ICE_CONNECTION",
  STREAM_RESULT: "STREAM_RESULT",
  ERROR: "ERROR",
} as const;
type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];

const ErrorMessage = {
  UNAUTHORIZED: "UNAUTHORIZED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;
type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];

const CandidateType = {
  STUN: "STUN",
  TURN: "TURN",
} as const;
type CandidateType = (typeof CandidateType)[keyof typeof CandidateType];

export { ErrorMessage, EventStatus, CandidateType };
