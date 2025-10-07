import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeUser } from "@/types/user";

interface RealtimePresenceState {
  users: Record<string, RealtimeUser>;
  channel: RealtimeChannel | null;
  setUsers: (users: Record<string, RealtimeUser>) => void;
  subscribeToRoom: (
    roomName: string,
    userName: string | null,
    userImage: string | null,
  ) => void;
  unsubscribeFromRoom: () => void;
}

const supabase = createClient();

export const useRealtimePresenceStore = create<RealtimePresenceState>()(
  (set, get) => ({
    users: {},
    channel: null,
    setUsers: (users) => set({ users }),
    subscribeToRoom: (roomName, userName, userImage) => {
      // Unsubscribe from existing channel if any
      const currentChannel = get().channel;
      if (currentChannel) {
        currentChannel.unsubscribe();
      }

      const room = supabase.channel(roomName);

      room
        .on("presence", { event: "sync" }, () => {
          const newState = room.presenceState<{
            image: string;
            name: string;
          }>();

          const newUsers = Object.fromEntries(
            Object.entries(newState).map(([key, values]) => [
              key,
              { name: values[0].name, image: values[0].image },
            ]),
          ) as Record<string, RealtimeUser>;
          set({ users: newUsers });
        })
        .subscribe(async (status) => {
          if (status !== "SUBSCRIBED") {
            return;
          }

          await room.track({
            name: userName,
            image: userImage,
          });
        });

      set({ channel: room });
    },
    unsubscribeFromRoom: () => {
      const currentChannel = get().channel;
      if (currentChannel) {
        currentChannel.unsubscribe();
        set({ channel: null, users: {} });
      }
    },
  }),
);
