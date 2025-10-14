import { create } from "zustand";

interface XrSupportState {
  xrSupported: boolean;
  setXrSupported: (supported: boolean) => void;
  checkXrSupport: () => Promise<void>;
}

export const useXrSupportStore = create<XrSupportState>()((set) => ({
  xrSupported: false,
  setXrSupported: (supported) => set({ xrSupported: supported }),
  checkXrSupport: async () => {
    try {
      const nav = typeof navigator !== "undefined" ? navigator : undefined;
      const xr = nav?.xr;
      const supported = xr?.isSessionSupported
        ? await xr.isSessionSupported("immersive-vr")
        : false;
      set({ xrSupported: !!supported });
    } catch {
      set({ xrSupported: false });
    }
  },
}));
