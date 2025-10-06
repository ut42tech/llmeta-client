"use client";

import { Level } from "@/components/Level";
import { LocalPlayer } from "@/components/player/LocalPlayer";
import { PlayerHandle } from "@/components/player/Player";
import { Players } from "@/components/player/Players";
import { useColyseusRoom } from "@/utils/colyseus";
import { useXRControllerInput } from "@react-three/viverse";
import { useRef, RefObject } from "react";
import { Vector3 } from "three";

type Props = {
  mode: "desktop" | "xr";
};

export const ExperienceScene = ({ mode }: Props) => {
  const room = useColyseusRoom();
  const name = room?.sessionId ?? "接続中...";
  const isXR = mode === "xr";
  const PlayerRef = useRef<PlayerHandle>(null);
  if (isXR) {
    const input = useXRControllerInput();
    return (
      <SceneContent
        name={name}
        isXR={isXR}
        input={input}
        PlayerRef={PlayerRef}
      />
    );
  } else {
    return (
      <SceneContent
        name={name}
        isXR={isXR}
        input={undefined}
        PlayerRef={PlayerRef}
      />
    );
  }
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
