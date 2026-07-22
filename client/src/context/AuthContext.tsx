// Global authentication state.
// Holds the current user + token, hydrates from localStorage on load,
// and exposes login / register / logout to the whole app.

import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthResponse, User } from "../types/auth.types";
import {
  getMeRequest,
  loginRequest,
  registerRequest,
} from "../api/auth.api";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean; // true while we verify a saved token on startup
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // On first load, if a token exists, verify it by fetching the current user.
  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await getMeRequest();
        setUser(me);
      } catch {
        // Token invalid/expired — clear it.
        localStorage.removeItem("token");
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };
    void bootstrap();
  }, [token]);

  const persist = (auth: AuthResponse) => {
    localStorage.setItem("token", auth.token);
    setToken(auth.token);
    setUser(auth.user);
  };

  const login = async (email: string, password: string) => {
    persist(await loginRequest(email, password));
  };

  const register = async (name: string, email: string, password: string) => {
    persist(await registerRequest(name, email, password));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
