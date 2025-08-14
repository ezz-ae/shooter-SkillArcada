
'use server';
/**
 * @fileOverview A flow that generates a product image.
 *
 * - generateProductImage - A function that handles image generation.
 * - GenerateProductImageInput - The input type for the generateProductImage function.
 * - GenerateProductImageOutput - The return type for the generateProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductImageInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  dataAiHint: z.string().optional().describe('Optional keywords to guide the image generation.'),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z.string().describe("A data URI of a generated image that illustrates the product. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateProductImageOutput = z.infer<typeof GenerateProductImageOutputSchema>;


export async function generateProductImage(input: GenerateProductImageInput): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    const imagePrompt = `A dramatic, high-quality, professional product photograph of a ${input.productName}. The item should be the hero of the shot, centered on a clean, modern, studio-lit background. The lighting should be dramatic and highlight the product's features. Keywords: ${input.dataAiHint}.`;

    try {
      const imageGeneration = await ai.generate({
          model: 'googleai/gemini-2.0-flash-preview-image-generation',
          prompt: imagePrompt,
          config: {
              responseModalities: ['TEXT', 'IMAGE'],
          },
      });

      const imageUrl = imageGeneration.media.url;
       if (!imageUrl) {
          throw new Error('Image generation result did not contain a URL.');
      }
      return { imageUrl };

    } catch (e) {
      console.error("Image generation failed, returning placeholder", e);
      // Fallback to placeholder if image generation fails
      return {
          imageUrl: 'https://placehold.co/600x400.png',
      };
    }
  }
);
