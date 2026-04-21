"use client";

/* Hooks */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

/* APIs */
import { logoutRequest } from "@/lib/apis/auth.api";
import { getMe } from "@/lib/apis/me.api";

const AuthContext = createContext(null);

/**
 * AuthProvider component
 *
 * Provides authentication context for the application.
 * Rehydrates authentication state from backend session on initial mount.
 *
 * @component
 * @param {React.ReactNode} children
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Rehydrates session state from /app/me
   */
  useEffect(() => {
    getMe()
      .then((me) => {
        if (me) setUser(me);
      })
      .catch((err) => {
        console.warn("[AuthContext] Session rehydration failed:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /**
   * Sets user after successful login.
   */
  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  /**
   * Clears user state and optionally logs out remotely.
   */
  const logout = useCallback(async ({ remote = true } = {}) => {
    if (remote) {
      try {
        await logoutRequest();
      } catch (error) {
        console.error("[AuthContext] Error during remote logout:", error);
      }
    }

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading],
  );

  if (loading) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access authentication context.
 *
 * @returns {{ user: Object|null, loading: boolean, login: Function, logout: Function }}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
