tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

type ToastVariant = "default" | "success" | "warning" | "destructive";

export type ToastOptions = {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  duration?: number; // ms
  variant?: ToastVariant;
  action?: { label: string; onClick: () => void };
};

type ToastItem = Required<ToastOptions> & { id: string; createdAt: number };

type ToastContextType = {
  toast: (opts: ToastOptions) => string; // returns id
  dismiss: (id?: string) => void;        // if no id: dismiss all
  toasts: ToastItem[];
};

const ToastContext = createContext<ToastContextType | null>(null);

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function variantClasses(v: ToastVariant) {
  switch (v) {
    case "success":
      return "border-emerald-400/25 bg-emerald-500/10 text-emerald-100";
    case "warning":
      return "border-amber-400/25 bg-amber-500/10 text-amber-100";
    case "destructive":
      return "border-rose-400/25 bg-rose-500/10 text-rose-100";
    default:
      return "border-white/10 bg-white/5 text-white";
  }
}

function variantIcon(v: ToastVariant) {
  switch (v) {
    case "success":
      return "✅";
    case "warning":
      return "⚠️";
    case "destructive":
      return "⛔";
    default:
      return "🔔";
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, any>>({});

  const dismiss = useCallback((id?: string) => {
    setToasts((prev) => (id ? prev.filter((t) => t.id !== id) : []));
    if (id) {
      clearTimeout(timers.current[id]);
      delete timers.current[id];
    } else {
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
    }
  }, []);

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = opts.id ?? uid();
      const item: ToastItem = {
        id,
        title: opts.title ?? "",
        description: opts.description ?? "",
        duration: opts.duration ?? 4000,
        variant: opts.variant ?? "default",
        action: opts.action ?? { label: "", onClick: () => {} },
        createdAt: Date.now(),
      };
      setToasts((prev) => [...prev, item]);

      if (item.duration > 0) {
        timers.current[id] = setTimeout(() => dismiss(id), item.duration);
      }
      return id;
    },
    [dismiss]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
    };
  }, []);

  const value = useMemo(() => ({ toast, dismiss, toasts }), [toast, dismiss, toasts]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within <ToastProvider>.");
  }
  return ctx;
}

// ---- UI ----

export function Toaster({
  position = "bottom-right",
  className = "",
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  className?: string;
}) {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const pos =
    position === "top-right"
      ? "top-4 right-4"
      : position === "top-left"
      ? "top-4 left-4"
      : position === "bottom-left"
      ? "bottom-4 left-4"
      : "bottom-4 right-4";

  return createPortal(
    <div className={`fixed z-[1000] ${pos} ${className} space-y-2 w-[min(360px,calc(100vw-2rem))]`}>
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={`group relative overflow-hidden rounded-2xl border backdrop-blur shadow-xl
                      ${variantClasses(t.variant)} transition-all animate-in fade-in slide-in-from-bottom-2`}
        >
          <div className="flex items-start gap-3 p-4">
            <div className="text-lg leading-none mt-0.5">{variantIcon(t.variant)}</div>
            <div className="min-w-0 flex-1">
              {t.title ? <div className="font-medium leading-5">{t.title}</div> : null}
              {t.description ? (
                <div className="mt-1 text-sm/5 text-white/80">{t.description}</div>
              ) : null}
              {t.action?.label ? (
                <button
                  onClick={() => {
                    try { t.action.onClick(); } finally { dismiss(t.id); }
                  }}
                  className="mt-3 inline-flex items-center rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/15"
                >
                  {t.action.label}
                </button>
              ) : null}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-md p-1 text-white/70 hover:text-white"
              aria-label="Dismiss"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
          {/* subtle progress bar */}
          {t.duration > 0 ? (
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
              <div
                className="h-full bg-white/40"
                style={{
                  width: "100%",
                  animation: `toastbar ${t.duration}ms linear forwards`,
                }}
              />
            </div>
          ) : null}
        </div>
      ))}

      {/* tiny keyframes for the bar */}
      <style jsx global>{`
        @keyframes toastbar {
          from { transform: translateX(0%); }
          to   { transform: translateX(100%); }
        }
        .animate-in {
          animation-duration: 180ms;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-bottom-2 { animation-name: slideInFromBottom; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInFromBottom { from { transform: translateY(8px) } to { transform: translateY(0) } }
      `}</style>
    </div>,
    document.body
  );
}