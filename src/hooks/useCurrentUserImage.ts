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

      // If no session, create an anonymous session
      if (!data.session) {
        await supabase.auth.signInAnonymously();
        setImage(null);
        return;
      }

      // If user is anonymous, no avatar
      if (data.session.user.is_anonymous) {
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
      if (!session || session.user.is_anonymous) {
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
