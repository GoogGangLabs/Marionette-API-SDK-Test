const EventState = {
  LOAD_STREAM: 'LOAD_STREAM',
  ICE_CANDIDATE: 'ICE_CANDIDATE',
  ICE_CONNECTION: 'ICE_CONNECTION',
  BLENDSHAPE_EVENT: 'BLENDSHAPE_EVENT',
  METADATA_USER_EVENT: 'METADATA_USER_EVENT',
  METADATA_ROOM_EVENT: 'METADATA_ROOM_EVENT',
  METADATA_CHAT_EVENT: 'METADATA_CHAT_EVENT',
  METADATA_SYSTEM_EVENT: 'METADATA_SYSTEM_EVENT',
  METADATA_OBJECT_EVENT: 'METADATA_OBJECT_EVENT',
  ERROR: 'ERROR',
} as const;
type EventState = (typeof EventState)[keyof typeof EventState];

const ErrorMessage = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;
type ErrorMessage = (typeof ErrorMessage)[keyof typeof ErrorMessage];

const GuardFlag = {
  INIT: 1,
  STREAM: 1 << 1,
  PEER_CONNECTION: 1 << 2,
};
type GuardFlag = (typeof GuardFlag)[keyof typeof GuardFlag];

const MetadataType = {
  METADATA_TYPE_UNKNOWN: 0,
  ROOM: 1,
  CHAT: 2,
  SYSTEM: 3,
  OBJECT: 4,
};
type MetadataType = (typeof MetadataType)[keyof typeof MetadataType];

const TargetType = {
  TARGET_TYPE_UNKNOWN: 0,
  BROADCAST: 1,
  GROUP: 2,
  SINGLE: 3,
};
type TargetType = (typeof TargetType)[keyof typeof TargetType];

const SystemEventType = {
  SYSTEM_EVENT_TYPE_UNKNOWN: 0,
  ERROR: 1,
};
type SystemEventType = (typeof SystemEventType)[keyof typeof SystemEventType];

const UserRole = {
  USER_ROLE_UNKNOWN: 0,
  OWNER: 1,
  PARTICIPANT: 2,
};
type UserRole = (typeof UserRole)[keyof typeof UserRole];

const UserState = {
  USER_STATE_UNKNOWN: 0,
  CONNECTED: 1,
  DISCONNECTED: 2,
};
type UserState = (typeof UserState)[keyof typeof UserState];

export { ErrorMessage, EventState, GuardFlag, MetadataType, TargetType, SystemEventType, UserRole, UserState };
