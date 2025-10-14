import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileName = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error(error);
        setName("匿名ユーザー");
        return;
      }

      // If no session, create an anonymous session
      if (!data.session) {
        await supabase.auth.signInAnonymously();
        const { data: newData } = await supabase.auth.getSession();
        if (newData.session?.user.is_anonymous) {
          setName("匿名ユーザー");
        }
        return;
      }

      // Check if user is anonymous
      if (data.session.user.is_anonymous) {
        setName("匿名ユーザー");
        return;
      }

      // Get name from user metadata or use email/id as fallback
      const userName =
        data.session.user.user_metadata?.full_name ||
        data.session.user.user_metadata?.name ||
        data.session.user.email?.split("@")[0] ||
        "ユーザー";

      setName(userName);
    };

    fetchProfileName();

    // Subscribe to auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || session.user.is_anonymous) {
        setName("匿名ユーザー");
      } else {
        const userName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          "ユーザー";
        setName(userName);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return name || "匿名ユーザー";
};
