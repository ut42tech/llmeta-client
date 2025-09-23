"use client";

import Link from "next/link";
import { Loader } from "@react-three/drei";
import { MainCanvas } from "@/components/main/MainCanvas";
import { Button } from "@/components/ui/button";
import { PersonStanding, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background 3D Canvas */}
      <MainCanvas />

      {/* Black translucent overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/50" />

      {/* Foreground content */}
      <div className="absolute inset-0 z-10 flex flex-col">
        {/* Header / Simple nav */}
        <header className="flex items-center justify-between px-6 py-4 text-white/80">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-white/80"
              aria-hidden
            />
            <span className="text-sm font-medium tracking-wide">
              Project LLMeta
            </span>
          </div>
          <nav className="hidden gap-2 md:flex">
            <Button asChild variant="ghost" size="sm">
              <Link href="/experience">
                <Sparkles />
                体験する
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/vrm">
                <PersonStanding />
                アバター
              </Link>
            </Button>
          </nav>
        </header>

        {/* Hero */}
        <main className="flex flex-1 items-center justify-center px-6">
          <div className="mx-auto max-w-3xl text-center text-white">
            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Project LLMeta
            </h1>
            <p className="mt-4 text-pretty text-base text-white/80 md:mt-6 md:text-lg">
              AIを活用したメタバースでの新たなコミュニケーション体験を実現します。
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-10">
              <Button asChild size="lg" className="min-w-40">
                <Link href="/experience" aria-label="体験ページへ移動">
                  <Sparkles />
                  体験する
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="min-w-40"
              >
                <Link href="/vrm" aria-label="VRMアバター体験へ移動">
                  <PersonStanding />
                  アバタープレビュー
                </Link>
              </Button>
            </div>

            <div className="mt-6 text-xs text-white/60">
              3D背景はリアルタイムでレンダリングされています
            </div>
          </div>
        </main>

        {/* Footer (optional minimal) */}
        <footer className="px-6 pb-6 text-center text-xs text-white/60">
          © 2025 Takuya Uehara
        </footer>
      </div>

      {/* Drei Loader overlays with its own portal/z-index */}
      <Loader />
    </div>
  );
}
