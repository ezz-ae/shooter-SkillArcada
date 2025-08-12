
"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { mockProducts } from "@/lib/products";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ShotTaker } from "@/components/shot-taker";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id);

  if (!product) {
    notFound();
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
            <ShotTaker product={product} isPage={true} />
        </div>
      </div>
    </div>
  );
}

    