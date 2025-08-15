
import { create } from 'zustand';
import { z } from 'zod';
import { mockProducts } from './products'; // Import products to dynamically generate games

export type GameStatus = 'live' | 'maintenance' | 'disabled';

export interface Game {
    id: string;
    name: string;
    description: string;
    status: GameStatus;
    isFeatured: boolean;
}

interface GameSettingsState {
    games: Game[];
    initializeGames: () => void;
    setStatus: (id: string, status: GameStatus) => void;
    toggleFeatured: (id: string) => void;
    getGame: (id: string) => Game | undefined;
}

// Function to generate the initial game list from products
const generateInitialGames = (): Game[] => {
    const gameProducts = mockProducts.filter(p => p.game);
    const uniqueGames = new Map<string, Game>();

    gameProducts.forEach(p => {
        if (p.game && !uniqueGames.has(p.game)) {
             uniqueGames.set(p.game, {
                id: p.game,
                name: p.name, // Use product name as a default game name
                description: p.expertSystem, // Use expert system as description
                status: 'live', // Default status
                isFeatured: false,
             });
        }
    });

    // Manually add games that don't have a specific product tied to them in the same way
    if (!uniqueGames.has('crypto-luck')) uniqueGames.set('crypto-luck', { id: 'crypto-luck', name: 'Crypto Luck', description: 'Predict Bitcoin\'s next move.', status: 'live', isFeatured: true });
    if (!uniqueGames.has('pool-shot')) uniqueGames.set('pool-shot', { id: 'pool-shot', name: 'Pool Shot Challenges', description: '1-on-1 pool challenges.', status: 'live', isFeatured: false });
    if (!uniqueGames.has('hit-or-miss')) uniqueGames.set('hit-or-miss', { id: 'hit-or-miss', name: 'Hit or Miss', description: 'Timing-based price capture game.', status: 'live', isFeatured: true });
    if (!uniqueGames.has('shop-hunter')) uniqueGames.set('shop-hunter', { id: 'shop-hunter', name: 'Shop Hunter', description: 'AI-powered discount hunting.', status: 'live', isFeatured: true });


    return Array.from(uniqueGames.values());
};


export const useGameSettingsStore = create<GameSettingsState>((set, get) => ({
    games: [],
    initializeGames: () => {
        set({ games: generateInitialGames() });
    },
    setStatus: (id, status) => set(state => ({
        games: state.games.map(game => game.id === id ? { ...game, status } : game)
    })),
    toggleFeatured: (id) => set(state => ({
        games: state.games.map(game => game.id === id ? { ...game, isFeatured: !game.isFeatured } : game)
    })),
    getGame: (id) => get().games.find(game => game.id === id),
}));

// Initialize the store with dynamic games
useGameSettingsStore.getState().initializeGames();


// Zod schema for AI tool input validation
export const GameSettingsInputSchema = z.object({
    gameId: z.string().describe("The unique identifier for the game, e.g., 'crypto-luck' or 'pool-shot'."),
    status: z.nativeEnum(['live', 'maintenance', 'disabled']).optional().describe("The new status for the game."),
    isFeatured: z.boolean().optional().describe("Whether the game should be featured on the homepage."),
});

export type GameSettingsInput = z.infer<typeof GameSettingsInputSchema>;

// Server-callable action to update the store (for use by AI tool)
export function updateGameSettings(input: GameSettingsInput): string {
    const { setStatus, toggleFeatured, getGame } = useGameSettingsStore.getState();
    const game = getGame(input.gameId);

    if (!game) {
        return `Error: Game with ID "${input.gameId}" not found.`;
    }

    if (input.status) {
        setStatus(input.gameId, input.status);
    }
    if (input.isFeatured !== undefined && game.isFeatured !== input.isFeatured) {
        toggleFeatured(input.gameId);
    }

    return `Successfully updated settings for ${game.name}.`;
}
