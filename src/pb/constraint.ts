/* eslint-disable */

export const protobufPackage = "constraint";

export enum RequestSource {
  REQUEST_SOURCE_CLIENT = 0,
  REQUEST_SOURCE_SIGNALING = 1,
  REQUEST_SOURCE_MEDIA_BRIDGE = 2,
  REQUEST_SOURCE_DATA_BRIDGE = 3,
  REQUEST_SOURCE_ROOM_MANAGEMENT = 4,
  UNRECOGNIZED = -1,
}

export function requestSourceFromJSON(object: any): RequestSource {
  switch (object) {
    case 0:
    case "REQUEST_SOURCE_CLIENT":
      return RequestSource.REQUEST_SOURCE_CLIENT;
    case 1:
    case "REQUEST_SOURCE_SIGNALING":
      return RequestSource.REQUEST_SOURCE_SIGNALING;
    case 2:
    case "REQUEST_SOURCE_MEDIA_BRIDGE":
      return RequestSource.REQUEST_SOURCE_MEDIA_BRIDGE;
    case 3:
    case "REQUEST_SOURCE_DATA_BRIDGE":
      return RequestSource.REQUEST_SOURCE_DATA_BRIDGE;
    case 4:
    case "REQUEST_SOURCE_ROOM_MANAGEMENT":
      return RequestSource.REQUEST_SOURCE_ROOM_MANAGEMENT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RequestSource.UNRECOGNIZED;
  }
}

