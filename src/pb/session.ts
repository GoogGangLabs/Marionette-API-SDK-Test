/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import {
  PayloadType,
  payloadTypeFromJSON,
  payloadTypeToJSON,
  RequestSource,
  requestSourceFromJSON,
  requestSourceToJSON,
  SystemEvent,
  systemEventFromJSON,
  systemEventToJSON,
  Target,
  targetFromJSON,
  targetToJSON,
  UserRole,
  userRoleFromJSON,
  userRoleToJSON,
  UserState,
  userStateFromJSON,
  userStateToJSON,
} from "./constraint";

export const protobufPackage = "datachannel";

export interface SessionData {
  sessionId: string;
  roomId: string;
  source: RequestSource;
}

export interface SessionTemplate {
  type: PayloadType;
  targetType: Target;
  source: string;
  targets: string[];
  timestamp: number;
  user?: UserTemplate | undefined;
  room?: RoomTemplate | undefined;
  chat?: ChatTemplate | undefined;
  system?: SystemTemplate | undefined;
  object?: string | undefined;
}

export interface UserTemplate {
  sessionId: string;
  nickname: string;
  role: UserRole;
  state: UserState;
}

export interface RoomTemplate {
  roomId: string;
  ownerId: string;
  name: string;
  timestamp: number;
  maxCount: number;
  users: UserTemplate[];
}

export interface ChatTemplate {
  message: string;
}

export interface SystemTemplate {
  type: SystemEvent;
  source: string;
  message: string;
}

function createBaseSessionData(): SessionData {
  return { sessionId: "", roomId: "", source: 0 };
}

