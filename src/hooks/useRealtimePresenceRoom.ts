"use client";

import { useEffect } from "react";
import { useCurrentUserImage } from "@/hooks/useCurrentUserImage";
import { useCurrentUserName } from "@/hooks/useCurrentUserName";
import { useRealtimePresenceStore } from "@/stores/realtime-presence";

export const useRealtimePresenceRoom = (roomName: string) => {
  const currentUserImage = useCurrentUserImage();
  const currentUserName = useCurrentUserName();
  const { users, subscribeToRoom, unsubscribeFromRoom } =
    useRealtimePresenceStore();

  useEffect(() => {
    subscribeToRoom(roomName, currentUserName, currentUserImage);

    return () => {
      unsubscribeFromRoom();
    };
  }, [
    roomName,
    currentUserName,
    currentUserImage,
    subscribeToRoom,
    unsubscribeFromRoom,
  ]);

  return { users };
};
