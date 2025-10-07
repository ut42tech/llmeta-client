import { create } from "zustand";
import type { Player } from "@/utils/colyseus";

// NOTE: This type is duplicated from `useRemotePlayerInterpolation.ts`.
// It should be centralized in a future refactoring.
export type RemotePose = {
  position: [number, number, number];
  rotation: [number, number, number];
  leftHandPosition?: [number, number, number];
  leftHandRotation?: [number, number, number];
  rightHandPosition?: [number, number, number];
  rightHandRotation?: [number, number, number];
};

export type RemotePlayer = {
  isXR: boolean;
  isHandTracking: boolean;
  pose: RemotePose;
};

type PlayersState = {
  players: Map<string, RemotePlayer>;
  setPlayer: (sessionId: string, player: Player) => void;
  removePlayer: (sessionId: string) => void;
};

/**
 * Converts a Colyseus Player object to a client-side RemotePlayer object.
 */
const convertPlayerToRemotePlayer = (player: Player): RemotePlayer => {
  // Heuristic: If hand position is all zero, assume it's not tracked.
  // This allows VR controllers to work even if `isHandTracking` is false.
  const leftHandTracked =
    player.leftHandPosition.x !== 0 ||
    player.leftHandPosition.y !== 0 ||
    player.leftHandPosition.z !== 0;
  const rightHandTracked =
    player.rightHandPosition.x !== 0 ||
    player.rightHandPosition.y !== 0 ||
    player.rightHandPosition.z !== 0;

  return {
    isXR: player.isXR,
    isHandTracking: player.isHandTracking,
    pose: {
      position: [player.position.x, player.position.y, player.position.z],
      rotation: [player.rotation.x, player.rotation.y, player.rotation.z],
      leftHandPosition: leftHandTracked
        ? [
            player.leftHandPosition.x,
            player.leftHandPosition.y,
            player.leftHandPosition.z,
          ]
        : undefined,
      leftHandRotation: leftHandTracked
        ? [
            player.leftHandRotation.x,
            player.leftHandRotation.y,
            player.leftHandRotation.z,
          ]
        : undefined,
      rightHandPosition: rightHandTracked
        ? [
            player.rightHandPosition.x,
            player.rightHandPosition.y,
            player.rightHandPosition.z,
          ]
        : undefined,
      rightHandRotation: rightHandTracked
        ? [
            player.rightHandRotation.x,
            player.rightHandRotation.y,
            player.rightHandRotation.z,
          ]
        : undefined,
    },
  };
};

export const usePlayersStore = create<PlayersState>((set) => ({
  players: new Map(),
  setPlayer: (sessionId, player) =>
    set((state) => ({
      players: new Map(state.players).set(
        sessionId,
        convertPlayerToRemotePlayer(player),
      ),
    })),
  removePlayer: (sessionId) =>
    set((state) => {
      const newPlayers = new Map(state.players);
      newPlayers.delete(sessionId);
      return { players: newPlayers };
    }),
}));
