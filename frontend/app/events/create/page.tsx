"use client";

import { BASE_API_URL } from "@/lib/api-config";
import { useAuth } from "@/lib/auth-context";
import { useFetchApi } from "@/lib/use-api";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";

interface NewEvent {
  name: string;
  description: string;
  organiser_type: "individual" | "organization"; // guessing possible values
  organiser_id: string;
  latitude: number;
  longitude: number;
  max_participants: number;
  bonus_points: number;
  start_date: string; // ISO 8601 date string
  end_date: string;   // ISO 8601 date string
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
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
  const [formData, setFormData] = useState<Omit<NewEvent, "latitude" | "longitude" | "id" | "created_at" | "updated_at">>({
  name: "",
  organiser_type: "organization",
  description: "",
  organiser_id: "",
  max_participants: 0,
  bonus_points: 0,
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
});
    const { isAuthenticated, user, logout } = useAuth();
    const { data: userProfile, isLoading } = useFetchApi<UserProfile>(BASE_API_URL + "/users/me", {
      requireAuth: true,
      enabled: isAuthenticated,
    });

  // On map click, place marker & show popup
  const handleMapClick = useCallback((event: any) => {
    const {lng, lat} = event.lngLat;
    setMarker({ lat, lng });
    setShowPopup(true);
  }, []);

  // Form change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Submit handler (no POST request)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!marker) {
      alert("Please select a location on the map.");
      return;
    }

    const newEvent: NewEvent = {
        ...formData,
        latitude: marker.lat,
        longitude: marker.lng,
        organiser_type: "individual", // guessing possible values
        organiser_id: "1",
        max_participants: 45,
        bonus_points: 0,   // ISO 8601 date string
        created_at: new Date().toISOString(), // ISO 8601 date string
        updated_at: new Date().toISOString()
    };

    console.log("New Event:", newEvent);
    alert("Event saved locally (no API call made).");
    console

    // Reset form & marker
    setMarker(null);
    setShowPopup(false);
    setFormData({
      name: "",
      description: "",
      max_participants: 0,
      bonus_points: 0,
      start_date: "",
      end_date: "",
    });
  };

  return (
    <main className="flex flex-col h-screen w-screen">
      <div className="flex-1 relative">
        <Map
          initialViewState={{
            longitude: 11.0946655,
            latitude: 49.4305421,
            zoom: 14,
          }}
          style={{ width: "100%", height: "100%" }}
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
              <input
                type="text"
                name="name"
                placeholder="Event Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="border rounded px-3 py-2"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="border rounded px-3 py-2"
              />
              <label>
                Start Date/Time:
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </label>
              <label>
                End Date/Time:
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                  className="border rounded px-3 py-2 w-full"
                />
              </label>

              <button
                type="submit"
                className="bg-green-600 text-white rounded py-2 hover:bg-green-700 transition"
              >
                Save Event
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPopup(false);
                  setMarker(null);
                }}
                className="text-gray-500 mt-1 underline"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
