/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { RequestSource, requestSourceFromJSON, requestSourceToJSON } from "./constraint";

export const protobufPackage = "auth";

export interface IssueIceCredentialRequest {
  source: RequestSource;
}

export interface IssueIceCredentialResponse {
  sessionId: string;
  username: string;
  credential: string;
  iceHost: string;
}

function createBaseIssueIceCredentialRequest(): IssueIceCredentialRequest {
  return { source: 0 };
}

export const IssueIceCredentialRequest = {
  encode(message: IssueIceCredentialRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.source !== 0) {
      writer.uint32(8).int32(message.source);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IssueIceCredentialRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIssueIceCredentialRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
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

  fromJSON(object: any): IssueIceCredentialRequest {
    return { source: isSet(object.source) ? requestSourceFromJSON(object.source) : 0 };
  },

  toJSON(message: IssueIceCredentialRequest): unknown {
    const obj: any = {};
    if (message.source !== 0) {
      obj.source = requestSourceToJSON(message.source);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IssueIceCredentialRequest>, I>>(base?: I): IssueIceCredentialRequest {
    return IssueIceCredentialRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IssueIceCredentialRequest>, I>>(object: I): IssueIceCredentialRequest {
    const message = createBaseIssueIceCredentialRequest();
    message.source = object.source ?? 0;
    return message;
  },
};

function createBaseIssueIceCredentialResponse(): IssueIceCredentialResponse {
  return { sessionId: "", username: "", credential: "", iceHost: "" };
}

export const IssueIceCredentialResponse = {
  encode(message: IssueIceCredentialResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sessionId !== "") {
      writer.uint32(10).string(message.sessionId);
    }
    if (message.username !== "") {
      writer.uint32(18).string(message.username);
    }
    if (message.credential !== "") {
      writer.uint32(26).string(message.credential);
    }
    if (message.iceHost !== "") {
      writer.uint32(34).string(message.iceHost);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IssueIceCredentialResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIssueIceCredentialResponse();
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

          message.username = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.credential = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.iceHost = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IssueIceCredentialResponse {
    return {
      sessionId: isSet(object.sessionId) ? globalThis.String(object.sessionId) : "",
      username: isSet(object.username) ? globalThis.String(object.username) : "",
      credential: isSet(object.credential) ? globalThis.String(object.credential) : "",
      iceHost: isSet(object.iceHost) ? globalThis.String(object.iceHost) : "",
    };
  },

  toJSON(message: IssueIceCredentialResponse): unknown {
    const obj: any = {};
    if (message.sessionId !== "") {
      obj.sessionId = message.sessionId;
    }
    if (message.username !== "") {
      obj.username = message.username;
    }
    if (message.credential !== "") {
      obj.credential = message.credential;
    }
    if (message.iceHost !== "") {
      obj.iceHost = message.iceHost;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IssueIceCredentialResponse>, I>>(base?: I): IssueIceCredentialResponse {
    return IssueIceCredentialResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IssueIceCredentialResponse>, I>>(object: I): IssueIceCredentialResponse {
    const message = createBaseIssueIceCredentialResponse();
    message.sessionId = object.sessionId ?? "";
    message.username = object.username ?? "";
    message.credential = object.credential ?? "";
    message.iceHost = object.iceHost ?? "";
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
