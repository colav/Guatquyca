import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export function useSessionExpired() {
  const router = useRouter();
  const { logout } = useAuth();

  return useCallback(async () => {
    console.log("[useSessionExpired] sesión expirada");

    await logout({ remote: false });

    router.replace("/login?reason=expired");
  }, [logout, router]);
}
