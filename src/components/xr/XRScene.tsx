"use client";

import { Level } from "@/components/Level";
import { Player, PlayerHandle } from "@/components/player/Player";
import { PlayerTag } from "@/components/player/PlayerTag";
import { SnapRotateXROrigin } from "@/components/xr/SnapRotateXROrigin";
import { PerspectiveCamera } from "@react-three/drei";
import { useXRControllerInput } from "@react-three/viverse";
import { useRef } from "react";
import { Vector3 } from "three";

export const XRScene = () => {
  const PlayerRef = useRef<PlayerHandle>(null);
  const input = useXRControllerInput();
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[-5, 5 * Math.SQRT2, 5]}
        fov={50}
        onUpdate={(cam) => cam.lookAt(0, 2, 0)}
      />

      <Player
        ref={PlayerRef}
        input={[input]}
        cameraBehavior={false}
        model={false}
      >
        <SnapRotateXROrigin />
        <PlayerTag name={"プレイヤー"} />
      </Player>

      <Level onTeleport={(v) => PlayerRef.current?.setPosition(v as Vector3)} />
    </>
  );
};
