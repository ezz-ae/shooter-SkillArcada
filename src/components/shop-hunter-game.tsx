
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Product, getProducts } from "@/lib/products";
import { Button } from "./ui/button";
import { useStore } from "@/lib/store";
import { useNotificationStore } from "@/lib/notification-store";
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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Target, Gem, DollarSign, Loader, Check, X, Tag } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { algorithmicPricing } from "@/ai/flows/algorithmic-pricing-flow";
import { Skeleton } from "./ui/skeleton";
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";

export function ShopHunterGame() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isHunting, setIsHunting] = useState(false);
    const [capturedResult, setCapturedResult] = useState<{ product: Product, price: number, imageUrl: string } | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    
    const { spendShot, addToVault } = useStore();
    const { add: toast } = useNotificationStore();

    useEffect(() => {
      async function fetchAndFilterProducts() {
        try {
          const allProducts = await getProducts();
          // Filter out game-specific or non-physical items
          const huntableProducts = allProducts.filter(p => 
            !p.game && p.category !== 'voucher' && p.category !== 'luckgirls' && p.category !== 'chess'
          );
          setProducts(huntableProducts);
        } catch (error) {
          console.error("Failed to fetch products:", error);
          toast({ variant: "destructive", title: "Error", description: "Could not load products for hunting." });
        } finally {
          setIsLoadingProducts(false);
        }
      }
      fetchAndFilterProducts();
    }, [toast]);
    
    const handleSelectProduct = async (product: Product) => {
        setSelectedProduct(product);
        setGeneratedImageUrl('');
        setIsGeneratingImage(true);
        try {
            const result = await generateProductImage({
                productName: product.name,
                dataAiHint: product.dataAiHint,
            });

            if (!result.imageUrl || result.imageUrl.includes('placehold.co')) {
              throw new Error("Image generation failed to return a valid URL.");
            }
            setGeneratedImageUrl(result.imageUrl);
        } catch (error) {
            console.error("Failed to generate image:", error);
            setGeneratedImageUrl(product.imageUrl); // Store original placeholder to signal failure
            toast({ variant: "destructive", title: "Image Generation Failed", description: "Could not generate a unique image for this product." });
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleTakeShot = async () => {
        if (!selectedProduct) return;

        if (!spendShot(1)) {
            toast({ variant: "destructive", title: "Not enough Shots!", description: "You need 1 Shot to play." });
            return;
        }

        setIsHunting(true);
        try {
            const result = await algorithmicPricing({ marketPrice: selectedProduct.marketPrice });
            setCapturedResult({ product: selectedProduct, price: result.discountPrice, imageUrl: generatedImageUrl });
        } catch (error) {
             console.error("Algorithmic pricing failed:", error);
             toast({ variant: "destructive", title: "AI Error", description: "The pricing AI is unavailable. Please try again." });
        } finally {
            setIsHunting(false);
        }
    };

    const handleVault = () => {
        if (!capturedResult) return;
        
        const success = addToVault({
            ...capturedResult.product,
            pricePaid: capturedResult.price,
            purchaseTimestamp: Date.now(),
            imageUrl: capturedResult.imageUrl, // Save generated image
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
    };
    
    const handleBackToSelection = () => {
        setSelectedProduct(null);
        setGeneratedImageUrl('');
    }

    if (isLoadingProducts) {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="h-48"><CardContent className="p-4"><Skeleton className="w-full h-full" /></CardContent></Card>
          ))}
        </div>
      );
    }

    if (!selectedProduct) {
        return (
            <Card className="w-full max-w-5xl mx-auto p-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Choose Your Target</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {products.map(product => (
                        <button key={product.id} onClick={() => handleSelectProduct(product)} className="p-4 bg-secondary rounded-lg flex flex-col items-center justify-center gap-2 hover:ring-2 hover:ring-primary transition-all h-48 group">
                           <div className="w-full h-24 relative">
                             <div className="w-full h-full bg-secondary/50 flex items-center justify-center rounded-lg">
                                <Tag className="h-10 w-10 text-muted-foreground" />
                            </div>
                           </div>
                           <p className="text-sm font-semibold text-center mt-2 flex-grow">{product.name}</p>
                           <p className="text-xs font-bold text-muted-foreground">${product.marketPrice.toFixed(2)}</p>
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
                    <Button variant="link" onClick={handleBackToSelection}>&larr; Change Target</Button>
                </div>
                 <div className="h-48 bg-secondary/50 rounded-xl overflow-hidden relative shadow-inner flex flex-col items-center justify-center p-4 gap-2">
                     <div className="w-full h-24 relative">
                        {isGeneratingImage ? <Skeleton className="w-full h-full" /> : (
                            generatedImageUrl.includes('placehold.co') ? (
                                <div className="w-full h-full bg-secondary flex items-center justify-center rounded-lg">
                                    <Tag className="h-10 w-10 text-muted-foreground" />
                                </div>
                            ) : (
                                <Image src={generatedImageUrl} alt={selectedProduct.name} fill className="object-contain" data-ai-hint={selectedProduct.dataAiHint}/>
                            )
                        )}
                     </div>
                    <p className="text-xl md:text-2xl font-black text-foreground text-center">{selectedProduct.name}</p>
                    <p className="text-sm text-muted-foreground font-semibold">Market Price: ${selectedProduct.marketPrice.toFixed(2)}</p>
                </div>

                 <div>
                    <Button size="lg" className="w-full h-14 text-lg" onClick={handleTakeShot} disabled={isHunting || isGeneratingImage}>
                        {isHunting ? <Loader className="animate-spin" /> : <><Target className="mr-2 h-6 w-6"/>Take the Shot (1)</>}
                    </Button>
                </div>
            </div>

            <AlertDialog open={!!capturedResult} onOpenChange={(open) => !open && handleCloseDialog()}>
                 <AlertDialogContent onEscapeKeyDown={handleCloseDialog} className="sm:max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className={cn("text-center text-2xl", capturedResult && capturedResult.product.marketPrice > capturedResult.price ? "text-primary" : "text-destructive")}>
                           <span className="flex items-center justify-center gap-2">
                               {capturedResult && capturedResult.product.marketPrice > capturedResult.price ? <><Check/>Nice Catch!</> : <><X/>Bad Deal...</>}
                           </span>
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    
                    <div className="relative h-64 w-full my-2 rounded-lg overflow-hidden shadow-lg bg-secondary flex flex-col items-center justify-center p-4 gap-4">
                        <div className="w-full h-24 relative">
                            {capturedResult?.imageUrl.includes('placehold.co') ? (
                                <div className="w-full h-full bg-background flex items-center justify-center rounded-lg">
                                    <Tag className="h-10 w-10 text-muted-foreground" />
                                </div>
                            ) : (
                                <Image src={capturedResult?.imageUrl || ''} alt={capturedResult?.product.name || ''} fill className="object-contain" data-ai-hint={capturedResult?.product.dataAiHint}/>
                            )}
                        </div>
                        <p className="text-2xl font-bold text-center">{capturedResult?.product.name}</p>
                        <p className="text-lg text-muted-foreground">for</p>
                        <p className="text-4xl font-black shimmer-text">{capturedResult?.price.toFixed(2)} Shots</p>
                    </div>

                    <AlertDialogDescription className="text-center">
                        The AI offered you the <span className="font-bold text-foreground">{capturedResult?.product.name}</span> for <span className="font-bold text-foreground">{capturedResult?.price.toFixed(2)} Shots</span>.
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
