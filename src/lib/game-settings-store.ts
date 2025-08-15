
import { create } from 'zustand';
import { z } from 'zod';

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
    setStatus: (id: string, status: GameStatus) => void;
    toggleFeatured: (id: string) => void;
    getGame: (id: string) => Game | undefined;
}

const initialGames: Game[] = [
    { id: 'crypto-luck', name: 'Crypto Luck', description: 'Predict Bitcoin\'s next move.', status: 'live', isFeatured: true },
    { id: 'pool-shot', name: 'Pool Shot Challenges', description: '1-on-1 pool challenges.', status: 'live', isFeatured: false },
    { id: 'luckgirls', name: 'Luckgirls Games', description: 'Social games with chat features.', status: 'disabled', isFeatured: false },
    { id: 'hit-or-miss', name: 'Hit or Miss', description: 'Timing-based price capture game.', status: 'live', isFeatured: true },
    { id: 'ai-adventure', name: 'AI Adventure', description: 'AI-powered story completion game.', status: 'maintenance', isFeatured: false },
    { id: 'chess', name: 'Chess Puzzles', description: 'Daily checkmate puzzles.', status: 'live', isFeatured: false },
    { id: 'higher-or-lower', name: 'Higher or Lower', description: 'Card sequence guessing game.', status: 'live', isFeatured: false },
];

export const useGameSettingsStore = create<GameSettingsState>((set, get) => ({
    games: initialGames,
    setStatus: (id, status) => set(state => ({
        games: state.games.map(game => game.id === id ? { ...game, status } : game)
    })),
    toggleFeatured: (id) => set(state => ({
        games: state.games.map(game => game.id === id ? { ...game, isFeatured: !game.isFeatured } : game)
    })),
    getGame: (id) => get().games.find(game => game.id === id),
}));

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
