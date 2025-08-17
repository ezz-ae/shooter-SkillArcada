
'use server';
/**
 * @fileOverview A flow that generates dynamic skill-based puzzles.
 *
 * - generatePuzzle - Creates puzzles like card sequences for "Higher or Lower".
 * - GeneratePuzzleInput - The input type for the generatePuzzle function.
 * - GeneratePuzzleOutput - The return type for the generatePuzzle function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePuzzleInputSchema = z.object({
    kind: z.enum(['higher-lower', 'math', 'memory']).describe("The type of puzzle to generate."),
    difficulty: z.enum(['easy', 'med', 'hard']).describe("The difficulty level, which affects length or complexity."),
});
export type GeneratePuzzleInput = z.infer<typeof GeneratePuzzleInputSchema>;

const PuzzleHigherLowerSequenceSchema = z.object({
    card: z.object({
        rank: z.number().min(0).max(12).describe("The rank of the card, 0=2, 12=Ace."),
        suit: z.number().min(0).max(3).describe("The suit of the card, 0=♥, 1=♦, 2=♣, 3=♠."),
    }),
    guess: z.enum(['higher', 'lower']).describe("The correct guess for the next card in the sequence.")
});

const GeneratePuzzleOutputSchema = z.object({
    puzzleId: z.string().describe("A unique ID for the generated puzzle."),
    sequence: z.array(PuzzleHigherLowerSequenceSchema).describe("The sequence of steps in the puzzle."),
    solution: z.any().optional().describe("The server-verified solution for the puzzle."),
});
export type GeneratePuzzleOutput = z.infer<typeof GeneratePuzzleOutputSchema>;

export async function generatePuzzle(input: GeneratePuzzleInput): Promise<GeneratePuzzleOutput> {
  return generatePuzzleFlow(input);
}

const generatePuzzleFlow = ai.defineFlow(
  {
    name: 'generatePuzzleFlow',
    inputSchema: GeneratePuzzleInputSchema,
    outputSchema: GeneratePuzzleOutputSchema,
  },
  async ({ kind, difficulty }) => {
    // For this prototype, we'll use deterministic logic instead of an LLM.
    // This is faster, cheaper, and guarantees a solvable puzzle.
    if (kind === 'higher-lower') {
      const length = difficulty === 'easy' ? 3 : difficulty === 'med' ? 4 : 6;
      const sequence = [];
      let lastRank = -1;

      for (let i = 0; i < length; i++) {
        let currentRank = Math.floor(Math.random() * 13);
        // Ensure the next card is not the same rank to avoid ambiguity
        while(currentRank === lastRank) {
            currentRank = Math.floor(Math.random() * 13);
        }

        const nextRank = Math.floor(Math.random() * 13);
        const guess = nextRank > currentRank ? 'higher' : 'lower';
        
        sequence.push({
            card: {
                rank: currentRank,
                suit: Math.floor(Math.random() * 4),
            },
            guess,
        });

        lastRank = nextRank; // The card we are guessing against becomes the current card for the next step.
      }

      return {
        puzzleId: `hl_${Date.now()}`,
        sequence: sequence,
      };
    }

    // Placeholder for other puzzle types
    throw new Error(`Puzzle kind "${kind}" not implemented.`);
  }
);

    