import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserInfoCard(user) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>
          <strong>Name:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Fick Score:</strong> {user.score}
        </p>
      </CardContent>
    </Card>
  );
}
