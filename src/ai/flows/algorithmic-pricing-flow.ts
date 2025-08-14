
'use server';
/**
 * @fileOverview An AI agent that determines a dynamic, randomized discount price for a product.
 *
 * - algorithmicPricing - A function that takes a market price and returns a discounted price.
 * - AlgorithmicPricingInput - The input type for the algorithmicPricing function.
 * - AlgorithmicPricingOutput - The return type for the algorithmicPricing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AlgorithmicPricingInputSchema = z.object({
  marketPrice: z.number().describe('The original market price of the item.'),
});
export type AlgorithmicPricingInput = z.infer<typeof AlgorithmicPricingInputSchema>;

const AlgorithmicPricingOutputSchema = z.object({
  discountPrice: z.number().describe("The final, discounted price for the item. This should be calculated based on a randomized discount percentage. The discount should feel random, but deeper discounts (e.g., over 80%) should be rare."),
});
export type AlgorithmicPricingOutput = z.infer<typeof AlgorithmicPricingOutputSchema>;

export async function algorithmicPricing(input: AlgorithmicPricingInput): Promise<AlgorithmicPricingOutput> {
  return algorithmicPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'algorithmicPricingPrompt',
  input: {schema: AlgorithmicPricingInputSchema},
  output: {schema: AlgorithmicPricingOutputSchema},
  prompt: `You are an AI pricing engine for an e-commerce platform called "ShopnLuck". Your task is to generate a randomized, one-time discount price for an item.

The user is taking a "shot" on an item with a market price of \${{{marketPrice}}}.

Your goal is to calculate a `discountPrice` based on the following weighted probabilities for the discount percentage:
- 60% chance of a small discount (10-40%)
- 25% chance of a medium discount (41-75%)
- 10% chance of a large discount (76-90%)
- 5% chance of a massive discount (91-98%)

Do not simply output the discount. Calculate the final `discountPrice` and return it. The result should feel exciting and unpredictable.
`,
});

const algorithmicPricingFlow = ai.defineFlow(
  {
    name: 'algorithmicPricingFlow',
    inputSchema: AlgorithmicPricingInputSchema,
    outputSchema: AlgorithmicPricingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
