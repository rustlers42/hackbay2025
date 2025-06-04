"use client";

import { useAuth } from "@/lib/auth-context";
import { useFetchApi } from "@/lib/use-api";
import { Footprints, LogOut, Star, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";
import { BASE_API_URL } from "@/lib/api-config";

type UserProfile = {
  email: string;
  username: string;
  score: number;
  level: number;
};

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { data: userProfile, isLoading } = useFetchApi<UserProfile>(BASE_API_URL + "/users/me", {
    requireAuth: true,
    enabled: isAuthenticated,
  });

  let progress = 0;

  if (isAuthenticated && userProfile) {
    progress = userProfile?.level % 5;
  }

  const radius = 12;
  const stroke = 2;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none">
              <Footprints className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold cursor-pointer">
                <span className="text-green-700">M</span>
                <span className="text-lg">EET</span>
                <span className="text-green-700">M</span>
                <span className="text-lg">ATCH</span>
              </h1>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48" align="start">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/events/map">Map</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                logout();
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/*<NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/events/map" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Karte</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>*/}
        <div className="flex items-center gap-3">
          {/* Score */}
          {isAuthenticated &&
            (isLoading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <span className="font-medium">{userProfile?.score || 0}</span>
            ))}
          {/* Star Icon */}
          {isAuthenticated && <Star className="w-5 h-5 text-yellow-600" />}

          {/* Progress Circle */}
          {isAuthenticated && (
            <div className="relative w-8 h-8 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 32 32">
                <circle stroke="#e5e7eb" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="16" cy="16" />
                <circle
                  stroke="#10b981"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  r={normalizedRadius}
                  cx="16"
                  cy="16"
                  transform="rotate(-90 16 16)"
                  style={{ transition: "stroke-dashoffset 0.35s" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-800" />
              </div>
            </div>
          )}

          {/* Logout */}
          {isAuthenticated && (
            <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
