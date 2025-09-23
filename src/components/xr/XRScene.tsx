"use client";

import { Level } from "@/components/Level";
import { LocalPlayer } from "@/components/player/LocalPlayer";
import { PlayerHandle } from "@/components/player/Player";
import { useColyseusRoom } from "@/utils/colyseus";
import { useXRControllerInput } from "@react-three/viverse";
import { useRef } from "react";
import { Vector3 } from "three";

export const XRScene = () => {
  const input = useXRControllerInput();
  const PlayerRef = useRef<PlayerHandle>(null);
  const room = useColyseusRoom();
  const name = room?.sessionId ?? "接続中...";
  return (
    <>
      <LocalPlayer
        name={name}
        isXR={true}
        input={input}
        PlayerRef={PlayerRef}
      />

      <Level onTeleport={(v) => PlayerRef.current?.setPosition(v as Vector3)} />
    </>
  );
};
