"use client";

import { CoinsCard } from "@/app/profile/components/coins-card";
import { LevelProgress } from "@/app/profile/components/level-progress";
import { StatsChart } from "@/app/profile/components/stats-chart";
import { UserInfoCard } from "@/app/profile/components/user-info-card";
import { BASE_API_URL } from "@/lib/api-config";
import { useAuth } from "@/lib/auth-context";
import { useFetchApi } from "@/lib/use-api";

type UserProfile = {
  email: string;
  username: string;
  level: number;
  bonus_points: number;
};

export default function UserDashboard() {
  const { isAuthenticated, user, logout } = useAuth();
  const { data: userProfile, isLoading } = useFetchApi<UserProfile>(BASE_API_URL + "/users/me", {
    requireAuth: true,
    enabled: isAuthenticated,
  });
  if (isLoading || !userProfile) return <p>Loading...</p>
  return (
    <div className="min-h-screen bg-muted px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6 mt-6">
        <div className="grid md:grid-cols-3 gap-6">
          <UserInfoCard user={userProfile} />
          <CoinsCard coins={userProfile.bonus_points} />
          <LevelProgress level={userProfile.level} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsChart title="Weekly Activity" />
        </div>
      </div>
    </div>
  );
}
