
"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { mockProducts } from "@/lib/products";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Gamepad2, Zap } from "lucide-react";
import { ShotTaker } from "@/components/shot-taker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const isGame = product.game && ['reel-pause', 'riddle-calc', 'draw-passcode'].includes(product.game);

  const renderHowToPlay = () => {
    switch (product.game) {
      case 'reel-pause':
        return (
          <p>
            The price is hidden behind a fast-spinning reel of numbers. Click the "Pause" button to freeze the reel at the perfect moment. Then, select three digits to form your price. Can you time it right to score a massive discount?
          </p>
        );
      case 'riddle-calc':
        return (
          <p>
            This item's price is locked behind a riddle. Click "Start Riddle" to see the clues and begin the timer. Use the on-card calculator to punch in the correct answer. If you solve it, you can buy the item for a fixed, low price.
          </p>
        );
      case 'draw-passcode':
        return (
          <p>
            A secret pattern is the key to this item's price. Click "Start Challenge" and a pattern will flash on screen. Memorize it, then draw it on the 3x3 grid. If you replicate it correctly, you unlock the chance to buy the item for a steal.
          </p>
        );
      case 'multi-shot':
        return (
          <p>
            Instead of one, you get three shots at a great price! Click the "x3 Shot" button to capture three different prices simultaneously. Review the three options and pick the best one to add to your vault. More chances, more luck!
          </p>
        );
      default:
        return (
          <p>
            The price of this item is constantly changing. Watch the chart and click the "Shot" button when you see a price you like. This captures the price, giving you the option to buy the item for that amount and add it to your vault.
          </p>
        );
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all products
        </Link>
      </div>
       <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
         <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg md:h-full">
           <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.dataAiHint}
          />
           <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-8">
              <h3 className="text-white text-lg font-bold text-center">{product.subtitle}</h3>
           </div>
        </div>
        <div className="flex flex-col">
            {!isGame && <h1 className="mb-2 text-3xl font-bold lg:text-4xl">{product.name}</h1>}
            <ShotTaker product={product} isPage={true} />
        </div>
      </div>
       <Card className="mt-12">
        <CardHeader>
            <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
             <div className="prose prose-invert max-w-none text-muted-foreground">
                <p>{product.description}</p>
            </div>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                     <h3 className="text-lg font-semibold flex items-center mb-2">
                        <Zap className="mr-2 h-5 w-5 text-primary" /> Product Luckshot
                    </h3>
                    <p className="text-muted-foreground">
                        This is how you take a shot at this item.
                    </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                    <h4 className="font-bold flex items-center mb-2">
                         {product.game ? <Gamepad2 className="mr-2 h-4 w-4" /> : <HelpCircle className="mr-2 h-4 w-4" />}
                        How It Works
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-2">
                         {renderHowToPlay()}
                    </div>
                </div>
            </div>
        </CardContent>
       </Card>
    </div>
  );
}
