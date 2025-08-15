
"use client";

import { useEffect, useState } from "react";
import { Product, getProducts } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Heart, Mic, MessageSquare, Puzzle, Shuffle, Users, LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";

const gameIcons: { [key: string]: LucideIcon } = {
    'time-challenge': Puzzle,
    'pink-cups': Shuffle,
    'snake-and-stairs': ArrowRight,
    'story-match': Puzzle,
};

const gameColors: { [key: string]: string } = {
    'time-challenge': 'from-rose-400 to-fuchsia-500',
    'pink-cups': 'from-purple-400 to-indigo-500',
    'snake-and-stairs': 'from-sky-400 to-cyan-500',
    'story-match': 'from-amber-400 to-orange-500',
}

export default function LuckgirlsPage() {
    const { setTheme } = useTheme();
    const [girlGames, setGirlGames] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTheme('pink-dark');

        async function fetchGames() {
            setIsLoading(true);
            const allProducts = await getProducts();
            const luckgirlsProducts = allProducts.filter(p => p.category === 'luckgirls');
            setGirlGames(luckgirlsProducts);
            setIsLoading(false);
        }

        fetchGames();
        
        return () => {
            setTheme('dark'); 
        };
    }, [setTheme]);

    if (isLoading) {
      return (
         <div className="w-full py-12">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h1 className="text-4xl font-black tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text flex items-center justify-center gap-3">
                        <Heart className="text-primary"/>
                        Luckgirls Games
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Fun, social, and exciting games. Play with friends, chat with the audience, and win amazing prizes!
                    </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="h-[450px] bg-secondary/50 animate-pulse" />
                    ))}
                 </div>
             </div>
        </div>
      )
    }


  return (
    <div className="w-full py-12">
        <div className="container mx-auto px-4">
             <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text flex items-center justify-center gap-3">
                    <Heart className="text-primary"/>
                    Luckgirls Games
                </h1>
                <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
                Fun, social, and exciting games. Play with friends, chat with the audience, and win amazing prizes!
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {girlGames.map((game) => {
                    const Icon = game.game ? gameIcons[game.game as keyof typeof gameIcons] : Puzzle;
                    const Color = game.game ? gameColors[game.game as keyof typeof gameIcons] : 'from-gray-400 to-gray-500';
                    return (
                        <Link key={game.id} href="#" className="group block">
                            <Card className="flex flex-col h-full shadow-lg bg-card/80 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">
                                <CardHeader className={cn("relative h-56 p-0 flex items-center justify-center rounded-t-lg bg-gradient-to-br", Color)}>
                                    <Icon className="h-24 w-24 text-white/80 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <h2 className="text-2xl font-bold text-white group-hover:shimmer-text transition-all">{game.name}</h2>
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
                                    Play Now (10 Shots)
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    </div>
  );
}
