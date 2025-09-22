"use client";

import { PlayerTag } from "@/components/player/PlayerTag";

type RemotePlayerProps = {
  name: string;
};

export const RemotePlayer = ({ name }: RemotePlayerProps) => {
  return (
    <group>
      <mesh castShadow receiveShadow position-y={0.9}>
        <boxGeometry args={[0.5, 1.8, 0.5]} />
        <meshStandardMaterial color="#44aaff" />
      </mesh>

      <PlayerTag name={name} />
    </group>
  );
};
