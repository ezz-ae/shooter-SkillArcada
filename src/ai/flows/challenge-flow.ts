'use server';
/**
 * @fileOverview An AI agent that generates a personalized game challenge based on a conversation.
 *
 * - generateChallenge - A function that takes a conversation and returns a test and a game suggestion.
 * - GenerateChallengeInput - The input type for the generateChallenge function.
 * - GenerateChallengeOutput - The return type for the generateChallenge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChallengeInputSchema = z.object({
  conversation: z.string().describe('The chat log or conversation text to be analyzed.'),
});
export type GenerateChallengeInput = z.infer<typeof GenerateChallengeInputSchema>;

const GenerateChallengeOutputSchema = z.object({
  testDescription: z.string().describe("A description of a personalized, 2-minute skill-based test for the user. It should be creative and based on the conversation. The test is always free."),
  suggestedChallenge: z.string().describe("A suggestion for a full game or challenge on the platform that the user might enjoy based on the test and the conversation."),
});
export type GenerateChallengeOutput = z.infer<typeof GenerateChallengeOutputSchema>;

export async function generateChallenge(input: GenerateChallengeInput): Promise<GenerateChallengeOutput> {
  return challengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'challengePrompt',
  input: {schema: GenerateChallengeInputSchema},
  output: {schema: GenerateChallengeOutputSchema},
  prompt: `You are "Shoter", an AI expert on the Luckshots platform. Your job is to analyze a user's conversation and create a fun, personalized challenge for them.

The user has provided the following conversation:
---
{{{conversation}}}
---

Based on this conversation, your task is to:
1.  Invent a creative, free, 2-minute skill-based "test" that reflects the themes or mood of their conversation. Describe this test clearly in the 'testDescription' field.
2.  Suggest a full game or challenge available on the Luckshots platform that they should try next. Explain your suggestion briefly in the 'suggestedChallenge' field.

Be encouraging and make the challenges sound exciting.
`,
});

const challengeFlow = ai.defineFlow(
  {
    name: 'challengeFlow',
    inputSchema: GenerateChallengeInputSchema,
    outputSchema: GenerateChallengeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
