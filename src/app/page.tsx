"use client";

import SceneWrapper from "@/components/ExperienceColyseus";
import { ColyseusClient } from "@/components/ColyseusClient";

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <ColyseusClient />
      <SceneWrapper />
    </div>
  );
}
