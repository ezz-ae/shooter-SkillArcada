
'use server';
/**
 * @fileOverview A flow for generating AI opponent moves.
 *
 * - getOpponentMove - A function that computes the next move for a bot.
 *
 * This flow uses a deterministic (seeded) random number generator to ensure that
 * bot moves can be consistent and replayed if needed, which is crucial for
 * server-authoritative game logic and anti-cheat validation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// A simple seeded random number generator (mulberry32).
// This ensures that given the same seed, the bot will always make the same "random" choices.
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const OpponentInputSchema = z.object({
  gameId: z.string().describe("The ID of the game being played."),
  gameState: z.any().describe("The current JSON state of the game."),
  difficulty: z.enum(['easy', 'med', 'hard']).describe("The bot's difficulty level."),
  serverSeed: z.string().describe("A seed for the random number generator to ensure deterministic moves."),
});
export type OpponentInput = z.infer<typeof OpponentInputSchema>;

const OpponentOutputSchema = z.object({
  move: z.any().describe("The computed move for the AI opponent."),
});
export type OpponentOutput = z.infer<typeof OpponentOutputSchema>;

export async function getOpponentMove(input: OpponentInput): Promise<OpponentOutput> {
  return opponentFlow(input);
}

const opponentFlow = ai.defineFlow(
  {
    name: 'opponentFlow',
    inputSchema: OpponentInputSchema,
    outputSchema: OpponentOutputSchema,
  },
  async ({ gameId, gameState, difficulty, serverSeed }) => {
    // Generate a numeric seed from the string
    const seed = [...serverSeed].reduce((a, c) => a + c.charCodeAt(0), 0);
    const random = mulberry32(seed);

    // --- Replace this with game-specific logic ---
    // Example: pick a random move from a list of legal moves.
    const legalMoves = (gameState?.legalMoves ?? []) as any[];
    if (legalMoves.length === 0) {
      return { move: null };
    }

    // Higher difficulty might involve looking ahead or choosing a "better" random move.
    const moveIndex = Math.floor(random() * legalMoves.length);
    const move = legalMoves[moveIndex];
    // --- End of game-specific logic ---

    return { move };
  }
);

    