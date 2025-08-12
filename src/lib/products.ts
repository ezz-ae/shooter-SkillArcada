
export interface Product {
  id: string;
  name: string;
  description: string;
  marketPrice: number;
  imageUrl: string;
  dataAiHint: string;
  game?: 'reel-pause' | 'digit-pause' | 'multi-shot';
}

export const mockProducts: Product[] = [
    {
    id: 'prod_020',
    name: 'Portable Fusion Power Bank',
    description:
      "The last power bank you'll ever need. Utilizes a stable, cold fusion reaction to provide a near-limitless supply of clean energy. Can power a small home for a week. Handle with care.",
    marketPrice: 15000.0,
    imageUrl: 'https://placehold.co/600x400/FF4500/FFFFFF/png?text=Fusion',
    dataAiHint: 'fusion generator',
    game: 'digit-pause',
  },
  {
    id: 'prod_001',
    name: "Cosmic Rift Arcade",
    description:
      "A fully restored, original 1983 'Cosmic Rift' arcade cabinet. Features a CRT monitor, authentic joystick and buttons, and the classic 8-bit soundtrack. A true collector's item.",
    marketPrice: 2500.0,
    imageUrl: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Arcade',
    dataAiHint: 'vintage arcade',
  },
  {
    id: 'prod_002',
    name: 'Holographic Sneakers',
    description:
      "Step into the future with these limited run sneakers. The synthetic upper is coated in a light-refractive material that creates a stunning holographic effect with every movement.",
    marketPrice: 750.0,
    imageUrl: 'https://placehold.co/600x400/2E2E2E/E0E0E0/png?text=Sneakers',
    dataAiHint: 'holographic sneakers',
  },
  {
    id: 'prod_003',
    name: 'Smart Planter',
    description:
      'The perfect solution for the forgetful plant parent. This planter uses integrated sensors to detect soil moisture and automatically waters your plants when needed. Connects to your phone via Bluetooth.',
    marketPrice: 120.5,
    imageUrl: 'https://placehold.co/600x400/1A4D2E/F5EFE6/png?text=Plant',
    dataAiHint: 'smart planter',
  },
  {
    id: 'prod_004',
    name: 'Gastronomy Kit',
    description:
      'Transform your kitchen into a food laboratory. This kit includes everything you need to get started with spherification, gelification, and emulsification. Includes a recipe book with 20 mind-bending recipes.',
    marketPrice: 199.99,
    imageUrl: 'https://placehold.co/600x400/4C0B33/F0E4F0/png?text=Gastronomy',
    dataAiHint: 'gastronomy kit',
  },
  {
    id: 'prod_005',
    name: 'GRAV-LEVITRON Hoverboard',
    description:
      'Experience personal levitation with the latest in magnetic field technology. The GRAV-LEVITRON offers a smooth, frictionless ride up to 15cm off the ground. Max speed of 25 km/h.',
    marketPrice: 1850.0,
    imageUrl: 'https://placehold.co/600x400/0D1B2A/E0E1DD/png?text=Hoverboard',
    dataAiHint: 'futuristic hoverboard',
  },
  {
    id: 'prod_006',
    name: 'Nixie Tube Clock',
    description:
      'A stunning conversation piece that blends Cold War-era technology with modern design. Genuine, new-old-stock Nixie tubes display the time in a warm, orange glow. Solid wood base.',
    marketPrice: 350.0,
    imageUrl: 'https://placehold.co/600x400/D4A276/3F2B2B/png?text=Clock',
    dataAiHint: 'nixie clock',
  },
  {
    id: 'prod_007',
    name: 'Personal Chef Bot',
    description:
      "The 'Culinary-tron 5000' can prepare over 10,000 recipes from its internal database. Simply add ingredients and let it do the chopping, mixing, and cooking. Cleans itself after use.",
    marketPrice: 3200.0,
    imageUrl: 'https://placehold.co/600x400/C0C0C0/000000/png?text=Robot',
    dataAiHint: 'robot chef',
  },
  {
    id: 'prod_008',
    name: "Signed 'Neuromancer'",
    description:
      "A rare, signed first edition of William Gibson's seminal cyberpunk novel. In mint condition, complete with original dust jacket. A must-have for any serious science fiction collector.",
    marketPrice: 4800.0,
    imageUrl: 'https://placehold.co/600x400/0000FF/FFFFFF/png?text=Book',
    dataAiHint: 'rare book',
    game: 'multi-shot',
  },
  {
    id: 'prod_009',
    name: 'DIY Gene Editing Kit',
    description:
      'Explore the building blocks of life with this consumer-grade CRISPR-Cas9 gene editing kit. Safely conduct experiments on bacteria at home. Educational use only. Please follow all safety guidelines.',
    marketPrice: 1250.75,
    imageUrl: 'https://placehold.co/600x400/7FFF00/000000/png?text=DNA',
    dataAiHint: 'science kit',
  },
  {
    id: 'prod_010',
    name: 'Weather Control Drone',
    description:
      "The 'Atmo-Sphere 2' can influence a 50-meter radius microclimate. Uses cloud-seeding technology to generate small amounts of rain or ultrasonic waves to dissipate fog. Requires licensing in some areas.",
    marketPrice: 7800.0,
    imageUrl: 'https://placehold.co/600x400/87CEEB/000000/png?text=Drone',
    dataAiHint: 'weather drone',
  },
  {
    id: 'prod_011',
    name: 'Anti-Gravity Yoga Mat',
    description:
      'Enhance your practice by removing the constraints of gravity. This mat uses a gentle repulsor field to create a feeling of weightlessness, deepening stretches and improving balance.',
    marketPrice: 220.0,
    imageUrl: 'https://placehold.co/600x400/DA70D6/FFFFFF/png?text=Yoga',
    dataAiHint: 'yoga mat',
  },
  {
    id: 'prod_012',
    name: 'Zero-G Space Pen',
    description:
      "The classic astronaut's pen. Writes upside down, underwater, and in extreme temperatures thanks to its pressurized ink cartridge. The perfect tool for any situation.",
    marketPrice: 85.0,
    imageUrl: 'https://placehold.co/600x400/708090/FFFFFF/png?text=Pen',
    dataAiHint: 'space pen',
  },
  {
    id: 'prod_013',
    name: "'Pocket Galaxy' Projector",
    description:
      'Project a stunning, rotating 3D model of the Milky Way galaxy in the palm of your hand. A mesmerizing and educational desk toy for all ages.',
    marketPrice: 150.0,
    imageUrl: 'https://placehold.co/600x400/483D8B/FFFFFF/png?text=Galaxy',
    dataAiHint: 'hologram projector',
  },
  {
    id: 'prod_014',
    name: "'Aura' Biometric Ring",
    description:
      'A sleek, minimalist ring that monitors your heart rate, sleep patterns, and body temperature. The exterior surface changes color to reflect your current emotional state.',
    marketPrice: 280.0,
    imageUrl: 'https://placehold.co/600x400/BDB76B/000000/png?text=Ring',
    dataAiHint: 'smart ring',
  },
  {
    id: 'prod_015',
    name: "Levitating Bonsai Pot",
    description:
      'Cultivate a sense of calm with this magical bonsai pot that floats and rotates gently above its magnetic base. A perfect fusion of nature and technology.',
    marketPrice: 180.5,
    imageUrl: 'https://placehold.co/600x400/556B2F/FFFFFF/png?text=Bonsai',
    dataAiHint: 'levitating planter',
  },
  {
    id: 'prod_016',
    name: 'Cryo-Stasis Sleep Pod',
    description:
      'Skip ahead in time with our weekly cryo-stasis rental service. Experience suspended animation in the comfort of your own home. For novelty and entertainment purposes only.',
    marketPrice: 5500.0,
    imageUrl: 'https://placehold.co/600x400/ADD8E6/000000/png?text=Sleep',
    dataAiHint: 'sleep pod',
  },
  {
    id: 'prod_017',
    name: 'Sonic-Cleanse Tool',
    description:
      'Cleans anything at a microscopic level using high-frequency ultrasonic waves. Perfect for jewelry, electronics, and delicate instruments. Just add water.',
    marketPrice: 95.99,
    imageUrl: 'https://placehold.co/600x400/00FFFF/000000/png?text=Clean',
    dataAiHint: 'ultrasonic cleaner',
  },
  {
    id: 'prod_018',
    name: "Autonomous Courier-Bot",
    description:
      'This friendly, six-wheeled robot will follow you anywhere, carrying up to 20kg of your belongings. Features autonomous navigation and a secure, locked compartment.',
    marketPrice: 2100.0,
    imageUrl: 'https://placehold.co/600x400/F5DEB3/000000/png?text=Bot',
    dataAiHint: 'delivery robot',
  },
  {
    id: 'prod_019',
    name: 'Graphene All-Weather Jacket',
    description:
      'Impossibly thin and light, yet stronger than steel and fully waterproof. This jacket incorporates a graphene weave for unparalleled durability and weather resistance. Self-regulating temperature.',
    marketPrice: 620.0,
    imageUrl: 'https://placehold.co/600x400/2F4F4F/FFFFFF/png?text=Jacket',
    dataAiHint: 'smart jacket',
  },
];
