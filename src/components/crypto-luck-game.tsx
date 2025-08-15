
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Area, AreaChart } from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useStore } from "@/lib/store";
import { useNotificationStore } from "@/lib/notification-store";
import { cn } from "@/lib/utils";
import { ChartContainer } from "./ui/chart";
import { Bitcoin, Check, Gamepad, Target, X, Trophy, ArrowUp, ArrowDown, Loader } from "lucide-react";
import { Input } from "./ui/input";

const GAME_DURATION_SECONDS = 180; // 3 minutes
const GRAND_PRIZE = 100; // Shots

type GameState = 'idle' | 'playing' | 'finished';
type Trend = 'upward' | 'downward' | 'stable';
type DirectionGuess = 'up' | 'down' | null;

interface GameResult {
    isWinner: boolean;
    prize: number;
    finalPrice: number;
    guessedPrice: number;
    actualDirection: 'up' | 'down' | 'stable';
    guessedDirection: DirectionGuess;
    priceAccuracy: number;
}

interface PriceModel {
    trend: Trend;
    stepsRemaining: number;
}

export function CryptoLuckGame() {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [marketPrice, setMarketPrice] = useState(70000);
  const [currentPrice, setCurrentPrice] = useState(70000);
  const [priceHistory, setPriceHistory] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      time: i,
      price: 70000 * (1 + (Math.random() - 0.5) * 0.001),
    }))
  );
  const [timer, setTimer] = useState(GAME_DURATION_SECONDS);
  
  const [guessedPrice, setGuessedPrice] = useState("");
  const [directionGuess, setDirectionGuess] = useState<DirectionGuess>(null);
  const [isGuessLocked, setIsGuessLocked] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const { shots, spendShot, addShots } = useStore();
  const { add: toast } = useNotificationStore();
  
  const timerInterval = useRef<NodeJS.Timeout>();
  const priceInterval = useRef<NodeJS.Timeout>();
  const priceModel = useRef<PriceModel>({ trend: 'stable', stepsRemaining: 0 });

  const getNewPrice = useCallback((price: number) => {
    let { trend, stepsRemaining } = priceModel.current;

    if (stepsRemaining <= 0) {
      const random = Math.random();
      if (random < 0.3) {
        trend = 'upward';
        stepsRemaining = 5 + Math.floor(Math.random() * 10);
      } else if (random < 0.6) {
        trend = 'downward';
        stepsRemaining = 5 + Math.floor(Math.random() * 10);
      } else {
        trend = 'stable';
        stepsRemaining = 3 + Math.floor(Math.random() * 5);
      }
    } else {
        stepsRemaining--;
    }

    priceModel.current = { trend, stepsRemaining };

    const majorVolatility = 0.003;
    const minorVolatility = 0.001;
    let changePercent = 0;

    switch (trend) {
        case 'upward': changePercent = (Math.random() * majorVolatility) + (minorVolatility / 2); break;
        case 'downward': changePercent = -(Math.random() * majorVolatility) - (minorVolatility / 2); break;
        case 'stable': changePercent = (Math.random() - 0.5) * minorVolatility; break;
    }

    let newPrice = price * (1 + changePercent);
    newPrice = Math.max(1, newPrice);
    return newPrice;
  }, []);

  const stopIntervals = () => {
    if (priceInterval.current) clearInterval(priceInterval.current);
    if (timerInterval.current) clearInterval(timerInterval.current);
  }

  const endGame = useCallback(() => {
      stopIntervals();
      setGameState('finished');
      
      const numericalGuessedPrice = parseFloat(guessedPrice) || 0;
      const actualDirection = currentPrice > marketPrice ? 'up' : currentPrice < marketPrice ? 'down' : 'stable';
      const isDirectionCorrect = actualDirection === directionGuess;
      
      let priceAccuracy = 100;
      if (numericalGuessedPrice > 0) {
        const priceDifference = Math.abs(currentPrice - numericalGuessedPrice);
        priceAccuracy = (priceDifference / currentPrice) * 100; // as a percentage
      }

      const isAccuracyMet = priceAccuracy <= 1; // Within 1%

      const result: GameResult = {
          finalPrice: currentPrice,
          guessedPrice: numericalGuessedPrice,
          actualDirection,
          guessedDirection: directionGuess,
          isWinner: false,
          prize: 0,
          priceAccuracy,
      }

      if (!isGuessLocked || !guessedPrice || !directionGuess) {
        toast({ variant: "destructive", title: "Time's up!", description: "You didn't lock in a complete guess." });
      } else if (isDirectionCorrect && isAccuracyMet) {
        addShots(GRAND_PRIZE);
        result.isWinner = true;
        result.prize = GRAND_PRIZE;
        toast({ title: "You Won!", description: `A perfect prediction! You've won ${GRAND_PRIZE} Shots!` });
      } else if (!isDirectionCorrect) {
        toast({ variant: "destructive", title: "Wrong Direction!", description: `So close! Your price guess was only off by ${priceAccuracy.toFixed(1)}%!` });
      } else {
         toast({ variant: "destructive", title: "Right Direction, Wrong Price", description: `You had the right trend, but your price was off. Keep trying!` });
      }
       setGameResult(result);
  }, [addShots, toast, currentPrice, marketPrice, directionGuess, guessedPrice, isGuessLocked]);

  useEffect(() => {
    if (gameState === 'playing') {
      priceInterval.current = setInterval(() => {
        setCurrentPrice(prevPrice => {
            const newPrice = getNewPrice(prevPrice);
            setPriceHistory(prevHistory => [...prevHistory.slice(1), { time: prevHistory[prevHistory.length - 1].time + 1, price: newPrice }]);
            return newPrice;
        });
      }, 1000 + Math.random() * 500);
    }
    return () => { if (priceInterval.current) clearInterval(priceInterval.current); }
  }, [gameState, getNewPrice]);

  useEffect(() => {
    if (gameState === 'playing' && timer > 0) {
      timerInterval.current = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer <= 0 && gameState === 'playing') {
      endGame();
    }
    return () => { if (timerInterval.current) clearInterval(timerInterval.current); }
  }, [gameState, timer, endGame]);
  
  const handleStartGame = () => {
    if (shots < 1) {
      toast({ variant: "destructive", title: "Not enough Shots!", description: "You need 1 Shot to play." });
      return;
    }
    spendShot(1);
    setGameState('playing');
    setTimer(GAME_DURATION_SECONDS);
    setMarketPrice(currentPrice);
    setIsGuessLocked(false);
    setGuessedPrice("");
    setDirectionGuess(null);
    setGameResult(null);
  };

  const handleLockGuess = () => {
    if (!guessedPrice || isNaN(parseFloat(guessedPrice))) {
      toast({ variant: "destructive", title: "Invalid Guess", description: "Please enter a valid price." });
      return;
    }
    if (!directionGuess) {
        toast({ variant: "destructive", title: "No Direction", description: "Please select 'Up' or 'Down'." });
        return;
    }
    setIsGuessLocked(true);
    toast({ title: "Guess Locked In!", description: "Good luck!" });
  }

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  
  const renderGameResult = () => {
    if (gameState !== 'finished' || !gameResult) return null;

    if (gameResult.isWinner) {
        return (
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-500">
                    <Trophy size={28} /> 
                    You Won {gameResult.prize} Shots!
                </div>
                <p className="text-muted-foreground">The final price was ${gameResult.finalPrice.toFixed(2)}</p>
                <Button onClick={handleStartGame} size="lg" className="w-full">Play Again</Button>
            </div>
        )
    }

    return (
        <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-destructive">
                <X size={28} /> Not Quite!
            </div>
            <p className="text-muted-foreground">The final price was ${gameResult.finalPrice.toFixed(2)}. You guessed ${gameResult.guessedPrice.toFixed(2)}</p>
             <p className="text-sm text-muted-foreground">
                Your price was off by <span className="font-bold">{gameResult.priceAccuracy.toFixed(1)}%</span>. You said <span className="font-bold">{gameResult.guessedDirection}</span>, it went <span className="font-bold">{gameResult.actualDirection}</span>.
            </p>
            <Button onClick={handleStartGame} size="lg" className="w-full">Play Again</Button>
        </div>
    )
  }

  return (
    <Card className="w-full shadow-2xl border-accent/20">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2"><Trophy className="text-accent" /> Grand Prize: {GRAND_PRIZE} Shots</CardTitle>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Time Left</p>
                <p className={cn("text-2xl font-bold font-mono", timer < 60 && 'text-destructive')}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 relative">
             <ChartContainer config={{ price: { label: "Price", color: "hsl(var(--accent))" } }} className="h-full w-full">
                  <AreaChart data={priceHistory} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chart-fill-crypto" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#chart-fill-crypto)" />
                  </AreaChart>
                </ChartContainer>
            <div className="absolute inset-0 flex items-center justify-center">
                 <span className="font-black tracking-wider text-foreground text-4xl sm:text-5xl lg:text-6xl text-shadow-lg bg-background/50 px-4 py-2 rounded-lg backdrop-blur-sm">${currentPrice.toFixed(2)}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 min-h-[140px] justify-center">
        {gameState === 'idle' && (
            <Button onClick={handleStartGame} size="lg" className="w-full h-14 text-lg">
                <Gamepad className="mr-2"/>
                Play for 1 Shot
            </Button>
        )}
        {gameState === 'playing' && (
            <div className="w-full space-y-4 animate-in fade-in-50">
                <div className="grid grid-cols-2 gap-2">
                    <Button variant={directionGuess === 'up' ? 'default' : 'outline'} onClick={() => setDirectionGuess('up')} disabled={isGuessLocked} size="lg">
                        <ArrowUp className="mr-2 h-5 w-5"/> Up
                    </Button>
                     <Button variant={directionGuess === 'down' ? 'default' : 'outline'} onClick={() => setDirectionGuess('down')} disabled={isGuessLocked} size="lg">
                        <ArrowDown className="mr-2 h-5 w-5"/> Down
                    </Button>
                </div>
                 <Input 
                    type="number"
                    placeholder="Your price guess"
                    className="h-12 text-lg text-center"
                    value={guessedPrice}
                    onChange={(e) => setGuessedPrice(e.target.value)}
                    disabled={isGuessLocked}
                />
                <Button onClick={handleLockGuess} size="lg" className="w-full" disabled={isGuessLocked || !guessedPrice || !directionGuess}>
                    <Target className="mr-2"/>
                    {isGuessLocked ? 'Guess Locked!' : 'Lock in Guess'}
                </Button>
            </div>
        )}
        {gameState === 'finished' && renderGameResult()}

      </CardFooter>
    </Card>
  );
}
