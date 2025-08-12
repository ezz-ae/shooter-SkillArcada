
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RectangleHorizontal } from "lucide-react";

export default function DominoesPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Dominoes
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          The timeless tile-based game of strategy and luck.
        </p>
      </div>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <RectangleHorizontal className="h-16 w-16 mx-auto text-primary"/>
          <CardTitle>Coming Soon!</CardTitle>
          <CardDescription>
            The digital dominoes table is being set up. Get ready to draw your tiles and dominate the board.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Check back soon for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
