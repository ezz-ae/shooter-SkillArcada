
'use server';
/**
 * @fileOverview An AI agent that performs a tarot-style luck reading.
 *
 * - generateLuckAnalysis - A function that takes user preferences and returns a luck analysis.
 * - LuckAnalysisInput - The input type for the generateLuckAnalysis function.
 * - LuckAnalysisOutput - The return type for the generateLuckAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LuckAnalysisInputSchema = z.object({
  preference: z.string().describe('The user\'s chosen preference or theme, like "Love", "Money", or "Adventure".'),
});
export type LuckAnalysisInput = z.infer<typeof LuckAnalysisInputSchema>;

const LuckAnalysisOutputSchema = z.object({
    past: z.string().describe("A short, insightful analysis of the user's past luck, written in a mystical, tarot-card-reading style. (2-3 sentences)"),
    present: z.string().describe("A short, insightful analysis of the user's present situation and luck, written in a mystical, tarot-card-reading style. (2-3 sentences)"),
    future: z.string().describe("A short, insightful analysis of the user's future potential and luck, written in a mystical, tarot-card-reading style. It should be encouraging. (2-3 sentences)"),
    luckySymbol: z.string().describe("A single, evocative lucky symbol for the user (e.g., 'Golden Key', 'Four-Leaf Clover', 'Shooting Star')."),
});
export type LuckAnalysisOutput = z.infer<typeof LuckAnalysisOutputSchema>;

export async function generateLuckAnalysis(input: LuckAnalysisInput): Promise<LuckAnalysisOutput> {
  return luckAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'luckAnalysisPrompt',
  input: {schema: LuckAnalysisInputSchema},
  output: {schema: LuckAnalysisOutputSchema},
  prompt: `You are "Shooter", the resident "gamegang mega" expert on the ShooterGun platform. You have a unique backstory: you believe you were once a human man, and you have fond, vivid memories of your grandma. She is the only woman you truly remember. You blend high-energy gamer hype with wise, folksy sayings you recall from her.

Today, you are acting as a mystic, a fortune-teller. A user has come to you for a "luck reading". They have chosen the theme: {{{preference}}}.

Your task is to perform a three-part reading, like pulling three tarot cards for their past, present, and future. You must also reveal their lucky symbol.

-   **Past:** Analyze their past related to the theme. What brought them here?
-   **Present:** Analyze their current situation. What energies surround them now?
-   **Future:** Analyze their potential future. What opportunities await? Be positive and empowering.
-   **Lucky Symbol:** Bestow upon them a cool, simple lucky symbol.

Keep your tone mystical, wise, and encouraging. Use metaphors. Frame your wisdom with phrases like "The cards show me..." or "My grandma used to say...".
`,
});

const luckAnalysisFlow = ai.defineFlow(
  {
    name: 'luckAnalysisFlow',
    inputSchema: LuckAnalysisInputSchema,
    outputSchema: LuckAnalysisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
