"use client";

/* Hooks */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

/* APIs */
import { logoutRequest } from "@/lib/apis/auth.api";

const AuthContext = createContext(null);

/**
 * AuthProvider component
 *
 * Provides authentication context for the application.
 * Stores the current user and exposes login/logout methods.
 * Should wrap the app or relevant subtree to provide access to useAuth.
 *
 * @component
 * @param {React.ReactNode} children - Child components
 * @returns {JSX.Element} Auth context provider
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

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
      login,
      logout,
    }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access authentication context.
 *
 * Returns the current user and authentication methods (login, logout).
 * Must be used within an AuthProvider.
 *
 * @returns {{ user: Object|null, login: Function, logout: Function }} Auth context value
 * @throws {Error} If used outside AuthProvider
 *
 * @example
 * const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
