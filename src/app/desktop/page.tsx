"use client";

import { DesktopCanvas } from "@/components/desktop/DesktopCanvas";
import { useEffect, useState } from "react";
import { connectToColyseus, disconnectFromColyseus } from "@/utils/colyseus";

export default function DesktopPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let active = true;
    (async () => {
      try {
        await connectToColyseus("my_room");
      } catch (e) {
        console.error("Failed to join Colyseus room:", e);
      }
    })();
    return () => {
      active = false;
      disconnectFromColyseus();
    };
  }, [mounted]);

  return (
    <div className="h-screen w-screen">
      <DesktopCanvas />
    </div>
  );
}
