
export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  marketPrice: number;
  imageUrl: string;
  dataAiHint: string;
  game?: 'reel-pause' | 'multi-shot' | 'riddle-calc' | 'draw-passcode';
}

export const mockProducts: Product[] = [
  {
    id: 'prod_card_01',
    name: '$100 Amazon Gift Card',
    subtitle: '$100 Gift Card',
    description: 'A prepaid gift card with a $100 balance, redeemable for millions of items on Amazon.com.',
    marketPrice: 100.0,
    imageUrl: 'https://placehold.co/600x400/232F3E/FFFFFF/png?text=Amazon',
    dataAiHint: 'gift card',
  },
  {
    id: 'prod_phone_01',
    name: 'iPhone 16 Pro',
    subtitle: 'The Ultimate Smartphone',
    description: 'The latest and greatest from Apple, featuring the A19 Bionic chip and a revolutionary camera system.',
    marketPrice: 1299.0,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF/png?text=iPhone+16',
    dataAiHint: 'iphone mockup',
    game: 'reel-pause',
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
  },
  {
    id: 'prod_phone_02',
    name: 'Samsung Galaxy S25 Ultra',
    subtitle: 'The Android Powerhouse',
    description: 'The pinnacle of Android technology, with a stunning display, pro-grade cameras, and powerful AI features.',
    marketPrice: 1350.0,
    imageUrl: 'https://placehold.co/600x400/1C1C1C/E0E0E0/png?text=Galaxy',
    dataAiHint: 'android phone',
    game: 'draw-passcode',
  },
  {
    id: 'prod_card_04',
    name: '$250 Mastercard Prepaid Card',
    subtitle: '$250 Prepaid Card',
    description: 'A prepaid card loaded with $250 that can be used anywhere Mastercard is accepted.',
    marketPrice: 250.0,
    imageUrl: 'https://placehold.co/600x400/EB001B/FFFFFF/png?text=Mastercard',
    dataAiHint: 'credit card',
    game: 'multi-shot',
  },
  {
    id: 'prod_card_05',
    name: '$200 PayPal Voucher',
    subtitle: '$200 Voucher',
    description: 'A voucher for $200 to be added to your PayPal balance. Use it for online shopping or send money to friends.',
    marketPrice: 200.0,
    imageUrl: 'https://placehold.co/600x400/003087/FFFFFF/png?text=PayPal',
    dataAiHint: 'paypal logo',
  },
  {
    id: 'prod_crypto_03',
    name: '$500 USDT Voucher',
    subtitle: '$500 USDT Voucher',
    description: 'A voucher for 500 USDT (Tether). A stablecoin pegged to the US dollar, perfect for stable crypto holdings.',
    marketPrice: 500.0,
    imageUrl: 'https://placehold.co/600x400/26A17B/FFFFFF/png?text=USDT',
    dataAiHint: 'usdt crypto',
  },
  {
    id: 'prod_crypto_02',
    name: '$500 Ethereum Voucher',
    subtitle: '$500 ETH Voucher',
    description: 'A voucher redeemable for $500 worth of Ethereum. Perfect for exploring NFTs, dApps, and DeFi.',
    marketPrice: 500.0,
    imageUrl: 'https://placehold.co/600x400/3C3C3D/FFFFFF/png?text=ETH',
    dataAiHint: 'ethereum crypto',
  },
  {
    id: 'prod_phone_03',
    name: 'Google Pixel 9 Pro',
    subtitle: 'Google AI in Your Hand',
    description: 'Experience Google\'s AI-powered camera and the clean, fast Android OS in its purest form.',
    marketPrice: 1199.0,
    imageUrl: 'https://placehold.co/600x400/7C7C7C/FFFFFF/png?text=Pixel',
    dataAiHint: 'google pixel',
  },
  {
    id: 'prod_card_02',
    name: '$100 Steam Gift Card',
    subtitle: '$100 Gaming Card',
    description: 'A gift card with a $100 balance for the ultimate PC gaming platform. Buy games, DLC, and more.',
    marketPrice: 100.0,
    imageUrl: 'https://placehold.co/600x400/1B2838/FFFFFF/png?text=Steam',
    dataAiHint: 'steam logo',
  },
  {
    id: 'prod_card_03',
    name: '$150 Visa Prepaid Card',
    subtitle: '$150 Prepaid Card',
    description: 'A versatile prepaid card with a $150 balance. Use it online or in-store wherever Visa is accepted.',
    marketPrice: 150.0,
    imageUrl: 'https://placehold.co/600x400/1A1F71/FFFFFF/png?text=VISA',
    dataAiHint: 'visa card',
  },
  {
    id: 'prod_card_06',
    name: '$100 Binance Gift Card',
    subtitle: '$100 BUSD Voucher',
    description: 'A gift card for the Binance crypto exchange, perfect for trading or holding various cryptocurrencies.',
    marketPrice: 100.0,
    imageUrl: 'https://placehold.co/600x400/F0B90B/000000/png?text=Binance',
    dataAiHint: 'binance crypto',
  },
];
