"use client";

import ProtectedRoute from "@/components/protected-route";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useFetchApi } from "../../lib/use-api";

type GoogleCalendarEvent = {
  id: string;
  summary?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  type: "google";
};

type SportEvent = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  latitude: number;
  longitude: number;
  type: "sport";
};

type UnifiedEvent = GoogleCalendarEvent | SportEvent;

type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: "google" | "sport";
  dayIndex: number;
  startHour: number;
  endHour: number;
  duration: number;
};

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sport events
  const { data: sportEventsRaw, isLoading: sportLoading } = useFetchApi<Omit<SportEvent, "type">[]>(
    "http://localhost:8000/users/me/events",
  );

  const isGoogleAuthenticated = !!session?.googleAccessToken;

  // Transform sport events to include type
  const sportEvents: SportEvent[] = useMemo(() => {
    return sportEventsRaw?.map((event) => ({ ...event, type: "sport" as const })) || [];
  }, [sportEventsRaw]);

  useEffect(() => {
    const load = async () => {
      if (!isGoogleAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/calendar/next-week", {
          headers: {
            Authorization: `Bearer ${session.googleAccessToken}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Unbekannter Fehler");

        const eventsWithType: GoogleCalendarEvent[] =
          data.events?.map((event: any) => ({
            ...event,
            type: "google" as const,
          })) || [];

        setGoogleEvents(eventsWithType);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isGoogleAuthenticated, session?.googleAccessToken]);

  // Get the current week's dates
  const weekDates = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday as first day
    startOfWeek.setDate(today.getDate() + diff);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  }, []);

  // Transform events for calendar display
  const calendarEvents: CalendarEvent[] = useMemo(() => {
    const events: UnifiedEvent[] = [];

    if (googleEvents) {
      events.push(...googleEvents);
    }
    events.push(...sportEvents);

    return events
      .map((event): CalendarEvent | null => {
        let startTime: Date;
        let endTime: Date;
        let title: string;
        let description: string | undefined;

        if (event.type === "google") {
          const startStr = event.start.dateTime || event.start.date;
          const endStr = event.end.dateTime || event.end.date;
          if (!startStr || !endStr) return null;

          startTime = new Date(startStr);
          endTime = new Date(endStr);
          title = event.summary || "(Kein Titel)";
        } else {
          startTime = new Date(event.start_date);
          endTime = new Date(event.end_date);
          title = event.name;
          description = event.description;
        }

        // Find which day of the week this event belongs to
        const eventDate = new Date(startTime);
        eventDate.setHours(0, 0, 0, 0);

        const dayIndex = weekDates.findIndex((date) => {
          const weekDate = new Date(date);
          weekDate.setHours(0, 0, 0, 0);
          return weekDate.getTime() === eventDate.getTime();
        });

        if (dayIndex === -1) return null; // Event not in current week

        const startHour = startTime.getHours() + startTime.getMinutes() / 60;
        const endHour = endTime.getHours() + endTime.getMinutes() / 60;
        const duration = endHour - startHour;

        return {
          id: `${event.type}-${event.id}`,
          title,
          description,
          startTime,
          endTime,
          type: event.type,
          dayIndex,
          startHour,
          endHour,
          duration,
        };
      })
      .filter((event): event is CalendarEvent => event !== null);
  }, [googleEvents, sportEvents, weekDates]);

  // Generate hour labels
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const isLoading = loading || sportLoading;

  const getEventStyles = (type: "google" | "sport") => {
    return type === "google"
      ? "bg-blue-500 text-white border-blue-600"
      : "bg-emerald-500 text-white border-emerald-600";
  };

  const formatTime = (hour: number) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  };

  const weekDayNames = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">Wochenkalender</h1>
          {!isGoogleAuthenticated && error && (
            <p className="text-xs text-amber-600 mt-1">Google Kalender nicht verbunden</p>
          )}
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Lade Events…</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Week header */}
            <div className="bg-white border-b flex">
              {/* Time column header */}
              <div className="w-12 flex-shrink-0 border-r bg-gray-50"></div>

              {/* Day headers */}
              {weekDates.map((date, index) => (
                <div key={index} className="flex-1 min-w-0 p-2 text-center border-r last:border-r-0">
                  <div className="text-xs font-medium text-gray-600">{weekDayNames[index]}</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {date.getDate().toString().padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="flex-1 overflow-y-auto">
              <div className="relative">
                {/* Hour rows */}
                {hours.map((hour) => (
                  <div key={hour} className="flex border-b border-gray-100 h-12">
                    {/* Time label */}
                    <div className="w-12 flex-shrink-0 border-r bg-gray-50 flex items-center justify-center">
                      <span className="text-xs text-gray-500 font-mono">{hour.toString().padStart(2, "0")}</span>
                    </div>

                    {/* Day columns */}
                    {weekDates.map((_, dayIndex) => (
                      <div key={dayIndex} className="flex-1 min-w-0 border-r last:border-r-0 relative">
                        {/* Events for this hour and day */}
                        {calendarEvents
                          .filter(
                            (event) =>
                              event.dayIndex === dayIndex && event.startHour <= hour + 1 && event.endHour > hour,
                          )
                          .map((event) => {
                            // Calculate position and height
                            const startOffset = Math.max(0, event.startHour - hour) * 48; // 48px per hour
                            const endOffset = Math.min(1, event.endHour - hour) * 48;
                            const height = endOffset - startOffset;

                            if (height <= 0) return null;

                            return (
                              <div
                                key={event.id}
                                className={`absolute left-0.5 right-0.5 rounded text-xs p-1 border ${getEventStyles(event.type)} overflow-hidden`}
                                style={{
                                  top: `${startOffset}px`,
                                  height: `${height}px`,
                                  zIndex: 10,
                                }}
                              >
                                <div className="font-medium truncate leading-tight">{event.title}</div>
                                {height > 20 && (
                                  <div className="text-xs opacity-90 truncate">
                                    {formatTime(event.startHour)} - {formatTime(event.endHour)}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="bg-white border-t px-4 py-2 flex items-center justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Google</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded"></div>
            <span className="text-xs text-gray-600">LiveMesh</span>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
