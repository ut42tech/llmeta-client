"use client";

import { Level } from "@/components/Level";
import { LocalPlayer } from "@/components/player/LocalPlayer";
import { PlayerHandle } from "@/components/player/Player";
import { useXRControllerInput } from "@react-three/viverse";
import { useRef } from "react";
import { Vector3 } from "three";

export const XRScene = () => {
  const input = useXRControllerInput();
  const PlayerRef = useRef<PlayerHandle>(null);
  return (
    <>
      <LocalPlayer
        name={"プレイヤー(XR)"}
        isXR={true}
        input={input}
        PlayerRef={PlayerRef}
      />

      <Level onTeleport={(v) => PlayerRef.current?.setPosition(v as Vector3)} />
    </>
  );
};
