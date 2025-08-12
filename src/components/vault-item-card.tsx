
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { useStore, type VaultItem } from "@/lib/store";
import { TrendingDown, TrendingUp, Hourglass, Check, Gift, Gem } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface VaultItemCardProps {
  item: VaultItem;
  isSelected: boolean;
  onSelect: () => void;
}

const TRADE_IN_COOLDOWN_MS = 60 * 1000; // 60 seconds

export function VaultItemCard({
  item,
  isSelected,
  onSelect,
}: VaultItemCardProps) {
  const [currentValue, setCurrentValue] = useState(item.pricePaid);
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "stale">(
    "stale"
  );
  const { tradeIn } = useStore();
  const { toast } = useToast();

  const timeSincePurchase = Date.now() - item.purchaseTimestamp;
  const isCoolingDown = timeSincePurchase < TRADE_IN_COOLDOWN_MS;
  const [cooldownRemaining, setCooldownRemaining] = useState(
    Math.max(0, TRADE_IN_COOLDOWN_MS - timeSincePurchase)
  );
  
  // This effect simulates the current market value of the item changing over time.
  useEffect(() => {
    const updatePriceInterval = 5000 + Math.random() * 2000;
    const interval = setInterval(() => {
      const volatility = 0.1; // 10% volatility
      const changePercent = (Math.random() - 0.5) * volatility;
      const changeAmount = currentValue * changePercent;
      
      let newValue = currentValue + changeAmount;
      newValue = Math.max(item.marketPrice * 0.5, newValue); 
      newValue = Math.max(1, newValue);

      if (newValue > currentValue) setPriceTrend("up");
      else if (newValue < currentValue) setPriceTrend("down");
      else setPriceTrend("stale");

      setCurrentValue(newValue);

    }, updatePriceInterval);

    let cooldownTimer: NodeJS.Timeout;
    if (isCoolingDown) {
      cooldownTimer = setInterval(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 1000));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
      if (cooldownTimer) clearInterval(cooldownTimer);
    };
  }, [currentValue, item.purchaseTimestamp, isCoolingDown, item.marketPrice]);

  const handleTradeIn = (tradeInForShots: boolean) => {
    const vaultItemKey = `${item.id}-${item.purchaseTimestamp}`;
    const tradeInValue = tradeInForShots ? Math.round(currentValue) : 20;
    tradeIn(vaultItemKey, tradeInValue);

    if (tradeInForShots) {
       toast({
        title: "Trade-in Successful!",
        description: `You received ${tradeInValue.toFixed(2)} Shots for ${item.name}.`,
      });
    } else {
        toast({
            title: "Trade-in Successful!",
            description: `You received 20 Luckshots for ${item.name}. This is a legacy option.`,
        });
    }
  };

  const profitLoss = currentValue - item.pricePaid;
  const profitLossPercent = (profitLoss / item.pricePaid) * 100;
  const profitColor =
    profitLoss > 0
      ? "text-green-500"
      : profitLoss < 0
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden shadow-lg transition-all duration-300 relative",
        isSelected && "ring-2 ring-accent"
      )}
    >
      <button
        onClick={onSelect}
        className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full border bg-card flex items-center justify-center"
        aria-label={isSelected ? "Deselect item" : "Select item"}
      >
        {isSelected && <Check className="h-4 w-4 text-accent" />}
      </button>

      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            data-ai-hint={item.dataAiHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pb-2">
        <h3 className="font-bold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          Paid: {item.pricePaid.toFixed(2)} Shots
        </p>
        <div className="mt-2">
          <p className="text-sm font-semibold">Current Value (Shots):</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">
              {currentValue.toFixed(2)}
            </span>
            {priceTrend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
            {priceTrend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
          </div>
          <p className={`text-sm font-bold ${profitColor}`}>
            {profitLoss >= 0 ? "+" : ""}{profitLoss.toFixed(2)} (
            {profitLossPercent.toFixed(1)}%)
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isCoolingDown ? (
          <Button disabled className="w-full">
            <Hourglass className="mr-2 h-4 w-4 animate-spin" />
            Trade-in cools down... ({Math.floor(cooldownRemaining / 1000)}s)
          </Button>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Trade-In
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Trade-In?</AlertDialogTitle>
                <AlertDialogDescription>
                    Choose your reward for trading in <strong>{item.name}</strong>. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <AlertDialogAction onClick={() => handleTradeIn(true)} className="h-auto flex flex-col gap-2 p-4">
                    <Gem className="h-8 w-8 text-primary"/>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">{currentValue.toFixed(2)} Shots</span>
                        <span className="text-xs text-primary-foreground/80">To Balance</span>
                    </div>
                </AlertDialogAction>
                <AlertDialogAction onClick={() => handleTradeIn(false)} className="h-auto flex flex-col gap-2 p-4">
                    <Gift className="h-8 w-8 text-accent"/>
                     <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">20 Luckshots</span>
                        <span className="text-xs text-primary-foreground/80">Legacy Option</span>
                    </div>
                </AlertDialogAction>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
