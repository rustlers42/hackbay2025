"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { BASE_API_URL } from "./api-config";

type User = {
  id: string;
  username: string;
  email?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, tokenType: string) => void;
  logout: () => void;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const login = (token: string, tokenType: string) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("token_type", tokenType);
    //checkAuth();

    signIn("google", { callbackUrl: "/dashboard" });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    setUser(null);
    router.push("/login");
  };

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("access_token");
    }
    return null;
  };

  const checkAuth = async () => {
    setIsLoading(true);
    const token = getToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(BASE_API_URL + "/users/me", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Auth check failed:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
