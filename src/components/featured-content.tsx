
"use client";

import { useEffect, useState } from "react";
import { Product, getProducts } from "@/lib/products";
import { ShotTaker } from "./shot-taker";
import { GameLinkCard } from "./game-link-card";
import { Target, Sparkles, Swords, BrainCircuit, Star } from "lucide-react";
import { SectionHeader } from "./section-header";

export function FeaturedContent() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        async function fetchProducts() {
            const allProducts = await getProducts();
            const luckshots = allProducts.filter(p => !p.category || p.category === 'luckshot').slice(0, 2);
            const brainshots = allProducts.filter(p => p.category === 'brainshot').slice(0, 2);
            setFeaturedProducts([...luckshots, ...brainshots]);
        }
        fetchProducts();
    }, []);

    const featuredGames = [
        { href: "/ai-adventure", label: "AI Adventure", icon: Sparkles, description: "Write the story, win the prize." },
        { href: "/pool-shot", label: "Pool Shot", icon: Swords, description: "1-on-1 challenges for glory." },
        { href: "/puzzle-games", label: "Puzzle Games", icon: BrainCircuit, description: "Test your wits to win." },
        { href: "/crypto-luck", label: "Crypto Luck", icon: Target, description: "Predict the price, win the prize." },
    ]

    return (
        <div className="container mx-auto px-4">
            <SectionHeader 
                icon={Star}
                title="Featured Shots"
                description="A mix of our most popular games and products. Your next big win could be right here."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {featuredProducts.map((product) => (
                    <div key={product.id} className="lg:col-span-1">
                        <ShotTaker product={product} />
                    </div>
                ))}
                {featuredGames.map(game => (
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
    );
}
