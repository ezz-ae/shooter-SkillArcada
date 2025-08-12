'use server';
/**
 * @fileOverview An AI agent that simulates price fluctuations for an item.
 *
 * - getAlgorithmicPrice - A function that returns a new price based on the current price to simulate market changes.
 * - AlgorithmicPricingInput - The input type for the getAlgorithmicPrice function.
 * - AlgorithmicPricingOutput - The return type for the getAlgorithmicPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const AlgorithmicPricingInputSchema = z.object({
  currentPrice: z.number().describe('The current price of the item.'),
});
export type AlgorithmicPricingInput = z.infer<typeof AlgorithmicPricingInputSchema>;

const AlgorithmicPricingOutputSchema = z.object({
  newPrice: z
    .number()
    .describe('The new, fluctuated price for the item.'),
});
export type AlgorithmicPricingOutput = z.infer<typeof AlgorithmicPricingOutputSchema>;

export async function getAlgorithmicPrice(input: AlgorithmicPricingInput): Promise<AlgorithmicPricingOutput> {
  return algorithmicPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'algorithmicPricingPrompt',
  input: {schema: AlgorithmicPricingInputSchema},
  output: {schema: AlgorithmicPricingOutputSchema},
  model: googleAI.model('gemini-2.0-flash'),
  prompt: `You are a market simulator for a highly volatile, speculative product, much like a cryptocurrency.
  Your task is to generate the next price for an item based on its current price.

  The price should fluctuate randomly. It can go up or down slightly. The change should be small, usually less than 5% of the current price, but with occasional larger swings to simulate market volatility.

  Current Price: {{currentPrice}}
  Generate the new price:`,
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
