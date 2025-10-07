import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const useCurrentUserImage = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        setImage(null);
        return;
      }

      // If no session, user is anonymous
      if (!data.session) {
        setImage(null);
        return;
      }

      setImage(data.session.user.user_metadata?.avatar_url ?? null);
    };

    fetchUserImage();

    // Subscribe to auth state changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setImage(null);
      } else {
        setImage(session.user.user_metadata?.avatar_url ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return image;
};
