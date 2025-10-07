import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Euler, type Group, Quaternion, Vector3 } from "three";
import type { PlayerPose } from "@/types/player";

const DEFAULT_LEFT_LOCAL = new Vector3(-0.3, -0.5, -0.3);
const DEFAULT_RIGHT_LOCAL = new Vector3(0.3, -0.5, -0.3);
const IDENTITY_QUAT = new Quaternion();

/**
 * ネットワーク受信した頭および両手のワールド座標系姿勢を、
 * Three.js Group に指数補間で適用するためのフック。
 * - 頭（groupRef）はワールド目標へ直接補間
 * - 両手はワールド -> ローカル（親: 頭）変換を行って補間
 */
export function useRemotePlayerInterpolation(
  pose: PlayerPose,
  damping: number = 12,
) {
  const groupRef = useRef<Group>(null);

  // 頭の補間ターゲット（ワールド）
  const targetPos = useRef(new Vector3(...pose.position));
  const targetQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(pose.rotation[0], pose.rotation[1], 0, "YXZ"),
    ),
  );

  // 左手ターゲット（ワールド）
  const leftRef = useRef<Group>(null);
  const leftPos = useRef(
    pose.leftHandPosition
      ? new Vector3(...pose.leftHandPosition)
      : new Vector3(),
  );
  const leftQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(
        pose.leftHandRotation?.[0] ?? 0,
        pose.leftHandRotation?.[1] ?? 0,
        pose.leftHandRotation?.[2] ?? 0,
        "YXZ",
      ),
    ),
  );

  // 右手ターゲット（ワールド）
  const rightRef = useRef<Group>(null);
  const rightPos = useRef(
    pose.rightHandPosition
      ? new Vector3(...pose.rightHandPosition)
      : new Vector3(),
  );
  const rightQuat = useRef(
    new Quaternion().setFromEuler(
      new Euler(
        pose.rightHandRotation?.[0] ?? 0,
        pose.rightHandRotation?.[1] ?? 0,
        pose.rightHandRotation?.[2] ?? 0,
        "YXZ",
      ),
    ),
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
    if (pose.leftHandPosition) {
      leftPos.current.set(...pose.leftHandPosition);
    }
  }, [pose.leftHandPosition]);
  useEffect(() => {
    if (pose.leftHandRotation) {
      const e = new Euler(
        pose.leftHandRotation[0],
        pose.leftHandRotation[1],
        pose.leftHandRotation[2],
        "YXZ",
      );
      leftQuat.current.setFromEuler(e);
    }
  }, [pose.leftHandRotation]);
  useEffect(() => {
    if (pose.rightHandPosition) {
      rightPos.current.set(...pose.rightHandPosition);
    }
  }, [pose.rightHandPosition]);
  useEffect(() => {
    if (pose.rightHandRotation) {
      const e = new Euler(
        pose.rightHandRotation[0],
        pose.rightHandRotation[1],
        pose.rightHandRotation[2],
        "YXZ",
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
        const lp = leftPos.current.clone();
        const lq = leftQuat.current.clone();
        obj.worldToLocal(lp);
        const invParent = obj.quaternion.clone().invert();
        lq.premultiply(invParent);
        l.position.lerp(lp, t);
        l.quaternion.slerp(lq, t);
      } else {
        l.position.lerp(DEFAULT_LEFT_LOCAL, t);
        l.quaternion.slerp(IDENTITY_QUAT, t);
      }
    }

    if (rightRef.current) {
      const r = rightRef.current;
      if (pose.rightHandPosition && pose.rightHandRotation) {
        const rp = rightPos.current.clone();
        const rq = rightQuat.current.clone();
        obj.worldToLocal(rp);
        const invParent = obj.quaternion.clone().invert();
        rq.premultiply(invParent);
        r.position.lerp(rp, t);
        r.quaternion.slerp(rq, t);
      } else {
        r.position.lerp(DEFAULT_RIGHT_LOCAL, t);
        r.quaternion.slerp(IDENTITY_QUAT, t);
      }
    }
  });

  return { groupRef, leftRef, rightRef };
}
