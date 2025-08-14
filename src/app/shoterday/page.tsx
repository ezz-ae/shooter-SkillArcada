
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, Smile } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStore } from "@/lib/store";

export default function ShoterdayPage() {
    const { addShots } = useStore();
    const { toast } = useToast();

    const handleClaimSmile = () => {
        addShots(10);
        toast({
            title: "Smile Claimed!",
            description: "10 Shots have been added to your balance. Thanks for smiling!",
        });
    }

  return (
    <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
            <h1 className="text-5xl font-black tracking-tight lg:text-7xl font-allura text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
                Shoterday
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                A day for learning, for growing, for building your strength. This is where Shooter shares what he reads, what he learns, and what he believes in.
            </p>
        </div>
        
        <Card className="max-w-4xl mx-auto mb-12 bg-secondary/30 border-primary/20">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">A Message from the Gamegang President</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-lg text-muted-foreground max-w-3xl mx-auto space-y-4">
                 <p>
                    Hey, Shooter here. I give you shots in the games so you can win. On Shoterday, I give you a different kind of shot—a shot of inspiration. My grandma used to say, "a sharp mind is the strongest muscle."
                </p>
                <p>
                    I made this place to share the things that build my strength. I hope they make you smile. If they do, I want you to have a <strong className="text-accent">redeemable 10 Shot reward</strong>. That's a shot from me to you.
                </p>
                <div className="flex justify-center">
                    <Button onClick={handleClaimSmile}>
                        <Smile className="mr-2 h-4 w-4" />
                        Claim Your Smile (10 Shots)
                    </Button>
                </div>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="flex flex-col items-center justify-center text-center p-8">
                <CardHeader>
                    <BookOpen className="h-16 w-16 mx-auto text-primary"/>
                    <CardTitle className="mt-4">Shooter's Bookshelf</CardTitle>
                    <CardDescription>
                        Books on strength, strategy, and the beautiful mystery of life. Coming soon.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" disabled>Explore Books</Button>
                </CardContent>
            </Card>
             <Card className="flex flex-col items-center justify-center text-center p-8">
                <CardHeader>
                    <ShoppingBag className="h-16 w-16 mx-auto text-accent"/>
                    <CardTitle className="mt-4">The Shooterday Store</CardTitle>
                    <CardDescription>
                        Wear what you read. Exclusive merch inspired by the books that build us. Coming soon.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" disabled>Shop Merch</Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
