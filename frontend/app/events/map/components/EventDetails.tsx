"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { deleteData, putData } from "@/lib/api-helpers";
import { useFetchApi } from "@/lib/use-api";
import { ArrowLeft, Calendar, Clock, Loader2, MapPin, Star, UserCheck, Users, UserX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";

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

interface ParticipationResponse {
  id: number;
  participation_type: string;
  date: string;
  score: number;
  event_id: number;
  user_id: number;
}

interface EventApiResponse {
  event: Event;
  tags: Tag[];
  is_participating: boolean;
  attendees: Attendee[];
}

interface EventDetailOverlayProps {
  eventId: number;
  onClose: () => void;
  onAdd: (minutes) => void;
}

export default function EventDetails({ eventId, onClose, onAdd }: EventDetailOverlayProps) {
  const { data, isLoading } = useFetchApi<EventApiResponse>(`http://localhost:8000/events/${eventId}`);
  const [isAttending, setIsAttending] = useState(false);

  useEffect(() => {
    setIsAttending(data?.is_participating || false);
  }, [data]);

  const handleAttendToggle = async () => {
    let result;

    if (isAttending) {
      // Leaving the event - use DELETE
      result = await deleteData(`http://localhost:8000/events/${eventId}/leave`, localStorage.getItem("access_token"));
    } else {
      // Joining the event - use PUT
      result = await putData<ParticipationResponse>(
        `http://localhost:8000/events/${eventId}/participate`,
        {},
        localStorage.getItem("access_token"),
      );

      let startDate = new Date(data.event.start_date),
        endDate = new Date(data.event.end_date);

      let diffMin = 0;

      if (startDate == endDate) {
        console.log("setting diffMin to default 120");
        diffMin = 120;
      } else {
        diffMin = Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
        if (diffMin < 1) diffMin = 120;
      }

      onAdd(diffMin);
      onClose();
    }

    if (result.error) {
      console.error(result.error);
    } else {
      setIsAttending((prev) => !prev);
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-3 text-lg text-gray-600">Loading event...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || !data.event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
            <p className="text-gray-600 mb-6">No event found or error loading event.</p>
            <Link href="/events">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { event, tags, attendees } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-EN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-EN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-4">
          <Link href="/events/map">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-700 hover:text-green-800 hover:bg-green-100"
              onClick={onClose}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>

        {/* Main Event Card */}
        <Card className="shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-gray-900 leading-tight">{event.name}</CardTitle>
            <CardDescription className="text-lg text-gray-600 mt-2">{event.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Event Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Max Participants</p>
                  <p className="font-semibold text-gray-900">{event.max_participants}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Bonus Points</p>
                  <p className="font-semibold text-gray-900">{event.bonus_points}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg col-span-2 md:col-span-1">
                <UserCheck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Attendees</p>
                  <p className="font-semibold text-gray-900">{attendees.length}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Date and Time */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Event Schedule
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border border-green-200 rounded-lg bg-green-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Start</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{formatDate(event.start_date)}</p>
                  <p className="text-gray-700">at {formatTime(event.start_date)}</p>
                </div>
                <div className="p-4 border border-red-200 rounded-lg bg-red-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">End</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{formatDate(event.end_date)}</p>
                  <p className="text-gray-700">at {formatTime(event.end_date)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Location
              </h3>
              <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg" style={{ height: 300 }}>
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
                  <Marker latitude={event.latitude} longitude={event.longitude} anchor="bottom" color="#16a34a" />
                </Map>
              </div>
            </div>

            <Separator />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Attend Button */}
            <div className="pt-4">
              <Button
                onClick={handleAttendToggle}
                size="lg"
                className={`w-full h-14 text-lg font-semibold ${isAttending ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
              >
                {isAttending ? (
                  <>
                    <UserX className="w-5 h-5 mr-2" />
                    Leave Event
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 mr-2" />
                    Attend Event
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Attendees Card
        {attendees.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Attendees ({attendees.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{attendee.username}</p>
                      <p className="text-sm text-gray-600">{attendee.email}</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      {attendee.bonus_points} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
        )}*/}
      </div>
    </div>
  );
}
