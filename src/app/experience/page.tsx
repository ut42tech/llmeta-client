"use client";

import { ExperienceCanvas } from "@/components/experience/ExperienceCanvas";
import { Loader } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MonitorSmartphone } from "lucide-react";
import { useXrSupport } from "@/hooks/useXrSupport";
import { useColyseusLifecycle } from "@/hooks/useColyseusLifecycle";
import {
  useExperienceModeStore,
  type ExperienceMode,
} from "@/stores/experience-mode";

export default function ExperiencePage() {
  const router = useRouter();
  const xrSupported = useXrSupport();
  const { mode, setMode } = useExperienceModeStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const queryMode = params.get("mode");

    if (!queryMode || (queryMode !== "desktop" && queryMode !== "xr")) {
      router.replace("/lobby");
      return;
    }

    // XR非対応の場合は、URLはそのままでストアのみdesktopに設定
    if (queryMode === "xr" && !xrSupported) {
      setMode("desktop");
      return;
    }

    // クエリパラメーターを信頼の源として、ストアを同期
    setMode(queryMode as ExperienceMode);
  }, [router, xrSupported, setMode]);

  // Colyseus connection lifecycle
  useColyseusLifecycle("my_room");

  // URLクエリからモードを取得（クライアントサイドのみ）
  const urlMode = isClient
    ? new URLSearchParams(window.location.search).get("mode")
    : null;
  const isXrRequested = urlMode === "xr";
  const isXrFallback = isXrRequested && !xrSupported;

  return (
    <div className="h-screen w-screen">
      <Loader />

      {/* Overlay UI */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2 text-white backdrop-blur-sm">
            <span className="text-sm opacity-90">
              <MonitorSmartphone className="inline mb-0.5 mr-1 h-4 w-4" />
              {mode === "xr" ? "XRモード" : "デスクトップモード"}
            </span>
          </div>
          {isXrFallback && (
            <div className="rounded-lg bg-amber-500/90 px-3 py-2 text-xs text-white backdrop-blur-sm">
              XRデバイスが検出できないため、デスクトップモードで動作中です
            </div>
          )}
        </div>
      </div>

      <ExperienceCanvas mode={mode} />
    </div>
  );
}
