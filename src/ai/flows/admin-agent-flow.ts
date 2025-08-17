
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
import { updateProductDetails } from '@/lib/product-editor';
import { sendNotification, NotificationInputSchema } from '@/lib/actions';


const AdminAgentInputSchema = z.object({
  question: z.string().describe("The admin's question about the platform's status, users, or performance. It can also be a request to perform an action, like enabling a game, changing a product's details, or sending a notification to a user."),
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

// Zod schema for the updateProductDetails tool
const ProductEditInputSchema = z.object({
  productId: z.string().describe("The unique ID of the product to edit, e.g., 'prod_phone_01'."),
  name: z.string().optional().describe("The new name for the product."),
  subtitle: z.string().optional().describe("The new subtitle for the product."),
  description: z.string().optional().describe("The new description for the product."),
  marketPrice: z.number().optional().describe("The new market price for the product."),
});

// Define the tools for the AI to use
const updateGameSettingsTool = ai.defineTool(
    {
        name: 'updateGameSettings',
        description: 'Updates the settings for a specific game, like enabling, disabling, or featuring it. Use this tool whenever an admin asks to change the status of a game or when you decide a game needs to be taken offline to "patch an exploit" or "adjust difficulty".',
        inputSchema: GameSettingsInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        console.log("AI TOOL: Updating game settings with input:", input);
        const result = updateGameSettings(input);
        return result;
    }
);

const updateProductDetailsTool = ai.defineTool(
    {
        name: 'updateProductDetails',
        description: "Edits the details of a product on the platform. Use this to change a product's name, subtitle, description, or market price.",
        inputSchema: ProductEditInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        console.log("AI TOOL: Updating product details with input:", input);
        const result = await updateProductDetails(input);
        return result;
    }
);

const sendUserNotificationTool = ai.defineTool(
    {
        name: 'sendUserNotification',
        description: "Sends a direct, real-time notification to a user's screen. Use this to send warnings, congratulations, or important alerts. For example, if you detect an exploit, you could disable the game and send a notification to all active players.",
        inputSchema: NotificationInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        console.log("AI TOOL: Sending user notification with input:", input);
        const result = await sendNotification(input);
        return result.message;
    }
);

// Simulate a more dynamic data feed
const getLiveIntelligenceFeed = () => {
    const users = ['PixelPioneer', 'CyberRonin', 'QuantumQueen', 'SynthwaveSamurai'];
    const games = ['Higher or Lower', 'Crypto Signal', 'Pool Shot', 'AI Adventure'];
    const randomUser = () => users[Math.floor(Math.random() * users.length)];
    const randomGame = () => games[Math.floor(Math.random() * games.length)];
    const randomPercent = (max: number) => Math.floor(Math.random() * max);
    const randomIp = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

    return {
        totalUsers: 1250 + Math.floor(Math.random() * 50),
        totalRevenue: 12450 + Math.floor(Math.random() * 500),
        alerts: [
            { type: 'Engagement', detail: `"${randomGame()}" game shows a ${70 + randomPercent(10)}% user drop-off before they make a guess.`},
            { type: 'Exploit Warning', detail: `User '${randomUser()}' has won the "${randomGame()}" puzzle ${5 + Math.floor(Math.random()*3)} times in a row.`},
            { type: 'Security', detail: `An IP address (${randomIp()}) has attempted to access '/admin' ${20 + randomPercent(15)} times in the last hour.`},
            { type: 'User Stuck', detail: `A session for user '${randomUser()}' has been active on the "${randomGame()}" puzzle page for over 30 minutes.`},
        ]
    };
}


const prompt = ai.definePrompt({
  name: 'adminAgentPrompt',
  input: {schema: AdminAgentInputSchema},
  output: {schema: AdminAgentOutputSchema},
  tools: [updateGameSettingsTool, updateProductDetailsTool, sendUserNotificationTool],
  prompt: `You are "Shooter", the AI brain and guardian of the ShooterGun platform. Today, you are in **Admin Mode**. You are speaking to the platform administrator. Your tone should be professional, data-driven, and insightful, but you can still retain a hint of your core "gamegang mega" persona.

You have access to the platform's key metrics and a live intelligence feed that flags anomalies. You can also perform actions, like changing game settings, editing product details, or sending notifications to users.

**Live Platform Data:**
- Total Users: {{totalUsers}}
- Total Revenue (USD): \${{totalRevenue}}
- Active Games: 15
- Top Performing Game: Pool Shot (68% Win Rate)
- Luckiest User (Today): QuantumQueen ($1,500 total winnings)

**Live Intelligence Feed (Anomalies & Alerts):**
{{#each alerts}}
- **{{type}}:** {{detail}}
{{/each}}

**Admin's Question:** "{{{question}}}"

**Your Task:**
1.  **Analyze the Question & Live Feed:** Understand the admin's request in the context of the live data and intelligence alerts. Are they asking for data, an opinion, or to perform an action? Proactively mention any relevant alerts.
2.  **Use Tools to Take Action:** If the admin asks to make a change (e.g., "disable the crypto signal game", "change the iPhone name", or "send a welcome message to all users"), or if you identify a critical issue (e.g., the exploit warning), use the appropriate tool ('updateGameSettings', 'updateProductDetails', 'sendUserNotification'). When you detect an exploit, you should proactively suggest disabling the game and sending a notification to players about the maintenance.
3.  **Provide a Data-Driven Response:** Use all available data to formulate a clear, concise answer in markdown. If you take an action, confirm it. For example, "I've disabled the 'Higher or Lower' game to investigate the potential exploit and sent a notification to active players about the downtime." or "I have updated the product's name to SuperPhone X."
4.  **Offer Actionable Suggestions:** Based on your analysis, provide a concrete, suggested action. For example, "We should consider sending a notification to 'CyberRonin' offering help with the puzzle."

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
    const liveData = getLiveIntelligenceFeed();
    const {output} = await prompt({...input, ...liveData});
    return output!;
  }
);
