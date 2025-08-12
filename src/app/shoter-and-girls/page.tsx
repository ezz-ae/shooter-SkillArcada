
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Product, getProducts } from "@/lib/products";
import { ArrowRight, Mic, MessageSquare, Puzzle, Shuffle, Users } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoterChat } from "@/components/shoter-chat";

export default function ShoterAndGirlsPage() {
    const [girlGames, setGirlGames] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            const allProducts = await getProducts();
            setGirlGames(allProducts.filter(p => p.category === 'luckgirls'));
        }
        fetchProducts();
    }, []);

    const gameIcons = {
        'time-challenge': Puzzle,
        'pink-cups': Shuffle,
        'snake-and-stairs': ArrowRight,
        'story-match': Puzzle,
    }

  return (
    <div className="w-full bg-black text-white py-12">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-12">
                <ShoterChat />
            </div>

             <div className="text-center mb-8">
                <h2 className="text-4xl font-black tracking-tight lg:text-5xl bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
                Luckgirls Games
                </h2>
                <p className="mt-2 text-lg text-white/70 max-w-2xl mx-auto">
                Fun, social, and exciting games. Play with friends, chat with the audience, and win amazing prizes!
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {girlGames.map((game) => {
                    const Icon = game.game ? gameIcons[game.game as keyof typeof gameIcons] : Puzzle;
                    return (
                        <Card key={game.id} className="flex flex-col shadow-lg bg-black border-2 border-pink-500/50 hover:border-pink-400 hover:shadow-pink-500/20 transition-all duration-300">
                            <CardHeader className="p-0 relative h-56">
                                <Image src={game.imageUrl} alt={game.name} fill className="object-cover rounded-t-lg" data-ai-hint={game.dataAiHint}/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h2 className="text-2xl font-bold text-white">{game.name}</h2>
                                </div>
                                <div className="absolute top-2 right-2 bg-black/80 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow p-4">
                                <CardDescription className="text-white/70">{game.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex-col gap-4 p-4 pt-0">
                                <div className="flex w-full justify-around items-center p-2 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-2 text-sm text-white/70 font-medium">
                                        <Mic className="h-4 w-4 text-accent" />
                                        Voice Chat
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/70 font-medium">
                                        <MessageSquare className="h-4 w-4 text-accent" />
                                        Text Chat
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/70 font-medium">
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
