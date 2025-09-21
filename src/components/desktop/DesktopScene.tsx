"use client";

import { Level } from "@/components/Level";
import { Player } from "@/components/player/Player";
import { PlayerTag } from "@/components/player/PlayerTag";

export const DesktopScene = () => {
  return (
    <>
      <Player
        model={{
          type: "vrm",
          url: "/models/8329890252317737768.vrm",
          castShadow: true,
          receiveShadow: true,
        }}
      >
        <PlayerTag name={"プレイヤー"} />
      </Player>

      <Level />
    </>
  );
};
