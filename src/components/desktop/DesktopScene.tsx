"use client";

import { Level } from "@/components/Level";
import { LocalPlayer } from "@/components/player/LocalPlayer";
import { useColyseusRoom } from "@/utils/colyseus";

export const DesktopScene = () => {
  const room = useColyseusRoom();
  const name = room?.sessionId ?? "接続中...";

  return (
    <>
      <LocalPlayer name={name} isXR={false} />
      <Level />
    </>
  );
};
