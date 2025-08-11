export interface Product {
  id: string;
  name: string;
  marketPrice: number;
  imageUrl: string;
  dataAiHint: string;
}

export const mockProducts: Product[] = [
  {
    id: "prod_001",
    name: "Wireless ANC Headphones",
    marketPrice: 349.99,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "headphones",
  },
  {
    id: "prod_002",
    name: "Smart Fitness Watch",
    marketPrice: 279.5,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "smart watch",
  },
  {
    id: "prod_003",
    name: "4K Action Camera",
    marketPrice: 425.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "action camera",
  },
  {
    id: "prod_004",
    name: "Portable Bluetooth Speaker",
    marketPrice: 129.99,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "bluetooth speaker",
  },
  {
    id: "prod_005",
    name: "Ergonomic Gaming Chair",
    marketPrice: 499.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "gaming chair",
  },
  {
    id: "prod_006",
    name: "Mechanical Keyboard",
    marketPrice: 189.95,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "mechanical keyboard",
  },
  {
    id: "prod_007",
    name: "Ultra-Wide Gaming Monitor",
    marketPrice: 899.99,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "gaming monitor",
  },
  {
    id: "prod_008",
    name: "Professional Drone Kit",
    marketPrice: 1250.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "drone",
  },
];
