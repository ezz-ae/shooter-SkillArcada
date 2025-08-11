
"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { VaultItemCard } from "@/components/vault-item-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { X, ArrowLeft } from "lucide-react";
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

export default function VaultPage() {
  const { vault, shippingCart, moveToShipping, removeFromShipping, confirmShipping } = useStore();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading skeleton
  }
  
  const handleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
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

  const getVaultItemKey = (item: { id: string; purchaseTimestamp: number }) => {
    return `${item.id}-${item.purchaseTimestamp}`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">My Vault</h1>
      <p className="text-muted-foreground mb-6">Items you've purchased. Trade them in for current value or ship them home.</p>
      
      {vault.length === 0 && shippingCart.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">Your Vault is Empty</h2>
          <p className="text-muted-foreground mt-2">Go find some lucky deals!</p>
          <Button asChild className="mt-4">
            <a href="/">Start Shopping</a>
          </Button>
        </div>
      )}

      {vault.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vault.map((item) => (
              <VaultItemCard
                key={getVaultItemKey(item)}
                item={item}
                isSelected={selectedItems.has(getVaultItemKey(item))}
                onSelect={() => onSelect(getVaultItemKey(item))}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={handleMoveToShipping} disabled={selectedItems.size === 0}>
              Move {selectedItems.size} Item(s) to Shipping
            </Button>
          </div>
        </>
      )}

      {shippingCart.length > 0 && (
        <div className="mt-12">
            <Separator />
            <h2 className="text-2xl font-bold my-6">Ready to Ship ({shippingCart.length}/3)</h2>
            <div className="space-y-4">
                {shippingCart.map(item => (
                    <div key={item.shippingId} className="flex items-center justify-between p-4 bg-card rounded-lg shadow-md">
                        <div className="flex items-center gap-4">
                            <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-cover" data-ai-hint={item.dataAiHint} />
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Paid: ${item.pricePaid.toFixed(2)}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleMoveToVault(item.shippingId)}>
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Move back to vault</span>
                        </Button>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-end">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button size="lg" variant="default" disabled={shippingCart.length === 0}>Confirm Shipment</Button>
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
            </div>
        </div>
      )}
    </div>
  );
}
