import { NextRequest, NextResponse } from "next/server";

const CALENDAR_LIST_URL = "https://www.googleapis.com/calendar/v3/users/me/calendarList";
const EVENTS_URL = (calendarId: string, timeMin: string, timeMax: string) =>
  `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${new URLSearchParams({
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
  }).toString()}`;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Kein Token gesendet" }, { status: 401 });
  }

  const accessToken = token;

  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToNextMonday = dayOfWeek === 1 ? 7 : (1 - dayOfWeek + 7) % 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + diffToNextMonday);
  nextMonday.setHours(0, 0, 0, 0);

  const nextMondayPlus7 = new Date(nextMonday);
  nextMondayPlus7.setDate(nextMonday.getDate() + 7);
  nextMondayPlus7.setHours(0, 0, 0, 0);

  const timeMin = nextMonday.toISOString();
  const timeMax = nextMondayPlus7.toISOString();

  try {
    // 1. Liste aller Kalender abrufen
    const calListRes = await fetch(CALENDAR_LIST_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!calListRes.ok) {
      const text = await calListRes.text();
      return NextResponse.json({ error: "Fehler beim Abrufen der Kalenderliste", details: text }, { status: 500 });
    }

    const calList = await calListRes.json();
    const calendars = calList.items || [];

    // 2. Pro Kalender die Events abrufen
    const allEvents: any[] = [];

    for (const calendar of calendars) {
      const eventsRes = await fetch(EVENTS_URL(calendar.id, timeMin, timeMax), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (eventsData.items?.length) {
          allEvents.push(
            ...eventsData.items.map((event: any) => ({
              ...event,
              calendarId: calendar.id,
              calendarSummary: calendar.summary,
            })),
          );
        }
      }
    }

    return NextResponse.json({ events: allEvents });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Interner Fehler beim Abrufen aller Kalenderdaten", details: err.message },
      { status: 500 },
    );
  }
}
