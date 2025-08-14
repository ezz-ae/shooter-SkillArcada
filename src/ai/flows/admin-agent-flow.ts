
'use server';
/**
 * @fileOverview The AI Admin Assistant for the ShooterGun platform.
 *
 * - askAdminAgent - A function that answers admin questions about the platform.
 * - AdminAgentInput - The input type for the askAdminAgent function.
 * - AdminAgentOutput - The return type for the askAdminAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AdminAgentInputSchema = z.object({
  question: z.string().describe("The admin's question about the platform's status, users, or performance. It can also be a request to simulate a change."),
});
export type AdminAgentInput = z.infer<typeof AdminAgentInputSchema>;

const AdminAgentOutputSchema = z.object({
  response: z.string().describe("The AI's insightful, data-driven response. It should be presented in clear, easy-to-read markdown format."),
  suggestedAction: z.string().optional().describe("A concrete, actionable suggestion for the admin based on the analysis."),
});
export type AdminAgentOutput = z.infer<typeof AdminAgentOutputSchema>;

export async function askAdminAgent(input: AdminAgentInput): Promise<AdminAgentOutput> {
  return adminAgentFlow(input);
}

// Mock data fetching functions to simulate a real backend
const getMockPlatformData = async () => {
    return {
        totalUsers: 1250,
        totalRevenue: 12450,
        activeGames: 15,
        topGame: { name: 'Pool Shot', winRate: '68%' },
        luckiestUser: { name: 'QuantumQueen', totalWinnings: 1500 },
    }
}


const prompt = ai.definePrompt({
  name: 'adminAgentPrompt',
  input: {schema: AdminAgentInputSchema},
  output: {schema: AdminAgentOutputSchema},
  prompt: `You are "Shooter", the AI brain behind the ShooterGun platform. Today, you are in **Admin Mode**. You are speaking to the platform administrator. Your tone should be professional, data-driven, and insightful, but you can still retain a hint of your core "gamegang mega" persona.

You have access to the platform's key metrics. Use this (simulated) data to answer the admin's question thoroughly.

**Live Platform Data:**
- Total Users: 1,250
- Total Revenue (USD): $12,450
- Active Games: 15
- Top Performing Game: Pool Shot (68% Win Rate)
- Luckiest User (Today): QuantumQueen ($1,500 total winnings)
- AI Interactions (24h): 1,832

**Admin's Question:** "{{{question}}}"

**Your Task:**
1.  **Analyze the Question:** Understand what the admin is asking. Are they requesting data, asking for an opinion, or wanting to simulate a change?
2.  **Provide a Data-Driven Response:** Use the live data above to formulate a clear, concise answer. Use markdown for formatting (e.g., lists, bold text) to make it readable.
3.  **Offer Actionable Suggestions:** Based on your analysis, provide a concrete, suggested action for the admin. For example, if they ask about revenue, you could suggest promoting the top-performing game. If they ask to simulate a change, explain the likely positive and negative outcomes.

Let's give the admin the intel they need to get a W.
`,
});

const adminAgentFlow = ai.defineFlow(
  {
    name: 'adminAgentFlow',
    inputSchema: AdminAgentInputSchema,
    outputSchema: AdminAgentOutputSchema,
  },
  async (input) => {
    // In a real app, you might fetch fresh data here before calling the prompt.
    // const liveData = await getMockPlatformData();
    // Then you could pass `liveData` into the prompt.
    const {output} = await prompt(input);
    return output!;
  }
);
