"use client";

import { Player } from "@/components/player/Player";
import { PlayerTag } from "@/components/player/PlayerTag";
import { SnapRotateXROrigin } from "@/components/xr/SnapRotateXROrigin";
import { PerspectiveCamera } from "@react-three/drei";

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
        onPoseUpdate={onPoseUpdate}
        poseUpdateIntervalMs={poseUpdateIntervalMs}
      >
        <PlayerTag name={name} />
        {isXR ? <SnapRotateXROrigin /> : null}
      </Player>
    </>
  );
};
