
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';
import { Check, X, MousePointerClick, TrendingUp } from 'lucide-react';
import { Progress } from './ui/progress';

interface PoolShotGameProps {
}

type GameState = 'placing' | 'aiming' | 'charging' | 'shot' | 'won' | 'lost';

export function PoolShotGame({}: PoolShotGameProps) {
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<GameState>('placing');
  const [cueBallPosition, setCueBallPosition] = useState({ x: 25, y: 50 });
  const [cueRotation, setCueRotation] = useState(0);
  const [shotPower, setShotPower] = useState(0);
  
  const tableRef = useRef<HTMLDivElement>(null);
  const powerIntervalRef = useRef<NodeJS.Timeout>();

  const prize = level * 10;
  const cost = level;

  const handleTableClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'placing' || !tableRef.current) return;

    const rect = tableRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Restrict placement to the left 40% of the table
    if (x < 40) {
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
  
  const handleMouseDown = () => {
    if (gameState !== 'aiming') return;

    setGameState('charging');
    powerIntervalRef.current = setInterval(() => {
        setShotPower(prev => Math.min(prev + 2, 100));
    }, 20);
  }

  const handleMouseUp = () => {
    if (gameState !== 'charging') return;
    
    clearInterval(powerIntervalRef.current);
    setGameState('shot');

    // In a real implementation, we would subtract the cost here.
    
    // Simulate shot outcome
    setTimeout(() => {
        // Higher power and more direct aim increases chance of winning
        const anglePenalty = Math.abs(cueRotation) > 30 ? 0.2 : 0; // Penalty for steep angles
        const powerBonus = shotPower / 200; // Bonus for higher power
        const successChance = 0.5 + powerBonus - anglePenalty;
        
        const success = Math.random() < successChance;
        setGameState(success ? 'won' : 'lost');
    }, 2000);
  }

  const handleNextLevel = () => {
    setLevel(prev => prev + 1);
    resetGame();
  }

  const handleTryAgain = () => {
    resetGame();
  }
  
  const resetGame = () => {
    setGameState('placing');
    setShotPower(0);
    setCueRotation(0);
  }

  // Effect to handle global mouse up to stop charging
  useEffect(() => {
    const onMouseUp = () => handleMouseUp();
    if (gameState === 'charging') {
        window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
        window.removeEventListener('mouseup', onMouseUp);
        if(powerIntervalRef.current) clearInterval(powerIntervalRef.current);
    }
  }, [gameState]);


  const renderGameStateUI = () => {
    switch(gameState) {
        case 'placing':
            return (
                <div className="text-center w-full space-y-2 text-muted-foreground animate-pulse">
                    <MousePointerClick size={28} className="mx-auto" />
                    <p className="font-bold">Place the cue ball on the left side of the table.</p>
                </div>
            )
        case 'aiming':
             return (
                <div className="text-center w-full space-y-2 text-muted-foreground">
                    <p className="font-bold animate-pulse">Aim with your mouse. Click and hold to charge your shot.</p>
                </div>
            )
        case 'charging':
        case 'shot':
            return (
                <div className="w-full px-8">
                  <Progress value={shotPower} className="h-4" />
                </div>
            )
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
                    <Button onClick={handleTryAgain} size="lg" className="w-full">Try Again</Button>
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
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Prize</p>
                <p className="text-2xl font-bold text-primary">{prize} Shots</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
            ref={tableRef}
            className="aspect-[16/9] bg-green-800 border-8 border-[#6b4226] rounded-md overflow-hidden relative flex items-center justify-center p-8 cursor-crosshair"
            onClick={handleTableClick}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
        >
            {/* Pockets */}
            <div className="absolute top-0 left-0 w-8 h-8 bg-black rounded-bl-full"></div>
            <div className="absolute top-0 right-0 w-8 h-8 bg-black rounded-br-full"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 bg-black rounded-tl-full"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-black rounded-tr-full"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-black rounded-b-full"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-black rounded-t-full"></div>

            {/* Cue Ball */}
            <div
                className={cn(
                    "absolute w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-1000",
                    gameState === 'shot' && `animate-cue-ball-release`,
                )}
                style={{ 
                    left: `${cueBallPosition.x}%`, 
                    top: `${cueBallPosition.y}%`,
                    transform: `translate(-50%, -50%) rotate(${cueRotation}deg)`,
                    '--shot-power': `${shotPower * 3}%`,
                } as React.CSSProperties}
            >
             {/* Cue Stick */}
                <div className={cn(
                    "absolute h-2 w-96 bg-gradient-to-r from-yellow-700 to-yellow-900 rounded-full origin-right transition-all duration-100",
                    "right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2",
                    "transform-gpu",
                    gameState === 'placing' && 'opacity-0',
                    gameState === 'aiming' && 'animate-cue-stick-aim-subtle',
                    gameState === 'charging' && 'animate-cue-stick-charge',
                    gameState === 'shot' && 'animate-cue-stick-release',
                )}
                style={{
                    '--shot-power': `-${shotPower/2}px`
                } as React.CSSProperties}
                ></div>
            </div>

             {/* 8-Ball */}
            <div className={cn(
                "absolute w-8 h-8 bg-black rounded-full shadow-md flex items-center justify-center text-white font-bold text-xs",
                "left-[70%] top-1/2 -translate-y-1/2",
                gameState === 'shot' && gameState === 'won' && "animate-8-ball-sink",
            )}>
                8
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 h-24 justify-center items-center">
        {renderGameStateUI()}
         {gameState !== 'placing' && (
            <div className="text-center">
                 <p className="text-sm text-muted-foreground mt-2">Cost: {cost} Shot{cost > 1 ? 's' : ''}</p>
            </div>
         )}
      </CardFooter>
    </Card>
  );
}