export function requestSourceToJSON(object: RequestSource): string {
  switch (object) {
    case RequestSource.REQUEST_SOURCE_CLIENT:
      return "REQUEST_SOURCE_CLIENT";
    case RequestSource.REQUEST_SOURCE_SIGNALING:
      return "REQUEST_SOURCE_SIGNALING";
    case RequestSource.REQUEST_SOURCE_MEDIA_BRIDGE:
      return "REQUEST_SOURCE_MEDIA_BRIDGE";
    case RequestSource.REQUEST_SOURCE_DATA_BRIDGE:
      return "REQUEST_SOURCE_DATA_BRIDGE";
    case RequestSource.REQUEST_SOURCE_ROOM_MANAGEMENT:
      return "REQUEST_SOURCE_ROOM_MANAGEMENT";
    case RequestSource.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum SessionEvent {
  SESSION_EVENT_UNSPECIFIED = 0,
  SESSION_EVENT_CONNECT = 1,
  SESSION_EVENT_DISCONNECT = 2,
  UNRECOGNIZED = -1,
}

export function sessionEventFromJSON(object: any): SessionEvent {
  switch (object) {
    case 0:
    case "SESSION_EVENT_UNSPECIFIED":
      return SessionEvent.SESSION_EVENT_UNSPECIFIED;
    case 1:
    case "SESSION_EVENT_CONNECT":
      return SessionEvent.SESSION_EVENT_CONNECT;
    case 2:
    case "SESSION_EVENT_DISCONNECT":
      return SessionEvent.SESSION_EVENT_DISCONNECT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SessionEvent.UNRECOGNIZED;
  }
}

export function sessionEventToJSON(object: SessionEvent): string {
  switch (object) {
    case SessionEvent.SESSION_EVENT_UNSPECIFIED:
      return "SESSION_EVENT_UNSPECIFIED";
    case SessionEvent.SESSION_EVENT_CONNECT:
      return "SESSION_EVENT_CONNECT";
    case SessionEvent.SESSION_EVENT_DISCONNECT:
      return "SESSION_EVENT_DISCONNECT";
    case SessionEvent.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum PayloadType {
  PAYLOAD_TYPE_UNSPECIFIED = 0,
  PAYLOAD_TYPE_ROOM = 1,
  PAYLOAD_TYPE_CHAT = 2,
  PAYLOAD_TYPE_SYSTEM = 3,
  PAYLOAD_TYPE_OBJECT = 4,
  UNRECOGNIZED = -1,
}

export function payloadTypeFromJSON(object: any): PayloadType {
  switch (object) {
    case 0:
    case "PAYLOAD_TYPE_UNSPECIFIED":
      return PayloadType.PAYLOAD_TYPE_UNSPECIFIED;
    case 1:
    case "PAYLOAD_TYPE_ROOM":
      return PayloadType.PAYLOAD_TYPE_ROOM;
    case 2:
    case "PAYLOAD_TYPE_CHAT":
      return PayloadType.PAYLOAD_TYPE_CHAT;
    case 3:
    case "PAYLOAD_TYPE_SYSTEM":
      return PayloadType.PAYLOAD_TYPE_SYSTEM;
    case 4:
    case "PAYLOAD_TYPE_OBJECT":
      return PayloadType.PAYLOAD_TYPE_OBJECT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return PayloadType.UNRECOGNIZED;
  }
}

export function payloadTypeToJSON(object: PayloadType): string {
  switch (object) {
    case PayloadType.PAYLOAD_TYPE_UNSPECIFIED:
      return "PAYLOAD_TYPE_UNSPECIFIED";
    case PayloadType.PAYLOAD_TYPE_ROOM:
      return "PAYLOAD_TYPE_ROOM";
    case PayloadType.PAYLOAD_TYPE_CHAT:
      return "PAYLOAD_TYPE_CHAT";
    case PayloadType.PAYLOAD_TYPE_SYSTEM:
      return "PAYLOAD_TYPE_SYSTEM";
    case PayloadType.PAYLOAD_TYPE_OBJECT:
      return "PAYLOAD_TYPE_OBJECT";
    case PayloadType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum Target {
  TARGET_UNSPECIFIED = 0,
  TARGET_BROADCAST = 1,
  TARGET_GROUP = 2,
  TARGET_SINGLE = 3,
  UNRECOGNIZED = -1,
}

export function targetFromJSON(object: any): Target {
  switch (object) {
    case 0:
    case "TARGET_UNSPECIFIED":
      return Target.TARGET_UNSPECIFIED;
    case 1:
    case "TARGET_BROADCAST":
      return Target.TARGET_BROADCAST;
    case 2:
    case "TARGET_GROUP":
      return Target.TARGET_GROUP;
    case 3:
    case "TARGET_SINGLE":
      return Target.TARGET_SINGLE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Target.UNRECOGNIZED;
  }
}

export function targetToJSON(object: Target): string {
  switch (object) {
    case Target.TARGET_UNSPECIFIED:
      return "TARGET_UNSPECIFIED";
    case Target.TARGET_BROADCAST:
      return "TARGET_BROADCAST";
    case Target.TARGET_GROUP:
      return "TARGET_GROUP";
    case Target.TARGET_SINGLE:
      return "TARGET_SINGLE";
    case Target.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum SystemEvent {
  SYSTEM_EVENT_UNSPECIFIED = 0,
  SYSTEM_EVENT_ERROR = 1,
  UNRECOGNIZED = -1,
}

export function systemEventFromJSON(object: any): SystemEvent {
  switch (object) {
    case 0:
    case "SYSTEM_EVENT_UNSPECIFIED":
      return SystemEvent.SYSTEM_EVENT_UNSPECIFIED;
    case 1:
    case "SYSTEM_EVENT_ERROR":
      return SystemEvent.SYSTEM_EVENT_ERROR;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SystemEvent.UNRECOGNIZED;
  }
}

export function systemEventToJSON(object: SystemEvent): string {
  switch (object) {
    case SystemEvent.SYSTEM_EVENT_UNSPECIFIED:
      return "SYSTEM_EVENT_UNSPECIFIED";
    case SystemEvent.SYSTEM_EVENT_ERROR:
      return "SYSTEM_EVENT_ERROR";
    case SystemEvent.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum UserRole {
  USER_ROLE_UNSPECIFIED = 0,
  USER_ROLE_OWNER = 1,
  USER_ROLE_PARTICIPANT = 2,
  UNRECOGNIZED = -1,
}

export function userRoleFromJSON(object: any): UserRole {
  switch (object) {
    case 0:
    case "USER_ROLE_UNSPECIFIED":
      return UserRole.USER_ROLE_UNSPECIFIED;
    case 1:
    case "USER_ROLE_OWNER":
      return UserRole.USER_ROLE_OWNER;
    case 2:
    case "USER_ROLE_PARTICIPANT":
      return UserRole.USER_ROLE_PARTICIPANT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UserRole.UNRECOGNIZED;
  }
}

export function userRoleToJSON(object: UserRole): string {
  switch (object) {
    case UserRole.USER_ROLE_UNSPECIFIED:
      return "USER_ROLE_UNSPECIFIED";
    case UserRole.USER_ROLE_OWNER:
      return "USER_ROLE_OWNER";
    case UserRole.USER_ROLE_PARTICIPANT:
      return "USER_ROLE_PARTICIPANT";
    case UserRole.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum UserState {
  USER_STATE_UNSPECIFIED = 0,
  USER_STATE_CONNECTED = 1,
  USER_STATE_DISCONNECTED = 2,
  UNRECOGNIZED = -1,
}

export function userStateFromJSON(object: any): UserState {
  switch (object) {
    case 0:
    case "USER_STATE_UNSPECIFIED":
      return UserState.USER_STATE_UNSPECIFIED;
    case 1:
    case "USER_STATE_CONNECTED":
      return UserState.USER_STATE_CONNECTED;
    case 2:
    case "USER_STATE_DISCONNECTED":
      return UserState.USER_STATE_DISCONNECTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UserState.UNRECOGNIZED;
  }
}

export function userStateToJSON(object: UserState): string {
  switch (object) {
    case UserState.USER_STATE_UNSPECIFIED:
      return "USER_STATE_UNSPECIFIED";
    case UserState.USER_STATE_CONNECTED:
      return "USER_STATE_CONNECTED";
    case UserState.USER_STATE_DISCONNECTED:
      return "USER_STATE_DISCONNECTED";
    case UserState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
