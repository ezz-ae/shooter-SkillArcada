
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers } from "lucide-react";

export default function CardGamesPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Card Games
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          Poker, and more classic card games are on their way.
        </p>
      </div>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <Layers className="h-16 w-16 mx-auto text-primary"/>
          <CardTitle>Coming Soon!</CardTitle>
          <CardDescription>
            The deck is being shuffled and the tables are being prepared. Get ready for high-stakes action.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Check back soon for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
