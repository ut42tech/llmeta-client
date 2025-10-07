"use client";

import { useMemo } from "react";
import { RemotePlayer } from "@/components/player/RemotePlayer";
import { useColyseusRoom, useColyseusState } from "@/utils/colyseus";
import { useRemotePlayerInterpolation } from "@/hooks/useRemotePlayerInterpolation";

export const Players = () => {
  const room = useColyseusRoom();
  const state = useColyseusState();

  const localId = room?.sessionId;

  const remotes = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      isXR: boolean;
      isHandTracking: boolean;
      position: [number, number, number]; // head(world)
      rotation: [number, number, number]; // head euler(YXZ)
      leftHandPosition?: [number, number, number];
      leftHandRotation?: [number, number, number];
      rightHandPosition?: [number, number, number];
      rightHandRotation?: [number, number, number];
    }> = [];

    if (!state) return list;

    // MapSchema の反復取得
    state.players.forEach((p: any, id: string) => {
      if (id === localId) return;
      // サーバーのpositionは「頭（カメラ）」のワールド位置
      const pos: [number, number, number] = [
        p.position?.x ?? 0,
        p.position?.y ?? 0,
        p.position?.z ?? 0,
      ];
      const rot: [number, number, number] = [
        p.rotation?.x ?? 0,
        p.rotation?.y ?? 0,
        p.rotation?.z ?? 0,
      ];
      const lhp = p.leftHandPosition
        ? [p.leftHandPosition.x, p.leftHandPosition.y, p.leftHandPosition.z]
        : undefined;
      const lhr = p.leftHandRotation
        ? [p.leftHandRotation.x, p.leftHandRotation.y, p.leftHandRotation.z]
        : undefined;
      const rhp = p.rightHandPosition
        ? [p.rightHandPosition.x, p.rightHandPosition.y, p.rightHandPosition.z]
        : undefined;
      const rhr = p.rightHandRotation
        ? [p.rightHandRotation.x, p.rightHandRotation.y, p.rightHandRotation.z]
        : undefined;

      list.push({
        id,
        name: id.slice(0, 8),
        isXR: !!p.isXR,
        isHandTracking: !!p.isHandTracking,
        position: pos,
        rotation: rot,
        leftHandPosition: lhp as any,
        leftHandRotation: lhr as any,
        rightHandPosition: rhp as any,
        rightHandRotation: rhr as any,
      });
    });

    return list;
  }, [state, localId]);

  if (!state) return null;

  return (
    <group>
      {remotes.map((rp) => (
        <RemotePlayerEntity
          key={rp.id}
          name={rp.name}
          isXR={rp.isXR}
          position={rp.position}
          rotation={rp.rotation}
          leftHandPosition={rp.leftHandPosition}
          leftHandRotation={rp.leftHandRotation}
          rightHandPosition={rp.rightHandPosition}
          rightHandRotation={rp.rightHandRotation}
        />
      ))}
    </group>
  );
};

// 各リモートプレイヤーの表示を補間して滑らかにするラッパー
const RemotePlayerEntity = ({
  name,
  isXR,
  position,
  rotation,
  leftHandPosition,
  leftHandRotation,
  rightHandPosition,
  rightHandRotation,
  /** 減衰係数（大きいほど素早く追従） */
  damping = 12,
}: {
  name: string;
  isXR: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  leftHandPosition?: [number, number, number];
  leftHandRotation?: [number, number, number];
  rightHandPosition?: [number, number, number];
  rightHandRotation?: [number, number, number];
  damping?: number;
}) => {
  const { groupRef, leftRef, rightRef } = useRemotePlayerInterpolation(
    {
      position,
      rotation,
      leftHandPosition,
      leftHandRotation,
      rightHandPosition,
      rightHandRotation,
    },
    damping
  );

  return (
    <group ref={groupRef}>
      <RemotePlayer
        name={name}
        showLeftHand={isXR && !!leftHandPosition}
        showRightHand={isXR && !!rightHandPosition}
        leftHandRef={leftRef}
        rightHandRef={rightRef}
      />
    </group>
  );
};
