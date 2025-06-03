"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Map, { FullscreenControl, GeolocateControl, Marker, NavigationControl, ViewState } from "react-map-gl/mapbox";

import classes from "./page.module.css";

import ProtectedRoute from "@/components/protected-route";
import { useFetchApi } from "../../../lib/use-api";
import Pin from "./pin";

interface Location {
  lat: number;
  long: number;
  color: string;
  onClick: () => void;
}

interface Event {
  id: number;
  name: string;
  description: string;
  start_date: string; // ISO 8601 date string
  end_date: string; // ISO 8601 date string
  latitude: number;
  longitude: number;
}

const MapView: React.FC = () => {
  const { data: eventData, isLoading } = useFetchApi<Event[]>("http://localhost:8000/events");

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const addPin = useCallback((loc: Location) => {
    setLocations((prev) => [...prev, loc]);
  }, []);

  const clearPins = useCallback(() => {
    setLocations((prev) => []);
  }, []);

  useEffect(() => {
    if (eventData) {
      const mapLocation = eventData.map((data) => {
        return { lat: data.latitude, long: data.longitude, color: "red", onClick: () => {console.log(data); setSelectedEvent(data)}};
      });
      setLocations(mapLocation);
    }
  }, [eventData]);

  const markers = useMemo(
    () =>
      locations.map((loc, idx) => (
        <Marker
          key={`marker-${idx}`}
          latitude={loc.lat}
          longitude={loc.long}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            loc.onClick()
          }}
        >
          <Pin color={loc.color} />
        </Marker>
      )),
    [locations],
  );

  const initialViewState: ViewState = {
    latitude: 49.4305421,
    longitude: 11.0946655,
    zoom: 18,
    bearing: 40,
    pitch: 70,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <main className={classes.mainStyle}>
        <div className="flex items-center justify-center flex-1">
          <Map
            mapboxAccessToken={mapboxToken}
            mapStyle="mapbox://styles/yves147/cmbgcd7j6007601qw6e7z7n3i/draft"
            initialViewState={initialViewState}
            maxZoom={20}
            minZoom={3}
            style={{ width: "100%", height: "100%" }}
          >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />

            {markers}
            {selectedEvent && (
              <div
                className="fixed left-0 right-0 bottom-16 bg-white p-4 shadow-lg z-50 flex justify-center"
                style={{ backdropFilter: "blur(8px)" }}
              >
                <div className="relative max-w-sm w-full">
                  <button
                    onClick={() => setSelectedEvent(undefined)}
                    className="absolute top-2 right-2 text-gray-500 text-2xl font-bold"
                    aria-label="Close"
                  >
                    ×
                  </button>

                  <h2 className="text-xl font-semibold break-words">{selectedEvent.name}</h2>
                  <p className="mt-1 break-words">{selectedEvent.description}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {new Date(selectedEvent.start_date).toLocaleString()} -{" "}
                    {new Date(selectedEvent.end_date).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </Map>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default MapView;
