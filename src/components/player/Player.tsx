"use client";

import { useFrame } from "@react-three/fiber";
import { SimpleCharacter } from "@react-three/viverse";
import {
  forwardRef,
  type PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { Euler, type Group, Quaternion, Vector3 } from "three";

/** サーバー送信用などに扱いやすい数値スナップショット */
export type PlayerTransformSnapshot = {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number }; // Euler (radians)
  quaternion: { x: number; y: number; z: number; w: number };
};

export type PlayerHandle = {
  /** 外部からプレイヤーのワールド座標を即時移動 */
  setPosition: (v: Vector3) => void;
  /** 内部の Three.js Group（SimpleCharacter の Object3D）を参照 */
  getObject3D: () => Group | null;
  /** 現在のトランスフォームを数値で取得（送信向けスナップショット） */
  getPose: () => PlayerTransformSnapshot | null;
};

export type PlayerProps = PropsWithChildren<{
  /** SimpleCharacter の model プロップ（VRM/GLTF設定 or false） */
  model?: unknown;
  /** XR などの入力（Input インスタンスまたは配列） */
  input?: unknown;
  /** カメラ挙動（boolean または CameraBehavior オブジェクト） */
  cameraBehavior?: unknown;
  /** しきい値より落下したら原点へリスポーン（既定: -10） */
  fallThresholdY?: number;
  /** フレーム毎または一定間隔で現在の姿勢をコールバック（サーバー送信用） */
  onPoseUpdate?: (pose: PlayerTransformSnapshot) => void;
  /** onPoseUpdate の送信間隔（ms）。未指定なら毎フレーム呼び出し。 */
  poseUpdateIntervalMs?: number;
}>;

export const Player = forwardRef<PlayerHandle, PlayerProps>(
  (
    {
      children,
      model,
      input,
      cameraBehavior,
      fallThresholdY = -10,
      onPoseUpdate,
      poseUpdateIntervalMs,
    },
    ref,
  ) => {
    const characterRef = useRef<Group>(null);
    const lastPoseSentAtRef = useRef<number>(0);

    const setPosition = useCallback((v: Vector3) => {
      const r = characterRef.current;
      if (!r) return;
      r.position.copy(v);
    }, []);

    const getPose = useCallback((): PlayerTransformSnapshot | null => {
      const r = characterRef.current;
      if (!r) return null;
      const wp = new Vector3();
      const wq = new Quaternion();
      r.getWorldPosition(wp);
      r.getWorldQuaternion(wq);
      const rot = new Euler().setFromQuaternion(wq);
      return {
        position: { x: wp.x, y: wp.y, z: wp.z },
        rotation: { x: rot.x, y: rot.y, z: rot.z },
        quaternion: { x: wq.x, y: wq.y, z: wq.z, w: wq.w },
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        setPosition,
        getObject3D: () => characterRef.current,
        getPose,
      }),
      [setPosition, getPose],
    );

    useFrame(() => {
      const r = characterRef.current;
      if (!r) return;
      if (r.position.y < fallThresholdY) {
        setPosition(new Vector3(0, 0, 0));
      }

      if (onPoseUpdate) {
        const now = performance.now();
        if (
          poseUpdateIntervalMs == null ||
          now - lastPoseSentAtRef.current >= poseUpdateIntervalMs
        ) {
          const pose = getPose();
          if (pose) onPoseUpdate(pose);
          lastPoseSentAtRef.current = now;
        }
      }
    });

    return (
      <SimpleCharacter
        ref={characterRef}
        // @ts-expect-error SimpleCharacter の型定義が不完全なため、unknown を許容
        model={model}
        // @ts-expect-error SimpleCharacter の型定義が不完全なため、unknown を許容
        input={input}
        // @ts-expect-error SimpleCharacter の型定義が不完全なため、unknown を許容
        cameraBehavior={cameraBehavior}
      >
        {children}
      </SimpleCharacter>
    );
  },
);
