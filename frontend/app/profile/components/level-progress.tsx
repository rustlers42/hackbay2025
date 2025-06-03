import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LevelProgress(level) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Level</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-2">Level {level.num}</p>
        <Progress value={level.progress} />
        <p className="text-xs text-muted-foreground mt-1">{level.progress}% to next level</p>
      </CardContent>
    </Card>
  );
}
