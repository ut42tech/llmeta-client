"use client";

import type { LucideIcon } from "lucide-react";
import { MonitorSmartphone, Scan, ScanEye, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useXrSupport } from "@/hooks/useXrSupport";
import { cn } from "@/lib/utils";
import {
  type ExperienceMode,
  useExperienceModeStore,
} from "@/stores/experience-mode";

interface ModeOption {
  id: ExperienceMode;
  title: string;
  description: string;
  details: string;
  icon: LucideIcon;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: "desktop",
    title: "デスクトップモード",
    description: "PCとマウス/キーボードで参加",
    details: "今すぐメタバース空間を探索できます。",
    icon: MonitorSmartphone,
  },
  {
    id: "xr",
    title: "XRモード",
    description: "対応デバイスでXR空間に没入",
    details: "WebXR対応ヘッドセット向け設定です。",
    icon: Scan,
  },
];

const UPCOMING_FEATURES = [
  {
    title: "アバター選択",
    description: "お好みのアバターで参加",
    icon: UserCircle2,
  },
  {
    title: "ニックネーム設定",
    description: "表示名をカスタマイズ",
    icon: MonitorSmartphone,
  },
  {
    title: "ボイスチャット",
    description: "音声でのコミュニケーション",
    icon: ScanEye,
  },
];

export default function LobbyPage() {
  const router = useRouter();
  const xrSupported = useXrSupport();
  const { mode: selectedMode, setMode } = useExperienceModeStore();

  useEffect(() => {
    if (selectedMode === "xr" && !xrSupported) {
      setMode("desktop");
    }
  }, [selectedMode, xrSupported, setMode]);

  const handleSelect = useCallback(
    (mode: ExperienceMode) => {
      if (mode === "xr" && !xrSupported) return;
      setMode(mode);
    },
    [xrSupported, setMode],
  );

  const handleStart = useCallback(() => {
    const search = new URLSearchParams({ mode: selectedMode });
    router.push(`/experience?${search.toString()}`);
  }, [router, selectedMode]);

  const xrDisabledReason = useMemo(() => {
    if (xrSupported) return null;
    return "XRモードに必要なデバイス/ブラウザが検出できません";
  }, [xrSupported]);

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12 md:py-16">
        <header className="flex flex-col gap-2">
          <span className="text-sm text-slate-400">Project LLMeta</span>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            参加前にモードを選択
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            アバター選択やニックネーム、ボイスチャット設定など今後追加予定です。
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {MODE_OPTIONS.map((option) => {
            const isSelected = selectedMode === option.id;
            const isDisabled = option.id === "xr" && !xrSupported;
            const Icon = option.icon;
            return (
              <Card
                key={option.id}
                className={cn(
                  "border-2 bg-slate-900/50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                  isSelected ? "border-slate-400" : "border-transparent",
                  isDisabled
                    ? "opacity-40"
                    : "cursor-pointer hover:border-slate-500",
                )}
                role="radio"
                aria-checked={isSelected}
                aria-disabled={isDisabled}
                tabIndex={isDisabled ? -1 : 0}
                onClick={() => handleSelect(option.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelect(option.id);
                  }
                }}
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-50">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-slate-400">
                      {option.description}
                    </CardDescription>
                  </div>
                  <Icon className="h-8 w-8 text-slate-500" aria-hidden />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">{option.details}</p>
                  {option.id === "xr" ? (
                    <p className="mt-3 text-xs text-slate-600">
                      WebXR対応のブラウザとデバイスが必要
                    </p>
                  ) : null}
                </CardContent>
                <CardFooter>
                  {isDisabled ? (
                    <span className="text-xs text-slate-600">
                      XRモードはご利用の環境で利用不可
                    </span>
                  ) : (
                    <span className="text-xs text-slate-600">
                      {isSelected ? "選択中" : "クリックまたはEnterで選択"}
                    </span>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {xrDisabledReason ? (
          <div className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-400">
            {xrDisabledReason}
          </div>
        ) : null}

        <section className="rounded-xl border border-slate-800 bg-slate-900/30 p-6">
          <h2 className="text-base font-semibold text-slate-200">
            近日アップデート予定
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            以下の機能を順次追加していきます
          </p>
          <Separator className="my-4 bg-slate-800" />
          <div className="grid gap-4 md:grid-cols-3">
            {UPCOMING_FEATURES.map(({ title, description, icon: Icon }) => (
              <Card key={title} className="border-slate-800 bg-slate-900/50">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                    <Icon className="h-4 w-4 text-slate-400" aria-hidden />
                  </div>
                  <CardTitle className="text-sm text-slate-200">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-slate-600">
            選択内容はセッション中保持されます
          </div>
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-slate-50 text-slate-950 hover:bg-slate-200 md:min-w-48"
            disabled={selectedMode === "xr" && !xrSupported}
          >
            <ScanEye className="mr-2 h-4 w-4" aria-hidden />
            体験を開始する
          </Button>
        </div>
      </div>
    </main>
  );
}
