"use client";

import ProtectedRoute from "@/components/protected-route";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type CalendarEvent = {
  id: string;
  summary?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
};

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isGoogleAuthenticated = !!session?.googleAccessToken;

  useEffect(() => {
    const load = async () => {
      if (!isGoogleAuthenticated) return;

      try {
        const res = await fetch("/api/calendar/next-week", {
          headers: {
            Authorization: `Bearer ${session.googleAccessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Unbekannter Fehler");

        setEvents(data.events);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isGoogleAuthenticated]);

  return (
    <ProtectedRoute>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Nächste Woche im Google-Kalender</h1>

        {status === "loading" || loading ? (
          <p>Lade Events…</p>
        ) : !isGoogleAuthenticated ? (
          <p className="text-yellow-600">Nicht mit Google verbunden.</p>
        ) : error ? (
          <p className="text-red-600">Fehler: {error}</p>
        ) : events && events.length > 0 ? (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="border rounded p-4 shadow">
                <h2 className="text-lg font-semibold">{event.summary || "(Kein Titel)"}</h2>
                <p>
                  <strong>Start:</strong> {event.start.dateTime || event.start.date}
                </p>
                <p>
                  <strong>Ende:</strong> {event.end.dateTime || event.end.date}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Termine gefunden.</p>
        )}
      </div>
    </ProtectedRoute>
  );
}
