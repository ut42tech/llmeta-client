import { useEffect } from "react";
import { useCurrentUserStore } from "@/stores/current-user";

export const useCurrentUserName = () => {
  const { name, fetchUserData } = useCurrentUserStore();

  useEffect(() => {
    if (name === null) {
      fetchUserData();
    }
  }, [name, fetchUserData]);

  return name || "?";
};
