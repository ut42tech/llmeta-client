"use client";

import { RemotePlayer } from "@/components/player/RemotePlayer";
import { useRemotePlayerInterpolation } from "@/hooks/useRemotePlayerInterpolation";
import { useSyncPlayers } from "@/hooks/useSyncPlayers";
import type { RemotePose } from "@/stores/players-store";
import { usePlayersStore } from "@/stores/players-store";
import { useColyseusRoom } from "@/utils/colyseus";

export const Players = () => {
  useSyncPlayers();
  const room = useColyseusRoom();
  const players = usePlayersStore((state) => state.players);

  const localId = room?.sessionId;

  const remotePlayers = Array.from(players.entries())
    .filter(([id]) => id !== localId)
    .map(([id, player]) => ({
      id,
      name: id.slice(0, 8),
      isXR: player.isXR,
      pose: player.pose,
    }));

  return (
    <group>
      {remotePlayers.map((player) => (
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
