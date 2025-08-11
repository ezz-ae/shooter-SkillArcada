import { getAlgorithmicPrice } from "@/ai/flows/algorithmic-pricing";
import { ProductCard } from "@/components/product-card";
import { mockProducts, type Product } from "@/lib/products";

async function getProductsWithInitialPrice() {
  const productsWithPrice = await Promise.all(
    mockProducts.map(async (product) => {
      const initialPriceData = await getAlgorithmicPrice({
        marketPrice: product.marketPrice,
      });
      return {
        ...product,
        initialDiscount: initialPriceData.discountPercentage,
      };
    })
  );
  return productsWithPrice;
}

export default async function Home() {
  const products = await getProductsWithInitialPrice();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
