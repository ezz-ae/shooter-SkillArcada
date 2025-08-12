
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  marketPrice: number;
  imageUrl: string;
  dataAiHint: string;
  game?: 'reel-pause' | 'multi-shot' | 'riddle-calc' | 'draw-passcode' | 'chess-mate' | 'time-challenge' | 'pink-cups' | 'snake-and-stairs';
  category?: 'luckshot' | 'brainshot' | 'luckgirls';
}

const db = getFirestore(app);

export async function getProducts(): Promise<Product[]> {
  const productsCol = collection(db, 'products');
  const productsSnapshot = await getDocs(productsCol);
  const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  return productsList;
}

// Keep one or two products for fallback or initial state if needed
export const mockProducts: Product[] = [
    {
    id: 'prod_phone_01',
    name: 'iPhone 16 Pro',
    subtitle: 'The Ultimate Smartphone',
    description: 'The latest and greatest from Apple, featuring the A19 Bionic chip and a revolutionary camera system.',
    marketPrice: 1299.0,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF/png?text=iPhone+16',
    dataAiHint: 'iphone mockup',
    game: 'reel-pause',
    category: 'brainshot',
  },
  {
    id: 'prod_crypto_01',
    name: '$500 Bitcoin Voucher',
    subtitle: '$500 BTC Voucher',
    description: "A voucher redeemable for $500 worth of Bitcoin at the current market rate. Your entry into the world of crypto.",
    marketPrice: 500.0,
    imageUrl: 'https://placehold.co/600x400/F7931A/FFFFFF/png?text=BTC',
    dataAiHint: 'bitcoin crypto',
    game: 'riddle-calc',
    category: 'brainshot',
  },
];
