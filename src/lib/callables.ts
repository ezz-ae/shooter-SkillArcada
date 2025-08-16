
'use server';

import { getCoachHint as getCoachHintFlow } from "@/ai/flows/coach-flow";

/**
 * A server action to get a hint from the AI Coach.
 * In a real app, this would fetch the authoritative room/game state from Firestore.
 * For now, it accepts a mock state from the client.
 */
export async function getCoachHint(gameId: string, gameState: any): Promise<string> {
  try {
    const response = await getCoachHintFlow({ gameId, gameState });
    return response.hint;
  } catch (error) {
    console.error("AI Coach callable failed:", error);
    return "My circuits are a bit fuzzy right now. Try asking for a hint again in a moment.";
  }
}
