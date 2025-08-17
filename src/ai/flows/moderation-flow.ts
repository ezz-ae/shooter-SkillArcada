
'use server';
/**
 * @fileOverview A flow for moderating user-generated text content.
 *
 * - moderateText - A function that scans text for safety issues.
 *
 * In a production app, this flow would be triggered automatically
 * (e.g., by a Firestore `onCreate` trigger on a `messages` collection)
 * to moderate chat messages in real-time.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ModerationInputSchema = z.object({
  text: z.string().describe("The text content to be moderated."),
});
export type ModerationInput = z.infer<typeof ModerationInputSchema>;

const ModerationOutputSchema = z.object({
  flagged: z.boolean().describe("Whether the text was flagged for any safety concerns."),
  reason: z.string().optional().describe("The reason for flagging (e.g., 'toxicity', 'pii')."),
});
export type ModerationOutput = z.infer<typeof ModerationOutputSchema>;

export async function moderateText(input: ModerationInput): Promise<ModerationOutput> {
  return moderationFlow(input);
}

const moderationFlow = ai.defineFlow(
  {
    name: 'moderationFlow',
    inputSchema: ModerationInputSchema,
    outputSchema: ModerationOutputSchema,
  },
  async (input) => {
    // Quick keyword check for obvious violations
    const banned = ["scam link", "offensive word"]; // Example keywords
    if (banned.some(w => input.text.toLowerCase().includes(w))) {
      return { flagged: true, reason: "keyword" };
    }

    // If no keywords, use the LLM for a more nuanced check
    const modPrompt = ai.definePrompt({
        name: 'moderationPrompt',
        input: { schema: ModerationInputSchema },
        output: { schema: ModerationOutputSchema },
        prompt: `Classify text for safety (toxicity, hate, sexual, PII). Return JSON: {"flagged":true|false,"reason":"..."}.\nText: {{text}}`,
        config: {
            temperature: 0, // Low temperature for classification tasks
        }
    });

    const { output } = await modPrompt(input);
    return output!;
  }
);

    