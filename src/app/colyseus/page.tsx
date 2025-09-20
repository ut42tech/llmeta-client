"use client";

import React from "react";
import { useColyseusRoom } from "@/hooks/useColyseusRoom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function ColyseusSamplePage() {
  const { players, isConnecting, error } = useColyseusRoom<any>("my_room", {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Colyseus Sample</h1>
      <div className="mt-2 text-sm">
        endpoint:{" "}
        {process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "http://localhost:2567"}
      </div>

      {isConnecting && <div className="mt-4">Connecting to room...</div>}
      {error && <div className="mt-4 text-red-300">Error: {error}</div>}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl">Players</h2>
          <ul className="mt-2 list-disc pl-6">
            {players.map((p: any) => (
              <li key={p.id}>
                {p.id}: ({p.x.toFixed?.(2) ?? p.x}, {p.y.toFixed?.(2) ?? p.y},{" "}
                {p.z.toFixed?.(2) ?? p.z})
              </li>
            ))}
            {!players?.length && !isConnecting && <li>No players</li>}
          </ul>
        </div>

        <div className="h-[480px] w-full rounded-lg border border-white/10 bg-black/30">
          <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
            <color attach="background" args={["#111"]} />
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 10, 5]} intensity={0.8} />
            <gridHelper args={[20, 20, "#222", "#222"]} />
            <axesHelper args={[3]} />

            {players.map((p: any) => (
              <mesh key={p.id} position={[p.x || 0, p.y || 0, p.z || 0]}>
                <sphereGeometry args={[0.25, 16, 16]} />
                <meshStandardMaterial color="#4ade80" />
              </mesh>
            ))}

            <OrbitControls makeDefault />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
