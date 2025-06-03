"use client";

import ProtectedRoute from "@/components/protected-route";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [googleIsLoggingIn, setGoogleIsLoggingIn] = useState(false);

  const isGoogleAuthenticated = !!session?.googleAccessToken;

  const handleGoogleLogin = () => {
    setGoogleIsLoggingIn(true);
    signIn("google", { callbackUrl: "/events/map" });
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        <h1 className="text-2xl mb-4">Einstellungen</h1>

        {status === "loading" ? (
          <p>Lade…</p>
        ) : isGoogleAuthenticated ? (
          <p>Du bist bereits mit Google eingeloggt.</p>
        ) : (
          <button
            onClick={handleGoogleLogin}
            disabled={googleIsLoggingIn}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {googleIsLoggingIn ? "Google-Weiterleitung…" : "In Google einloggen"}
          </button>
        )}
      </div>
    </ProtectedRoute>
  );
}
