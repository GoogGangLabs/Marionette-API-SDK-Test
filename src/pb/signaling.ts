/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "signaling";

export interface CreateRoomRequest {
  roomName: string;
}

export interface DeleteRoomRequest {
}

export interface JoinRoomRequest {
  roomId: string;
  nickName: string;
  mediaBridgeSdp: string;
  dataBridgeSdp: string;
  roomManagementSdp: string;
}

export interface LeaveRoomRequest {
}

export interface CreateRoomResponse {
  roomId: string;
  roomName: string;
}

export interface DeleteRoomResponse {
}

export interface JoinRoomResponse {
  roomId: string;
  mediaBridgeSdp: string;
  dataBridgeSdp: string;
  roomManagementSdp: string;
}

export interface LeaveRoomResponse {
}

function createBaseCreateRoomRequest(): CreateRoomRequest {
  return { roomName: "" };
}

export const CreateRoomRequest = {
  encode(message: CreateRoomRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomName !== "") {
      writer.uint32(10).string(message.roomName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRoomRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateRoomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateRoomRequest {
    return { roomName: isSet(object.roomName) ? globalThis.String(object.roomName) : "" };
  },

  toJSON(message: CreateRoomRequest): unknown {
    const obj: any = {};
    if (message.roomName !== "") {
      obj.roomName = message.roomName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateRoomRequest>, I>>(base?: I): CreateRoomRequest {
    return CreateRoomRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateRoomRequest>, I>>(object: I): CreateRoomRequest {
    const message = createBaseCreateRoomRequest();
    message.roomName = object.roomName ?? "";
    return message;
  },
};

function createBaseDeleteRoomRequest(): DeleteRoomRequest {
  return {};
}

export const DeleteRoomRequest = {
  encode(_: DeleteRoomRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteRoomRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteRoomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DeleteRoomRequest {
    return {};
  },

  toJSON(_: DeleteRoomRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteRoomRequest>, I>>(base?: I): DeleteRoomRequest {
    return DeleteRoomRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteRoomRequest>, I>>(_: I): DeleteRoomRequest {
    const message = createBaseDeleteRoomRequest();
    return message;
  },
};

function createBaseJoinRoomRequest(): JoinRoomRequest {
  return { roomId: "", nickName: "", mediaBridgeSdp: "", dataBridgeSdp: "", roomManagementSdp: "" };
}

export const JoinRoomRequest = {
  encode(message: JoinRoomRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.nickName !== "") {
      writer.uint32(18).string(message.nickName);
    }
    if (message.mediaBridgeSdp !== "") {
      writer.uint32(26).string(message.mediaBridgeSdp);
    }
    if (message.dataBridgeSdp !== "") {
      writer.uint32(34).string(message.dataBridgeSdp);
    }
    if (message.roomManagementSdp !== "") {
      writer.uint32(42).string(message.roomManagementSdp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinRoomRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinRoomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nickName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.mediaBridgeSdp = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.dataBridgeSdp = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.roomManagementSdp = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): JoinRoomRequest {
    return {
      roomId: isSet(object.roomId) ? globalThis.String(object.roomId) : "",
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      mediaBridgeSdp: isSet(object.mediaBridgeSdp) ? globalThis.String(object.mediaBridgeSdp) : "",
      dataBridgeSdp: isSet(object.dataBridgeSdp) ? globalThis.String(object.dataBridgeSdp) : "",
      roomManagementSdp: isSet(object.roomManagementSdp) ? globalThis.String(object.roomManagementSdp) : "",
    };
  },

  toJSON(message: JoinRoomRequest): unknown {
    const obj: any = {};
    if (message.roomId !== "") {
      obj.roomId = message.roomId;
    }
    if (message.nickName !== "") {
      obj.nickName = message.nickName;
    }
    if (message.mediaBridgeSdp !== "") {
      obj.mediaBridgeSdp = message.mediaBridgeSdp;
    }
    if (message.dataBridgeSdp !== "") {
      obj.dataBridgeSdp = message.dataBridgeSdp;
    }
    if (message.roomManagementSdp !== "") {
      obj.roomManagementSdp = message.roomManagementSdp;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<JoinRoomRequest>, I>>(base?: I): JoinRoomRequest {
    return JoinRoomRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<JoinRoomRequest>, I>>(object: I): JoinRoomRequest {
    const message = createBaseJoinRoomRequest();
    message.roomId = object.roomId ?? "";
    message.nickName = object.nickName ?? "";
    message.mediaBridgeSdp = object.mediaBridgeSdp ?? "";
    message.dataBridgeSdp = object.dataBridgeSdp ?? "";
    message.roomManagementSdp = object.roomManagementSdp ?? "";
    return message;
  },
};

function createBaseLeaveRoomRequest(): LeaveRoomRequest {
  return {};
}

export const LeaveRoomRequest = {
  encode(_: LeaveRoomRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveRoomRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveRoomRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): LeaveRoomRequest {
    return {};
  },

  toJSON(_: LeaveRoomRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<LeaveRoomRequest>, I>>(base?: I): LeaveRoomRequest {
    return LeaveRoomRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LeaveRoomRequest>, I>>(_: I): LeaveRoomRequest {
    const message = createBaseLeaveRoomRequest();
    return message;
  },
};

function createBaseCreateRoomResponse(): CreateRoomResponse {
  return { roomId: "", roomName: "" };
}

export const CreateRoomResponse = {
  encode(message: CreateRoomResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.roomName !== "") {
      writer.uint32(18).string(message.roomName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateRoomResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateRoomResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.roomName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateRoomResponse {
    return {
      roomId: isSet(object.roomId) ? globalThis.String(object.roomId) : "",
      roomName: isSet(object.roomName) ? globalThis.String(object.roomName) : "",
    };
  },

  toJSON(message: CreateRoomResponse): unknown {
    const obj: any = {};
    if (message.roomId !== "") {
      obj.roomId = message.roomId;
    }
    if (message.roomName !== "") {
      obj.roomName = message.roomName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateRoomResponse>, I>>(base?: I): CreateRoomResponse {
    return CreateRoomResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CreateRoomResponse>, I>>(object: I): CreateRoomResponse {
    const message = createBaseCreateRoomResponse();
    message.roomId = object.roomId ?? "";
    message.roomName = object.roomName ?? "";
    return message;
  },
};

function createBaseDeleteRoomResponse(): DeleteRoomResponse {
  return {};
}

export const DeleteRoomResponse = {
  encode(_: DeleteRoomResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteRoomResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteRoomResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DeleteRoomResponse {
    return {};
  },

  toJSON(_: DeleteRoomResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeleteRoomResponse>, I>>(base?: I): DeleteRoomResponse {
    return DeleteRoomResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeleteRoomResponse>, I>>(_: I): DeleteRoomResponse {
    const message = createBaseDeleteRoomResponse();
    return message;
  },
};

function createBaseJoinRoomResponse(): JoinRoomResponse {
  return { roomId: "", mediaBridgeSdp: "", dataBridgeSdp: "", roomManagementSdp: "" };
}

export const JoinRoomResponse = {
  encode(message: JoinRoomResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.mediaBridgeSdp !== "") {
      writer.uint32(18).string(message.mediaBridgeSdp);
    }
    if (message.dataBridgeSdp !== "") {
      writer.uint32(26).string(message.dataBridgeSdp);
    }
    if (message.roomManagementSdp !== "") {
      writer.uint32(34).string(message.roomManagementSdp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinRoomResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinRoomResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.roomId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.mediaBridgeSdp = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.dataBridgeSdp = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.roomManagementSdp = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): JoinRoomResponse {
    return {
      roomId: isSet(object.roomId) ? globalThis.String(object.roomId) : "",
      mediaBridgeSdp: isSet(object.mediaBridgeSdp) ? globalThis.String(object.mediaBridgeSdp) : "",
      dataBridgeSdp: isSet(object.dataBridgeSdp) ? globalThis.String(object.dataBridgeSdp) : "",
      roomManagementSdp: isSet(object.roomManagementSdp) ? globalThis.String(object.roomManagementSdp) : "",
    };
  },

  toJSON(message: JoinRoomResponse): unknown {
    const obj: any = {};
    if (message.roomId !== "") {
      obj.roomId = message.roomId;
    }
    if (message.mediaBridgeSdp !== "") {
      obj.mediaBridgeSdp = message.mediaBridgeSdp;
    }
    if (message.dataBridgeSdp !== "") {
      obj.dataBridgeSdp = message.dataBridgeSdp;
    }
    if (message.roomManagementSdp !== "") {
      obj.roomManagementSdp = message.roomManagementSdp;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<JoinRoomResponse>, I>>(base?: I): JoinRoomResponse {
    return JoinRoomResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<JoinRoomResponse>, I>>(object: I): JoinRoomResponse {
    const message = createBaseJoinRoomResponse();
    message.roomId = object.roomId ?? "";
    message.mediaBridgeSdp = object.mediaBridgeSdp ?? "";
    message.dataBridgeSdp = object.dataBridgeSdp ?? "";
    message.roomManagementSdp = object.roomManagementSdp ?? "";
    return message;
  },
};

function createBaseLeaveRoomResponse(): LeaveRoomResponse {
  return {};
}

export const LeaveRoomResponse = {
  encode(_: LeaveRoomResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveRoomResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveRoomResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): LeaveRoomResponse {
    return {};
  },

  toJSON(_: LeaveRoomResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<LeaveRoomResponse>, I>>(base?: I): LeaveRoomResponse {
    return LeaveRoomResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LeaveRoomResponse>, I>>(_: I): LeaveRoomResponse {
    const message = createBaseLeaveRoomResponse();
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
