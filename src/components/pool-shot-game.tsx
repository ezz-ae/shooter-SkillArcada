
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Check, X, MousePointer, TrendingUp, Target, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

type GameState = 'idle' | 'placing' | 'aiming' | 'charging' | 'shot' | 'won' | 'lost';

export function PoolShotGame() {
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [cueBallPosition, setCueBallPosition] = useState({ x: 25, y: 50 });
  const [cueRotation, setCueRotation] = useState(0);
  const [shotPower, setShotPower] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  
  const tableRef = useRef<HTMLDivElement>(null);
  const powerIntervalRef = useRef<NodeJS.Timeout>();
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({}).current;

  const { luckshots, spendLuckshot, addLuckshots } = useStore();
  const { toast } = useToast();

  const prize = level * 10;
  const cost = level;
  
  const playSound = useCallback((sound: 'strike' | 'sink' | 'clack') => {
    if (isMuted) return;
    let audioSrc = '';
    switch(sound) {
        case 'strike': audioSrc = '/sounds/pool-cue-strike.mp3'; break;
        case 'sink': audioSrc = '/sounds/pool-ball-sink.mp3'; break;
        case 'clack': audioSrc = '/sounds/pool-ball-clack.mp3'; break;
    }

    if (!audioRefs[sound]) {
        audioRefs[sound] = new Audio(audioSrc);
    }
    audioRefs[sound]?.play().catch(e => console.error("Error playing sound", e));
  }, [isMuted, audioRefs]);

  const handleStartPlacing = () => {
    if (luckshots < cost) {
      toast({
        variant: "destructive",
        title: "Not enough Luckshots!",
        description: `You need ${cost} Luckshot(s) to play this level.`,
      });
      return;
    }
    setGameState('placing');
  }

  const handleTableClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'placing' || !tableRef.current) return;

    const rect = tableRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Restrict placement to the "kitchen" (left 30% of the table)
    if (x < 30) {
      setCueBallPosition({ x, y });
      setGameState('aiming');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'aiming' || !tableRef.current) return;

    const rect = tableRef.current.getBoundingClientRect();
    const ballX = rect.left + (cueBallPosition.x / 100) * rect.width;
    const ballY = rect.top + (cueBallPosition.y / 100) * rect.height;

    const angle = Math.atan2(e.clientY - ballY, e.clientX - ballX) * (180 / Math.PI);
    setCueRotation(angle);
  };
  
  const startCharging = () => {
    if (gameState !== 'aiming') return;

    setGameState('charging');
    let direction = 1;
    powerIntervalRef.current = setInterval(() => {
        setShotPower(prev => {
            if(prev >= 100) direction = -1;
            if(prev <= 0) direction = 1;
            return prev + (direction * 2);
        });
    }, 10);
  }

  const handleShotRelease = () => {
    if (gameState !== 'charging') return;
    
    clearInterval(powerIntervalRef.current);
    
    const shotTaken = spendLuckshot(cost);
    if (!shotTaken) {
      toast({
        variant: "destructive",
        title: "Shot Failed",
        description: "Could not spend Luckshots. Please try again.",
      });
      resetGame();
      return;
    }
    
    playSound('strike');
    setGameState('shot');
    
    // Simulate shot outcome
    setTimeout(() => {
        // Higher power and more direct aim increases chance of winning
        const anglePenalty = Math.min(Math.abs(cueRotation) / 90, 1) * 0.4; // Penalty up to 40% for 90deg angle
        const perfectPower = 85;
        const powerDifference = Math.abs(shotPower - perfectPower);
        const powerPenalty = (powerDifference / perfectPower) * 0.5; // Penalty up to 50%
        const levelPenalty = (level - 1) * 0.05;
        const successChance = 0.85 - anglePenalty - powerPenalty - levelPenalty;
        
        const success = Math.random() < successChance;
        if (success) {
            addLuckshots(prize);
            playSound('sink');
            setGameState('won');
        } else {
            playSound('clack');
            setGameState('lost');
        }
    }, 2000);
  }

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    resetGame();
  }
  
  const resetGame = () => {
    setGameState('idle');
    setShotPower(0);
    setCueRotation(0);
  }

  const renderGameStateUI = () => {
    switch(gameState) {
        case 'idle':
            return (
                 <div className="text-center w-full space-y-2">
                    <Button onClick={handleStartPlacing} size="lg" className="w-full">
                        <Target className="mr-2 h-5 w-5"/>
                        Play for {cost} Luckshot{cost > 1 ? 's' : ''}
                    </Button>
                </div>
            )
        case 'placing':
            return (
                <div className="text-center w-full space-y-2 text-muted-foreground animate-pulse">
                    <MousePointer size={28} className="mx-auto" />
                    <p className="font-bold">Place the cue ball behind the line.</p>
                </div>
            )
        case 'aiming':
             return (
                <div className="text-center w-full space-y-2 text-muted-foreground animate-pulse">
                    <p className="font-bold">Aim with your mouse. Click to start power meter.</p>
                </div>
            )
        case 'charging':
            return (
                <div className="text-center w-full space-y-2 text-muted-foreground">
                    <p className="font-bold animate-pulse">Click again to set power!</p>
                </div>
            )
        case 'shot':
            return <div className="text-center w-full space-y-2 text-muted-foreground"><p className="font-bold">Shot away!</p></div>
        case 'won':
             return (
                <div className="text-center w-full space-y-2">
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-500">
                        <Check size={28} /> You Won {prize} Shots!
                    </div>
                    <Button onClick={handleNextLevel} size="lg" className="w-full">
                        <TrendingUp className="mr-2 h-5 w-5"/>
                        Next Level
                    </Button>
                </div>
            )
        case 'lost':
            return (
                <div className="text-center w-full space-y-2">
                    <div className="flex items-center justify-center gap-2 text-2xl font-bold text-destructive">
                        <X size={28} /> Missed!
                    </div>
                    <Button onClick={resetGame} size="lg" className="w-full">Try Again</Button>
                </div>
            )
        default:
            return null;
    }
  }

  return (
    <Card className="w-full shadow-2xl select-none">
      <CardHeader>
        <div className="flex justify-between items-center">
            <CardTitle>Level {level}</CardTitle>
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setIsMuted(prev => !prev)}>
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5 text-primary"/>}
                    <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                </Button>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Prize</p>
                    <p className="text-2xl font-bold text-primary">{prize} Shots</p>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
            ref={tableRef}
            className={cn(
                "aspect-[2/1] bg-green-700 border-[16px] border-[#6b4226] rounded-xl overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]",
                gameState === 'placing' ? 'cursor-crosshair' : 'cursor-none'
            )}
            onClick={gameState === 'placing' ? handleTableClick : (gameState === 'charging' ? handleShotRelease : undefined)}
            onMouseDown={gameState === 'aiming' ? startCharging : undefined}
            onMouseMove={handleMouseMove}
        >
            {/* Table Markings */}
            <div className="absolute left-[30%] top-0 bottom-0 w-px bg-white/20"></div>

            {/* Pockets */}
            {[0, 50, 100].map(top => [0, 100].map(left => (
                <div key={`${top}-${left}`} className="absolute w-12 h-12 bg-black rounded-full" style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    transform: `translate(${left === 0 ? '-50%' : '-50%'}, ${top === 0 ? '-50%' : top === 50 ? '-50%' : '-50%'})`
                }}></div>
            )))}

            {/* 8-Ball */}
            <div className={cn(
                "absolute w-8 h-8 rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs transition-all duration-1000",
                "bg-black left-[75%] top-1/2 -translate-x-1/2 -translate-y-1/2",
                gameState === 'shot' && gameState === 'won' && "animate-8-ball-sink"
            )}>
                8
            </div>
            
            {/* Cue Ball & Stick */}
            {gameState !== 'idle' && gameState !== 'placing' && (
              <div
                  className="absolute w-8 h-8 bg-white rounded-full shadow-lg transition-transform duration-1000"
                  style={{ 
                      left: `${cueBallPosition.x}%`, 
                      top: `${cueBallPosition.y}%`,
                      transform: `translate(-50%, -50%)`,
                      transition: 'transform 1s ease-out',
                      ...(gameState === 'shot' && {
                          transform: `translate(calc(${shotPower * 3}% - 50%), calc(${cueRotation/2}% - 50%)) rotate(360deg)`
                      })
                  }}
              >
              </div>
            )}
            {/* Cue Stick */}
            {(gameState === 'aiming' || gameState === 'charging' || gameState === 'shot') && (
                <div className="absolute" style={{left: `${cueBallPosition.x}%`, top: `${cueBallPosition.y}%`}}>
                    <div className={cn(
                        "absolute h-1.5 w-96 bg-gradient-to-r from-[#c5a378] to-[#a17e56] rounded-full origin-right transition-all duration-100 shadow-lg",
                        "right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2",
                        "transform-gpu",
                        gameState === 'shot' && 'animate-cue-stick-release',
                    )}
                    style={{
                        transform: `rotate(${cueRotation}deg) ${gameState === 'charging' ? `translateX(${shotPower/3}px)` : ''}`,
                        '--shot-power-release': `${shotPower*1.5}px`
                    } as React.CSSProperties}>
                    </div>
                </div>
            )}

        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 h-28 justify-center items-center">
        {renderGameStateUI()}
        {(gameState === 'charging') && (
            <div className="w-full px-8 flex items-center gap-4">
                <span className="font-bold text-sm text-muted-foreground">Power</span>
                <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-100" style={{width: `${shotPower}%`}}></div>
                </div>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
