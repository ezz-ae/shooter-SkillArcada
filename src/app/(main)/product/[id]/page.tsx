
"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { Product, getProducts } from "@/lib/products";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Gamepad2, Zap, Tag, Clock, TrendingUp, Bot } from "lucide-react";
import { ShotTaker } from "@/components/shot-taker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { AIGameGuide } from "@/components/ai-game-guide";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const allProducts = await getProducts();
      const foundProduct = allProducts.find((p) => p.id === params.id) || null;
      setProduct(foundProduct);
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper skeleton loader
  }

  if (!product) {
    notFound();
  }

  const renderHowToPlay = () => {
    return (
        <p>
            {product.expertSystem}
        </p>
    )
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all products
        </Link>
      </div>

       <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl lg:text-4xl font-black">{product.name}</h1>
            <h3 className="text-lg font-bold text-muted-foreground">{product.subtitle}</h3>
             <Card>
              <CardHeader>
                  <CardTitle>Product Details</CardTitle>
              </CardHeader>
               <CardContent className="space-y-4">
                  <div className="prose prose-invert max-w-none text-muted-foreground">
                      <p>{product.description}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <div>
                              <p className="font-semibold">Original Price</p>
                              <p className="text-muted-foreground">${product.marketPrice.toFixed(2)}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-2">
                           <TrendingUp className="h-4 w-4 text-primary" />
                           <div>
                              <p className="font-semibold">Max Discount</p>
                              <p className="text-muted-foreground">Up to 95% off</p>
                          </div>
                      </div>
                       <div className="flex items-center gap-2">
                           <Clock className="h-4 w-4 text-primary" />
                           <div>
                              <p className="font-semibold">Delivery</p>
                              <p className="text-muted-foreground">Instant to Vault</p>
                          </div>
                      </div>
                  </div>
              </CardContent>
           </Card>
        </div>
        <div className="flex flex-col space-y-8">
           <div>
            <h2 className="text-sm uppercase text-muted-foreground font-semibold mb-2">Live Price</h2>
            <ShotTaker product={product} view="chart" />
           </div>
           
           <Card className="mt-12">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Zap className="h-6 w-6 text-primary" /> Product ShooterGun</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 items-center">
                    <div className="bg-secondary/50 p-6 rounded-lg">
                        <h4 className="font-bold flex items-center mb-2 text-lg">
                            {product.game ? <Gamepad2 className="mr-2 h-5 w-5" /> : <HelpCircle className="mr-2 h-5 w-5" />}
                            How It Works
                        </h4>
                        <div className="text-muted-foreground space-y-2">
                            {renderHowToPlay()}
                        </div>
                    </div>

                    <div className="p-4">
                    <ShotTaker product={product} view="actions" />
                    </div>
                </div>
            </CardContent>
        </Card>
        </div>
      </div>

        <Card className="mt-12">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    AI Game Guide
                </CardTitle>
            </CardHeader>
            <CardContent>
                <AIGameGuide 
                    gameName={product.name}
                    gameDescription={product.description}
                    expertSystem={product.expertSystem}
                />
            </CardContent>
        </Card>
    </div>
  );
}
