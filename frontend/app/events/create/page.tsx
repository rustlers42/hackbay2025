"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BASE_API_URL } from "@/lib/api-config";
import { postData } from "@/lib/api-helpers";
import { useAuth } from "@/lib/auth-context";
import { useFetchApi } from "@/lib/use-api";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";

interface NewEvent {
  name: string;
  description: string;
  organiser_type: "individual" | "company" | "professional" | "advertisement";
  organiser_id: string;
  latitude: number;
  longitude: number;
  max_participants: number;
  bonus_points: number;
  start_date: string;
  end_date: string;
}

type UserProfile = {
  email: string;
  username: string;
  score: number;
};

export default function CreateEventPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState<Omit<
    NewEvent,
    "latitude" | "longitude" | "id"
  >>({
    name: "",
    organiser_type: "company",
    description: "",
    organiser_id: "1", // assuming fixed organisation
    max_participants: 0,
    bonus_points: 0,
    start_date: new Date().toISOString(),
    end_date: new Date().toISOString(),
  });

  const { isAuthenticated } = useAuth();
  useFetchApi<UserProfile>(BASE_API_URL + "/users/me", {
    requireAuth: true,
    enabled: isAuthenticated,
  });

  const handleMapClick = useCallback((event: any) => {
    const { lng, lat } = event.lngLat;
    setMarker({ lat, lng });
    setShowPopup(true);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "max_participants"
          ? parseInt(value)
          : name === "start_date" || name === "end_date"
          ? new Date(value).toISOString()
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!marker) {
      alert("Please select a location on the map.");
      return;
    }

    const newEvent: NewEvent = {
      ...formData,
      latitude: marker.lat,
      longitude: marker.lng
    };

    try {
      const result = await postData<NewEvent>(
        "http://localhost:8000/events",
        newEvent
      );

      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        alert("Event created successfully!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create event. Please try again.");
    } finally {
      setMarker(null);
      setShowPopup(false);
      setFormData({
        name: "",
        description: "",
        organiser_type: "company",
        organiser_id: "1",
        max_participants: 0,
        bonus_points: 0,
        start_date: new Date().toISOString(),
        end_date: new Date().toISOString(),
      });
    }
  };

  return (
    <main style={{height: "92vh"}} className="flex flex-col w-screen">
      <div className="flex-1 relative">
        <Map
          initialViewState={{
            longitude: 11.0946655,
            latitude: 49.4305421,
            zoom: 14,
          }}
          style={{ width: "100%", height: "92vh" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={mapboxToken}
          onClick={handleMapClick}
        >
          {marker && (
            <Marker
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="bottom"
              color="red"
            />
          )}
        </Map>

        {showPopup && marker && (
          <div
            className="fixed bottom-0 left-0 right-0 bg-white p-6 shadow-lg border-t border-gray-200"
            style={{ maxWidth: 600, margin: "0 auto" }}
          >
            <h2 className="text-xl font-semibold mb-4">Create Event</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <Input
                type="text"
                name="name"
                placeholder="Event Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <Textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
              <Input
                type="number"
                name="max_participants"
                placeholder="Max Participants"
                value={formData.max_participants}
                onChange={handleInputChange}
                required
              />
              <label>
                Start Date/Time:
                <Input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date.slice(0, 16)}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                End Date/Time:
                <Input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date.slice(0, 16)}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <Button type="submit" variant="default">
                Save Event
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPopup(false);
                  setMarker(null);
                }}
              >
                Cancel
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
