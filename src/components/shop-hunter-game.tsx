
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

const displayableProducts = mockProducts.filter(p => 
    p.category !== 'luckgirls' &&
    !p.game?.includes('riddle') &&
    !p.game?.includes('chess') &&
    !p.game?.includes('maze') &&
    !p.game?.includes('mirror') &&
    p.id !== 'prod_console_01'
);

const shotPrices = [5, 10, 20, 40, 80, 200, 400];

export function ShopHunterGame() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [shotPrice, setShotPrice] = useState(shotPrices[0]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [capturedResult, setCapturedResult] = useState<{ product: Product, price: number } | null>(null);
    
    const animationTimeoutRef = useRef<NodeJS.Timeout>();

    const { spendShot, addToVault } = useStore();
    const { toast } = useToast();
    
    const animateReels = useCallback(() => {
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

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setIsSpinning(true);
    };

    const handleTakeShot = () => {
        if (!isSpinning || !selectedProduct) return;

        if (!spendShot(1)) {
            toast({ variant: "destructive", title: "Not enough Shots!", description: "You need 1 Shot to play." });
            return;
        }

        setIsSpinning(false);
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }
        setCapturedResult({ product: selectedProduct, price: shotPrice });
    };

    const handleVault = () => {
        if (!capturedResult) return;
        
        const success = addToVault({
            ...capturedResult.product,
            pricePaid: capturedResult.price,
            purchaseTimestamp: Date.now(),
        });

        if (success) {
            toast({
                title: "Item Vaulted!",
                description: `Your item has been added to your vault for ${capturedResult.price.toFixed(2)} Shots.`,
            });
        } else {
            toast({ variant: "destructive", title: "Insufficient Shots", description: `You cannot afford this for ${capturedResult.price.toFixed(2)} Shots.` });
        }
        handleCloseDialog();
    };

    const handleCloseDialog = () => {
        setCapturedResult(null);
        if (selectedProduct) {
            setIsSpinning(true);
        }
    };
    
    const handleBackToSelection = () => {
        setSelectedProduct(null);
        setIsSpinning(false);
    }

    if (!selectedProduct) {
        return (
            <Card className="w-full max-w-4xl mx-auto p-4">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Choose Your Hunting Ground</h2>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayableProducts.map(product => (
                        <button key={product.id} onClick={() => handleSelectProduct(product)} className="p-4 bg-secondary rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-secondary/80 transition-colors h-40">
                           <div className="w-full h-16 relative">
                             <Image src={product.imageUrl} alt={product.name} fill className="object-contain" data-ai-hint={product.dataAiHint}/>
                           </div>
                           <p className="text-sm font-semibold text-center mt-2">{product.name}</p>
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
                    <Button variant="link" onClick={handleBackToSelection}>&larr; Change Product</Button>
                </div>
                 <div className="h-40 bg-secondary/50 rounded-xl overflow-hidden relative shadow-inner flex flex-col items-center justify-center p-4">
                     <div className="w-full h-20 relative">
                        <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill className="object-contain" data-ai-hint={selectedProduct.dataAiHint}/>
                     </div>
                    <p className="text-xl font-black font-mono text-foreground text-center mt-2">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground font-semibold">Market Price: ${selectedProduct.marketPrice.toFixed(2)}</p>
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
                        <AlertDialogTitle className={cn("text-center", capturedResult && capturedResult.product.marketPrice > capturedResult.price ? "text-primary" : "text-destructive")}>
                            {capturedResult && capturedResult.product.marketPrice > capturedResult.price ? "Nice Catch!" : "Bad Deal..."}
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    
                    <div className="relative h-64 w-full my-4 rounded-lg overflow-hidden shadow-lg bg-secondary flex flex-col items-center justify-center p-4 gap-4">
                        <div className="w-full h-24 relative">
                            <Image src={capturedResult?.product.imageUrl || ''} alt={capturedResult?.product.name || ''} fill className="object-contain" data-ai-hint={capturedResult?.product.dataAiHint}/>
                        </div>
                        <p className="text-2xl font-bold">{capturedResult?.product.name}</p>
                        <p className="text-lg text-muted-foreground">for</p>
                        <p className="text-4xl font-black shimmer-text">{capturedResult?.price.toFixed(2)} Shots</p>
                    </div>

                    <AlertDialogDescription className="text-center">
                        You captured the <span className="font-bold text-foreground">{capturedResult?.product.name}</span> for <span className="font-bold text-foreground">{capturedResult?.price.toFixed(2)} Shots</span>.
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
