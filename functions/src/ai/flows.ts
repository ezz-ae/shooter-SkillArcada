import * as admin from "firebase-admin";
import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/googleai";
import { openAI } from "@genkit-ai/compat-oai/openai";

if (!admin.apps.length) admin.initializeApp();

// ---- Genkit init with pluggable provider ----
// Default: Google AI (Gemini). To switch to OpenAI, set AI_PROVIDER=openai.
const PROVIDER = process.env.AI_PROVIDER?.toLowerCase() || "google";
const ai = genkit({
  plugins: [PROVIDER === "openai" ? openAI() : googleAI()],
});

// pick a sensible default model per provider
const defaultModel =
  PROVIDER === "openai" ? "openai/gpt-4o-mini" : "googleai/gemini-2.5-flash";

// --- small helpers ---
const db = admin.firestore();

async function assertWithinRate(uid: string, bucket: string, limitPerMin = 8) {
  const now = admin.firestore.Timestamp.now();
  const start = admin.firestore.Timestamp.fromMillis(now.toMillis() - 60_000);
  const ref = db.collection("rate_limiter").doc(`${uid}:${bucket}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const hits: admin.firestore.Timestamp[] =
      (snap.data()?.hits || []).filter((t: admin.firestore.Timestamp) => t.toMillis() > start.toMillis());
    if (hits.length >= limitPerMin) throw new Error("rate-limit-exceeded");
    hits.push(now);
    tx.set(ref, { hits }, { merge: true });
  });
}

async function recordUsage(entry: any) {
  await db.collection("ai_sessions").add({
    ...entry,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ---------------- Flows ----------------

// AI Coach: returns one short hint + micro-checklist
export const coachFlow = ai.defineFlow(
  {
    name: "coachFlow",
    inputSchema: z.object({ uid: z.string(), roomId: z.string() }),
    outputSchema: z.object({ hint: z.string() }),
  },
  async ({ uid, roomId }) => {
    await assertWithinRate(uid, "coach", 8);
    const roomSnap = await db.collection("rooms").doc(roomId).get();
    if (!roomSnap.exists) throw new Error("room-not-found");
    const room = roomSnap.data()!;
    if (!Array.isArray(room.members) || !room.members.includes(uid))
      throw new Error("not-a-member");
    if (room.status !== "active") throw new Error("room-not-active");

    const prompt = [
      "You are Shooter, an ultra-concise skill coach.",
      `Game: ${room.gameId}`,
      `State JSON: ${JSON.stringify(room.state).slice(0, 4000)}`,
      "Goal: give ONE short hint (<= 2 lines), then a tiny 1–2 step checklist.",
      "No gambling language. Focus on timing, attention, or logic.",
    ].join("\n");

    const { text } = await ai.generate({ model: defaultModel, prompt, config: { temperature: 0.2, maxOutputTokens: 180 }});
    const hint = (text || "").trim();
    await recordUsage({ role: "coach", uid, roomId, gameId: room.gameId, prompt, output: hint });
    return { hint };
  }
);

// AI Opponent: deterministic legal move using simple seed
export const opponentFlow = ai.defineFlow(
  {
    name: "opponentFlow",
    inputSchema: z.object({ uid: z.string(), roomId: z.string() }),
    outputSchema: z.object({ move: z.any() }),
  },
  async ({ uid, roomId }) => {
    await assertWithinRate(uid, "opponent", 12);
    const ref = db.collection("rooms").doc(roomId);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("room-not-found");
    const room = snap.data()!;

    const seedStr = room.serverSeed || roomId;
    const seed = [...String(seedStr)].reduce((a, c) => a + c.charCodeAt(0), 0);
    const rng = (() => {
      let a = seed >>> 0;
      return () => {
        a = (a + 0x6D2B79F5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), a | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();

    const legal = Array.isArray(room?.state?.legalMoves) ? room.state.legalMoves : [];
    const move = legal.length ? legal[Math.floor(rng() * legal.length)] : null;

    await ref.collection("events").add({
      type: "BOT_MOVE",
      move,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    await recordUsage({ role: "opponent", uid, roomId, move });
    return { move };
  }
);

// AI Suggester: reads last scores and returns one recommendation
export const suggesterFlow = ai.defineFlow(
  {
    name: "suggesterFlow",
    inputSchema: z.object({ uid: z.string() }),
    outputSchema: z.object({ gameId: z.string(), difficulty: z.enum(["easy","med","hard"]), why: z.string() }),
  },
  async ({ uid }) => {
    await assertWithinRate(uid, "suggester", 6);
    const [u, scores] = await Promise.all([
      db.collection("users").doc(uid).get(),
      db.collection("leaderboards").where("userId","==",uid).orderBy("createdAt","desc").limit(50).get()
    ]);
    const user = u.data() || {};
    const hist = scores.docs.map(d => d.data());
    const summary = hist.reduce((m: any, s: any) => {
      const g = s.gameId || "unknown";
      m[g] = m[g] || { plays: 0, total: 0 };
      m[g].plays++; m[g].total += s.score || 0;
      return m;
    }, {});
    Object.keys(summary).forEach(g => summary[g].avg = summary[g].total / summary[g].plays);

    const prompt = [
      "You are Shooter Coach. Recommend one skill challenge for the user.",
      `User: ${JSON.stringify({ country: user.country, skill: user.skill })}`,
      `History: ${JSON.stringify(summary)}`,
      `Return strict JSON: {"gameId":"...","difficulty":"easy|med|hard","why":"<=120 chars"}`,
      "No gambling terms."
    ].join("\n");

    const { text } = await ai.generate({ model: defaultModel, prompt, config: { temperature: 0.3, maxOutputTokens: 200 }});
    let parsed: any;
    try { parsed = JSON.parse(text || ""); }
    catch { parsed = { gameId: "pool-shot", difficulty: "med", why: "Balanced for your recent performance." }; }

    await recordUsage({ role: "suggester", uid, input: prompt, output: text });
    return parsed;
  }
);

// Puzzle generator: math (extend later)
export const puzzleGenFlow = ai.defineFlow(
  {
    name: "puzzleGenFlow",
    inputSchema: z.object({ uid: z.string(), kind: z.enum(["math","memory","path","chess"]), difficulty: z.enum(["easy","med","hard"]) }),
    outputSchema: z.object({ id: z.string(), puzzle: z.any() }),
  },
  async ({ uid, kind, difficulty }) => {
    await assertWithinRate(uid, "puzzleGen", 5);
    const genMath = () => {
      const n = difficulty === "easy" ? 2 : difficulty === "med" ? 3 : 4;
      const nums = Array.from({length:n}, ()=>Math.floor(Math.random()*20)+1);
      const ops = ["+","-","*"];
      let expr = ""+nums[0];
      for (let i=1;i<n;i++) expr += ` ${ops[Math.floor(Math.random()*ops.length)]} ${nums[i]}`;
      // eslint-disable-next-line no-new-func
      const value = Function('"use strict";return ('+expr+');')();
      return { statement: `Compute: ${expr}`, solution: Math.round(value*100)/100 };
    };
    const puzzle = kind === "math" ? genMath() : { statement: "TBD", solution: null };
    const doc = await db.collection("generated_puzzles").add({
      kind, difficulty, puzzle, createdBy: uid, createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await recordUsage({ role: "puzzle", uid, kind, difficulty });
    return { id: doc.id, puzzle };
  }
);