"use client";

import { useEffect } from "react";
import { connectToColyseus, disconnectFromColyseus } from "@/utils/colyseus";

/**
 * Colyseus接続/切断を自動で行うフック。
 */
export function useColyseusLifecycle(roomName = "my_room") {
  useEffect(() => {
    (async () => {
      try {
        await connectToColyseus(roomName);
      } catch (e) {
        console.error("Failed to join Colyseus room:", e);
      }
    })();
    return () => {
      disconnectFromColyseus();
    };
  }, [roomName]);
}
