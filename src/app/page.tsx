"use client";

import { Loader } from "@react-three/drei";
import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut, PersonStanding, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MainCanvas } from "@/components/main/MainCanvas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(!session.user.is_anonymous);
        } else {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error("Anonymous session error:", error);
          } else if (data.session?.user) {
            setUser(data.session.user);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      setIsAuthenticated(Boolean(sessionUser && !sessionUser.is_anonymous));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Sign in anonymously after logout to maintain a session
    await supabase.auth.signInAnonymously();
    router.refresh();
  };

  const avatarUrl = useMemo(() => {
    if (!user) {
      return "";
    }

    const metadata = user.user_metadata as Record<string, unknown> | null;
    if (!metadata) {
      return "";
    }

    return (
      (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
      (typeof metadata.picture === "string" && metadata.picture) ||
      ""
    );
  }, [user]);

  const avatarInitial = useMemo(() => {
    if (!user) {
      return "";
    }

    const metadata = user.user_metadata as Record<string, unknown> | null;
    const nameValue =
      metadata?.full_name ?? metadata?.name ?? metadata?.user_name;
    const displaySource =
      (typeof nameValue === "string" && nameValue) || user.email || "";

    const trimmed = displaySource.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : "";
  }, [user]);

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
              <Link href="/lobby">
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
            {!isLoading &&
              (isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    aria-label="ログアウト"
                  >
                    <LogOut />
                    ログアウト
                  </Button>

                  <Avatar className="size-8">
                    <AvatarImage src={avatarUrl} alt="アバター" />
                    <AvatarFallback>{avatarInitial || "U"}</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">
                    <LogIn />
                    ログイン
                  </Link>
                </Button>
              ))}
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
                <Link href="/lobby" aria-label="ロビーページへ移動">
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
      <Loader />
    </div>
  );
}
