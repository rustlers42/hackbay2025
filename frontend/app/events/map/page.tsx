"use client";

import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Info, MapPin, X } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  MapRef,
  Marker,
  NavigationControl,
  ViewState,
} from "react-map-gl/mapbox";
import { useFetchApi } from "../../../lib/use-api";
import EventDetailsOverlay from "./components/EventDetails";
import classes from "./page.module.css";

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
  start_date: string;
  end_date: string;
  latitude: number;
  longitude: number;
}

const Pin: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="relative">
      <div
        className="w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: color === "red" ? "#16a34a" : color }}
      >
        <MapPin className="w-4 h-4 text-white" />
      </div>
      <div
        className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent"
        style={{ borderTopColor: color === "red" ? "#16a34a" : color }}
      />
    </div>
  );
};

const MapView: React.FC = () => {
  const [showFullDetails, setShowFullDetails] = useState(false);
  const { data: eventData, isLoading } = useFetchApi<Event[]>("http://localhost:8000/events");

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
  const mapRef = useRef<MapRef>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (eventData) {
      const mapLocation = eventData.map((data) => ({
        lat: data.latitude,
        long: data.longitude,
        color: "red",
        onClick: () => {
          flyToEvent(data.latitude, data.longitude, 18);
          setTimeout(() => {
            setSelectedEvent(data);
          }, 2500);
        },
      }));
      setLocations(mapLocation);
    }

    const timeout = setTimeout(() => {
      resetFly();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [eventData]);

  const flyToEvent = (
    long: number,
    lat: number,
    zoom = 18,
    bearing = 60,
    pitch = 70,
    duration = 4000
  ) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: [lat, long],
      zoom,
      bearing,
      pitch,
      duration,
    });
  };

  const resetFly = () => {
    flyToEvent(49.4405421, 11.1046655, 11, 330, 30);
    setSelectedEvent(null);
  };

  if (typeof window !== "undefined") {
    (window as any).flyToEvent = flyToEvent;
    (window as any).resetFly = resetFly;
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-EN", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-EN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

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
            loc.onClick();
          }}
        >
          <Pin color={loc.color} />
        </Marker>
      )),
    [locations]
  );

  const initialViewState: ViewState = {
    latitude: 49.4305421,
    longitude: 11.0946655,
    zoom: 18,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, left: 0, right: 0, bottom: 0 },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <main className={classes.mainStyle}>
        <div className="flex items-center justify-center flex-1">
          <Map
            ref={mapRef}
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
              <>
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => resetFly()} />

                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
                  <Card className="w-full max-w-lg mx-auto shadow-2xl bg-white">
                    <CardHeader className="relative pb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resetFly()}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>

                      <CardTitle className="text-xl font-bold text-gray-900 pr-8 leading-tight">
                        {selectedEvent.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-2">
                        {selectedEvent.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-green-800">Start</p>
                            <p className="text-sm text-gray-700">
                               {formatDateTime(selectedEvent.start_date).date} at{" "}
                              {formatDateTime(selectedEvent.start_date).time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                          <Clock className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-red-800">End</p>
                            <p className="text-sm text-gray-700">
                              {formatDateTime(selectedEvent.end_date).date} at{" "}
                              {formatDateTime(selectedEvent.end_date).time}
                            </p>
                          </div>
                        </div>
                      </div>

                    
                        <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold" onClick={() => setShowFullDetails(true)}>
                          <Info className="w-4 h-4 mr-2" />
                          View Event Details
                        </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </Map>
          
        </div>
        
      </main>
      {showFullDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-60 flex justify-center items-center">
          <div className="bg-white max-w-4xl w-full overflow-auto max-h-[100vh] relative">

            {/* You can reuse your event detail UI here or import the detail component */}
            <EventDetailsOverlay eventId={selectedEvent.id} onClose={() => setShowFullDetails(false)} />
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
};

export default MapView;
