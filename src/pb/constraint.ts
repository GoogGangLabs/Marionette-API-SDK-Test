/* eslint-disable */

export const protobufPackage = "constraint";

export enum RequestSource {
  CLIENT = 0,
  MEDIA = 1,
  BROADCAST = 2,
  SESSION = 3,
  UNRECOGNIZED = -1,
}

export function requestSourceFromJSON(object: any): RequestSource {
  switch (object) {
    case 0:
    case "CLIENT":
      return RequestSource.CLIENT;
    case 1:
    case "MEDIA":
      return RequestSource.MEDIA;
    case 2:
    case "BROADCAST":
      return RequestSource.BROADCAST;
    case 3:
    case "SESSION":
      return RequestSource.SESSION;
    case -1:
    case "UNRECOGNIZED":
    default:
      return RequestSource.UNRECOGNIZED;
  }
}

export function requestSourceToJSON(object: RequestSource): string {
  switch (object) {
    case RequestSource.CLIENT:
      return "CLIENT";
    case RequestSource.MEDIA:
      return "MEDIA";
    case RequestSource.BROADCAST:
      return "BROADCAST";
    case RequestSource.SESSION:
      return "SESSION";
    case RequestSource.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum DataType {
  ROOM = 0,
  CHAT = 1,
  SYSTEM = 2,
  OBJECT = 3,
  UNRECOGNIZED = -1,
}

export function dataTypeFromJSON(object: any): DataType {
  switch (object) {
    case 0:
    case "ROOM":
      return DataType.ROOM;
    case 1:
    case "CHAT":
      return DataType.CHAT;
    case 2:
    case "SYSTEM":
      return DataType.SYSTEM;
    case 3:
    case "OBJECT":
      return DataType.OBJECT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DataType.UNRECOGNIZED;
  }
}

export function dataTypeToJSON(object: DataType): string {
  switch (object) {
    case DataType.ROOM:
      return "ROOM";
    case DataType.CHAT:
      return "CHAT";
    case DataType.SYSTEM:
      return "SYSTEM";
    case DataType.OBJECT:
      return "OBJECT";
    case DataType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum TargetType {
  GLOBAL = 0,
  GROUP = 1,
  SINGLE = 2,
  UNRECOGNIZED = -1,
}

export function targetTypeFromJSON(object: any): TargetType {
  switch (object) {
    case 0:
    case "GLOBAL":
      return TargetType.GLOBAL;
    case 1:
    case "GROUP":
      return TargetType.GROUP;
    case 2:
    case "SINGLE":
      return TargetType.SINGLE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return TargetType.UNRECOGNIZED;
  }
}

export function targetTypeToJSON(object: TargetType): string {
  switch (object) {
    case TargetType.GLOBAL:
      return "GLOBAL";
    case TargetType.GROUP:
      return "GROUP";
    case TargetType.SINGLE:
      return "SINGLE";
    case TargetType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum SystemEventType {
  ERROR = 0,
  UNRECOGNIZED = -1,
}

export function systemEventTypeFromJSON(object: any): SystemEventType {
  switch (object) {
    case 0:
    case "ERROR":
      return SystemEventType.ERROR;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SystemEventType.UNRECOGNIZED;
  }
}

export function systemEventTypeToJSON(object: SystemEventType): string {
  switch (object) {
    case SystemEventType.ERROR:
      return "ERROR";
    case SystemEventType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum UserRole {
  OWNER = 0,
  PARTICIPANT = 1,
  UNRECOGNIZED = -1,
}

export function userRoleFromJSON(object: any): UserRole {
  switch (object) {
    case 0:
    case "OWNER":
      return UserRole.OWNER;
    case 1:
    case "PARTICIPANT":
      return UserRole.PARTICIPANT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UserRole.UNRECOGNIZED;
  }
}

export function userRoleToJSON(object: UserRole): string {
  switch (object) {
    case UserRole.OWNER:
      return "OWNER";
    case UserRole.PARTICIPANT:
      return "PARTICIPANT";
    case UserRole.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum UserState {
  CONNECTED = 0,
  DISCONNECTED = 1,
  UNRECOGNIZED = -1,
}

export function userStateFromJSON(object: any): UserState {
  switch (object) {
    case 0:
    case "CONNECTED":
      return UserState.CONNECTED;
    case 1:
    case "DISCONNECTED":
      return UserState.DISCONNECTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return UserState.UNRECOGNIZED;
  }
}

export function userStateToJSON(object: UserState): string {
  switch (object) {
    case UserState.CONNECTED:
      return "CONNECTED";
    case UserState.DISCONNECTED:
      return "DISCONNECTED";
    case UserState.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}
