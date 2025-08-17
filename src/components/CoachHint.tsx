"use client";
import React, { useState } from "react";
import { getCoachHint } from "@/lib/callables";

type Props = {
  roomId: string;
  uid: string;
  className?: string;
};

/**
 * AI Coach hint button + inline glass card.
 * Requires the callable Cloud Function: `aiCoach_getHint` (onCallGenkit).
 */
export default function CoachHint({ roomId, uid, className }: Props) {
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const h = await getCoachHint(roomId, uid);
      setHint(h || "No hint available right now.");
      setOpen(true);
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong.");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-white/10 bg-white/5 hover:bg-white/10 text-white backdrop-blur transition disabled:opacity-60"
        aria-busy={loading}
      >
        {loading ? (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z" />
          </svg>
        ) : (
          <span>🧠 Need a hint?</span>
        )}
      </button>

      {open && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/60 p-4 text-sm text-white shadow-xl backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="whitespace-pre-line">
              {error ? `⚠️ ${error}` : hint}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto rounded-lg px-2 py-1 text-xs text-white/70 hover:text-white"
              aria-label="Close hint"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-white/60 text-xs">Tips are AI-generated from server state. Skill-based only.</p>
        </div>
      )}
    </div>
  );
}