
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
    name: "Vintage 'Cosmic Rift' Arcade Machine",
    marketPrice: 2500.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "arcade machine",
  },
  {
    id: "prod_002",
    name: "Limited Edition Holographic Sneakers",
    marketPrice: 750.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "holographic sneakers",
  },
  {
    id: "prod_003",
    name: "Self-Watering Smart Planter",
    marketPrice: 120.5,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "smart planter",
  },
  {
    id: "prod_004",
    name: "Gourmet Molecular Gastronomy Kit",
    marketPrice: 199.99,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "gastronomy kit",
  },
  {
    id: "prod_005",
    name: "GRAV-LEVITRON Hoverboard",
    marketPrice: 1850.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "hoverboard",
  },
  {
    id: "prod_006",
    name: "Retro-Futuristic Nixie Tube Clock",
    marketPrice: 350.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "nixie clock",
  },
  {
    id: "prod_007",
    name: "AI-Powered Personal Chef Bot",
    marketPrice: 3200.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "robot chef",
  },
  {
    id: "prod_008",
    name: "Signed First Edition 'Neuromancer'",
    marketPrice: 4800.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "rare book",
  },
];
