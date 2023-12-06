/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "stream";

export interface SerializedStream {
  bytes: Uint8Array[];
}

export interface StreamStruct {
  sessionId: string;
  roomId: string;
  data: Uint8Array;
  sequence: number;
  fps: number;
  startedAt: number;
  proceededAt: number;
  dataSizes: number[];
  proceededTimes: number[];
  elapsedTimes: number[];
}

function createBaseSerializedStream(): SerializedStream {
  return { bytes: [] };
}

export const SerializedStream = {
  encode(message: SerializedStream, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.bytes) {
      writer.uint32(10).bytes(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SerializedStream {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSerializedStream();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.bytes.push(reader.bytes());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SerializedStream {
    return { bytes: globalThis.Array.isArray(object?.bytes) ? object.bytes.map((e: any) => bytesFromBase64(e)) : [] };
  },

  toJSON(message: SerializedStream): unknown {
    const obj: any = {};
    if (message.bytes?.length) {
      obj.bytes = message.bytes.map((e) => base64FromBytes(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SerializedStream>, I>>(base?: I): SerializedStream {
    return SerializedStream.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SerializedStream>, I>>(object: I): SerializedStream {
    const message = createBaseSerializedStream();
    message.bytes = object.bytes?.map((e) => e) || [];
    return message;
  },
};

function createBaseStreamStruct(): StreamStruct {
  return {
    sessionId: "",
    roomId: "",
    data: new Uint8Array(0),
    sequence: 0,
    fps: 0,
    startedAt: 0,
    proceededAt: 0,
    dataSizes: [],
    proceededTimes: [],
    elapsedTimes: [],
  };
}

export const StreamStruct = {
  encode(message: StreamStruct, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sessionId !== "") {
      writer.uint32(10).string(message.sessionId);
    }
    if (message.roomId !== "") {
      writer.uint32(18).string(message.roomId);
    }
    if (message.data.length !== 0) {
      writer.uint32(26).bytes(message.data);
    }
    if (message.sequence !== 0) {
      writer.uint32(32).int32(message.sequence);
    }
    if (message.fps !== 0) {
      writer.uint32(40).int32(message.fps);
    }
    if (message.startedAt !== 0) {
      writer.uint32(48).int64(message.startedAt);
    }
    if (message.proceededAt !== 0) {
      writer.uint32(56).int64(message.proceededAt);
    }
    writer.uint32(66).fork();
    for (const v of message.dataSizes) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(74).fork();
    for (const v of message.proceededTimes) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(82).fork();
    for (const v of message.elapsedTimes) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StreamStruct {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStreamStruct();
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
          if (tag !== 26) {
            break;
          }

          message.data = reader.bytes();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.sequence = reader.int32();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.fps = reader.int32();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.startedAt = longToNumber(reader.int64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.proceededAt = longToNumber(reader.int64() as Long);
          continue;
        case 8:
          if (tag === 64) {
            message.dataSizes.push(reader.int32());

            continue;
          }

          if (tag === 66) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.dataSizes.push(reader.int32());
            }

            continue;
          }

          break;
        case 9:
          if (tag === 72) {
            message.proceededTimes.push(reader.int32());

            continue;
          }

          if (tag === 74) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.proceededTimes.push(reader.int32());
            }

            continue;
          }

          break;
        case 10:
          if (tag === 80) {
            message.elapsedTimes.push(reader.int32());

            continue;
          }

          if (tag === 82) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.elapsedTimes.push(reader.int32());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StreamStruct {
    return {
      sessionId: isSet(object.sessionId) ? globalThis.String(object.sessionId) : "",
      roomId: isSet(object.roomId) ? globalThis.String(object.roomId) : "",
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
      sequence: isSet(object.sequence) ? globalThis.Number(object.sequence) : 0,
      fps: isSet(object.fps) ? globalThis.Number(object.fps) : 0,
      startedAt: isSet(object.startedAt) ? globalThis.Number(object.startedAt) : 0,
      proceededAt: isSet(object.proceededAt) ? globalThis.Number(object.proceededAt) : 0,
      dataSizes: globalThis.Array.isArray(object?.dataSizes)
        ? object.dataSizes.map((e: any) => globalThis.Number(e))
        : [],
      proceededTimes: globalThis.Array.isArray(object?.proceededTimes)
        ? object.proceededTimes.map((e: any) => globalThis.Number(e))
        : [],
      elapsedTimes: globalThis.Array.isArray(object?.elapsedTimes)
        ? object.elapsedTimes.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: StreamStruct): unknown {
    const obj: any = {};
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    if (message.roomId !== "") {
      obj.roomId = message.roomId;
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    if (message.sequence !== 0) {
      obj.sequence = Math.round(message.sequence);
    }
    if (message.fps !== 0) {
      obj.fps = Math.round(message.fps);
    }
    if (message.startedAt !== 0) {
      obj.startedAt = Math.round(message.startedAt);
    }
    if (message.proceededAt !== 0) {
      obj.proceededAt = Math.round(message.proceededAt);
    }
    if (message.dataSizes?.length) {
      obj.dataSizes = message.dataSizes.map((e) => Math.round(e));
    }
    if (message.proceededTimes?.length) {
      obj.proceededTimes = message.proceededTimes.map((e) => Math.round(e));
    }
    if (message.elapsedTimes?.length) {
      obj.elapsedTimes = message.elapsedTimes.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StreamStruct>, I>>(base?: I): StreamStruct {
    return StreamStruct.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StreamStruct>, I>>(object: I): StreamStruct {
    const message = createBaseStreamStruct();
    message.sessionId = object.sessionId ?? "";
    message.roomId = object.roomId ?? "";
    message.data = object.data ?? new Uint8Array(0);
    message.sequence = object.sequence ?? 0;
    message.fps = object.fps ?? 0;
    message.startedAt = object.startedAt ?? 0;
    message.proceededAt = object.proceededAt ?? 0;
    message.dataSizes = object.dataSizes?.map((e) => e) || [];
    message.proceededTimes = object.proceededTimes?.map((e) => e) || [];
    message.elapsedTimes = object.elapsedTimes?.map((e) => e) || [];
    return message;
  },
};

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

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
