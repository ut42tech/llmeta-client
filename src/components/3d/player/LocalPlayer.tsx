"use client";

import { PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  FirstPersonCharacterCameraBehavior,
  LocomotionKeyboardInput,
  PointerLockInput,
} from "@react-three/viverse";
import { useXRInputSourceState, XRSpace } from "@react-three/xr";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Euler, type Object3D, Quaternion, Vector3 } from "three";
import {
  Player,
  type PlayerHandle,
  type PlayerTransformSnapshot,
} from "@/components/3d/player/Player";
import { PlayerTag } from "@/components/3d/player/PlayerTag";
import { SnapRotateXROrigin } from "@/components/3d/player/SnapRotateXROrigin";
import { useColyseusRoom } from "@/utils/colyseus";
import {
  addHandData,
  createDesktopMoveData,
  sendMoveUpdate,
  sendProfileUpdate,
} from "@/utils/colyseus-helpers";

type LocalPlayerProps = {
  name: string;
  isXR: boolean;
  input?: unknown;
  PlayerRef?: React.RefObject<PlayerHandle | null>;
  onPoseUpdate?: (pose: PlayerTransformSnapshot) => void;
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
  const { camera } = useThree();

  // 初期プロフィール同期
  useEffect(() => {
    const profile = isXR ? { isXR } : { isXR, isHandTracking: false };
    sendProfileUpdate(room, profile);
  }, [room, isXR]);

  // XR手の姿勢を保持するRef
  const leftHandRef = useRef<{ pos: Vector3; euler: Euler; has: boolean }>({
    pos: new Vector3(-0.3, 1.0, 0),
    euler: new Euler(),
    has: false,
  });
  const rightHandRef = useRef<{ pos: Vector3; euler: Euler; has: boolean }>({
    pos: new Vector3(0.3, 1.0, 0),
    euler: new Euler(),
    has: false,
  });

  const getCameraWorldTransform = useCallback(() => {
    const position = camera.getWorldPosition(new Vector3());
    const quaternion = camera.getWorldQuaternion(new Quaternion());
    const rotation = new Euler().setFromQuaternion(quaternion, "YXZ");
    return { position, quaternion, rotation };
  }, [camera]);

  const handlePoseUpdate = useCallback(
    (pose: PlayerTransformSnapshot) => {
      onPoseUpdate?.(pose);

      const { position, quaternion, rotation } = getCameraWorldTransform();

      let moveData = createDesktopMoveData(position, rotation);

      if (isXR) {
        moveData = addHandData(
          moveData,
          leftHandRef.current,
          rightHandRef.current,
          position,
          quaternion,
          rotation,
        );
      }

      sendMoveUpdate(room, moveData);
    },
    [room, onPoseUpdate, getCameraWorldTransform, isXR],
  );

  const interval = useMemo(
    () => poseUpdateIntervalMs ?? 50,
    [poseUpdateIntervalMs],
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
        model={false}
        onPoseUpdate={handlePoseUpdate}
        poseUpdateIntervalMs={interval}
      >
        <PlayerTag name={name} />
        {isXR && (
          <>
            <XRProfileSync isXR={isXR} />
            <XRControllersProbe leftRef={leftHandRef} rightRef={rightHandRef} />
            <SnapRotateXROrigin />
          </>
        )}
      </Player>
    </>
  );
};

/**
 * XRハンドトラッキング状態をサーバーに同期
 */
const XRProfileSync = ({ isXR }: { isXR: boolean }) => {
  const room = useColyseusRoom();
  const leftHandState = useXRInputSourceState("hand", "left");
  const rightHandState = useXRInputSourceState("hand", "right");

  const isHandTracking = !!(
    leftHandState?.inputSource || rightHandState?.inputSource
  );

  useEffect(() => {
    sendProfileUpdate(room, { isXR, isHandTracking });
  }, [room, isXR, isHandTracking]);

  return null;
};

/**
 * XRコントローラー・ハンドの姿勢をRefに書き込む
 */
const XRControllersProbe = ({
  leftRef,
  rightRef,
}: {
  leftRef: React.RefObject<{ pos: Vector3; euler: Euler; has: boolean }>;
  rightRef: React.RefObject<{ pos: Vector3; euler: Euler; has: boolean }>;
}) => {
  const leftControllerState = useXRInputSourceState("controller", "left");
  const rightControllerState = useXRInputSourceState("controller", "right");
  const leftHandState = useXRInputSourceState("hand", "left");
  const rightHandState = useXRInputSourceState("hand", "right");

  // ハンドトラッキングを優先、なければコントローラー
  const leftState = leftHandState?.inputSource
    ? leftHandState
    : leftControllerState;
  const rightState = rightHandState?.inputSource
    ? rightHandState
    : rightControllerState;

  const leftSpaceRef = useRef<Object3D>(null);
  const rightSpaceRef = useRef<Object3D>(null);

  useFrame(() => {
    // 左手
    if (leftState?.inputSource && leftSpaceRef.current) {
      const pos = leftSpaceRef.current.getWorldPosition(new Vector3());
      const rot = new Euler().setFromQuaternion(
        leftSpaceRef.current.getWorldQuaternion(new Quaternion()),
        "YXZ",
      );
      leftRef.current.pos.copy(pos);
      leftRef.current.euler.copy(rot);
      leftRef.current.has = true;
    } else {
      leftRef.current.has = false;
    }

    // 右手
    if (rightState?.inputSource && rightSpaceRef.current) {
      const pos = rightSpaceRef.current.getWorldPosition(new Vector3());
      const rot = new Euler().setFromQuaternion(
        rightSpaceRef.current.getWorldQuaternion(new Quaternion()),
        "YXZ",
      );
      rightRef.current.pos.copy(pos);
      rightRef.current.euler.copy(rot);
      rightRef.current.has = true;
    } else {
      rightRef.current.has = false;
    }
  });

  // 手関節を取得（ハンドトラッキング時）
  const getHandJoint = (inputSource: XRInputSource | undefined) => {
    if (!inputSource?.hand) return null;
    const hand = inputSource.hand;
    if (typeof hand.get === "function") {
      return hand.get("wrist") || null;
    }
    return null;
  };

  const leftSpace =
    getHandJoint(leftState?.inputSource) ??
    leftState?.inputSource?.gripSpace ??
    leftState?.inputSource?.targetRaySpace;

  const rightSpace =
    getHandJoint(rightState?.inputSource) ??
    rightState?.inputSource?.gripSpace ??
    rightState?.inputSource?.targetRaySpace;

  return (
    <>
      {leftSpace && <XRSpace ref={leftSpaceRef} space={leftSpace} />}
      {rightSpace && <XRSpace ref={rightSpaceRef} space={rightSpace} />}
    </>
  );
};
