
'use server';
/**
 * @fileOverview A flow that generates a professional product image.
 *
 * - generateProductImage - A function that handles the image generation.
 * - ProductImageInput - The input type for the generateProductImage function.
 * - ProductImageOutput - The return type for the generateProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductImageInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  dataAiHint: z.string().describe('Keywords to help guide the image generation.'),
});
export type ProductImageInput = z.infer<typeof ProductImageInputSchema>;

const ProductImageOutputSchema = z.object({
  imageUrl: z.string().describe("A data URI of a generated image that illustrates the product. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type ProductImageOutput = z.infer<typeof ProductImageOutputSchema>;


export async function generateProductImage(input: ProductImageInput): Promise<ProductImageOutput> {
  return productImageFlow(input);
}

const productImageFlow = ai.defineFlow(
  {
    name: 'productImageFlow',
    inputSchema: ProductImageInputSchema,
    outputSchema: ProductImageOutputSchema,
  },
  async (input) => {
    const imagePrompt = `A dramatic, high-quality, professional product photograph of a ${input.productName}. The item should be the hero of the shot, centered on a clean, modern, studio-lit background. The lighting should be dramatic and highlight the product's features. Keywords: ${input.dataAiHint}.`;

    const imageGeneration = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: imagePrompt,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    const imageUrl = imageGeneration.media.url;

    if (!imageUrl) {
        // Fallback to placeholder if image generation fails
        return {
            imageUrl: 'https://placehold.co/600x400.png',
        };
    }

    return {
      imageUrl: imageUrl,
    };
  }
);
