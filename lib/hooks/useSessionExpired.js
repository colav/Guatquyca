/* Hooks */
import { useAuth } from "@/app/context/AuthContext";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom React hook to handle session expiration.
 *
 * Logs out the user (local only, not remote) and redirects to the login page with a reason.
 * Intended to be used when a 401/SESSION_EXPIRED is detected in API calls.
 *
 * @returns {Function} Callback to trigger session expiration handling
 *
 * @example
 * const handleSessionExpired = useSessionExpired();
 * // ...
 * if (err.status === 401) handleSessionExpired();
 */
export function useSessionExpired() {
  const router = useRouter();
  const { logout } = useAuth();

  return useCallback(async () => {
    await logout({ remote: false });

    router.replace("/login?reason=expired");
  }, [logout, router]);
}
