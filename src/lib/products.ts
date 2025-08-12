
export interface Product {
  id: string;
  name: string;
  description: string;
  marketPrice: number;
  imageUrl: string;
  dataAiHint: string;
  game?: 'reel-pause' | 'digit-pause' | 'multi-shot' | 'riddle-calc';
}

export const mockProducts: Product[] = [
  {
    id: 'prod_phone_01',
    name: 'iPhone 16 Pro',
    description: 'The latest and greatest from Apple, featuring the A19 Bionic chip and a revolutionary camera system.',
    marketPrice: 1299.0,
    imageUrl: 'https://placehold.co/600x400/333333/FFFFFF/png?text=iPhone+16',
    dataAiHint: 'iphone mockup',
    game: 'digit-pause',
  },
  {
    id: 'prod_crypto_01',
    name: '$500 Bitcoin Voucher',
    description: "A voucher redeemable for $500 worth of Bitcoin at the current market rate. Your entry into the world of crypto.",
    marketPrice: 500.0,
    imageUrl: 'https://placehold.co/600x400/F7931A/FFFFFF/png?text=BTC',
    dataAiHint: 'bitcoin crypto',
    game: 'riddle-calc',
  },
  {
    id: 'prod_card_01',
    name: '$100 Amazon Gift Card',
    description: 'A prepaid gift card with a $100 balance, redeemable for millions of items on Amazon.com.',
    marketPrice: 100.0,
    imageUrl: 'https://placehold.co/600x400/232F3E/FFFFFF/png?text=Amazon',
    dataAiHint: 'gift card',
  },
  {
    id: 'prod_phone_02',
    name: 'Samsung Galaxy S25 Ultra',
    description: 'The pinnacle of Android technology, with a stunning display, pro-grade cameras, and powerful AI features.',
    marketPrice: 1350.0,
    imageUrl: 'https://placehold.co/600x400/1C1C1C/E0E0E0/png?text=Galaxy',
    dataAiHint: 'android phone',
  },
  {
    id: 'prod_card_02',
    name: '$250 Visa Prepaid Card',
    description: 'A prepaid card loaded with $250 that can be used anywhere Visa is accepted, both online and in-store.',
    marketPrice: 250.0,
    imageUrl: 'https://placehold.co/600x400/1A1F71/FFFFFF/png?text=VISA',
    dataAiHint: 'credit card',
    game: 'multi-shot'
  },
  {
    id: 'prod_crypto_02',
    name: '$500 Ethereum Voucher',
    description: 'A voucher redeemable for $500 worth of Ethereum. Perfect for exploring NFTs, dApps, and DeFi.',
    marketPrice: 500.0,
    imageUrl: 'https://placehold.co/600x400/3C3C3D/FFFFFF/png?text=ETH',
    dataAiHint: 'ethereum crypto',
  },
  {
    id: 'prod_phone_03',
    name: 'Google Pixel 9 Pro',
    description: 'The smartest smartphone, powered by Google AI. Unmatched camera quality and seamless software experience.',
    marketPrice: 1199.0,
    imageUrl: 'https://placehold.co/600x400/4285F4/FFFFFF/png?text=Pixel+9',
    dataAiHint: 'google phone',
  },
  {
    id: 'prod_card_03',
    name: '$100 Steam Wallet Card',
    description: 'Load your Steam wallet with $100 to spend on thousands of games, DLC, and in-game items.',
    marketPrice: 100.0,
    imageUrl: 'https://placehold.co/600x400/1B2838/FFFFFF/png?text=Steam',
    dataAiHint: 'gaming card',
  },
];
