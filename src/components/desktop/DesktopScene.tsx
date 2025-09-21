"use client";

import { Level } from "@/components/Level";
import { LocalPlayer } from "@/components/player/LocalPlayer";

export const DesktopScene = () => {
  return (
    <>
      <LocalPlayer name={"プレイヤー(PC)"} isXR={false} />

      <Level />
    </>
  );
};
