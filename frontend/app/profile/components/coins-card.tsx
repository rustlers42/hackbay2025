import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CoinsCard(coins) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between text-center">
        <div>
          <p className="text-2xl font-semibold">{coins.status}</p>
          <p className="text-muted-foreground">Gold Coins</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{coins.reward}</p>
          <p className="text-muted-foreground">Silver Coins</p>
        </div>
      </CardContent>
    </Card>
  );
}
