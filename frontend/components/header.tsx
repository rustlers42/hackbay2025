"use client";

import { useAuth } from "@/lib/auth-context";
import { useFetchApi } from "@/lib/use-api";
import { AxeIcon, LogOut, SproutIcon, User } from "lucide-react";
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
};

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { data: userProfile, isLoading } = useFetchApi<UserProfile>(BASE_API_URL + "/users/me", {
    requireAuth: true,
    enabled: isAuthenticated,
  });

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus:outline-none">
              <AxeIcon className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold cursor-pointer">activate</h1>
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
          <div className="flex items-center gap-2">
            {isAuthenticated &&
              (isLoading ? (
                <Skeleton className="h-6 w-12" />
              ) : (
                <span className="font-medium">{userProfile?.score || 0}</span>
              ))}
            {isAuthenticated && <SproutIcon className="h-5 w-5" aria-hidden="true" />}
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{user?.username}</span>
              <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}