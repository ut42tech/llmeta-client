"use client";

import { useMemo } from "react";
import { RemotePlayer } from "@/components/player/RemotePlayer";
import { useRemotePlayerInterpolation } from "@/hooks/useRemotePlayerInterpolation";
import type {
  ColyseusPlayerState,
  RemotePlayerData,
} from "@/types/player";
import { useColyseusRoom, useColyseusState } from "@/utils/colyseus";

export const Players = () => {
  const room = useColyseusRoom();
  const state = useColyseusState();

  const localId = room?.sessionId;

  const remotes = useMemo(() => {
    const list: RemotePlayerData[] = [];

    if (!state) return list;

    // MapSchema の反復取得
    state.players.forEach((p: ColyseusPlayerState, id: string) => {
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
      const lhp: [number, number, number] | undefined = p.leftHandPosition
        ? [p.leftHandPosition.x, p.leftHandPosition.y, p.leftHandPosition.z]
        : undefined;
      const lhr: [number, number, number] | undefined = p.leftHandRotation
        ? [p.leftHandRotation.x, p.leftHandRotation.y, p.leftHandRotation.z]
        : undefined;
      const rhp: [number, number, number] | undefined = p.rightHandPosition
        ? [p.rightHandPosition.x, p.rightHandPosition.y, p.rightHandPosition.z]
        : undefined;
      const rhr: [number, number, number] | undefined = p.rightHandRotation
        ? [p.rightHandRotation.x, p.rightHandRotation.y, p.rightHandRotation.z]
        : undefined;

      list.push({
        id,
        name: id.slice(0, 8),
        isXR: !!p.isXR,
        isHandTracking: !!p.isHandTracking,
        position: pos,
        rotation: rot,
        leftHandPosition: lhp,
        leftHandRotation: lhr,
        rightHandPosition: rhp,
        rightHandRotation: rhr,
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
    damping,
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
