import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserInfoCard(user) {
  console.log(user.user)
  console.log(user.user.bonus_points)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>Name:</strong> {user.user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.user.email}
        </p>
        <p>
          <strong>Bonus Points:</strong> {user.user.bonus_points}
        </p>
      </CardContent>
    </Card>
  );
}
