import { MapSchema, Schema, type } from "@colyseus/schema";
import { colyseus } from "use-colyseus";

/**
 * Colyseus設定定数
 */
export const COLYSEUS_CONFIG = {
  DEFAULT_ENDPOINT: "http://localhost:2567",
  DEFAULT_ROOM_NAME: "my_room",
} as const;

/**
 * メッセージタイプ（サーバーと同期）
 */
export enum MessageType {
  CHANGE_PROFILE,
  MOVE,
}

/**
 * 3D座標スキーマ
 */
export class Vec3 extends Schema {
  @type("number") x = 0;
  @type("number") y = 0;
  @type("number") z = 0;
}

/**
 * プレーンな3D座標オブジェクト（メッセージ送信用）
 */
export type Vec3Data = {
  x: number;
  y: number;
  z: number;
};

/**
 * プロフィール更新メッセージ
 */
export type ProfileData = {
  isXR?: boolean;
  isHandTracking?: boolean;
  isVisible?: boolean;
};

/**
 * 移動・姿勢更新メッセージ（送信用）
 */
export type MoveData = {
  position?: Vec3Data;
  rotation?: Vec3Data;
  leftHandPosition?: Vec3Data;
  leftHandRotation?: Vec3Data;
  rightHandPosition?: Vec3Data;
  rightHandRotation?: Vec3Data;
};

/**
 * プレイヤー状態スキーマ
 */
export class Player extends Schema {
  @type("boolean") isXR = false;
  @type("boolean") isHandTracking = false;
  @type("boolean") isVisible = false;
  @type(Vec3) position = new Vec3();
  @type(Vec3) rotation = new Vec3();
  @type(Vec3) leftHandPosition = new Vec3();
  @type(Vec3) leftHandRotation = new Vec3();
  @type(Vec3) rightHandPosition = new Vec3();
  @type(Vec3) rightHandRotation = new Vec3();
}

/**
 * ルーム状態スキーマ
 */
export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

/**
 * Colyseusクライアントとフック
 */
const serverEndpoint =
  process.env.NEXT_PUBLIC_SERVER_ENDPOINT || COLYSEUS_CONFIG.DEFAULT_ENDPOINT;

export const {
  client,
  connectToColyseus,
  disconnectFromColyseus,
  useColyseusRoom,
  useColyseusState,
} = colyseus<MyRoomState>(serverEndpoint, MyRoomState);
