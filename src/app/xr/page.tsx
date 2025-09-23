"use client";

import { XRCanvas } from "@/components/xr/XRCanvas";
import { connectToColyseus, disconnectFromColyseus } from "@/utils/colyseus";
import { Loader } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function XRPage() {
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
      <Loader />
      <XRCanvas />
    </div>
  );
}
