"use client";

import { useEffect } from "react";
import { useXrSupportStore } from "@/stores/xr-support";

/**
 * WebXRの immersive-vr サポート有無を返す。
 */
export function useXrSupport() {
  const { xrSupported, checkXrSupport } = useXrSupportStore();

  useEffect(() => {
    checkXrSupport();
  }, [checkXrSupport]);

  return xrSupported;
}
