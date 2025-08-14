
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Product, mockProducts } from "@/lib/products";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Target, Gift, DollarSign, Check, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const voucherProducts = mockProducts.filter(p => p.category === 'voucher');

const AmazonLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" className="w-full h-full object-contain">
        <text x="5" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">amazon</text>
        <path d="M20,22 Q50,32 80,22" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
    </svg>
);

const WalmartLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" className="w-full h-full object-contain">
        <text x="5" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">Walmart</text>
        <path d="M75 10 L 78 15 L 75 20 L 72 15 Z" fill="hsl(var(--accent))" />
        <path d="M80 10 L 83 15 L 80 20 L 77 15 Z" fill="hsl(var(--accent))" />
        <path d="M85 10 L 88 15 L 85 20 L 82 15 Z" fill="hsl(var(--accent))" />
    </svg>
);

const NoonLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" className="w-full h-full object-contain">
        <circle cx="20" cy="15" r="8" fill="hsl(var(--accent))" />
        <circle cx="35" cy="15" r="8" fill="hsl(var(--accent))" />
        <text x="50" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">noon</text>
    </svg>
);

const TargetLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" className="w-full h-full object-contain">
        <circle cx="15" cy="15" r="10" fill="hsl(var(--destructive))" />
        <circle cx="15" cy="15" r="6" fill="white" />
        <circle cx="15" cy="15" r="3" fill="hsl(var(--destructive))" />
        <text x="30" y="20" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="currentColor">TARGET</text>
    </svg>
);

const stores = [
    { name: "Amazon", LogoComponent: AmazonLogo },
    { name: "Walmart", LogoComponent: WalmartLogo },
    { name: "Noon", LogoComponent: NoonLogo },
    { name: "Target", LogoComponent: TargetLogo },
];

const voucherValues = [10, 25, 50, 100, 200, 500];
const shotPrices = [5, 10, 20, 40, 80, 200, 400];

