"use client";

import ProtectedRoute from "@/components/protected-route";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    signIn("google", { callbackUrl: "/events/map" });
  }, []);

  return (
    <ProtectedRoute>
      <h1>hi</h1>
    </ProtectedRoute>
  );
}
