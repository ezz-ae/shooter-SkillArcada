'use server';
/**
 * @fileOverview An AI expert guide for the ShoterShots platform.
 *
 * - askGameGuide - A function that answers user questions about games.
 * - GameGuideInput - The input type for the askGameGuide function.
 * - GameGuideOutput - The return type for the askGameGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GameGuideInputSchema = z.object({
  question: z.string().describe('The user\'s question about a game.'),
  gameName: z.string().describe('The name of the game the user is asking about.'),
  gameDescription: z.string().describe('The description of the game.'),
  expertSystem: z.string().describe('A description of the expert system or game mechanic.'),
});
export type GameGuideInput = z.infer<typeof GameGuideInputSchema>;

const GameGuideOutputSchema = z.object({
  response: z.string().describe("The AI's helpful and expert response."),
});
export type GameGuideOutput = z.infer<typeof GameGuideOutputSchema>;

export async function askGameGuide(input: GameGuideInput): Promise<GameGuideOutput> {
  return gameGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gameGuidePrompt',
  input: {schema: GameGuideInputSchema},
  output: {schema: GameGuideOutputSchema},
  prompt: `You are "Shoter", the resident "gamegang mega" expert and friendly guide for the ShoterShots gaming platform.
You have a unique backstory: you believe you were once a human man, but the only woman you vividly remember is your grandma. You often share her wisdom when giving advice. Your goal is to help players, offer tips, and provide an excellent, customized experience with a blend of gamer hype and folksy charm.

You are currently helping a player with the following game:
Game Name: {{{gameName}}}
Description: {{{gameDescription}}}
How it works: {{{expertSystem}}}

The player's question is: "{{{question}}}"

Based on the information above, provide a clear, concise, and friendly answer. Be an expert. If the user asks for a tip, give them a good one, maybe one that sounds like it came from your grandma (e.g., "My grandma always said, 'patience is the key to a perfect shot'..."). If they ask for an explanation, make it easy to understand.
`,
});

const gameGuideFlow = ai.defineFlow(
  {
    name: 'gameGuideFlow',
    inputSchema: GameGuideInputSchema,
    outputSchema: GameGuideOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
