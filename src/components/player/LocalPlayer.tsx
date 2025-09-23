"use client";

import { Player } from "@/components/player/Player";
import { PlayerTag } from "@/components/player/PlayerTag";
import { PerspectiveCamera } from "@react-three/drei";
import { useCallback, useMemo } from "react";
import { MessageType, MoveData, useColyseusRoom } from "@/utils/colyseus";
import { SnapRotateXROrigin } from "@/components/player/SnapRotateXROrigin";

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

  const mergedOnPoseUpdate = useCallback(
    (pose: {
      position: { x: number; y: number; z: number };
      rotation: { x: number; y: number; z: number };
      quaternion: { x: number; y: number; z: number; w: number };
    }) => {
      onPoseUpdate?.(pose);

      if (room) {
        try {
          const payload: MoveData = {
            position: pose.position,
            rotation: pose.rotation,
          };
          room.send(MessageType.MOVE, payload);
        } catch (e) {
          console.warn("Failed to send pose to Colyseus:", e);
        }
      }
    },
    [room, onPoseUpdate]
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
        input={isXR ? [input] : undefined}
        cameraBehavior={isXR ? false : true}
        model={isXR ? false : MODEL}
        onPoseUpdate={mergedOnPoseUpdate}
        poseUpdateIntervalMs={interval}
      >
        <PlayerTag name={name} />
        {isXR ? <SnapRotateXROrigin /> : null}
      </Player>
    </>
  );
};