export function ShopHunterGame() {
    const [selectedStore, setSelectedStore] = useState<(typeof stores)[0] | null>(null);
    const [voucherValue, setVoucherValue] = useState(voucherValues[0]);
    const [shotPrice, setShotPrice] = useState(shotPrices[0]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [capturedResult, setCapturedResult] = useState<{ store: (typeof stores)[0], value: number, price: number } | null>(null);
    
    const animationTimeoutRef = useRef<NodeJS.Timeout>();

    const { spendShot, addToVault } = useStore();
    const { toast } = useToast();
    
    const animateReels = useCallback(() => {
        setVoucherValue(voucherValues[Math.floor(Math.random() * voucherValues.length)]);
        setShotPrice(shotPrices[Math.floor(Math.random() * shotPrices.length)]);
        
        const randomDelay = 100 + Math.random() * 400;
        animationTimeoutRef.current = setTimeout(animateReels, randomDelay);
    }, []);

    useEffect(() => {
        if (isSpinning) {
            animateReels();
        }
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [isSpinning, animateReels]);

    const handleSelectStore = (store: (typeof stores)[0]) => {
        setSelectedStore(store);
        setIsSpinning(true);
    };

    const handleTakeShot = () => {
        if (!isSpinning || !selectedStore) return;

        if (!spendShot(1)) {
            toast({ variant: "destructive", title: "Not enough Shots!", description: "You need 1 Shot to play." });
            return;
        }

        setIsSpinning(false);
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }
        setCapturedResult({ store: selectedStore, value: voucherValue, price: shotPrice });
    };

    const handleVault = () => {
        if (!capturedResult) return;
        const product = voucherProducts.find(p => p.marketPrice === capturedResult.value);

        if (!product) {
            toast({ variant: "destructive", title: "Error", description: "Could not find a matching voucher product." });
            handleCloseDialog();
            return;
        }
        
        const success = addToVault({
            ...product,
            name: `$${capturedResult.value} ${capturedResult.store.name} Voucher`,
            pricePaid: capturedResult.price,
            purchaseTimestamp: Date.now(),
        });

        if (success) {
            toast({
                title: "Voucher Vaulted!",
                description: `Your voucher has been added to your vault for ${capturedResult.price.toFixed(2)} Shots.`,
            });
        } else {
            toast({ variant: "destructive", title: "Insufficient Shots", description: `You cannot afford this for ${capturedResult.price.toFixed(2)} Shots.` });
        }
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setCapturedResult(null);
        if (selectedStore) {
            setIsSpinning(true);
        }
    };
    
    const handleBackToSelection = () => {
        setSelectedStore(null);
        setIsSpinning(false);
    }

    if (!selectedStore) {
        return (
            <Card className="w-full max-w-2xl mx-auto p-4">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Choose Your Hunting Ground</h2>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    {stores.map(store => (
                        <button key={store.name} onClick={() => handleSelectStore(store)} className="p-4 bg-secondary rounded-lg flex flex-col items-center justify-center gap-4 hover:bg-secondary/80 transition-colors h-32">
                           <div className="w-full h-12 relative text-foreground">
                             <store.LogoComponent />
                           </div>
                        </button>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="w-full max-w-md mx-auto bg-card border-2 border-primary/10 rounded-2xl shadow-2xl p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Hunting at {selectedStore.name}</h2>
                    <Button variant="link" onClick={handleBackToSelection}>Change</Button>
                </div>
                 <div className="h-24 bg-secondary/50 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center p-4">
                    <p className="text-6xl font-black font-mono shimmer-text">${voucherValue.toFixed(2)}</p>
                </div>
                 <div className="h-24 w-full bg-secondary/50 rounded-xl overflow-hidden relative shadow-inner flex items-center justify-center">
                    <p className="text-4xl font-black font-mono text-foreground">${shotPrice.toFixed(2)}</p>
                     <span className="absolute bottom-2 text-sm font-semibold text-muted-foreground">Price in Shots</span>
                </div>
                 <div>
                    <Button size="lg" className="w-full h-14 text-lg" onClick={handleTakeShot} disabled={!isSpinning}>
                        <Target className="mr-2 h-6 w-6"/>
                        {isSpinning ? 'Hunt' : 'Spinning...'}
                    </Button>
                </div>
            </div>

            <AlertDialog open={!!capturedResult} onOpenChange={(open) => !open && handleCloseDialog()}>
                 <AlertDialogContent onEscapeKeyDown={handleCloseDialog}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className={cn("text-center", capturedResult && capturedResult.value > capturedResult.price ? "text-primary" : "text-destructive")}>
                            {capturedResult && capturedResult.value > capturedResult.price ? "Nice Catch!" : "Bad Deal..."}
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    
                    <div className="relative h-64 w-full my-4 rounded-lg overflow-hidden shadow-lg bg-secondary flex flex-col items-center justify-center p-4 gap-4">
                        <div className="w-full h-16 relative text-foreground">
                            {capturedResult?.store.LogoComponent ? <capturedResult.store.LogoComponent /> : <p>{capturedResult?.store.name}</p>}
                        </div>
                        <p className="text-4xl font-black shimmer-text">${capturedResult?.value.toFixed(2)}</p>
                        <p className="text-lg text-muted-foreground">for</p>
                        <p className="text-2xl font-bold text-foreground">{capturedResult?.price.toFixed(2)} Shots</p>
                    </div>

                    <AlertDialogDescription className="text-center">
                        You captured a <span className="font-bold text-foreground">${capturedResult?.value.toFixed(2)} {capturedResult?.store.name} voucher</span> for <span className="font-bold text-foreground">{capturedResult?.price.toFixed(2)} Shots</span>.
                    </AlertDialogDescription>
                    
                    <AlertDialogFooter className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <AlertDialogCancel onClick={handleCloseDialog}>Let It Go</AlertDialogCancel>
                        <AlertDialogAction onClick={handleVault}>Vault It!</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
