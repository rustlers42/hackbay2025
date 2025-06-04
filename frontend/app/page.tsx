import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Calendar, Footprints, Heart, MapPin, Star, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white pt-10">
      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-8 pb-12 px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Footprints className="h-12 w-12 text-green-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap className="h-2 w-2 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold">
                <span className="text-green-700">MEET</span>
                <span className="text-blue-600">MATCH</span>
              </h1>
            </div>

            {/* Tagline */}
            <div className="mb-6">
              <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800 border-green-200">
                AI-Powered Sports Matching
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Find Your Perfect Sports Partner</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Connect with like-minded athletes in your area. Our AI matches you based on skill level, location, and
                schedule.
              </p>
            </div>

            {/* CTA Button */}
            <Button
              asChild
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-xl shadow-lg"
            >
              <Link href="/registration">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>10k+ users</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 px-4 bg-white/50">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Why Choose MeetMatch?</h3>

            <div className="space-y-4">
              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">AI-Powered Matching</h4>
                      <p className="text-gray-600 text-sm">
                        Our smart algorithm finds players who match your skill level and playing style.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Location-Based</h4>
                      <p className="text-gray-600 text-sm">
                        Find players and courts near you. Never travel far for a great game.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm bg-white/80 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Flexible Scheduling</h4>
                      <p className="text-gray-600 text-sm">
                        Match with players who share your availability and preferred playing times.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 px-4">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">How It Works</h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Create Your Profile</h4>
                  <p className="text-gray-600 text-sm">Tell us about your sports, skill level, and preferences</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Get Matched</h4>
                  <p className="text-gray-600 text-sm">Our AI finds compatible players in your area</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Start Playing</h4>
                  <p className="text-gray-600 text-sm">Connect, schedule, and enjoy your favorite sports</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sports Categories */}
        <section className="py-12 px-4 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Popular Sports</h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Tennis", icon: "🎾", users: "2.3k" },
                { name: "Basketball", icon: "🏀", users: "1.8k" },
                { name: "Soccer", icon: "⚽", users: "3.1k" },
                { name: "Badminton", icon: "🏸", users: "1.2k" },
                { name: "Running", icon: "🏃", users: "4.5k" },
                { name: "Cycling", icon: "🚴", users: "2.7k" },
              ].map((sport) => (
                <Card
                  key={sport.name}
                  className="border-0 shadow-sm bg-white/80 backdrop-blur hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{sport.icon}</div>
                    <h4 className="font-semibold text-gray-900 text-sm">{sport.name}</h4>
                    <p className="text-xs text-gray-500">{sport.users} players</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-xl font-bold mb-3">Ready to Find Your Match?</h3>
              <p className="text-green-100 mb-6 text-sm">
                Join thousands of athletes already using MeetMatch to find their perfect sports partners.
              </p>
              <Button
                asChild
                size="lg"
                className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold py-6 rounded-xl"
              >
                <Link href="/registration">
                  Start Matching Now <Heart className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-6">Free to join • No credit card required • Cancel anytime</p>
          </div>
        </section>
      </main>
    </div>
  );
}
