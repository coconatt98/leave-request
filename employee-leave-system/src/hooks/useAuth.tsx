"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AuthStorageService } from "@/services/auth-storage";
import { APP_EVENTS, STORAGE_KEYS, type UserRole } from "@/constants";

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  username: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const refreshSession = useCallback(() => {
    const session = AuthStorageService.getSession();
    setIsAuthenticated(!!session);
    setRole(session?.role || null);
    setUsername(session?.username || null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleAuthChange = () => refreshSession();
    const handleStorage = (event: StorageEvent) => {
      if (event.key && event.key !== STORAGE_KEYS.AUTH_SESSION) return;
      refreshSession();
    };

    window.addEventListener(APP_EVENTS.AUTH_CHANGE, handleAuthChange as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        APP_EVENTS.AUTH_CHANGE,
        handleAuthChange as EventListener
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [refreshSession]);

  const login = useCallback(
    async (username: string, password: string) => {
      const success = await AuthStorageService.login(username, password);
      if (success) {
        refreshSession();
      }
      return success;
    },
    [refreshSession]
  );

  const logout = useCallback(() => {
    AuthStorageService.logout();
    refreshSession();
    router.push("/login");
  }, [refreshSession, router]);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, role, username, login, logout }),
    [isAuthenticated, isLoading, role, username, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
