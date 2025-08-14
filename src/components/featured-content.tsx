
"use client";

import { useEffect, useState } from "react";
import { Product, getProducts } from "@/lib/products";
import { ShotTaker } from "./shot-taker";
import { GameLinkCard } from "./game-link-card";
import { Target, Sparkles, Swords, BrainCircuit } from "lucide-react";
import { SectionHeader } from "./section-header";

export function FeaturedContent() {
    const [shooterGunProducts, setShooterGunProducts] = useState<Product[]>([]);
    const [brainshotProducts, setBrainshotProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function fetchProducts() {
        const allProducts = await getProducts();
        setShooterGunProducts(allProducts.filter(p => !p.category || p.category === 'luckshot').slice(0, 2));
        setBrainshotProducts(allProducts.filter(p => p.category === 'brainshot').slice(0, 2));
        }
        fetchProducts();
    }, []);

    const featuredGames = [
        { href: "/ai-adventure", label: "AI Adventure", icon: Sparkles, description: "Write the story, win the prize." },
        { href: "/pool-shot", label: "Pool Shot", icon: Swords, description: "1-on-1 challenges for glory." },
        { href: "/puzzle-games", label: "Puzzle Games", icon: BrainCircuit, description: "Test your wits to win." },
    ]

    return (
        <div className="container mx-auto px-4 space-y-16">
            <div>
                <SectionHeader 
                    icon={Target}
                    title="Featured ShooterGuns"
                    description="Your shot at a killer discount! Prices change constantly. Hit 'Shot' at the perfect moment."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {shooterGunProducts.map((product) => (
                        <div key={product.id} className="lg:col-span-1">
                            <ShotTaker product={product} />
                        </div>
                    ))}
                    {featuredGames.slice(0,2).map(game => (
                         <GameLinkCard
                            key={game.href}
                            href={game.href}
                            icon={game.icon}
                            label={game.label}
                            description={game.description}
                            className="lg:col-span-1"
                        />
                    ))}
                </div>
            </div>
             <div>
                <SectionHeader 
                    icon={BrainCircuit}
                    title="Featured Brainshots"
                    description="Think you're sharp? Solve puzzles and skill-based challenges to unlock incredible deals."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    {brainshotProducts.map((product) => (
                         <div key={product.id} className="lg:col-span-1">
                            <ShotTaker product={product} />
                        </div>
                    ))}
                    {featuredGames.slice(2).map(game => (
                         <GameLinkCard
                            key={game.href}
                            href={game.href}
                            icon={game.icon}
                            label={game.label}
                            description={game.description}
                            className="lg:col-span-2"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
