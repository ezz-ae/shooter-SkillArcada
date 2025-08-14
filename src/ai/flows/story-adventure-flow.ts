
'use server';
/**
 * @fileOverview A flow that generates a story premise and an image for a text-based adventure game.
 *
 * - generateStoryAdventure - A function that handles the story and image generation.
 * - StoryAdventureInput - The input type for the generateStoryAdventure function.
 * - StoryAdventureOutput - The return type for the generateStoryAdventure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StoryAdventureInputSchema = z.object({
  productName: z.string().describe('The name of the item the user is trying to win.'),
  prompt: z.string().optional().describe('An optional custom prompt for image generation.'),
});
export type StoryAdventureInput = z.infer<typeof StoryAdventureInputSchema>;

const StoryAdventureOutputSchema = z.object({
  story: z.string().describe('A short, adventurous story premise, under 50 words, that ends on a cliffhanger.'),
  imageUrl: z.string().describe("A data URI of a generated image that illustrates the story. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type StoryAdventureOutput = z.infer<typeof StoryAdventureOutputSchema>;


export async function generateStoryAdventure(input: StoryAdventureInput): Promise<StoryAdventureOutput> {
  return storyAdventureFlow(input);
}

const storyAdventureFlow = ai.defineFlow(
  {
    name: 'storyAdventureFlow',
    inputSchema: StoryAdventureInputSchema,
    outputSchema: StoryAdventureOutputSchema,
  },
  async (input) => {
    const storyPrompt = `Create a very short, exciting, and adventurous story premise, under 50 words, based on the following item: "${input.productName}". The story must end on a cliffhanger, prompting the user to continue it. Do not title the story.`;
    
    const storyResult = await ai.generate({
        prompt: storyPrompt,
        model: 'googleai/gemini-1.5-flash',
    });
    
    const storyText = storyResult.text;

    if (!storyText) {
      throw new Error('Failed to generate story.');
    }

    const imagePrompt = input.prompt || `A dramatic, high-quality, professional product photograph of a ${input.productName}. The item should be the hero of the shot, centered on a clean, modern, studio-lit background. The lighting should be dramatic and highlight the product's features.`;

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
            story: storyText,
            imageUrl: 'https://placehold.co/600x400.png',
        };
    }

    return {
      story: storyText,
      imageUrl: imageUrl,
    };
  }
);
