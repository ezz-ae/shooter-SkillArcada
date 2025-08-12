"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { mockProducts, type Product } from "@/lib/products";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";


export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id);
  const { addToVault } = useStore();
  const { toast } = useToast();
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDiscount(Math.floor(Math.random() * 99) + 1);
    }, 100 + Math.random() * 200); // Rapid, random updates

    return () => clearInterval(interval);
  }, []);

  if (!product) {
    notFound();
  }

  const handleBuy = () => {
    const finalPrice = product.marketPrice * (1 - discount / 100);
    addToVault(
      {
        ...product,
        pricePaid: finalPrice,
        purchaseTimestamp: Date.now(),
      },
      discount
    );
    toast({
      title: `Item Vaulted with a ${discount}% discount!`,
      description: `${product.name} has been added to your vault for $${finalPrice.toFixed(2)}.`,
    });
  };

  const finalPrice = product.marketPrice * (1 - discount / 100);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all products
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative h-96 w-full md:h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-lg object-cover shadow-lg"
            data-ai-hint={product.dataAiHint}
          />
        </div>
        <div className="flex flex-col">
          <h1 className="mb-2 text-3xl font-bold lg:text-4xl">{product.name}</h1>
          <p className="mb-6 text-muted-foreground">{product.description}</p>

          <Card className="mb-6">
            <CardHeader>
              <p className="text-sm text-muted-foreground">Market Price</p>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-black">
                  ${product.marketPrice.toFixed(2)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Current potential price after discount
              </p>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold text-primary">
                  ${finalPrice.toFixed(2)}
                </div>
                <div className="flex items-center text-sm font-bold text-green-400">
                  ({discount}% off)
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold relative overflow-hidden"
            onClick={handleBuy}
          >
            <div className="absolute inset-0 w-full h-full">
               <Progress value={discount} className="h-full rounded-md" />
               <div 
                 className="absolute inset-0 bg-primary/30"
                 style={{
                    clipPath: `polygon(0 0, ${discount}% 0, ${discount}% 100%, 0% 100%)`
                 }}
                />
            </div>
            <span className="z-10 relative flex items-center justify-center">
                Buy &amp; Vault It! ({discount}%)
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
