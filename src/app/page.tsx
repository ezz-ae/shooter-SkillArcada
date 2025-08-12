
"use client";

import { Button } from "@/components/ui/button";
import { User, getUsers } from "@/lib/user";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, BrainCircuit, LineChart, Swords, Heart, Dices, Users, DollarSign, FileText, Sparkles, Grid, RectangleHorizontal, Layers } from "lucide-react";
import { ActivityFeed } from "@/components/activity-feed";
import { useAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { LuckiestUsers } from "@/components/luckiest-users";
import { DiceGame } from "@/components/dice-game";
import { ShotTaker } from "@/components/shot-taker";
import { Product, getProducts } from "@/lib/products";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PoolChallengeCard } from "@/components/pool-challenge-card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TopGames } from "@/components/top-games";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { GameLinkCard } from "@/components/game-link-card";
import { GiChessKing } from "react-icons/gi";
import { FaChess } from "react-icons/fa";

export default function Home() {
    const { isAuthenticated, user, initializeAuth, isNewUser, hasAcceptedTerms, acceptTerms, isLoggingIn } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [openChallenges, setOpenChallenges] = useState<any[]>([]);
    const [isAgreed, setIsAgreed] = useState(false);
    
    useEffect(() => {
        const unsubscribe = initializeAuth();
        return () => unsubscribe();
    }, [initializeAuth]);
    
    useEffect(() => {
        async function fetchData() {
            const fetchedProducts = await getProducts();
            const fetchedUsers = await getUsers();
            setProducts(fetchedProducts);
            setUsers(fetchedUsers);

            if (fetchedUsers.length > 3) {
                setOpenChallenges([
                  { id: 'c1', prize: 40, fee: 5, player1: fetchedUsers[0], player2: null, type: 'pool' },
                  { id: 'c2', prize: 100, fee: 10, player1: fetchedUsers[2], player2: null, type: 'pool' },
                  { id: 'c3', prize: 500, fee: 25, player1: fetchedUsers[3], player2: null, type: 'chess' },
                ]);
            }
        }
        fetchData();
    }, []);

    const iphoneProduct = products.find(p => p.id === 'prod_phone_01');
    const btcProduct = products.find(p => p.id === 'prod_crypto_01');
    
    const gameLinks = [
      { href: "/luckshots", label: "Luckshots", icon: Dices, description: "Classic price drop action." },
      { href: "/brainshots", label: "Brainshots", icon: BrainCircuit, description: "Puzzles and skill challenges." },
      { href: "/crypto-luck", label: "Crypto Luck", icon: LineChart, description: "Predict the market to win." },
      { href: "/pool-shot", label: "Pool Shot", icon: Swords, description: "1-on-1 skill-based pool." },
      { href: "/chess", label: "Chess", icon: FaChess as any, description: "1-on-1 chess challenges." },
      { href: "/board-games", label: "Board Games", icon: Grid, description: "Siga, Dominoes and more." },
      { href: "/luckgirls", label: "Luckgirls", icon: Heart, description: "Fun, social, and exciting games." },
      { href: "/ai-adventure", label: "AI Adventure", icon: Sparkles, description: "AI-powered story game." },
      { href: "/card-games", label: "Card Games", icon: Layers, description: "Poker, and more." },
    ];

    const handleDismissChallenge = (id: string) => {
        setOpenChallenges(prev => {
            const dismissedChallenge = prev.find(c => c.id === id);
            if (!dismissedChallenge) return prev;
            return [...prev.filter(c => c.id !== id), dismissedChallenge];
        });
    };

    if (isLoggingIn) {
        return (
             <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="animate-pulse">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="h-12 w-12 bg-muted rounded-full mx-auto mb-4"></div>
                            <div className="h-8 w-3/4 bg-muted rounded-md mx-auto"></div>
                            <div className="h-4 w-1/2 bg-muted rounded-md mx-auto mt-2"></div>
                        </CardHeader>
                         <CardContent className="space-y-4">
                            <div className="h-4 w-full bg-muted rounded-md"></div>
                            <div className="h-12 w-full bg-muted rounded-md"></div>
                            <div className="h-12 w-full bg-muted rounded-md"></div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    
    const showTermsDialog = isNewUser && !hasAcceptedTerms;

    return (
        <div className="container mx-auto px-4 py-8">
            <AlertDialog open={showTermsDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <FileText className="text-primary"/>
                    Please verify the following
                  </AlertDialogTitle>
                  <AlertDialogDescription className="pt-4 text-left">
                    Our games involve real value. Before playing, please confirm the following points. You can review our full terms anytime.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex items-start space-x-3 rounded-md border p-4">
                    <Checkbox id="terms" checked={isAgreed} onCheckedChange={(checked) => setIsAgreed(checked as boolean)} />
                    <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        I am over 18, I understand the risks of loss/win, and I assure you this money is my own.
                    </label>
                </div>
                 <div className="text-sm text-muted-foreground">
                    By clicking accept, you also agree to our full{' '}
                    <Link href="/terms" target="_blank" className="underline hover:text-primary">
                        Terms of Service
                    </Link>.
                 </div>

                <AlertDialogFooter>
                  <AlertDialogAction onClick={acceptTerms} disabled={!isAgreed}>I Understand and Accept</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <div className={cn("space-y-16", showTermsDialog && "blur-sm pointer-events-none")}>
                
                {/* Main Content: Challenges and League */}
                <div className="space-y-8">
                    {/* Test Your Luck & Skill */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <DiceGame />
                       {openChallenges.length > 0 && (
                            <PoolChallengeCard 
                                challenge={openChallenges[0]}
                                onDismiss={() => handleDismissChallenge(openChallenges[0].id)}
                            />
                       )}
                    </section>
                    
                    {/* Trending Games */}
                     <section>
                         <h2 className="text-2xl font-bold mb-4">Trending games</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                            {iphoneProduct && 
                                <div className="relative">
                                    <div className="absolute top-2 left-2 z-10 flex gap-2">
                                        <Badge variant="secondary">Brainshot</Badge>
                                        <Badge variant="destructive">Ends Soon</Badge>
                                        <Badge variant="default">+79% Wins</Badge>
                                    </div>
                                    <ShotTaker product={iphoneProduct} />
                                </div>
                            }
                            {btcProduct && 
                                <div className="relative">
                                     <Badge variant="secondary" className="absolute top-2 left-2 z-10">Brainshot</Badge>
                                     <ShotTaker product={btcProduct} />
                                </div>
                            }
                             <Card className="shadow-2xl border-accent/50 border-2 flex flex-col justify-center relative overflow-hidden text-center">
                                <Image 
                                    src="https://firebasestorage.googleapis.com/v0/b/reodywellness.firebasestorage.app/o/billiard-games.jpeg?alt=media&token=de4a117f-42a2-458b-a3c1-ee185eb544fc" 
                                    alt="Pool table with balls arranged"
                                    data-ai-hint="pool table top view"
                                    fill 
                                    className="object-cover blur-sm"
                                />
                                <div className="absolute inset-0 bg-black/50" />
                                <div className="relative flex flex-col h-full p-6 text-white justify-center">
                                    <CardHeader className="p-0">
                                        <Trophy className="mx-auto h-12 w-12 text-accent animate-pulse"/>
                                        <CardTitle className="text-3xl font-black text-shadow-lg mt-2">Pool Luck Pros</CardTitle>
                                        <CardDescription className="text-lg text-white/80">New Season is available</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow flex flex-col justify-center p-0 my-4">
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-6xl font-black text-primary text-shadow-lg">One Ethereum</p>
                                                <p className="font-semibold text-white/90">Grand Prize</p>
                                            </div>
                                            <div className="text-white/80 px-4 pt-4">
                                                <p>Join the top 32 players from the globe in an open chat event with a live audience.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-0">
                                        <Button size="lg" className="w-full" variant="default">
                                            Free Registration Test
                                        </Button>
                                    </CardFooter>
                                </div>
                            </Card>
                         </div>
                    </section>

                     {/* All Games */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">All Games</h2>
                        <div className="flex flex-col gap-4">
                            {gameLinks.map(game => (
                                <GameLinkCard
                                    key={game.href}
                                    href={game.href}
                                    icon={game.icon}
                                    label={game.label}
                                    description={game.description}
                                />
                            ))}
                        </div>
                    </section>

                </div>

                {/* Sidebar: Live Activity & Social */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <section>
                        <h2 className="text-2xl font-bold mb-4">Live Activity</h2>
                        <ActivityFeed users={users} />
                    </section>
                     <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                           <Trophy className="text-yellow-400" />
                           Luckiest Users
                        </h2>
                        <LuckiestUsers users={users} />
                    </section>
                </div>

                <section>
                    <h2 className="text-2xl font-bold mb-4">Top Winning Games</h2>
                    <TopGames />
                </section>

            </div>
        </div>
    );
}
