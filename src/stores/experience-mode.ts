import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ExperienceMode = "desktop" | "xr";

interface ExperienceModeState {
  mode: ExperienceMode;
  setMode: (mode: ExperienceMode) => void;
  resetMode: () => void;
}

const DEFAULT_MODE: ExperienceMode = "desktop";

export const useExperienceModeStore = create<ExperienceModeState>()(
  persist(
    (set) => ({
      mode: DEFAULT_MODE,
      setMode: (mode) => set({ mode }),
      resetMode: () => set({ mode: DEFAULT_MODE }),
    }),
    {
      name: "llmeta:experience-mode",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.sessionStorage;
      }),
    },
  ),
);
