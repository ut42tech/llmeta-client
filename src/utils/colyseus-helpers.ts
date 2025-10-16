import type { Euler, Quaternion, Vector3 } from "three";
import type { MoveData, ProfileData, Vec3Data } from "./colyseus";
import { MessageType } from "./colyseus";

/**
 * Colyseusのルーム型（簡易版）
 */
type ColyseusRoom =
  | {
      send: (type: number, data: unknown) => void;
    }
  | null
  | undefined;

/**
 * Colyseusメッセージ送信のヘルパー関数群
 */

/**
 * プロフィール更新メッセージを送信
 */
export function sendProfileUpdate(
  room: ColyseusRoom,
  profile: ProfileData,
): void {
  if (!room) return;

  try {
    room.send(MessageType.CHANGE_PROFILE, profile);
  } catch (error) {
    console.warn("[Colyseus] Failed to send profile update:", error);
  }
}

/**
 * 移動・姿勢更新メッセージを送信
 */
export function sendMoveUpdate(room: ColyseusRoom, moveData: MoveData): void {
  if (!room) {
    console.warn("[Colyseus] Cannot send move update: room is not connected");
    return;
  }

  try {
    room.send(MessageType.MOVE, moveData);
  } catch (error) {
    console.error("[Colyseus] Failed to send move update:", error);
  }
}

/**
 * Vector3をプレーンオブジェクトに変換
 */
function toPlainVec3(v: Vector3 | Euler): { x: number; y: number; z: number } {
  return { x: v.x, y: v.y, z: v.z };
}

/**
 * Vector3とEulerから移動データを構築（デスクトップ用）
 */
export function createDesktopMoveData(
  position: Vector3,
  rotation: Euler,
): MoveData {
  return {
    position: toPlainVec3(position),
    rotation: { x: rotation.x, y: rotation.y, z: 0 },
  };
}

/**
 * XR用の手の位置データを追加
 */
export function addHandData(
  moveData: MoveData,
  leftHand: { pos: Vector3; euler: Euler; has: boolean },
  rightHand: { pos: Vector3; euler: Euler; has: boolean },
  cameraPosition: Vector3,
  cameraQuaternion: Quaternion,
  cameraRotation: Euler,
): MoveData {
  const result = { ...moveData };

  // 左手
  if (leftHand.has) {
    result.leftHandPosition = toPlainVec3(leftHand.pos);
    result.leftHandRotation = toPlainVec3(leftHand.euler);
  } else {
    const defaultLeft = calculateDefaultHandPosition(
      cameraPosition,
      cameraQuaternion,
      cameraRotation,
      "left",
    );
    result.leftHandPosition = defaultLeft.position;
    result.leftHandRotation = defaultLeft.rotation;
  }

  // 右手
  if (rightHand.has) {
    result.rightHandPosition = toPlainVec3(rightHand.pos);
    result.rightHandRotation = toPlainVec3(rightHand.euler);
  } else {
    const defaultRight = calculateDefaultHandPosition(
      cameraPosition,
      cameraQuaternion,
      cameraRotation,
      "right",
    );
    result.rightHandPosition = defaultRight.position;
    result.rightHandRotation = defaultRight.rotation;
  }

  return result;
}

/**
 * デフォルトの手の位置を計算
 */
function calculateDefaultHandPosition(
  cameraPosition: Vector3,
  cameraQuaternion: Quaternion,
  cameraRotation: Euler,
  hand: "left" | "right",
): {
  position: Vec3Data;
  rotation: Vec3Data;
} {
  const offset = new (require("three").Vector3)(
    hand === "left" ? -0.3 : 0.3,
    -0.5,
    -0.3,
  );

  offset.applyQuaternion(cameraQuaternion);
  const pos = cameraPosition.clone().add(offset);

  return {
    position: { x: pos.x, y: pos.y, z: pos.z },
    rotation: { x: cameraRotation.x, y: cameraRotation.y, z: 0 },
  };
}
