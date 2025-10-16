import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  avatarUrl: string;
  initial: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profile: UserProfile;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
      } else {
        const { data } = await supabase.auth.signInAnonymously();
        if (mounted && data.session?.user) {
          setUser(data.session.user);
        }
      }

      setIsLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const logout = async () => {
    await supabase.auth.signOut();
    await supabase.auth.signInAnonymously();
    router.refresh();
  };

  const profile: UserProfile = {
    avatarUrl: getAvatarUrl(user),
    initial: getAvatarInitial(user),
  };

  return {
    user,
    isAuthenticated: Boolean(user && !user.is_anonymous),
    isLoading,
    profile,
    logout,
  };
}

function getAvatarUrl(user: User | null): string {
  if (!user?.user_metadata) return "";

  const metadata = user.user_metadata;
  return (
    (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
    (typeof metadata.picture === "string" && metadata.picture) ||
    ""
  );
}

function getAvatarInitial(user: User | null): string {
  if (!user) return "";

  const metadata = user.user_metadata ?? {};
  const nameValue = metadata.full_name ?? metadata.name ?? metadata.user_name;
  const displaySource =
    (typeof nameValue === "string" && nameValue) || user.email || "";

  const trimmed = displaySource.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "U";
}
