"use client";

import { useEffect, useMemo, useRef } from "react";
import { RemotePlayer } from "@/components/player/RemotePlayer";
import { useColyseusRoom, useColyseusState } from "@/utils/colyseus";
import { useFrame } from "@react-three/fiber";
import { Euler, Group, Quaternion, Vector3 } from "three";

export const Players = () => {
  const room = useColyseusRoom();
  const state = useColyseusState();

  const localId = room?.sessionId;

  const remotes = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      position: [number, number, number];
      rotation: [number, number, number];
    }> = [];

    if (!state) return list;

    // MapSchema の反復取得
    state.players.forEach((p, id) => {
      if (id === localId) return;
      const pos: [number, number, number] = [
        p.position?.x ?? 0,
        (p.position?.y ?? 0) + 1.5,
        p.position?.z ?? 0,
      ];
      const rot: [number, number, number] = [
        p.rotation?.x ?? 0,
        p.rotation?.y ?? 0,
        p.rotation?.z ?? 0,
      ];
      list.push({ id, name: id.slice(0, 8), position: pos, rotation: rot });
    });

    return list;
  }, [state, localId]);

  if (!state) return null;

  return (
    <group>
      {remotes.map((rp) => (
        <RemotePlayerEntity
          key={rp.id}
          name={rp.name}
          position={rp.position}
          rotation={rp.rotation}
        />
      ))}
    </group>
  );
};

// 各リモートプレイヤーの表示を補間して滑らかにするラッパー
const RemotePlayerEntity = ({
  name,
  position,
  rotation,
  /** 減衰係数（大きいほど素早く追従） */
  damping = 12,
}: {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  damping?: number;
}) => {
  const groupRef = useRef<Group>(null);
  const targetPos = useRef(new Vector3(...position));
  const targetQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(rotation[0], rotation[1], rotation[2], "YXZ")
    )
  );

  // サーバー更新でターゲットを更新
  useEffect(() => {
    targetPos.current.set(position[0], position[1], position[2]);
  }, [position]);

  useEffect(() => {
    const e = new Euler(rotation[0], rotation[1], rotation[2], "YXZ");
    targetQuat.current.setFromEuler(e);
  }, [rotation]);

  // 毎フレーム、ターゲットへ指数補間
  useFrame((_, dt) => {
    const obj = groupRef.current;
    if (!obj) return;
    // 1 - exp(-k*dt) で時間独立の減衰係数を算出
    const t = 1 - Math.exp(-damping * dt);
    obj.position.lerp(targetPos.current, t);
    obj.quaternion.slerp(targetQuat.current, t);
  });

  return (
    <group ref={groupRef}>
      <RemotePlayer name={name} />
    </group>
  );
};
