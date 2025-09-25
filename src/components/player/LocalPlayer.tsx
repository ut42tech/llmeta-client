"use client";

import { Player } from "@/components/player/Player";
import { PlayerTag } from "@/components/player/PlayerTag";
import { PerspectiveCamera } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FirstPersonCharacterCameraBehavior,
  LocomotionKeyboardInput,
  PointerLockInput,
} from "@react-three/viverse";
import {
  MessageType,
  MoveData,
  useColyseusRoom,
  ProfileData,
} from "@/utils/colyseus";
import { SnapRotateXROrigin } from "@/components/player/SnapRotateXROrigin";
import { useFrame, useThree } from "@react-three/fiber";
import { Euler, Quaternion, Vector3, Object3D } from "three";
import { XRSpace, useXRInputSourceState } from "@react-three/xr";

const MODEL = {
  type: "vrm",
  url: "/models/8329890252317737768.vrm",
  castShadow: true,
  receiveShadow: true,
};

type LocalPlayerProps = {
  name: string;
  isXR: boolean;
  input?: any;
  PlayerRef?: any;
  onPoseUpdate?: (pose: any) => void;
  poseUpdateIntervalMs?: number;
};

export const LocalPlayer = ({
  name,
  isXR,
  input,
  PlayerRef,
  onPoseUpdate,
  poseUpdateIntervalMs,
}: LocalPlayerProps) => {
  const room = useColyseusRoom();
  // 基本プロフィール同期（デスクトップ時は isHandTracking を false で明示）
  useEffect(() => {
    if (!room) return;
    const payload: ProfileData = isXR
      ? { isXR }
      : { isXR, isHandTracking: false };
    try {
      room.send(MessageType.CHANGE_PROFILE, payload);
    } catch (e) {
      console.warn("Failed to send profile (isXR) to Colyseus:", e);
    }
  }, [room, isXR]);
  const { camera } = useThree();
  // XR時のみ更新される左右手ポーズの共有Ref
  const leftHandRef = useRef<{ pos: Vector3; euler: Euler; has: boolean }>({
    pos: new Vector3(),
    euler: new Euler(),
    has: false,
  });
  const rightHandRef = useRef<{ pos: Vector3; euler: Euler; has: boolean }>({
    pos: new Vector3(),
    euler: new Euler(),
    has: false,
  });

  const getCameraEulerYXZ = useCallback(() => {
    const q = new Quaternion();
    camera.getWorldQuaternion(q);
    const e = new Euler().setFromQuaternion(q, "YXZ");
    return e;
  }, [camera]);

  const mergedOnPoseUpdate = useCallback(
    (pose: {
      position: { x: number; y: number; z: number };
      rotation: { x: number; y: number; z: number };
      quaternion: { x: number; y: number; z: number; w: number };
    }) => {
      onPoseUpdate?.(pose);

      if (room) {
        try {
          // 頭（カメラ）のワールド姿勢
          const e = getCameraEulerYXZ();

          const camPos = camera.getWorldPosition(new Vector3());
          const payload: MoveData = {
            // プレイヤーのpositionは頭（カメラ）のワールド位置を送る
            position: { x: camPos.x, y: camPos.y, z: camPos.z },
            rotation: { x: e.x, y: e.y, z: 0 },
          };
          // 子コンポーネントで更新される手の最新値を取り込む
          if (leftHandRef.current.has) {
            const lp = leftHandRef.current.pos;
            const le = leftHandRef.current.euler;
            payload.leftHandPosition = { x: lp.x, y: lp.y, z: lp.z };
            payload.leftHandRotation = { x: le.x, y: le.y, z: le.z };
          }
          if (rightHandRef.current.has) {
            const rp = rightHandRef.current.pos;
            const re = rightHandRef.current.euler;
            payload.rightHandPosition = { x: rp.x, y: rp.y, z: rp.z };
            payload.rightHandRotation = { x: re.x, y: re.y, z: re.z };
          }
          room.send(MessageType.MOVE, payload);
        } catch (e) {
          console.warn("Failed to send pose to Colyseus:", e);
        }
      }
    },
    [room, onPoseUpdate, getCameraEulerYXZ, camera, leftHandRef, rightHandRef]
  );

  const interval = useMemo(
    () => poseUpdateIntervalMs ?? 50,
    [poseUpdateIntervalMs]
  );

  return (
    <>
      {isXR ? (
        <PerspectiveCamera
          makeDefault
          position={[-5, 5 * Math.SQRT2, 5]}
          fov={50}
          onUpdate={(cam) => cam.lookAt(0, 2, 0)}
        />
      ) : null}

      <Player
        ref={isXR ? PlayerRef : null}
        input={isXR ? [input] : [LocomotionKeyboardInput, PointerLockInput]}
        cameraBehavior={isXR ? false : FirstPersonCharacterCameraBehavior}
        model={isXR ? false : false}
        onPoseUpdate={mergedOnPoseUpdate}
        poseUpdateIntervalMs={interval}
      >
        <PlayerTag name={name} />
        {/* XR内のみ hand-tracking 状態を検出して同期 */}
        {isXR ? <XRProfileSync isXR={isXR} /> : null}
        {isXR ? (
          <XRControllersProbe leftRef={leftHandRef} rightRef={rightHandRef} />
        ) : null}
        {isXR ? <SnapRotateXROrigin /> : null}
      </Player>
    </>
  );
};

