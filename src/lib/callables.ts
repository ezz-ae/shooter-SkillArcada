
'use server';

// Client helpers for calling Firebase callable functions (Genkit-wrapped)
// Adjust the firebaseApp import path if your app initializes elsewhere.
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from "@/lib/firebase"; // 🔧 ensure this exists in your project

/**
 * Get an AI hint from the Coach for the current room.
 * The corresponding Cloud Function should be exposed as `aiCoach_getHint`
 * via onCallGenkit in your Functions code.
 */
export async function callCoachHintCallable(roomId: string, uid: string) {
  const fn = httpsCallable(getFunctions(app), "aiCoach_getHint");
  const res: any = await fn({ uid, roomId });
  return (res?.data?.hint as string) || "";
}

/**
 * (Optional) Personalized challenge suggestion.
 * Requires an exported `aiSuggest_challenge` callable.
 */
export async function getSuggestedChallenge(uid: string) {
  const fn = httpsCallable(getFunctions(app), "aiSuggest_challenge");
  const res: any = await fn({ uid });
  return res?.data as { gameId: string; difficulty: "easy"|"med"|"hard"; why: string };
}

/**
 * (Optional) Ask the AI opponent to produce a next move for the room.
 * Requires an exported `aiOpponent_nextMove` callable.
 */
export async function getOpponentMove(roomId: string, uid: string) {
  const fn = httpsCallable(getFunctions(app), "aiOpponent_nextMove");
  const res: any = await fn({ uid, roomId });
  return res?.data?.move;
}

/**
 * (Optional) Generate a server-verified puzzle (math/memory/path/chess).
 * Requires an exported `puzzles_generate` callable.
 */
export async function generatePuzzle(uid: string, kind: "math"|"memory"|"path"|"chess", difficulty: "easy"|"med"|"hard") {
  const fn = httpsCallable(getFunctions(app), "puzzles_generate");
  const res: any = await fn({ uid, kind, difficulty });
  return res?.data as { id: string; puzzle: any };
}

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
