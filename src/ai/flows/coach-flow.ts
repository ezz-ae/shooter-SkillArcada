
'use server';
/**
 * @fileOverview An AI coach that provides hints for games.
 *
 * - getCoachHint - A function that returns a hint for a given game state.
 * - CoachHintInput - The input type for the getCoachHint function.
 * - CoachHintOutput - The return type for the getCoachHint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoachHintInputSchema = z.object({
  gameId: z.string().describe('The ID of the game, e.g., "pool-shot".'),
  gameState: z.any().describe('A JSON object representing the current state of the game.'),
});
export type CoachHintInput = z.infer<typeof CoachHintInputSchema>;

const CoachHintOutputSchema = z.object({
  hint: z.string().describe("A short, ultra-concise skill-based hint for the player. It should be 1-2 lines, followed by a 1-2 step checklist. It should not contain spoilers. It should focus on timing, attention, or logic."),
});
export type CoachHintOutput = z.infer<typeof CoachHintOutputSchema>;

export async function getCoachHint(input: CoachHintInput): Promise<CoachHintOutput> {
  return coachHintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coachHintPrompt',
  input: {schema: CoachHintInputSchema},
  output: {schema: CoachHintOutputSchema},
  prompt: `You are Shooter, an ultra-concise skill coach.
Game: {{{gameId}}}
State JSON: {{{json gameState}}}
Goal: give ONE short hint (<= 2 lines), then a tiny 1-2 step checklist.
Avoid spoilers of full solutions. No gambling language. Focus on timing, attention, or logic.`,
});

const coachHintFlow = ai.defineFlow(
  {
    name: 'coachHintFlow',
    inputSchema: CoachHintInputSchema,
    outputSchema: CoachHintOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
