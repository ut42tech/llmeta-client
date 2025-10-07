import { useEffect } from "react";
import { useColyseusRoom } from "@/utils/colyseus";
import { usePlayersStore } from "@/stores/players-store";

/**
 * A hook that syncs the Colyseus room's player state with the Zustand store.
 */
export const useSyncPlayers = () => {
  const room = useColyseusRoom();
  const { setPlayer, removePlayer } = usePlayersStore();

  useEffect(() => {
    if (!room) return;

    // `onAdd` is triggered for existing players when the room is joined,
    // and for new players who join later.
    const unsubscribeAdd = room.state.players.onAdd((player, sessionId) => {
      setPlayer(sessionId, player);
    });

    // `onChange` is triggered when a player's state changes.
    const unsubscribeChange = room.state.players.onChange(
      (player, sessionId) => {
        setPlayer(sessionId, player);
      },
    );

    // Listen for player removals
    const unsubscribeRemove = room.state.players.onRemove(
      (_, sessionId) => {
        removePlayer(sessionId);
      },
    );

    return () => {
      unsubscribeAdd();
      unsubscribeChange();
      unsubscribeRemove();
    };
  }, [room, setPlayer, removePlayer]);
};