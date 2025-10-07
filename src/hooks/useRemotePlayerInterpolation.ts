import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Euler, Group, Quaternion, Vector3 } from "three";

export type RemotePose = {
  position: [number, number, number];
  rotation: [number, number, number]; // Euler(YXZ)想定、頭のZは0固定
  leftHandPosition?: [number, number, number];
  leftHandRotation?: [number, number, number]; // Euler(YXZ)
  rightHandPosition?: [number, number, number];
  rightHandRotation?: [number, number, number]; // Euler(YXZ)
};

/**
 * ネットワーク受信したワールド座標系の頭・両手の姿勢を、
 * Three.js Group に指数補間で適用するためのフック。
 * - 頭（groupRef）はワールド目標へ直接補間
 * - 両手はワールド→ローカル（親: 頭）へ変換しつつ補間
 */
export function useRemotePlayerInterpolation(
  pose: RemotePose,
  damping: number = 12
) {
  const groupRef = useRef<Group>(null);

  // 頭の補間ターゲット（ワールド）
  const targetPos = useRef(new Vector3(...pose.position));
  const targetQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(pose.rotation[0], pose.rotation[1], 0, "YXZ")
    )
  );

  // 左手ターゲット（ワールド）: データがない場合はデフォルト位置（親の左側・腰レベル）
  const leftRef = useRef<Group>(null);
  const leftPos = useRef(
    pose.leftHandPosition
      ? new Vector3(...pose.leftHandPosition)
      : new Vector3(-0.3, 1.0, 0) // デフォルト位置
  );
  const leftQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(
        pose.leftHandRotation?.[0] ?? 0,
        pose.leftHandRotation?.[1] ?? 0,
        pose.leftHandRotation?.[2] ?? 0,
        "YXZ"
      )
    )
  );

  // 右手ターゲット（ワールド）: データがない場合はデフォルト位置（親の右側・腰レベル）
  const rightRef = useRef<Group>(null);
  const rightPos = useRef(
    pose.rightHandPosition
      ? new Vector3(...pose.rightHandPosition)
      : new Vector3(0.3, 1.0, 0) // デフォルト位置
  );
  const rightQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(
        pose.rightHandRotation?.[0] ?? 0,
        pose.rightHandRotation?.[1] ?? 0,
        pose.rightHandRotation?.[2] ?? 0,
        "YXZ"
      )
    )
  );

  // サーバー更新でターゲットを更新
  useEffect(() => {
    targetPos.current.set(pose.position[0], pose.position[1], pose.position[2]);
  }, [pose.position]);

  useEffect(() => {
    const e = new Euler(pose.rotation[0], pose.rotation[1], 0, "YXZ");
    targetQuat.current.setFromEuler(e);
  }, [pose.rotation]);

  // 手のターゲット更新
  useEffect(() => {
    if (pose.leftHandPosition) leftPos.current.set(...pose.leftHandPosition);
  }, [pose.leftHandPosition]);
  useEffect(() => {
    if (pose.leftHandRotation) {
      const e = new Euler(
        pose.leftHandRotation[0],
        pose.leftHandRotation[1],
        pose.leftHandRotation[2],
        "YXZ"
      );
      leftQuat.current.setFromEuler(e);
    }
  }, [pose.leftHandRotation]);
  useEffect(() => {
    if (pose.rightHandPosition) rightPos.current.set(...pose.rightHandPosition);
  }, [pose.rightHandPosition]);
  useEffect(() => {
    if (pose.rightHandRotation) {
      const e = new Euler(
        pose.rightHandRotation[0],
        pose.rightHandRotation[1],
        pose.rightHandRotation[2],
        "YXZ"
      );
      rightQuat.current.setFromEuler(e);
    }
  }, [pose.rightHandRotation]);

  // 毎フレーム、ターゲットへ指数補間
  useFrame((_, dt) => {
    const obj = groupRef.current;
    if (!obj) return;
    // 1 - exp(-k*dt) で時間独立の減衰係数
    const t = 1 - Math.exp(-damping * dt);

    // 頭（親）をワールド目標へ補間
    obj.position.lerp(targetPos.current, t);
    obj.quaternion.slerp(targetQuat.current, t);

    // hands: データがある場合はワールド→ローカル（頭を親とする）に変換して補間
    // データがない場合は頭の相対位置（デフォルト）に配置
    if (leftRef.current) {
      const l = leftRef.current;
      if (pose.leftHandPosition && pose.leftHandRotation) {
        // データがある場合
        const lp = leftPos.current.clone();
        const lq = leftQuat.current.clone();
        obj.worldToLocal(lp);
        const invParent = obj.quaternion.clone().invert();
        lq.premultiply(invParent);
        l.position.lerp(lp, t);
        l.quaternion.slerp(lq, t);
      } else {
        // データがない場合はデフォルト相対位置
        const defaultLocal = new Vector3(-0.3, -0.5, -0.3);
        l.position.lerp(defaultLocal, t);
        l.quaternion.slerp(new Quaternion(), t);
      }
    }

    if (rightRef.current) {
      const r = rightRef.current;
      if (pose.rightHandPosition && pose.rightHandRotation) {
        // データがある場合
        const rp = rightPos.current.clone();
        const rq = rightQuat.current.clone();
        obj.worldToLocal(rp);
        const invParent = obj.quaternion.clone().invert();
        rq.premultiply(invParent);
        r.position.lerp(rp, t);
        r.quaternion.slerp(rq, t);
      } else {
        // データがない場合はデフォルト相対位置
        const defaultLocal = new Vector3(0.3, -0.5, -0.3);
        r.position.lerp(defaultLocal, t);
        r.quaternion.slerp(new Quaternion(), t);
      }
    }
  });

  return { groupRef, leftRef, rightRef };
}
