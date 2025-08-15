"use client";

import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import type { Room } from "colyseus.js";
import { Client, getStateCallbacks } from "colyseus.js";

// Colyseus連携用のAtom
export type XRPlayer = {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  qx: number;
  qy: number;
  qz: number;
  qw: number;
  lastUpdate: number;
};

export const playersAtom = atom<Record<string, XRPlayer>>({});
export const sessionIdAtom = atom<string | null>(null);
export const roomAtom = atom<Room | null>(null);

/**
 * Colyseusサーバーに接続し、`playersAtom` をサーバー状態に同期する。
 */
export function ColyseusClient() {
  const [, setPlayers] = useAtom(playersAtom);
  const [, setSessionId] = useAtom(sessionIdAtom);
  const [, setRoom] = useAtom(roomAtom);

  useEffect(() => {
    let room: Room | null = null;
    const client = new Client(
      process.env.NEXT_PUBLIC_COLYSEUS_ENDPOINT || "ws://localhost:2567"
    );

    (async () => {
      try {
        room = await client.joinOrCreate("my_room", {
          name:
            typeof window !== "undefined"
              ? localStorage.getItem("playerName") || ""
              : "",
        });
        setRoom(room);
        setSessionId(room.sessionId);

        const $ = getStateCallbacks(room);

        // 初期クリア
        setPlayers({});

        // プレイヤー追加
        $(room.state).players.onAdd((player: any, key: string) => {
          setPlayers((prev) => ({
            ...prev,
            [key]: {
              id: player.id,
              name: player.name,
              x: player.x,
              y: player.y,
              z: player.z,
              qx: player.qx,
              qy: player.qy,
              qz: player.qz,
              qw: player.qw,
              lastUpdate: player.lastUpdate,
            },
          }));

          // 個別変更監視
          $(player).onChange(() => {
            setPlayers((prev) => ({
              ...prev,
              [key]: {
                id: player.id,
                name: player.name,
                x: player.x,
                y: player.y,
                z: player.z,
                qx: player.qx,
                qy: player.qy,
                qz: player.qz,
                qw: player.qw,
                lastUpdate: player.lastUpdate,
              },
            }));
          });
        });

        // プレイヤー削除
        $(room.state).players.onRemove((_player: any, key: string) => {
          setPlayers((prev) => {
            const { [key]: _removed, ...rest } = prev;
            return rest;
          });
        });
      } catch (e) {
        console.error("Failed to join Colyseus room:", e);
      }
    })();

    return () => {
      if (room) {
        try {
          room.leave(true);
        } catch {}
      }
    };
  }, [setPlayers, setRoom, setSessionId]);

  return null;
}

/**
 * 姿勢（位置/回転）を送信するシンプルなヘルパー
 */
export function sendPose(room: Room | null, pose: Partial<XRPlayer>) {
  if (!room) return;
  room.send("pose", pose);
}
