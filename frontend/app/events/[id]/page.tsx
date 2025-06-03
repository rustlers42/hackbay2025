"use client";

import { Button } from "@/components/ui/button";
import { useFetchApi } from "@/lib/use-api";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";

// Lazy load Mapbox so it only loads on the client

interface Event {
  id: number;
  name: string;
  description: string;
  organiser_type: string;
  organiser_id: string;
  latitude: number;
  longitude: number;
  max_participants: number;
  bonus_points: number;
  start_date: string;
  end_date: string;
}

interface Tag {
  id: number;
  name: string;
}

interface Attendee {
  email: string;
  username: string;
  bonus_points: number;
}

interface EventApiResponse {
  event: Event;
  tags: Tag[];
  attendees: Attendee[];
}

export default function EventInfoPage() {
  const id = usePathname().split("/")[2];
  const { data, isLoading } = useFetchApi<EventApiResponse>(
    `http://localhost:8000/events/${id}`
  );

  const [isAttending, setIsAttending] = useState(false);

  const handleAttendToggle = () => {
    // Mock toggle (you can replace with a POST/DELETE API call later)
    setIsAttending((prev) => !prev);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.event) {
    return <div>No event found or error loading event.</div>;
  }

  const { event, tags, attendees } = data;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
      <p className="mb-2">{event.description}</p>
      <p><strong>Location:</strong> {event.latitude}, {event.longitude}</p>
      <p><strong>Max Participants:</strong> {event.max_participants}</p>
      <p><strong>Bonus Points:</strong> {event.bonus_points}</p>
      <p>
        <strong>Start:</strong> {new Date(event.start_date).toLocaleString()}
      </p>
      <p>
        <strong>End:</strong> {new Date(event.end_date).toLocaleString()}
      </p>

      {/* Map */}
      <div className="my-4 rounded-lg overflow-hidden border" style={{ height: 300 }}>
  <Map
    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    mapStyle="mapbox://styles/mapbox/streets-v11"
    initialViewState={{
      latitude: event.latitude,
      longitude: event.longitude,
      zoom: 14,
    }}
    style={{ width: "100%", height: "100%" }}
  >
    <Marker
          latitude={event.latitude}
          longitude={event.longitude}
          anchor="bottom"
        >
        </Marker>
  </Map>
</div>

      {/* Attend/Leave Button */}
      <Button
        className="my-4"
        onClick={handleAttendToggle}
        variant={isAttending ? "secondary" : "default"}
      >
        {isAttending ? "Leave Event" : "Attend Event"}
      </Button>

      <h2 className="text-xl font-bold mt-4">Tags</h2>
      <ul className="list-disc pl-5">
        {tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-4">Attendees</h2>
      <ul className="list-disc pl-5">
        {attendees.map((att) => (
          <li key={att.email}>
            {att.username} ({att.email})
          </li>
        ))}
      </ul>

      <Link href="/events">
        <Button className="mt-6">Back to events</Button>
      </Link>
    </main>
  );
}
