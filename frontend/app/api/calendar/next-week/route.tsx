import { NextResponse } from "next/server";

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
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Get difference to current/previous Monday
  const currentMonday = new Date(now);
  currentMonday.setDate(now.getDate() + diffToMonday);
  currentMonday.setHours(0, 0, 0, 0);

  const mondayPlus7 = new Date(currentMonday);
  mondayPlus7.setDate(currentMonday.getDate() + 7);
  mondayPlus7.setHours(0, 0, 0, 0);

  const timeMin = currentMonday.toISOString();
  const timeMax = mondayPlus7.toISOString();

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
