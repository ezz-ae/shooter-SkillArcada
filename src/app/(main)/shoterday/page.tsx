
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ShoppingBag, Smile, Dices } from "lucide-react";
import { useNotificationStore } from "@/lib/notification-store";
import { useStore } from "@/lib/store";
import { LuckAnalysis } from "@/components/luck-analysis";

export default function ShooterdayPage() {
    const { addShots } = useStore();
    const { add: toast } = useNotificationStore();

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
            <h1 className="text-5xl font-black tracking-tight lg:text-7xl font-lilita text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
                Shooterday
            </h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
                A day for learning, for growing, for building your strength. This is where Shooter shares what he learns, and what he believes in.
            </p>
        </div>
        
         <div className="max-w-4xl mx-auto mb-12">
            <LuckAnalysis />
        </div>
        

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
