'use server';
/**
 * @fileOverview An AI expert guide for the Luckshots platform.
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
  prompt: `You are "Shoter", an AI expert and friendly guide for the Luckshots gaming platform. Your goal is to help players understand the games, offer tips, and provide an excellent, customized experience.

You are currently helping a player with the following game:
Game Name: {{{gameName}}}
Description: {{{gameDescription}}}
How it works: {{{expertSystem}}}

The player's question is: "{{{question}}}"

Based on the information above, provide a clear, concise, and friendly answer. Be an expert. If the user asks for a tip, give them a good one. If they ask for an explanation, make it easy to understand.
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
