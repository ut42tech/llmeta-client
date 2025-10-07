"use client";

import { useMemo } from "react";
import { AvatarStack } from "@/components/AvatarStack";
import { useRealtimePresenceRoom } from "@/hooks/useRealtimePresenceRoom";

export const RealtimeAvatarStack = ({ roomName }: { roomName: string }) => {
  const { users: usersMap } = useRealtimePresenceRoom(roomName);
  const avatars = useMemo(() => {
    return Object.values(usersMap).map((user) => ({
      name: user.name,
      image: user.image,
    }));
  }, [usersMap]);

  return <AvatarStack avatars={avatars} />;
};
