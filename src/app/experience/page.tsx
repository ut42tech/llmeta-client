"use client";

import { ExperienceCanvas } from "@/components/experience/ExperienceCanvas";
import { Loader } from "@react-three/drei";
import { connectToColyseus, disconnectFromColyseus } from "@/utils/colyseus";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { MonitorSmartphone } from "lucide-react";

export default function ExperiencePage() {
  const [mode, setMode] = useState<"desktop" | "xr">("desktop");
  const [xrSupported, setXrSupported] = useState<boolean>(false);

  // Detect XR support and apply initial mode from query (default desktop)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let disposed = false;

    const check = async () => {
      try {
        const supported = await (async () => {
          // Basic WebXR support detection
          // Some browsers may not expose navigator.xr; guard carefully
          const nav: any = navigator as any;
          if (!nav?.xr?.isSessionSupported) return false;
          return await nav.xr.isSessionSupported("immersive-vr");
        })();
        if (!disposed) setXrSupported(!!supported);

        // Allow deep-linking via ?mode=xr when supported
        const params = new URLSearchParams(window.location.search);
        const wantXR = params.get("mode") === "xr";
        if (wantXR && supported) setMode("xr");
      } catch {
        if (!disposed) setXrSupported(false);
      }
    };
    check();

    return () => {
      disposed = true;
    };
  }, []);

  // Colyseus connection lifecycle
  useEffect(() => {
    (async () => {
      try {
        await connectToColyseus("my_room");
      } catch (e) {
        console.error("Failed to join Colyseus room:", e);
      }
    })();
    return () => {
      disconnectFromColyseus();
    };
  }, []);

  const enterXR = useCallback(() => setMode("xr"), []);
  const exitXR = useCallback(() => setMode("desktop"), []);

  return (
    <div className="h-screen w-screen">
      <Loader />

      {/* Overlay UI */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center p-4">
        <div className="flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-white backdrop-blur-sm">
          <span className="text-sm opacity-90">
            <MonitorSmartphone className="inline mb-0.5 mr-1 h-4 w-4" />
            {mode === "xr" ? "XRモード" : "デスクトップモード"}
          </span>
          {mode === "desktop" ? (
            <>
              <Button
                className="pointer-events-auto"
                size="sm"
                onClick={enterXR}
                disabled={!xrSupported}
                aria-disabled={!xrSupported}
                title={xrSupported ? "XRモードで参加" : "XRモード非対応"}
              >
                XRで参加
              </Button>
            </>
          ) : null}
          {mode === "xr" ? (
            <Button
              className="pointer-events-auto"
              size="sm"
              variant="secondary"
              onClick={exitXR}
            >
              戻る
            </Button>
          ) : null}
        </div>
      </div>

      <ExperienceCanvas mode={mode} />
    </div>
  );
}
