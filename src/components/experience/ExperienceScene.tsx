"use client";

import { Level } from "@/components/Level";
import { LocalPlayer } from "@/components/player/LocalPlayer";
import { PlayerHandle } from "@/components/player/Player";
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

  if (mode === "xr") return <XRInnerScene name={name} />;
  return <DesktopInnerScene name={name} />;
};

type DesktopInnerSceneProps = { name: string };
const DesktopInnerScene = ({ name }: DesktopInnerSceneProps) => (
  <SceneContent name={name} isXR={false} />
);

type XRInnerSceneProps = { name: string };
const XRInnerScene = ({ name }: XRInnerSceneProps) => {
  const input = useXRControllerInput();
  const PlayerRef = useRef<PlayerHandle>(null);
  return (
    <SceneContent name={name} isXR={true} input={input} PlayerRef={PlayerRef} />
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
    <Level
      onTeleport={
        isXR && PlayerRef
          ? (v) => PlayerRef.current?.setPosition(v as Vector3)
          : undefined
      }
    />
  </>
);
