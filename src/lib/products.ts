import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from './firebase'; // Import the initialized app

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  marketPrice: number;
  imageUrl: string;
  dataAiHint: string;
  expertSystem: string;
  game?: 'reel-pause' | 'multi-shot' | 'riddle-calc' | 'draw-passcode' | 'chess-mate' | 'time-challenge' | 'pink-cups' | 'snake-and-stairs' | 'ai-adventure' | 'maze-draw';
  category?: 'luckshot' | 'brainshot' | 'luckgirls' | 'chess';
}

const db = getFirestore(app); // Use the imported, initialized app

export async function getProducts(): Promise<Product[]> {
  // Mock data for products. In a real app, this would fetch from Firestore.
  // const productsCol = collection(db, 'products');
  // const productsSnapshot = await getDocs(productsCol);
  // const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  // return productsList;
  return Promise.resolve(mockProducts);
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
    expertSystem: 'The price is hidden behind a fast-spinning reel of numbers. Click the "Pause" button to freeze the reel at the perfect moment. Then, select three digits to form your price. Can you time it right to score a massive discount?',
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
    expertSystem: "This item's price is locked behind a riddle. Click \"Start Riddle\" to see the clues and begin the timer. Use the on-card calculator to punch in the correct answer. If you solve it, you can buy the item for a fixed, low price.",
    game: 'riddle-calc',
    category: 'brainshot',
  },
  {
    id: 'prod_math_01',
    name: 'MathMoney Challenge',
    subtitle: 'Win $100!',
    description: "Solve the math problem to win a $100 prize, credited as 100 Shots to your account.",
    marketPrice: 100.0,
    imageUrl: 'https://placehold.co/600x400/2196F3/FFFFFF/png?text=Math',
    dataAiHint: 'math equations',
    expertSystem: "This item's price is locked behind a riddle. Click \"Start Riddle\" to see the clues and begin the timer. Use the on-card calculator to punch in the correct answer. If you solve it, you can buy the item for a fixed, low price.",
    game: 'riddle-calc',
    category: 'brainshot',
  },
  {
    id: 'prod_headset_01',
    name: 'VR Headset',
    subtitle: 'Immersive Virtual Reality',
    description: 'Step into new worlds with this high-end VR headset, featuring stunning visuals and intuitive controls.',
    marketPrice: 499.0,
    imageUrl: 'https://placehold.co/600x400/5E35B1/FFFFFF/png?text=VR',
    dataAiHint: 'vr headset',
    expertSystem: "A secret pattern is the key to this item's price. Click \"Start Challenge\" and a pattern will flash on screen. Memorize it, then draw it on the 3x3 grid. If you replicate it correctly, you unlock the chance to buy the item for a steal.",
    game: 'draw-passcode',
    category: 'brainshot',
  },
   {
    id: 'prod_maze_01',
    name: '$5 Prize Voucher',
    subtitle: 'Solve the Pathfinder Maze',
    description: 'Navigate the maze from start to finish to win a $5 voucher, credited as 5 Shots to your account.',
    marketPrice: 5.0,
    imageUrl: 'https://placehold.co/600x400/009688/FFFFFF/png?text=Maze',
    dataAiHint: 'maze labyrinth',
    expertSystem: 'This is a timed Pathfinder puzzle. Click "Start Game" and draw the correct path from the start point (S) to the end point (E) before the timer runs out. If you succeed, you win the prize!',
    game: 'maze-draw',
    category: 'brainshot',
  },
  {
    id: 'prod_console_01',
    name: 'Gaming Console',
    subtitle: 'Next-Generation Gaming',
    description: 'Experience lightning-fast loading and breathtaking graphics with the latest gaming console.',
    marketPrice: 599.0,
    imageUrl: 'https://placehold.co/600x400/1E88E5/FFFFFF/png?text=Console',
    dataAiHint: 'gaming console',
    expertSystem: 'Instead of one, you get three shots at a great price! Click the "x3 Shot" button to capture three different prices simultaneously. Review the three options and pick the best one to add to your vault. More chances, more luck!',
    game: 'multi-shot',
    category: 'luckshot',
  },
   {
    id: 'prod_chess_01',
    name: '500 Shots Prize',
    subtitle: 'Solve for Checkmate',
    description: 'A special chess puzzle. Find the checkmate in one move to win a massive prize of 500 Shots.',
    marketPrice: 500,
    imageUrl: 'https://placehold.co/600x400/795548/FFFFFF/png?text=Chess',
    dataAiHint: 'chess board',
    expertSystem: 'This is a "Checkmate in One" puzzle. You are playing as White. Analyze the board and make the single move that puts the Black king in checkmate. If you find the correct move, you instantly win the prize.',
    game: 'chess-mate',
    category: 'brainshot',
  },
  {
    id: 'prod_chess_challenge_01',
    name: 'Head-to-Head Chess',
    subtitle: '1v1 Puzzle Speedrun',
    description: 'Challenge another player to a head-to-head chess puzzle speedrun. First to solve wins the prize.',
    marketPrice: 100, // Represents the prize pool
    imageUrl: 'https://placehold.co/600x400/795548/FFFFFF/png?text=Chess',
    dataAiHint: 'chess board',
    expertSystem: 'This is a "Checkmate in One" puzzle. You are playing as White. Analyze the board and make the single move that puts the Black king in checkmate. If you find the correct move, you instantly win the prize.',
    game: 'chess-mate',
    category: 'chess',
  },
  {
    id: 'prod_laptop_01',
    name: 'Gaming Laptop',
    subtitle: 'Power on the Go',
    description: 'A high-performance gaming laptop with a top-of-the-line GPU and a high-refresh-rate screen.',
    marketPrice: 1999.0,
    imageUrl: 'https://placehold.co/600x400/43A047/FFFFFF/png?text=Laptop',
    dataAiHint: 'gaming laptop',
    expertSystem: 'The price of this item is constantly changing. Watch the chart and click the "Shot" button when you see a price you like. This captures the price, giving you the option to buy the item for that amount and add it to your vault.',
    category: 'luckshot',
  },
   {
    id: 'prod_luckgirl_01',
    name: 'Time Challenge',
    subtitle: 'Beat the clock!',
    description: 'A fast-paced puzzle game. Solve as many mini-puzzles as you can before the time runs out.',
    marketPrice: 10,
    imageUrl: 'https://placehold.co/600x400/f472b6/ffffff/png?text=Time',
    dataAiHint: 'stopwatch clock',
    expertSystem: 'A fast-paced puzzle game. Solve as many mini-puzzles as you can before the time runs out.',
    game: 'time-challenge',
    category: 'luckgirls',
  },
  {
    id: 'prod_luckgirl_02',
    name: 'Pink Cups',
    subtitle: 'Find the lucky cup!',
    description: 'A classic shell game with a fun twist. Keep your eye on the pink cup to win the prize.',
    marketPrice: 10,
    imageUrl: 'https://placehold.co/600x400/ec4899/ffffff/png?text=Cups',
    dataAiHint: 'pink cups',
    expertSystem: 'A classic shell game with a fun twist. Keep your eye on the pink cup to win the prize.',
    game: 'pink-cups',
    category: 'luckgirls',
  },
   {
    id: 'prod_luckgirl_03',
    name: 'Snake and Stairs',
    subtitle: 'Social board game',
    description: 'A social board game where you can chat with your opponent and the audience. Roll the dice and climb to victory!',
    marketPrice: 10,
    imageUrl: 'https://placehold.co/600x400/8b5cf6/ffffff/png?text=Board',
    dataAiHint: 'board game',
    expertSystem: 'A social board game where you can chat with your opponent and the audience. Roll the dice and climb to victory!',
    game: 'snake-and-stairs',
    category: 'luckgirls',
  },
  {
    id: 'prod_adventure_01',
    name: "The Adventurer's Golden Key",
    subtitle: 'Unlock a special prize',
    description: 'A key that unlocks a special prize for those who can prove their creativity in the AI Adventure.',
    marketPrice: 50,
    imageUrl: 'https://placehold.co/600x400/FFD700/000000/png?text=Key',
    dataAiHint: 'golden key fantasy',
    expertSystem: 'The AI has started a story and created an image. It\'s up to you to write the perfect ending.',
    game: 'ai-adventure',
    category: 'brainshot',
  },
];
