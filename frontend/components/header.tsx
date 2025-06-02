"use client";

import Link from "next/link";
import { LogOut, SproutIcon, SproutIcon as Seedling, User, AxeIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useFetchApi } from "@/lib/use-api";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BASE_API_URL } from "@/lib/api-config";

type UserProfile = {
  email: string;
  username: string;
  score: number;
};

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  // Only fetch user profile when authenticated
  const { data: userProfile, isLoading } = useFetchApi<UserProfile>(BASE_API_URL + "/users/me", {
    requireAuth: true,
    // Skip the API call if not authenticated
    enabled: isAuthenticated,
  });

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <AxeIcon className="h-6 w-6  text-green-600" />
          <h1 className="text-2xl font-bold">boilerplate</h1>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard (nicht fertig)
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

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
