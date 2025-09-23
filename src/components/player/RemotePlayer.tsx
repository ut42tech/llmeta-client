"use client";

import { PlayerTag } from "@/components/player/PlayerTag";

type RemotePlayerProps = {
  name: string;
};

export const RemotePlayer = ({ name }: RemotePlayerProps) => {
  return (
    <group>
      <mesh castShadow receiveShadow position-y={1}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={"orange"} transparent opacity={0.8} />
      </mesh>

      <PlayerTag name={name} />
    </group>
  );
};
