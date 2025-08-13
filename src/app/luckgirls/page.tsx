
"use client";

import { useEffect, useState } from "react";
import { Product, getProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Mic, MessageSquare, Puzzle, Shuffle, Users } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function LuckgirlsPage() {
    const { setTheme } = useTheme();
    const [girlGames, setGirlGames] = useState<Product[]>([]);

    useEffect(() => {
        // Set the lucky-pink theme when the component mounts
        setTheme('lucky-pink');

        async function fetchProducts() {
            const allProducts = await getProducts();
            setGirlGames(allProducts.filter(p => p.category === 'luckgirls'));
        }
        fetchProducts();
        
        // Reset to the dark theme when the component unmounts
        return () => {
            setTheme('dark'); 
        };
    }, [setTheme]);

    const gameIcons = {
        'time-challenge': Puzzle,
        'pink-cups': Shuffle,
        'snake-and-stairs': ArrowRight,
        'story-match': Puzzle,
    }

  return (
    <div className="w-full py-12">
        <div className="container mx-auto px-4">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
                Luckgirls Games
                </h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                Fun, social, and exciting games. Play with friends, chat with the audience, and win amazing prizes!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {girlGames.map((game) => {
                    const Icon = game.game ? gameIcons[game.game as keyof typeof gameIcons] : Puzzle;
                    return (
                        <Card key={game.id} className="flex flex-col shadow-lg bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">
                            <CardHeader className="relative h-56 p-0">
                                <Image src={game.imageUrl} alt={game.name} fill className="object-cover rounded-t-lg" data-ai-hint={game.dataAiHint}/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h2 className="text-2xl font-bold text-white">{game.name}</h2>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow p-4">
                                <CardDescription>{game.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex-col gap-4 p-4 pt-0">
                                <div className="flex w-full justify-around items-center p-2 bg-secondary/50 rounded-lg border border-border">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <Mic className="h-4 w-4 text-accent" />
                                        Voice Chat
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <MessageSquare className="h-4 w-4 text-accent" />
                                        Text Chat
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                        <Users className="h-4 w-4 text-accent" />
                                        Audience
                                    </div>
                                </div>
                                <Button size="lg" className="w-full">
                                Play for 10 Shots
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    </div>
  );
}
