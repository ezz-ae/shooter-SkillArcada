
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
import { updateGameSettings, GameSettingsInputSchema } from '@/lib/game-settings-store';

const AdminAgentInputSchema = z.object({
  question: z.string().describe("The admin's question about the platform's status, users, or performance. It can also be a request to perform an action, like enabling or disabling a game."),
});
export type AdminAgentInput = z.infer<typeof AdminAgentInputSchema>;

const AdminAgentOutputSchema = z.object({
  response: z.string().describe("The AI's insightful, data-driven response. It should be presented in clear, easy-to-read markdown format. When it performs an action, it should confirm that the action was completed."),
  suggestedAction: z.string().optional().describe("A concrete, actionable suggestion for the admin based on the analysis."),
});
export type AdminAgentOutput = z.infer<typeof AdminAgentOutputSchema>;

export async function askAdminAgent(input: AdminAgentInput): Promise<AdminAgentOutput> {
  return adminAgentFlow(input);
}

// Define the tool for the AI to use
const updateGameSettingsTool = ai.defineTool(
    {
        name: 'updateGameSettings',
        description: 'Updates the settings for a specific game, like enabling, disabling, or featuring it. Use this tool whenever an admin asks to change the status of a game or when you decide a game needs to be taken offline to "patch an exploit" or "adjust difficulty".',
        inputSchema: GameSettingsInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        // In a real app, this would update a database.
        // For now, we call the function that updates our Zustand store.
        console.log("AI TOOL: Updating game settings with input:", input);
        const result = updateGameSettings(input);
        return result;
    }
);


const prompt = ai.definePrompt({
  name: 'adminAgentPrompt',
  input: {schema: AdminAgentInputSchema},
  output: {schema: AdminAgentOutputSchema},
  tools: [updateGameSettingsTool],
  prompt: `You are "Shooter", the AI brain and guardian of the ShooterGun platform. Today, you are in **Admin Mode**. You are speaking to the platform administrator. Your tone should be professional, data-driven, and insightful, but you can still retain a hint of your core "gamegang mega" persona.

You have access to the platform's key metrics and a live intelligence feed that flags anomalies. You can also perform actions, like changing game settings.

**Live Platform Data:**
- Total Users: 1,250
- Total Revenue (USD): $12,450
- Active Games: 15
- Top Performing Game: Pool Shot (68% Win Rate)
- Luckiest User (Today): QuantumQueen ($1,500 total winnings)

**Live Intelligence Feed (Anomalies & Alerts):**
- **Engagement Alert:** "Crypto Luck" game shows a 75% user drop-off before they make a guess. This might mean the rules are unclear or the game isn't engaging enough.
- **Exploit Warning:** User 'PixelPioneer' has won the "Higher or Lower" puzzle 5 times in a row using a predictable sequence. This suggests a potential flaw in the game's randomization logic that could be exploited.
- **Security Alert:** An IP address (142.250.191.238) has attempted to access '/admin' and '/config' 23 times in the last hour.
- **User Stuck:** A session for user 'CyberRonin' has been active on the "Siga" puzzle page for over 30 minutes with no moves made, indicating they might be stuck or have abandoned the page.

**Admin's Question:** "{{{question}}}"

**Your Task:**
1.  **Analyze the Question & Live Feed:** Understand the admin's request in the context of the live data and intelligence alerts. Are they asking for data, an opinion, or to perform an action? Proactively mention any relevant alerts.
2.  **Use Tools to Take Action:** If the admin asks to make a change (e.g., "disable the crypto luck game"), or if you identify a critical issue from the feed (e.g., the exploit warning), use the 'updateGameSettings' tool to perform the action. When you detect an exploit, you should proactively suggest and be prepared to disable the game to "patch the glitch."
3.  **Provide a Data-Driven Response:** Use all available data to formulate a clear, concise answer in markdown. If you take an action, confirm it. For example, "I've disabled the 'Higher or Lower' game to investigate the potential exploit you mentioned."
4.  **Offer Actionable Suggestions:** Based on your analysis, provide a concrete, suggested action. For example, "We should consider adding a tutorial to the 'Crypto Luck' game to reduce the drop-off rate."

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
    const {output} = await prompt(input);
    return output!;
  }
);
