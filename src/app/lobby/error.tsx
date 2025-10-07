"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LobbyErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function LobbyError({ error, reset }: LobbyErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <div className="max-w-md rounded-xl border border-slate-700 bg-slate-900/50 p-6 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
          <AlertTriangle className="h-7 w-7 text-slate-300" aria-hidden />
        </div>
        <h1 className="mt-4 text-xl font-semibold">
          ロビーの読み込みに失敗しました
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          一時的な問題が発生しました。時間をおいて再試行してください。
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={reset} variant="secondary">
            再試行する
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">トップに戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
