"use client";

import type { Ref } from "react";
import type { Group } from "three";
import { PlayerTag } from "@/components/3d/player/PlayerTag";

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
      {/* 頭部 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color={"orange"} transparent opacity={0.8} />
      </mesh>

      {/* 正面方向インジケーター（プレイヤーの前方に配置） */}
      <group position={[0, 0, -0.4]}>
        {/* 三角形（矢印）で正面を示す */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <coneGeometry args={[0.15, 0.3, 3]} />
          <meshStandardMaterial
            color={"yellow"}
            emissive={"yellow"}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

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
