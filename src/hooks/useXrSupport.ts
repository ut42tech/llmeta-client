"use client";

import { useEffect, useState } from "react";

/**
 * WebXRの immersive-vr サポート有無を返す。
 */
export function useXrSupport() {
  const [xrSupported, setXrSupported] = useState(false);

  useEffect(() => {
    let disposed = false;

    const check = async () => {
      try {
        const nav = typeof navigator !== "undefined" ? navigator : undefined;
        const xr = nav?.xr;
        const supported = xr?.isSessionSupported
          ? await xr.isSessionSupported("immersive-vr")
          : false;
        if (!disposed) setXrSupported(!!supported);
      } catch {
        if (!disposed) setXrSupported(false);
      }
    };

    check();
    return () => {
      disposed = true;
    };
  }, []);

  return xrSupported;
}
