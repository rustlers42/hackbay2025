"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import React, { useCallback, useMemo, useState } from "react";
import Map, { FullscreenControl, GeolocateControl, Marker, NavigationControl, ViewState } from "react-map-gl/mapbox";

import classes from "./page.module.css";

import Pin from "./pin";

interface Location {
  lat: number;
  long: number;
  color: string;
  onClick: () => void;
}

const MapView: React.FC = () => {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;
  const [locations, setLocations] = useState<Location[]>([
    {
      lat: 49.4305421,
      long: 11.0946655,
      color: "red",
      onClick: () => {
        alert("Beispiel-Pin geklickt!");
      },
    },
  ]);

  const addPin = useCallback((loc: Location) => {
    setLocations((prev) => [...prev, loc]);
  }, []);

  const clearPins = useCallback(() => {
    setLocations((prev) => []);
  }, []);

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

  return (
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
        </Map>
      </div>
    </main>
  );
};

export default MapView;
