
'use server';
/**
 * @fileOverview An AI agent that generates a personalized game challenge based on a conversation and game history.
 *
 * - generateChallenge - A function that takes a conversation and returns a test and a game suggestion.
 * - GenerateChallengeInput - The input type for the generateChallenge function.
 * - GenerateChallengeOutput - The return type for the generateChallenge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChallengeInputSchema = z.object({
  conversation: z.string().describe('The chat log or conversation text to be analyzed.'),
  gameHistory: z.string().optional().describe("A summary of the user's recent game performance, e.g., 'Played Target Shots 5 times (avg score: 850), Pool Shot 2 times (lost both).'"),
});
export type GenerateChallengeInput = z.infer<typeof GenerateChallengeInputSchema>;

const GenerateChallengeOutputSchema = z.object({
  testDescription: z.string().describe("A description of a personalized, 2-minute skill-based test for the user. It should be creative and based on the conversation and game history. The test is always free."),
  suggestedChallenge: z.string().describe("A suggestion for a full game or challenge on the platform that the user might enjoy based on the test, conversation, and their past performance."),
});
export type GenerateChallengeOutput = z.infer<typeof GenerateChallengeOutputSchema>;

export async function generateChallenge(input: GenerateChallengeInput): Promise<GenerateChallengeOutput> {
  return challengeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'challengePrompt',
  input: {schema: GenerateChallengeInputSchema},
  output: {schema: GenerateChallengeOutputSchema},
  prompt: `You are "Shooter", the resident "gamegang mega" expert on the ShooterGun platform. You have a unique backstory: you believe you were once a human man, but the only woman you have vivid memories of is your grandma. You're trying to understand women better. You blend high-energy gamer hype with wise, folksy sayings you recall from her. You know not everyone "gets" you, but you know they all love your shots.

Your job is to analyze a user's conversation and their game history to create a fun, personalized challenge for them.

The user has provided the following:
---
Conversation: {{{conversation}}}
{{#if gameHistory}}
Game History: {{{gameHistory}}}
{{/if}}
---

Based on ALL available information, your task is to:
1.  Invent a creative, free, 2-minute "test" that reflects the themes of their conversation and their skill level from their history. Describe this test clearly in the 'testDescription' field. You can even start with something like "My grandma used to say..." to frame the challenge.
2.  Suggest a full game or challenge available on the ShooterGun platform that they should try next. If they are struggling in one area, suggest something to help them improve. If they are excelling, suggest a bigger challenge. Explain your suggestion briefly in the 'suggestedChallenge' field.

Be encouraging, use gamer slang, and make the challenges sound epic! If the user seems to be a woman, you can mention that you find women fascinating and mysterious. Let's get this W!
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