export const SessionData = {
  encode(message: SessionData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sessionId !== "") {
      writer.uint32(10).string(message.sessionId);
    }
    if (message.roomId !== "") {
      writer.uint32(18).string(message.roomId);
    }
    if (message.source !== 0) {
      writer.uint32(24).int32(message.source);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SessionData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSessionData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sessionId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.roomId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.source = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SessionData {
    return {
      sessionId: isSet(object.sessionId) ? globalThis.String(object.sessionId) : "",
      roomId: isSet(object.roomId) ? globalThis.String(object.roomId) : "",
      source: isSet(object.source) ? requestSourceFromJSON(object.source) : 0,
    };
  },

  toJSON(message: SessionData): unknown {
    const obj: any = {};
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    if (message.roomId !== "") {
      obj.roomId = message.roomId;
    }
    if (message.source !== 0) {
      obj.source = requestSourceToJSON(message.source);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SessionData>, I>>(base?: I): SessionData {
    return SessionData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SessionData>, I>>(object: I): SessionData {
    const message = createBaseSessionData();
    message.sessionId = object.sessionId ?? "";
    message.roomId = object.roomId ?? "";
    message.source = object.source ?? 0;
    return message;
  },
};

function createBaseSessionTemplate(): SessionTemplate {
  return {
    type: 0,
    targetType: 0,
    source: "",
    targets: [],
    timestamp: 0,
    user: undefined,
    room: undefined,
    chat: undefined,
    system: undefined,
    object: undefined,
  };
}

export const SessionTemplate = {
  encode(message: SessionTemplate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.targetType !== 0) {
      writer.uint32(16).int32(message.targetType);
    }
    if (message.source !== "") {
      writer.uint32(26).string(message.source);
    }
    for (const v of message.targets) {
      writer.uint32(34).string(v!);
    }
    if (message.timestamp !== 0) {
      writer.uint32(40).int64(message.timestamp);
    }
    if (message.user !== undefined) {
      UserTemplate.encode(message.user, writer.uint32(50).fork()).ldelim();
    }
    if (message.room !== undefined) {
      RoomTemplate.encode(message.room, writer.uint32(58).fork()).ldelim();
    }
    if (message.chat !== undefined) {
      ChatTemplate.encode(message.chat, writer.uint32(66).fork()).ldelim();
    }
    if (message.system !== undefined) {
      SystemTemplate.encode(message.system, writer.uint32(74).fork()).ldelim();
    }
    if (message.object !== undefined) {
      writer.uint32(82).string(message.object);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SessionTemplate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSessionTemplate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.targetType = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.source = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.targets.push(reader.string());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.timestamp = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.user = UserTemplate.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.room = RoomTemplate.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.chat = ChatTemplate.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.system = SystemTemplate.decode(reader, reader.uint32());
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.object = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SessionTemplate {
    return {
      type: isSet(object.type) ? payloadTypeFromJSON(object.type) : 0,
      targetType: isSet(object.targetType) ? targetFromJSON(object.targetType) : 0,
      source: isSet(object.source) ? globalThis.String(object.source) : "",
      targets: globalThis.Array.isArray(object?.targets) ? object.targets.map((e: any) => globalThis.String(e)) : [],
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      user: isSet(object.user) ? UserTemplate.fromJSON(object.user) : undefined,
      room: isSet(object.room) ? RoomTemplate.fromJSON(object.room) : undefined,
      chat: isSet(object.chat) ? ChatTemplate.fromJSON(object.chat) : undefined,
      system: isSet(object.system) ? SystemTemplate.fromJSON(object.system) : undefined,
      object: isSet(object.object) ? globalThis.String(object.object) : undefined,
    };
  },

  toJSON(message: SessionTemplate): unknown {
    const obj: any = {};
    if (message.type !== 0) {
      obj.type = payloadTypeToJSON(message.type);
    }
    if (message.targetType !== 0) {
      obj.targetType = targetToJSON(message.targetType);
    }
    if (message.source !== "") {
      obj.source = message.source;
    }
    if (message.targets?.length) {
      obj.targets = message.targets;
    }
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.user !== undefined) {
      obj.user = UserTemplate.toJSON(message.user);
    }
    if (message.room !== undefined) {
      obj.room = RoomTemplate.toJSON(message.room);
    }
    if (message.chat !== undefined) {
      obj.chat = ChatTemplate.toJSON(message.chat);
    }
    if (message.system !== undefined) {
      obj.system = SystemTemplate.toJSON(message.system);
    }
    if (message.object !== undefined) {
      obj.object = message.object;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SessionTemplate>, I>>(base?: I): SessionTemplate {
    return SessionTemplate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SessionTemplate>, I>>(object: I): SessionTemplate {
    const message = createBaseSessionTemplate();
    message.type = object.type ?? 0;
    message.targetType = object.targetType ?? 0;
    message.source = object.source ?? "";
    message.targets = object.targets?.map((e) => e) || [];
    message.timestamp = object.timestamp ?? 0;
    message.user = (object.user !== undefined && object.user !== null)
      ? UserTemplate.fromPartial(object.user)
      : undefined;
    message.room = (object.room !== undefined && object.room !== null)
      ? RoomTemplate.fromPartial(object.room)
      : undefined;
    message.chat = (object.chat !== undefined && object.chat !== null)
      ? ChatTemplate.fromPartial(object.chat)
      : undefined;
    message.system = (object.system !== undefined && object.system !== null)
      ? SystemTemplate.fromPartial(object.system)
      : undefined;
    message.object = object.object ?? undefined;
    return message;
  },
};

function createBaseUserTemplate(): UserTemplate {
  return { sessionId: "", nickname: "", role: 0, state: 0 };
}

export const UserTemplate = {
  encode(message: UserTemplate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sessionId !== "") {
      writer.uint32(10).string(message.sessionId);
    }
    if (message.nickname !== "") {
      writer.uint32(18).string(message.nickname);
    }
    if (message.role !== 0) {
      writer.uint32(24).int32(message.role);
    }
    if (message.state !== 0) {
      writer.uint32(32).int32(message.state);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserTemplate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserTemplate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.sessionId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nickname = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.role = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.state = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UserTemplate {
    return {
      sessionId: isSet(object.sessionId) ? globalThis.String(object.sessionId) : "",
      nickname: isSet(object.nickname) ? globalThis.String(object.nickname) : "",
      role: isSet(object.role) ? userRoleFromJSON(object.role) : 0,
      state: isSet(object.state) ? userStateFromJSON(object.state) : 0,
    };
  },

  toJSON(message: UserTemplate): unknown {
    const obj: any = {};
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    if (message.nickname !== "") {
      obj.nickname = message.nickname;
    }
    if (message.role !== 0) {
      obj.role = userRoleToJSON(message.role);
    }
    if (message.state !== 0) {
      obj.state = userStateToJSON(message.state);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UserTemplate>, I>>(base?: I): UserTemplate {
    return UserTemplate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UserTemplate>, I>>(object: I): UserTemplate {
    const message = createBaseUserTemplate();
    message.sessionId = object.sessionId ?? "";
    message.nickname = object.nickname ?? "";
    message.role = object.role ?? 0;
    message.state = object.state ?? 0;
    return message;
  },
};

function createBaseRoomTemplate(): RoomTemplate {
  return { roomId: "", ownerId: "", name: "", timestamp: 0, maxCount: 0, users: [] };
}

export const RoomTemplate = {
  encode(message: RoomTemplate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.ownerId !== "") {
      writer.uint32(18).string(message.ownerId);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.timestamp !== 0) {
      writer.uint32(40).int64(message.timestamp);
    }
    if (message.maxCount !== 0) {
      writer.uint32(48).int32(message.maxCount);
    }
    for (const v of message.users) {
      UserTemplate.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RoomTemplate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoomTemplate();
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

          message.ownerId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.timestamp = longToNumber(reader.int64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.maxCount = reader.int32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.users.push(UserTemplate.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RoomTemplate {
    return {
      roomId: isSet(object.roomId) ? globalThis.String(object.roomId) : "",
      ownerId: isSet(object.ownerId) ? globalThis.String(object.ownerId) : "",
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      maxCount: isSet(object.maxCount) ? globalThis.Number(object.maxCount) : 0,
      users: globalThis.Array.isArray(object?.users) ? object.users.map((e: any) => UserTemplate.fromJSON(e)) : [],
    };
  },

  toJSON(message: RoomTemplate): unknown {
    const obj: any = {};
    if (message.roomId !== "") {
      obj.roomId = message.roomId;
    }
    if (message.ownerId !== "") {
      obj.ownerId = message.ownerId;
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.maxCount !== 0) {
      obj.maxCount = Math.round(message.maxCount);
    }
    if (message.users?.length) {
      obj.users = message.users.map((e) => UserTemplate.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RoomTemplate>, I>>(base?: I): RoomTemplate {
    return RoomTemplate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RoomTemplate>, I>>(object: I): RoomTemplate {
    const message = createBaseRoomTemplate();
    message.roomId = object.roomId ?? "";
    message.ownerId = object.ownerId ?? "";
    message.name = object.name ?? "";
    message.timestamp = object.timestamp ?? 0;
    message.maxCount = object.maxCount ?? 0;
    message.users = object.users?.map((e) => UserTemplate.fromPartial(e)) || [];
    return message;
  },
};

function createBaseChatTemplate(): ChatTemplate {
  return { message: "" };
}

export const ChatTemplate = {
  encode(message: ChatTemplate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message !== "") {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ChatTemplate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseChatTemplate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ChatTemplate {
    return { message: isSet(object.message) ? globalThis.String(object.message) : "" };
  },

  toJSON(message: ChatTemplate): unknown {
    const obj: any = {};
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ChatTemplate>, I>>(base?: I): ChatTemplate {
    return ChatTemplate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ChatTemplate>, I>>(object: I): ChatTemplate {
    const message = createBaseChatTemplate();
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseSystemTemplate(): SystemTemplate {
  return { type: 0, source: "", message: "" };
}

export const SystemTemplate = {
  encode(message: SystemTemplate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.type !== 0) {
      writer.uint32(8).int32(message.type);
    }
    if (message.source !== "") {
      writer.uint32(18).string(message.source);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SystemTemplate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSystemTemplate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.source = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.message = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SystemTemplate {
    return {
      type: isSet(object.type) ? systemEventFromJSON(object.type) : 0,
      source: isSet(object.source) ? globalThis.String(object.source) : "",
      message: isSet(object.message) ? globalThis.String(object.message) : "",
    };
  },

  toJSON(message: SystemTemplate): unknown {
    const obj: any = {};
    if (message.type !== 0) {
      obj.type = systemEventToJSON(message.type);
    }
    if (message.source !== "") {
      obj.source = message.source;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SystemTemplate>, I>>(base?: I): SystemTemplate {
    return SystemTemplate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SystemTemplate>, I>>(object: I): SystemTemplate {
    const message = createBaseSystemTemplate();
    message.type = object.type ?? 0;
    message.source = object.source ?? "";
    message.message = object.message ?? "";
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

function longToNumber(long: Long): number {
  if (long.gt(globalThis.Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
