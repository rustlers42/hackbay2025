import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LevelProgress(level) {
  console.log(level)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Level</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">Level {Math.floor(level.level)}</p>
        <Progress value={(level.level % 1) * 100} />
        <p className="text-xs text-muted-foreground mt-1">{Math.round((1 - level.level % 1) * 100)}% to next level</p>
      </CardContent>
    </Card>
  );
}
