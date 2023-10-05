import protobuf from 'protobufjs';

const protoSchema = `
syntax = "proto3";

package streampackage;

/* Common */

message Any {
  string  type_url  = 1;
  bytes   value     = 2;
}

/* Enum */

enum MetadataType {
  METADATA_TYPE_UNKNOWN = 0;
  ROOM    = 1;
  CHAT    = 2;
  SYSTEM  = 3;
  OBJECT  = 4;
}

enum TargetType {
  TARGET_TYPE_UNKNOWN = 0;
  BROADCAST = 1;
  GROUP     = 2;
  SINGLE    = 3;
}

enum SystemEventType {
  SYSTEM_EVENT_TYPE_UNKNOWN = 0;
  ERROR   = 1;
}

enum UserRole {
  USER_ROLE_UNKNOWN = 0;
  OWNER       = 1;
  PARTICIPANT = 2;
}

enum UserState {
  USER_STATE_UNKNOWN = 0;
  CONNECTED     = 1;
  DISCONNECTED  = 2;
}

/* Template */

message MetadataTemplate {
  MetadataType    type        = 1;
  TargetType      targetType  = 2;
  string          source      = 3;
  repeated string target      = 4;
  int64           timestamp   = 5;
  oneof           payload {
    UserTemplate    user    = 6;
    RoomTemplate    room    = 7;
    ChatTemplate    chat    = 8;
    SystemTemplate  system  = 9;
    string          object  = 10;
  }
}

message UserTemplate {
  string    sessionId = 1;
  string    nickname  = 2;
  UserRole  role      = 3;
  UserState state     = 4;
}

message RoomTemplate {
  string                roomId      = 1;
  string                ownerId     = 2;
  string                name        = 3;
  int64                 timestamp   = 5;
  int32                 maxCount    = 6;
  repeated UserTemplate userList    = 7;
}

message ChatTemplate {
  string  message = 1;
}

message SystemTemplate {
  SystemEventType type      = 1;
  string          source    = 2;
  string          message   = 3;
}

/* Stream */

message OptimizationSession {
  string sessionId = 1;
  string roomId = 2;
  int32 sequence = 3;
  float optimizedValue = 4;
  bytes results = 5;
}

message SerializedRoomData {
  repeated bytes data = 1;
}
`;
const protobufRoot = protobuf.parse(protoSchema, { keepCase: true }).root;

export const serializedRoomData = protobufRoot.lookupType('streampackage.SerializedRoomData');
export const optimizationSession = protobufRoot.lookupType('streampackage.OptimizationSession');
export const metadataTemplate = protobufRoot.lookupType('streampackage.MetadataTemplate');
