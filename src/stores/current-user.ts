import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

interface CurrentUserState {
  name: string | null;
  image: string | null;
  isLoading: boolean;
  fetchUserData: () => Promise<void>;
  setName: (name: string | null) => void;
  setImage: (image: string | null) => void;
}

export const useCurrentUserStore = create<CurrentUserState>()((set) => ({
  name: null,
  image: null,
  isLoading: false,
  fetchUserData: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await createClient().auth.getSession();
      if (error) {
        console.error(error);
        set({ isLoading: false });
        return;
      }

      const userName = data.session?.user.user_metadata.full_name ?? "?";
      const userImage = data.session?.user.user_metadata.avatar_url ?? null;

      set({
        name: userName,
        image: userImage,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      set({ isLoading: false });
    }
  },
  setName: (name) => set({ name }),
  setImage: (image) => set({ image }),
}));
