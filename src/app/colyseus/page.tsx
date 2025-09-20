"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import {
  connectToColyseus,
  disconnectFromColyseus,
  useColyseusRoom,
  useColyseusState,
} from "@/utils/colyseus";

// Simple helpers
function randomPosition(): [number, number, number] {
  const range = 5;
  return [
    (Math.random() - 0.5) * 2 * range,
    0.5,
    (Math.random() - 0.5) * 2 * range,
  ];
}

function LocalPlayer({ sessionId }: { sessionId: string }) {
  // Keep an initial random position per mount (demo only)
  const initial = React.useMemo(() => randomPosition(), []);
  return (
    <mesh position={initial} castShadow>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}

function RemotePlayer({ id }: { id: string }) {
  const state = useColyseusState();
  const p: any = (state as any)?.players?.get
    ? (state as any).players.get(id)
    : (state as any)?.players?.[id];
  const position: [number, number, number] = [
    p?.x ?? 0,
    p?.y ?? 0.5,
    p?.z ?? 0,
  ];
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshStandardMaterial color="#10b981" />
    </mesh>
  );
}

function Players() {
  const room = useColyseusRoom();
  const state = useColyseusState();

  // Collect current sessionIds from players map
  const sessionIds = React.useMemo(() => {
    const ids: string[] = [];
    const map: any = (state as any)?.players;
    if (!map) return ids;
    if (typeof map.forEach === "function") {
      map.forEach((_p: any, id: string) => ids.push(id));
    } else if (typeof map === "object") {
      Object.keys(map).forEach((id) => ids.push(id));
    }
    return ids;
  }, [state]);

  return (
    <group name="players">
      {sessionIds.map((id) =>
        id === room?.sessionId ? (
          <LocalPlayer key={id} sessionId={id} />
        ) : (
          <RemotePlayer key={id} id={id} />
        )
      )}
    </group>
  );
}

function Scene() {
  return (
    <>
      {/* Scene background */}
      <color attach="background" args={["#f1f5f9"]} />

      {/* Camera & Controls */}
      <PerspectiveCamera makeDefault position={[5, 4, 8]} fov={50} />
      <OrbitControls target={[0, 0.5, 0]} enableDamping />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      {/* Helpers */}
      <axesHelper args={[2]} />
      <gridHelper args={[20, 20]} />
      <Players />
    </>
  );
}

function ColyseusContent() {
  return (
    <Canvas className="!fixed !inset-0 !h-screen !w-screen" shadows>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}

export default function ColyseusSamplePage() {
  const [mounted, setMounted] = React.useState(false);
  const [isJoined, setIsJoined] = React.useState(false);
  const ROOM_NAME = "my_room";

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    let active = true;
    (async () => {
      try {
        await connectToColyseus(ROOM_NAME);
        if (active) setIsJoined(true);
      } catch (e) {
        console.error("Failed to join room:", e);
      }
    })();
    return () => {
      active = false;
      disconnectFromColyseus();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <main
      className={
        "relative h-screen w-screen bg-slate-100 " +
        (!isJoined ? "cursor-wait" : "")
      }
    >
      {/* Always show the 3D scene; overlay handles loading state */}
      <ColyseusContent />

      {!isJoined && (
        <div className="pointer-events-none absolute left-0 right-0 top-0 bottom-0 z-10 m-auto grid h-64 w-64 place-items-center text-slate-700">
          <h2 className="pb-2 text-2xl font-semibold">Loading...</h2>
          <p className="text-sm">Connecting to {ROOM_NAME}</p>
        </div>
      )}
    </main>
  );
}
