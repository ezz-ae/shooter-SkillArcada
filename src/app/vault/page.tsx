
"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { VaultItemCard } from "@/components/vault-item-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Info, Repeat, Gift, Wallet, Target, Gem } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function VaultPage() {
  const { 
    vault, 
    shippingCart, 
    moveToShipping, 
    removeFromShipping, 
    confirmShipping, 
    hasSeenVaultInfo, 
    setHasSeenVaultInfo,
    walletBalance,
    earnedShots,
    redeemEarnedShots
  } = useStore();
  
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!hasSeenVaultInfo) {
      setIsInfoOpen(true);
    }
  }, [hasSeenVaultInfo]);
  
  const earnedShotsValue = isClient ? (earnedShots * 0.5).toFixed(2) : "0.00";
  const canRedeem = isClient && parseFloat(earnedShotsValue) >= 10;

  const getVaultItemKey = (item: { id: string; purchaseTimestamp: number }) => {
    return `${item.id}-${item.purchaseTimestamp}`;
  }

  const handleSelect = (vaultItemKey: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(vaultItemKey)) {
        newSet.delete(vaultItemKey);
      } else {
        newSet.add(vaultItemKey);
      }
      return newSet;
    });
  };

  const handleMoveToShipping = () => {
    if (selectedItems.size === 0) return;
    
    if (shippingCart.length + selectedItems.size > 3) {
      toast({
        variant: "destructive",
        title: "Shipping Limit Exceeded",
        description: "You can only have a maximum of 3 items in your shipping cart.",
      });
      return;
    }
    
    const success = moveToShipping(Array.from(selectedItems));
    if (success) {
      toast({
        title: "Items Moved to Shipping",
        description: `${selectedItems.size} item(s) are ready to be shipped.`,
      });
      setSelectedItems(new Set());
    }
  };

  const handleConfirmShipping = () => {
    confirmShipping();
    toast({
      title: "Shipment Confirmed!",
      description: "Your items are on their way.",
    });
  }

  const handleMoveToVault = (shippingId: string) => {
    removeFromShipping(shippingId);
    toast({
      title: "Item Moved to Vault",
      description: "The item has been returned to your vault.",
    });
  }

  const handleRedeem = () => {
    if (!canRedeem) {
      toast({
        variant: "destructive",
        title: "Redemption Failed",
        description: "You need at least $10.00 in Earned Shots value to redeem.",
      });
      return;
    }
    redeemEarnedShots();
    toast({
      title: "Redemption Successful!",
      description: `You've added $${earnedShotsValue} to your wallet.`,
    });
  }

  if (!isClient) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
                <div className="h-8 w-1/4 bg-muted rounded-md mb-2"></div>
                <div className="h-4 w-1/2 bg-muted rounded-md mb-6"></div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
                    <div className="md:col-span-8">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-muted/50 rounded-lg h-96"></div>
                            ))}
                        </div>
                    </div>
                    <div className="md:col-span-4">
                         <div className="bg-muted/50 rounded-lg h-64"></div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AlertDialog open={isInfoOpen} onOpenChange={(open) => {
        if (!open) {
          setIsInfoOpen(false);
          setHasSeenVaultInfo(true);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome to Your Vault!</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <Repeat className="h-8 w-8 text-primary mt-1"/>
                <div>
                  <h3 className="font-bold">Trade-In for Value</h3>
                  <p className="text-sm text-muted-foreground">Don't want an item anymore? Trade it in for its current market value, which fluctuates over time. The money goes straight to your wallet.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Gift className="h-8 w-8 text-accent mt-1"/>
                <div>
                  <h3 className="font-bold">Trade-In for Luckshots</h3>
                   <p className="text-sm text-muted-foreground">Alternatively, you can trade in any item for a flat rate of <span className="font-bold text-accent-foreground">20 Luckshots</span>. A great way to restock if you're running low!</p>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              setIsInfoOpen(false);
              setHasSeenVaultInfo(true);
            }}>Got It!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


      <h1 className="text-3xl font-bold mb-2">My Vault</h1>
      <p className="text-muted-foreground mb-6">Items you've purchased. Trade them in for current value or ship them home.</p>
      
      {vault.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg flex flex-col items-center">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <ShoppingCart className="h-12 w-12 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Your Vault is Empty</h2>
          <p className="text-muted-foreground mt-2">Go find some lucky deals!</p>
          <Button asChild className="mt-4">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        <div className={cn("grid gap-8", vault.length > 0 ? "md:col-span-8" : "md:col-span-12")}>
            {vault.length > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Your Items ({vault.length})</h2>
                        <Button onClick={handleMoveToShipping} disabled={selectedItems.size === 0}>
                            Move {selectedItems.size > 0 ? `(${selectedItems.size})` : ''} to Shipping
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {vault.map((item) => (
                        <VaultItemCard
                            key={getVaultItemKey(item)}
                            item={item}
                            isSelected={selectedItems.has(getVaultItemKey(item))}
                            onSelect={() => handleSelect(getVaultItemKey(item))}
                        />
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className={cn(vault.length > 0 ? "md:col-span-4" : "hidden")}>
             <div className="sticky top-24 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wallet className="text-primary"/> Wallet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black">${isClient ? walletBalance.toFixed(2) : '0.00'}</p>
                        <p className="text-sm text-muted-foreground">Available to spend or withdraw.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gem className="text-accent"/> Earned Shots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-black">{isClient ? earnedShots : 0}</p>
                        <p className="text-sm text-muted-foreground">Value: <span className="font-bold text-foreground">${earnedShotsValue}</span></p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" disabled={!canRedeem} onClick={handleRedeem}>
                            Redeem to Wallet
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Ready to Ship ({shippingCart.length}/3)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {shippingCart.length > 0 ? (
                            <div className="space-y-4">
                                {shippingCart.map(item => (
                                    <div key={item.shippingId} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <Image src={item.imageUrl} alt={item.name} width={48} height={48} className="rounded-md object-cover" data-ai-hint={item.dataAiHint} />
                                            <div>
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">Paid: ${item.pricePaid.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleMoveToVault(item.shippingId)}>
                                            <ArrowLeft className="h-4 w-4" />
                                            <span className="sr-only">Move back to vault</span>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>Select items from your vault to move them here for shipping.</p>
                            </div>
                        )}
                    </CardContent>
                    {shippingCart.length > 0 && (
                         <CardFooter>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="lg" variant="default" className="w-full" disabled={shippingCart.length === 0}>Confirm Shipment</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Your Shipment?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will finalize the shipment for the {shippingCart.length} item(s) in your cart. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleConfirmShipping}>Confirm & Ship</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    )}
                 </Card>
             </div>
        </div>
      </div>
    </div>
  );
}
