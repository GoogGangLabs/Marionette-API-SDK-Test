import protobuf from "protobufjs";

const protoSchema = `
syntax = "proto3";

package streampackage;

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

export const serializedRoomData = protobufRoot.lookupType("streampackage.SerializedRoomData");
export const optimizationSession = protobufRoot.lookupType("streampackage.OptimizationSession");
