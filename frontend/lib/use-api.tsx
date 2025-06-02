"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./auth-context";
import { useRouter } from "next/navigation";

type ApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
  enabled?: boolean;
};

export function useApi<T>(url: string, options: ApiOptions = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Use a ref to track if a request is in progress
  const requestInProgress = useRef(false);

  const { method = "GET", body, headers = {}, requireAuth = true, enabled = true } = options;

  const fetchData = useCallback(async (): Promise<T | null> => {
    if (!enabled || (requireAuth && !isAuthenticated) || requestInProgress.current) {
      return null;
    }

    requestInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const requestHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...headers,
      };

      if (requireAuth) {
        const token = getToken();
        if (token) {
          requestHeaders.authorization = `Bearer ${token}`;
        }
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (body && method !== "GET") {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, requestOptions);

      if (response.status === 401) {
        logout();
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      console.error("API request failed:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
      requestInProgress.current = false;
    }
  }, [url, JSON.stringify(headers), requireAuth, enabled, getToken, isAuthenticated, logout]); // Removed `method`, `body`, and `router` if they don't change often.

  return {
    data,
    error,
    isLoading,
    fetchData,
    setData,
  };
}

export function useFetchApi<T>(url: string, options: ApiOptions = {}) {
  const api = useApi<T>(url, options);
  const hasRun = useRef(false);

  useEffect(() => {
    // Only run once per component lifecycle
    if (options.enabled !== false && !hasRun.current) {
      hasRun.current = true;
      api.fetchData();
    }

    // Cleanup function to reset the flag when component unmounts
    return () => {
      hasRun.current = false;
    };
  }, [api.fetchData, options.enabled]);

  return api;
}
