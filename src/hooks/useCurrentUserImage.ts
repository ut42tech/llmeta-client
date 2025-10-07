import { useEffect } from "react";
import { useCurrentUserStore } from "@/stores/current-user";

export const useCurrentUserImage = () => {
  const { image, fetchUserData } = useCurrentUserStore();

  useEffect(() => {
    if (image === null) {
      fetchUserData();
    }
  }, [image, fetchUserData]);

  return image;
};
