import * as admin from "firebase-admin";
import { onCallGenkit, hasClaim } from "firebase-functions/https";
import * as functions from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { coachFlow, opponentFlow, suggesterFlow, puzzleGenFlow } from "./ai/flows.js";

if (!admin.apps.length) admin.initializeApp();

// ---- Secrets (configure one of these) ----
// If you're using Google AI (Gemini), store GEMINI_API_KEY in Secret Manager:
export const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");
// If you're using OpenAI via Genkit's OpenAI plugin, store OPENAI_API_KEY:
export const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

// ---- Expose Genkit flows as callable functions (recommended by Firebase) ----
export const aiCoach_getHint = onCallGenkit(
  { authPolicy: hasClaim("email_verified"), enforceAppCheck: true, secrets: [GEMINI_API_KEY, OPENAI_API_KEY] },
  coachFlow
);

export const aiOpponent_nextMove = onCallGenkit(
  { authPolicy: hasClaim("email_verified"), enforceAppCheck: true },
  opponentFlow
);

export const aiSuggest_challenge = onCallGenkit(
  { authPolicy: hasClaim("email_verified"), enforceAppCheck: true },
  suggesterFlow
);

export const puzzles_generate = onCallGenkit(
  { authPolicy: hasClaim("email_verified"), enforceAppCheck: true },
  puzzleGenFlow
);

// ---- Moderation trigger (uses plain Functions, can call flows internally later) ----
export const moderate_onMessageCreate = functions.firestore
  .document("messages/{roomId}/{msgId}")
  .onCreate(async (snap) => {
    const text = String(snap.data()?.text || "");
    const lowKeywords = ["scam", "hack link"]; // fast heuristic
    let flagged = lowKeywords.some((w) => text.toLowerCase().includes(w));
    let reason = flagged ? "keyword" : "";
    if (!flagged) {
      // quick LLM moderation using Genkit generate
      const prompt = `Classify for safety. Return JSON {"flagged":true|false,"reason":"..."}.
Text: ${text.slice(0, 500)}`;
      const { genkit } = await import("genkit");
      const { googleAI } = await import("@genkit-ai/googleai");
      const ai = genkit({ plugins: [googleAI()] });
      try {
        const { text: out } = await ai.generate({ model: "googleai/gemini-2.5-flash", prompt, config: { temperature: 0 } });
        const parsed = JSON.parse(out || "{}");
        flagged = !!parsed.flagged; reason = parsed.reason || reason;
      } catch { /* soft fail */ }
    }
    if (flagged) await snap.ref.update({ moderated: { flagged: true, reason } });
  });

// ---- Daily insights (scheduled) ----
export const admin_dailyInsights = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("UTC")
  .onRun(async () => {
    const db = admin.firestore();
    const lb = await db.collection("leaderboards").orderBy("createdAt","desc").limit(1000).get();
    const kpi = {
      plays: lb.size,
      byGame: lb.docs.reduce((m, d) => { const g=(d.data().gameId||"unknown"); m[g]=(m[g]||0)+1; return m; }, {} as Record<string,number>)
    };
    const { genkit } = await import("genkit");
    const { googleAI } = await import("@genkit-ai/googleai");
    const ai = genkit({ plugins: [googleAI()] });
    const prompt = [
      "You are an analytics copilot. Given KPIs, output 3 bullet insights and 2 concrete admin actions.",
      `KPIs: ${JSON.stringify(kpi)}`,
      "No gambling terminology."
    ].join("\n");
    const { text } = await ai.generate({ model: "googleai/gemini-2.5-flash", prompt, config: { temperature: 0.2 } });
    await db.collection("admin_reports").add({ date: new Date().toISOString().slice(0,10), kpi, insights: text });
  });