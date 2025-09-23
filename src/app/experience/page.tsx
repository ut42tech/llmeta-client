"use client";

import { ExperienceCanvas } from "@/components/experience/ExperienceCanvas";
import { Loader } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { MonitorSmartphone } from "lucide-react";
import { useXrSupport } from "@/hooks/useXrSupport";
import { useColyseusLifecycle } from "@/hooks/useColyseusLifecycle";

export default function ExperiencePage() {
  const [mode, setMode] = useState<"desktop" | "xr">("desktop");
  const xrSupported = useXrSupport();

  // Detect XR support and apply initial mode from query (default desktop)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const wantXR = params.get("mode") === "xr";
    if (wantXR && xrSupported) setMode("xr");
  }, [xrSupported]);

  // Colyseus connection lifecycle
  useColyseusLifecycle("my_room");

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
