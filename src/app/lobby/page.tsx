"use client";

import type { LucideIcon } from "lucide-react";
import { MonitorSmartphone, Scan, ScanEye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  icon: LucideIcon;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: "desktop",
    title: "デスクトップモード",
    description: "PCとマウス/キーボードで参加する",
    icon: MonitorSmartphone,
  },
  {
    id: "xr",
    title: "XRモード",
    description: "対応デバイスでXR空間に没入する",
    icon: Scan,
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

  return (
    <main className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12 md:py-16">
        <header className="flex flex-col gap-2">
          <span className="text-sm">Project LLMeta</span>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            モード選択
          </h1>
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
                  "border-2",
                  isDisabled ? "opacity-40" : "cursor-pointer",
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
                    <CardTitle className="text-lg font-semibold">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {option.description}
                    </CardDescription>
                  </div>
                  <Icon className="h-8 w-8" aria-hidden />
                </CardHeader>
                <CardFooter>
                  {isDisabled ? (
                    <span className="text-xs">
                      XRモードはご利用の環境に対応していません
                    </span>
                  ) : (
                    <span className="text-xs">
                      {isSelected ? "選択中" : ""}
                    </span>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        <div>
          <Button
            onClick={handleStart}
            size="lg"
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
