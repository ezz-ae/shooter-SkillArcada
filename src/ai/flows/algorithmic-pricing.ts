'use server';
/**
 * @fileOverview An AI agent that sets randomized discount amounts based on market prices.
 *
 * - getAlgorithmicPrice - A function that returns a randomized discount amount based on market prices.
 * - AlgorithmicPricingInput - The input type for the getAlgorithmicPrice function.
 * - AlgorithmicPricingOutput - The return type for the getAlgorithmicPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlgorithmicPricingInputSchema = z.object({
  marketPrice: z.number().describe('The current market price of the item.'),
});
export type AlgorithmicPricingInput = z.infer<typeof AlgorithmicPricingInputSchema>;

const AlgorithmicPricingOutputSchema = z.object({
  discountPercentage: z
    .number()
    .min(1)
    .max(99)
    .describe('The randomized discount percentage to apply to the item.'),
});
export type AlgorithmicPricingOutput = z.infer<typeof AlgorithmicPricingOutputSchema>;

export async function getAlgorithmicPrice(input: AlgorithmicPricingInput): Promise<AlgorithmicPricingOutput> {
  return algorithmicPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'algorithmicPricingPrompt',
  input: {schema: AlgorithmicPricingInputSchema},
  output: {schema: AlgorithmicPricingOutputSchema},
  prompt: `You are an expert in pricing strategy, tasked with determining a randomized discount percentage for an item based on its market price.

  The discount percentage should be between 1% and 99%, and should be influenced by the market price.
  A higher market price should generally lead to a slightly lower discount percentage, and vice versa, but randomness is key.

  Market Price: {{marketPrice}}
  Set a discount percentage:`,
});

const algorithmicPricingFlow = ai.defineFlow(
  {
    name: 'algorithmicPricingFlow',
    inputSchema: AlgorithmicPricingInputSchema,
    outputSchema: AlgorithmicPricingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
