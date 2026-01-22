"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { logoutRequest } from "@/lib/apis/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    console.log("[AuthContext] login:", userData);
    setUser(userData);
  }, []);

  const logout = useCallback(async ({ remote = true } = {}) => {
    console.log("[AuthContext] logout called", { remote });

    if (remote) {
      try {
        await logoutRequest();
      } catch (error) {
        console.error("[AuthContext] Error durante logout remoto:", error);
      }
    }

    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
