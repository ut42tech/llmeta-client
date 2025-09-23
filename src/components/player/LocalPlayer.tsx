"use client";

import { Player } from "@/components/player/Player";
import { PlayerTag } from "@/components/player/PlayerTag";
import { PerspectiveCamera } from "@react-three/drei";
import { useCallback, useMemo } from "react";
import {
  FirstPersonCharacterCameraBehavior,
  LocomotionKeyboardInput,
  PointerLockInput,
} from "@react-three/viverse";
import { MessageType, MoveData, useColyseusRoom } from "@/utils/colyseus";
import { SnapRotateXROrigin } from "@/components/player/SnapRotateXROrigin";
import { useThree } from "@react-three/fiber";
import { Euler, Quaternion } from "three";

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
  const { camera } = useThree();

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
          const e = getCameraEulerYXZ();
          const payload: MoveData = {
            position: pose.position,
            rotation: { x: e.x, y: e.y, z: 0 },
          };
          room.send(MessageType.MOVE, payload);
        } catch (e) {
          console.warn("Failed to send pose to Colyseus:", e);
        }
      }
    },
    [room, onPoseUpdate, getCameraEulerYXZ]
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
        {isXR ? <SnapRotateXROrigin /> : null}
      </Player>
    </>
  );
};
