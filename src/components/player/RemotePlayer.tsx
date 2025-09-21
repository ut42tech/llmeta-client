"use client";

import { Player } from "@/components/player/Player";
import { PlayerTag } from "@/components/player/PlayerTag";

const MODEL = {
  type: "vrm",
  url: "/models/8590256991748008892.vrm",
  castShadow: true,
  receiveShadow: true,
};

type RemotePlayerProps = {
  name: string;
};

export const RemotePlayer = ({ name }: RemotePlayerProps) => {
  return (
    <>
      <Player model={MODEL} input={null} cameraBehavior={false}>
        <PlayerTag name={name} />
      </Player>
    </>
  );
};
