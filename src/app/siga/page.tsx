
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "lucide-react";

export default function SigaPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
          Siga
        </h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
          A traditional two-player strategy board game from the Philippines.
        </p>
      </div>

      <Card className="w-full max-w-md text-center">
        <CardHeader>
            <Grid className="h-16 w-16 mx-auto text-primary"/>
          <CardTitle>Coming Soon!</CardTitle>
          <CardDescription>
            The classic game of Siga is being prepared for the digital table. Get ready to outmaneuver your opponents.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Check back soon for updates!</p>
        </CardContent>
      </Card>
    </div>
  );
}
