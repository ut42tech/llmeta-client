"use client";

import { Environment, Grid, OrbitControls, useCursor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { AnimatedWoman } from "./AnimatedWoman";
import { roomAtom, playersAtom, sessionIdAtom } from "./ColyseusClient";
import { sendPose } from "./ColyseusClient";

export function ExperienceColyseus() {
  const [players] = useAtom(playersAtom);
  const [room] = useAtom(roomAtom);
  const [sessionId] = useAtom(sessionIdAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  const playerList = useMemo(() => Object.values(players), [players]);
  const { scene } = useThree((state) => state);

  const onGroundClick = (e) => {
    // 自分のキャラが存在するときだけ移動
    if (!sessionId) return;
    const target = e.point;
    sendPose(room, { x: target.x, y: 0, z: target.z });
  };

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />

      {/* シンプルな床 */}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onGroundClick}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />

      {playerList.map((p) => (
        <AnimatedWoman
          key={p.id}
          id={p.id}
          // サーバー座標を直接使う
          serverPosition={[p.x, p.y, p.z]}
          follow={p.id === sessionId}
          hairColor={p.id === sessionId ? "#2e90ff" : "#7c3aed"}
          topColor={p.id === sessionId ? "#60a5fa" : "#a78bfa"}
          bottomColor={p.id === sessionId ? "#93c5fd" : "#c4b5fd"}
        />
      ))}
    </>
  );
}

export default function SceneWrapper() {
  return (
    <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
      <color attach={"background"} args={["#ececec"]} />
      <ExperienceColyseus />
    </Canvas>
  );
}
