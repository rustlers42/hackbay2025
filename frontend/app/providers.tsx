"use client";

import { AuthProvider } from "@/lib/auth-context";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider basePath="/api/google" refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
