"use client";

import { RemotePlayer } from "@/components/player/RemotePlayer";
import { useRemotePlayerInterpolation } from "@/hooks/useRemotePlayerInterpolation";
import type { ColyseusPlayerState, RemotePlayerData } from "@/types/player";
import { useColyseusRoom } from "@/utils/colyseus";

export const Players = () => {
  useSyncPlayers();
  const room = useColyseusRoom();
  const players = usePlayersStore((state) => state.players);

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
      {remotes.map((player) => (
        <RemotePlayerEntity
          key={player.id}
          name={player.name}
          isXR={player.isXR}
          pose={player.pose}
        />
      ))}
    </group>
  );
};

// 各リモートプレイヤーの表示を補間して滑らかにするラッパー
const RemotePlayerEntity = ({
  name,
  isXR,
  pose,
  /** 減衰係数（大きいほど素早く追従） */
  damping = 12,
}: {
  name: string;
  isXR: boolean;
  pose: RemotePose;
  damping?: number;
}) => {
  const { groupRef, leftRef, rightRef } = useRemotePlayerInterpolation(
    pose,
    damping,
  );

  return (
    <group ref={groupRef}>
      <RemotePlayer
        name={name}
        showLeftHand={isXR && !!pose.leftHandPosition}
        showRightHand={isXR && !!pose.rightHandPosition}
        leftHandRef={leftRef}
        rightHandRef={rightRef}
      />
    </group>
  );
};