// XR のみでマウントして hand-tracking の有無をサーバーへ同期
const XRProfileSync = ({ isXR }: { isXR: boolean }) => {
  const room = useColyseusRoom();
  const leftHandState = useXRInputSourceState("hand", "left");
  const rightHandState = useXRInputSourceState("hand", "right");
  const isHandTracking = !!(
    leftHandState?.inputSource || rightHandState?.inputSource
  );

  useEffect(() => {
    if (!room) return;
    try {
      const payload: ProfileData = { isXR, isHandTracking };
      room.send(MessageType.CHANGE_PROFILE, payload);
    } catch (e) {
      console.warn("Failed to send hand-tracking profile to Colyseus:", e);
    }
  }, [room, isXR, isHandTracking]);

  return null;
};

// XRコンテキスト内でのみマウントし、左右手（コントローラーgrip）のワールド姿勢をRefに書き込む
const XRControllersProbe = ({
  leftRef,
  rightRef,
}: {
  leftRef: React.RefObject<{ pos: Vector3; euler: Euler; has: boolean }>;
  rightRef: React.RefObject<{
    pos: Vector3;
    euler: Euler;
    has: boolean;
  }>;
}) => {
  // v6 API: 入力ソース状態を取得
  // コントローラー/ハンドを両方監視し、手があれば手を優先
  const leftControllerState = useXRInputSourceState("controller", "left");
  const rightControllerState = useXRInputSourceState("controller", "right");
  const leftHandState = useXRInputSourceState("hand", "left");
  const rightHandState = useXRInputSourceState("hand", "right");
  const leftState = leftHandState?.inputSource
    ? leftHandState
    : leftControllerState;
  const rightState = rightHandState?.inputSource
    ? rightHandState
    : rightControllerState;

  // XRSpace を使って grip/targetRay space の姿勢を Three の Object3D に反映
  const leftSpaceRef = useRef<Object3D>(null);
  const rightSpaceRef = useRef<Object3D>(null);

  useFrame(() => {
    // Left
    if (leftState?.inputSource && leftSpaceRef.current) {
      const pos = leftSpaceRef.current.getWorldPosition(new Vector3());
      const rot = new Euler().setFromQuaternion(
        leftSpaceRef.current.getWorldQuaternion(new Quaternion()),
        "YXZ"
      );
      leftRef.current.pos.copy(pos);
      leftRef.current.euler.copy(rot);
      leftRef.current.has = true;
    } else {
      leftRef.current.has = false;
    }

    // Right
    if (rightState?.inputSource && rightSpaceRef.current) {
      const pos = rightSpaceRef.current.getWorldPosition(new Vector3());
      const rot = new Euler().setFromQuaternion(
        rightSpaceRef.current.getWorldQuaternion(new Quaternion()),
        "YXZ"
      );
      rightRef.current.pos.copy(pos);
      rightRef.current.euler.copy(rot);
      rightRef.current.has = true;
    } else {
      rightRef.current.has = false;
    }
  });

  // 手がある場合は wrist 関節の XRJointSpace を優先し、
  // 無ければ gripSpace、さらに無ければ targetRaySpace を使用
  const leftSpace =
    (leftState?.inputSource as any)?.hand?.get?.("wrist") ??
    leftState?.inputSource?.gripSpace ??
    leftState?.inputSource?.targetRaySpace;
  const rightSpace =
    (rightState?.inputSource as any)?.hand?.get?.("wrist") ??
    rightState?.inputSource?.gripSpace ??
    rightState?.inputSource?.targetRaySpace;

  return (
    <>
      {leftSpace ? <XRSpace ref={leftSpaceRef} space={leftSpace} /> : null}
      {rightSpace ? <XRSpace ref={rightSpaceRef} space={rightSpace} /> : null}
    </>
  );
};
