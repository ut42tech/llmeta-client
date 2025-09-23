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
      position: [number, number, number]; // head(world)
      rotation: [number, number, number]; // head euler(YXZ)
      leftHandPosition?: [number, number, number];
      leftHandRotation?: [number, number, number];
      rightHandPosition?: [number, number, number];
      rightHandRotation?: [number, number, number];
    }> = [];

    if (!state) return list;

    // MapSchema の反復取得
    state.players.forEach((p, id) => {
      if (id === localId) return;
      // サーバーのpositionは「頭（カメラ）」のワールド位置
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
      const lhp = p.leftHandPosition
        ? [p.leftHandPosition.x, p.leftHandPosition.y, p.leftHandPosition.z]
        : undefined;
      const lhr = p.leftHandRotation
        ? [p.leftHandRotation.x, p.leftHandRotation.y, p.leftHandRotation.z]
        : undefined;
      const rhp = p.rightHandPosition
        ? [p.rightHandPosition.x, p.rightHandPosition.y, p.rightHandPosition.z]
        : undefined;
      const rhr = p.rightHandRotation
        ? [p.rightHandRotation.x, p.rightHandRotation.y, p.rightHandRotation.z]
        : undefined;

      list.push({
        id,
        name: id.slice(0, 8),
        position: pos,
        rotation: rot,
        leftHandPosition: lhp as any,
        leftHandRotation: lhr as any,
        rightHandPosition: rhp as any,
        rightHandRotation: rhr as any,
      });
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
          leftHandPosition={rp.leftHandPosition}
          leftHandRotation={rp.leftHandRotation}
          rightHandPosition={rp.rightHandPosition}
          rightHandRotation={rp.rightHandRotation}
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
  leftHandPosition,
  leftHandRotation,
  rightHandPosition,
  rightHandRotation,
  /** 減衰係数（大きいほど素早く追従） */
  damping = 12,
}: {
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  leftHandPosition?: [number, number, number];
  leftHandRotation?: [number, number, number];
  rightHandPosition?: [number, number, number];
  rightHandRotation?: [number, number, number];
  damping?: number;
}) => {
  const groupRef = useRef<Group>(null);
  const targetPos = useRef(new Vector3(...position));
  const targetQuat = useRef(
    new Quaternion().setFromEuler(new Euler(rotation[0], rotation[1], 0, "YXZ"))
  );

  // 手の補間ターゲット
  const leftRef = useRef<Group>(null);
  const leftPos = useRef(
    leftHandPosition ? new Vector3(...leftHandPosition) : new Vector3()
  );
  const leftQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(
        leftHandRotation?.[0] ?? 0,
        leftHandRotation?.[1] ?? 0,
        leftHandRotation?.[2] ?? 0,
        "YXZ"
      )
    )
  );
  const rightRef = useRef<Group>(null);
  const rightPos = useRef(
    rightHandPosition ? new Vector3(...rightHandPosition) : new Vector3()
  );
  const rightQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(
        rightHandRotation?.[0] ?? 0,
        rightHandRotation?.[1] ?? 0,
        rightHandRotation?.[2] ?? 0,
        "YXZ"
      )
    )
  );

  // サーバー更新でターゲットを更新
  useEffect(() => {
    targetPos.current.set(position[0], position[1], position[2]);
  }, [position]);

  useEffect(() => {
    const e = new Euler(rotation[0], rotation[1], 0, "YXZ");
    targetQuat.current.setFromEuler(e);
  }, [rotation]);

  // 手のターゲット更新
  useEffect(() => {
    if (leftHandPosition) leftPos.current.set(...leftHandPosition);
  }, [leftHandPosition]);
  useEffect(() => {
    if (leftHandRotation) {
      const e = new Euler(
        leftHandRotation[0],
        leftHandRotation[1],
        leftHandRotation[2],
        "YXZ"
      );
      leftQuat.current.setFromEuler(e);
    }
  }, [leftHandRotation]);
  useEffect(() => {
    if (rightHandPosition) rightPos.current.set(...rightHandPosition);
  }, [rightHandPosition]);
  useEffect(() => {
    if (rightHandRotation) {
      const e = new Euler(
        rightHandRotation[0],
        rightHandRotation[1],
        rightHandRotation[2],
        "YXZ"
      );
      rightQuat.current.setFromEuler(e);
    }
  }, [rightHandRotation]);

  // 毎フレーム、ターゲットへ指数補間
  useFrame((_, dt) => {
    const obj = groupRef.current;
    if (!obj) return;
    // 1 - exp(-k*dt) で時間独立の減衰係数を算出
    const t = 1 - Math.exp(-damping * dt);
    obj.position.lerp(targetPos.current, t);
    obj.quaternion.slerp(targetQuat.current, t);

    // hands
    if (leftRef.current) {
      // ワールド→ローカル（頭を親とする）
      const l = leftRef.current;
      const lp = leftPos.current.clone();
      const lq = leftQuat.current.clone();
      obj.worldToLocal(lp);
      // 回転は親の逆回転を適用
      const invParent = obj.quaternion.clone().invert();
      lq.premultiply(invParent);
      l.position.lerp(lp, t);
      l.quaternion.slerp(lq, t);
    }
    if (rightRef.current) {
      const r = rightRef.current;
      const rp = rightPos.current.clone();
      const rq = rightQuat.current.clone();
      obj.worldToLocal(rp);
      const invParent = obj.quaternion.clone().invert();
      rq.premultiply(invParent);
      r.position.lerp(rp, t);
      r.quaternion.slerp(rq, t);
    }
  });

  return (
    <group ref={groupRef}>
      <RemotePlayer name={name} />
      {/* 簡易ハンド（球） */}
      {leftHandPosition ? (
        <group ref={leftRef}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={"deepskyblue"} />
          </mesh>
        </group>
      ) : null}
      {rightHandPosition ? (
        <group ref={rightRef}>
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color={"hotpink"} />
          </mesh>
        </group>
      ) : null}
    </group>
  );
};
