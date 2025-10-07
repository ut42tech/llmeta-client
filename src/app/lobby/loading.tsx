import { Loader2 } from "lucide-react";

export default function LobbyLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        <span className="text-sm">ロビーを準備しています…</span>
      </div>
    </div>
  );
}
