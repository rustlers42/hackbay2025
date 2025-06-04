"use client"

import { UserProfile } from "@/components/header"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Info, MapPin, X } from "lucide-react"
import "mapbox-gl/dist/mapbox-gl.css"
import Link from "next/link"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import Map, {
  FullscreenControl,
  GeolocateControl,
  type MapRef,
  Marker,
  NavigationControl,
  type ViewState,
} from "react-map-gl/mapbox"
import { useFetchApi } from "../../../lib/use-api"
import EventDetailsOverlay from "./components/EventDetails"
import classes from "./page.module.css"

interface Location {
  lat: number
  long: number
  color: string
  onClick: () => void
}

interface Event {
  id: number
  name: string
  description: string
  start_date: string
  end_date: string
  latitude: number
  longitude: number
}

interface SearchResult {
  url: string
  name: string
  description: string
  start_date: string
  end_date: string
  latitude: number
  longitude: number
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
  )
}

const MapView: React.FC = () => {
  const [showFullDetails, setShowFullDetails] = useState(false)
  const { data: eventData, isLoading } = useFetchApi<Event[]>("http://localhost:8000/events")
  const { data: searchData, isLoading: isSearchLoading } = useFetchApi<SearchResult[]>(
    "http://localhost:8000/search?tags=badminton&tags=basketball",
  )

  const { data: userProfile } = useFetchApi<UserProfile>("http://localhost:8000/users/me");

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string
  const mapRef = useRef<MapRef>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [searchLocations, setSearchLocations] = useState<Location[]>([])
  const [allSearchLocations, setAllSearchLocations] = useState<Location[]>([])
  const [displayedSearchCount, setDisplayedSearchCount] = useState(0)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedSearchEvent, setSelectedSearchEvent] = useState<SearchResult | null>(null)
  const [goalProgress, setGoalProgress] = useState(0) // Example: 67% progress

  useEffect(() => {
    if (eventData) {
      const mapLocation = eventData.map((data) => ({
        lat: data.latitude,
        long: data.longitude,
        color: "red",
        onClick: () => {
          flyToEvent(data.latitude, data.longitude, 18)
          setTimeout(() => {
            setSelectedEvent(data)
          }, 2500)
        },
      }))
      setLocations(mapLocation)
    }

    const timeout = setTimeout(() => {
      resetFly()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [eventData])

  useEffect(() => {
    if (searchData) {
      const mapSearchLocation = searchData.map((data) => ({
        lat: data.latitude,
        long: data.longitude,
        color: "blue",
        onClick: () => {
          flyToEvent(data.latitude, data.longitude, 18)
          setTimeout(() => {
            setSelectedSearchEvent(data)
          }, 2500)
        },
      }))
      setAllSearchLocations(mapSearchLocation)
      setDisplayedSearchCount(0)
    }

    const timeout = setTimeout(() => {
      resetFly()
    }, 2000)

    return () => clearTimeout(timeout)
  }, [searchData])

  useEffect(() => {
    if (allSearchLocations.length > 0 && displayedSearchCount < allSearchLocations.length) {
      const initialTimeout = setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayedSearchCount((prev) => {
            const next = prev + 1
            if (next >= allSearchLocations.length) {
              clearInterval(interval)
            }
            return next
          })
        }, 2500) // 2.5 seconds between each marker

        return () => clearInterval(interval)
      }, 7000) // 7 seconds initial delay

      return () => clearTimeout(initialTimeout)
    }
  }, [allSearchLocations.length, displayedSearchCount])

  useEffect(() => {
    const visibleSearchLocations = allSearchLocations.slice(0, displayedSearchCount)
    setSearchLocations(visibleSearchLocations)
  }, [allSearchLocations, displayedSearchCount])

  const flyToEvent = (long: number, lat: number, zoom = 18, bearing = 60, pitch = 70, duration = 4000) => {
    if (!mapRef.current) return
    mapRef.current.flyTo({
      center: [lat, long],
      zoom,
      bearing,
      pitch,
      duration,
    })
  }

  const resetFly = () => {
    flyToEvent(49.4305421, 11.1046655, 11, 330, 30)
    setSelectedEvent(null)
    setSelectedSearchEvent(null)
  }

  if (typeof window !== "undefined") {
    ; (window as any).flyToEvent = flyToEvent
      ; (window as any).resetFly = resetFly
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
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
    }
  }

  const markers = useMemo(() => {
    const allLocations = [...locations, ...searchLocations]
    return allLocations.map((loc, idx) => (
      <Marker
        key={`marker-${idx}`}
        latitude={loc.lat}
        longitude={loc.long}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation()
          loc.onClick()
        }}
      >
        <Pin color={loc.color} />
      </Marker>
    ))
  }, [locations, searchLocations])

  const initialViewState: ViewState = {
    latitude: 49.4305421,
    longitude: 11.0946655,
    zoom: 18,
    bearing: 0,
    pitch: 0,
    padding: { top: 0, left: 0, right: 0, bottom: 0 },
  }

  if (isLoading || isSearchLoading || !userProfile) {
    return <div>Loading...</div>
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
                      <CardDescription className="text-gray-600 mt-2">{selectedEvent.description}</CardDescription>
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

                      <Button
                        className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
                        onClick={() => setShowFullDetails(true)}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        View Event Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {selectedSearchEvent && (
              <>
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => resetFly()} />

                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-300">
                  <Card className="w-full max-w-lg mx-auto shadow-2xl bg-blue-50 border-blue-200">
                    <CardHeader className="relative pb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => resetFly()}
                        className="absolute top-2 right-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>

                      <CardTitle className="text-xl font-bold text-blue-900 pr-8 leading-tight">
                        {selectedSearchEvent.name}
                      </CardTitle>
                      <CardDescription className="text-blue-700 mt-2">
                        {selectedSearchEvent.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-blue-800">Start</p>
                            <p className="text-sm text-blue-700">
                              {formatDateTime(selectedSearchEvent.start_date).date} at{" "}
                              {formatDateTime(selectedSearchEvent.start_date).time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-blue-800">End</p>
                            <p className="text-sm text-blue-700">
                              {formatDateTime(selectedSearchEvent.end_date).date} at{" "}
                              {formatDateTime(selectedSearchEvent.end_date).time}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        onClick={() => {
                          window.open(selectedSearchEvent.url, "_blank")
                        }}
                      >
                        Learn more
                      </Button>

                      <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold">
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
            <EventDetailsOverlay eventId={selectedEvent.id} onAdd={(min) => {
              min = Math.min(120, min);
              setGoalProgress(Math.min(100, goalProgress + Math.ceil((min / userProfile.intensity) * 100)));
              resetFly();
            }} onClose={() => setShowFullDetails(false)} />
          </div>
        </div>
      )}
      {/* Floating Progress Bar */}
      <Link href={"/calendar"} className="fixed bottom-4 left-4 right-4 z-30 pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Weekly Goals</span>
              <span className="text-sm font-bold text-green-600">{goalProgress}%</span>
            </div>
            <Progress value={goalProgress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">You have achieved {goalProgress}% of your goals this week</p>
          </div>
        </div>
      </Link>
    </ProtectedRoute>
  )
}

export default MapView
