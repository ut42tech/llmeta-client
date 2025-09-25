"use client";

import { PlayerTag } from "@/components/player/PlayerTag";
import type { Group } from "three";
import type { Ref } from "react";

type RemotePlayerProps = {
  name: string;
  // Optional: render simple hand spheres inside this component
  showLeftHand?: boolean;
  showRightHand?: boolean;
  // Refs so parent can control transforms (position/quaternion)
  leftHandRef?: Ref<Group>;
  rightHandRef?: Ref<Group>;
  // Appearance tweaks (optional)
  handRadius?: number;
  leftHandColor?: string;
  rightHandColor?: string;
};

export const RemotePlayer = ({
  name,
  showLeftHand,
  showRightHand,
  leftHandRef,
  rightHandRef,
  handRadius = 0.08,
  leftHandColor = "deepskyblue",
  rightHandColor = "hotpink",
}: RemotePlayerProps) => {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={"orange"} transparent opacity={0.8} />
      </mesh>

      <PlayerTag name={name} />

      {showLeftHand ? (
        <group ref={leftHandRef}>
          <mesh castShadow receiveShadow>
            <boxGeometry
              args={[handRadius * 2, handRadius * 2, handRadius * 2]}
            />
            <meshStandardMaterial color={leftHandColor} />
          </mesh>
        </group>
      ) : null}

      {showRightHand ? (
        <group ref={rightHandRef}>
          <mesh castShadow receiveShadow>
            <boxGeometry
              args={[handRadius * 2, handRadius * 2, handRadius * 2]}
            />
            <meshStandardMaterial color={rightHandColor} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};
