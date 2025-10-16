"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

function AuthGuardContent({
  children,
  requireAuth = true,
  redirectTo = "/auth/login",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  if (isLoading) {
    return null;
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function AuthGuardFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

export function AuthGuard(props: AuthGuardProps) {
  return (
    <Suspense fallback={<AuthGuardFallback />}>
      <AuthGuardContent {...props} />
    </Suspense>
  );
}
