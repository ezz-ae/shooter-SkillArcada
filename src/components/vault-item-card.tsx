"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { useStore, type VaultItem } from "@/lib/store";
import { fetchUpdatedPrice } from "@/app/actions";
import { TrendingDown, TrendingUp, Hourglass, Check } from "lucide-react";
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
  onSelect: (id: string) => void;
}

const TRADE_IN_COOLDOWN_MS = 60 * 1000; // 60 seconds

export function VaultItemCard({
  item,
  isSelected,
  onSelect,
}: VaultItemCardProps) {
  const [currentPrice, setCurrentPrice] = useState(item.pricePaid);
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "stale">(
    "stale"
  );
  const [isPending, startTransition] = useTransition();
  const { tradeIn } = useStore();
  const { toast } = useToast();

  const timeSincePurchase = Date.now() - item.purchaseTimestamp;
  const isCoolingDown = timeSincePurchase < TRADE_IN_COOLDOWN_MS;
  const [cooldownRemaining, setCooldownRemaining] = useState(
    Math.max(0, TRADE_IN_COOLDOWN_MS - timeSincePurchase)
  );

  useEffect(() => {
    const updatePriceInterval = setInterval(() => {
      startTransition(async () => {
        const newPriceData = await fetchUpdatedPrice({
          currentPrice: currentPrice,
        });
        const newPrice = newPriceData.newPrice;

        if (newPrice > currentPrice) setPriceTrend("up");
        else if (newPrice < currentPrice) setPriceTrend("down");
        else setPriceTrend("stale");

        setCurrentPrice(newPrice);
      });
    }, 5000); // Update price every 5 seconds

    let cooldownTimer: NodeJS.Timeout;
    if (isCoolingDown) {
      cooldownTimer = setInterval(() => {
        setCooldownRemaining((prev) => Math.max(0, prev - 1000));
      }, 1000);
    }

    return () => {
      clearInterval(updatePriceInterval);
      if (cooldownTimer) clearInterval(cooldownTimer);
    };
  }, [currentPrice, item.purchaseTimestamp, isCoolingDown]);

  const handleTradeIn = () => {
    tradeIn(item.id, currentPrice);
    toast({
      title: "Trade-in Successful!",
      description: `You received $${currentPrice.toFixed(
        2
      )} in wallet balance for ${item.name}.`,
    });
  };

  const profitLoss = currentPrice - item.pricePaid;
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
        onClick={() => onSelect(item.id)}
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
          Paid: ${item.pricePaid.toFixed(2)}
        </p>
        <div className="mt-2">
          <p className="text-sm font-semibold">Current Value:</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-primary">
              ${currentPrice.toFixed(2)}
            </span>
            {priceTrend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
            {priceTrend === "down" && <TrendingDown className="h-4 w-4 text-destructive" />}
          </div>
          <p className={`text-sm font-bold ${profitColor}`}>
            {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)} (
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
                  You will trade in {item.name} for its current value of{" "}
                  <span className="font-bold text-foreground">
                    ${currentPrice.toFixed(2)}
                  </span>
                  . This amount will be added to your wallet. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleTradeIn}>
                  Confirm Trade-In
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  );
}
