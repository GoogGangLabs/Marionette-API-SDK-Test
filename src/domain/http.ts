import { RequestSource } from '../pb/constraint';
import { IssueIceCredentialRequest, IssueIceCredentialResponse } from '../pb/auth';
import {
  CreateRoomRequest,
  CreateRoomResponse,
  DeleteRoomRequest,
  DeleteRoomResponse,
  JoinRoomRequest,
  JoinRoomResponse,
  LeaveRoomRequest,
  LeaveRoomResponse,
} from '../pb/signaling';

/** Reqeust Payload */

export class IssueIceCredentialRequestDto implements IssueIceCredentialRequest {
  source: RequestSource;

  constructor() {
    this.source = RequestSource.REQUEST_SOURCE_CLIENT;
  }
}

export class CreateRoomRequestDto implements CreateRoomRequest {
  roomName: string;
}

export class DeleteRoomRequestDto implements DeleteRoomRequest {}

export class JoinRoomRequestDto implements JoinRoomRequest {
  roomId: string;
  nickName: string;
  mediaBridgeSdp: string;
  dataBridgeSdp: string;
  roomManagementSdp: string;
}

export class LeaveRoomRequestDto implements LeaveRoomRequest {}

/** Response Payload */

export class IssueIceCredentialResponseDto implements IssueIceCredentialResponse {
  sessionId: string;
  username: string;
  credential: string;
  iceHost: string;
}

export class CreateRoomResponseDto implements CreateRoomResponse {
  roomId: string;
  roomName: string;
}

export class DeleteRoomResponseDto implements DeleteRoomResponse {}

export class JoinRoomResponseDto implements JoinRoomResponse {
  roomId: string;
  mediaBridgeSdp: string;
  dataBridgeSdp: string;
  roomManagementSdp: string;
}

export class LeaveRoomResponseDto implements LeaveRoomResponse {}
