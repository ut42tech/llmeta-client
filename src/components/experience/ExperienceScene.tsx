"use client";

import { useXRControllerInput } from "@react-three/viverse";
import { type RefObject, useRef } from "react";
import type { Vector3 } from "three";
import { LocalPlayer } from "@/components/player/LocalPlayer";
import type { PlayerHandle } from "@/components/player/Player";
import { Players } from "@/components/player/Players";
import { Level } from "@/components/scene/Level";
import { useColyseusRoom } from "@/utils/colyseus";

type Props = {
  mode: "desktop" | "xr";
};

export const ExperienceScene = ({ mode }: Props) => {
  const room = useColyseusRoom();
  const name = room?.sessionId ?? "接続中...";
  const isXR = mode === "xr";
  const PlayerRef = useRef<PlayerHandle>(null);
  const controllerInput = useXRControllerInput();
  const input = isXR ? controllerInput : undefined;

  return (
    <SceneContent name={name} isXR={isXR} input={input} PlayerRef={PlayerRef} />
  );
};

type SceneContentProps = {
  name: string;
  isXR: boolean;
  input?: ReturnType<typeof useXRControllerInput>;
  PlayerRef?: RefObject<PlayerHandle | null>;
};

const SceneContent = ({ name, isXR, input, PlayerRef }: SceneContentProps) => (
  <>
    <LocalPlayer name={name} isXR={isXR} input={input} PlayerRef={PlayerRef} />
    <Players />

    <Level
      onTeleport={
        isXR && PlayerRef
          ? (v) => PlayerRef.current?.setPosition(v as Vector3)
          : undefined
      }
    />
  </>
);
