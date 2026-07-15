import { useEffect, useLayoutEffect, useState } from "react";
import { STORAGE_KEYS, readLS, writeLS } from "@/lib/storage";

type Step = {
  targetId: string;
  text: string;
  button: string;
};

const STEPS: Step[] = [
  {
    targetId: "mood-chip",
    text: "Aquí está tu estado de ánimo. Tócalo para cambiarlo cuando te sientas diferente.",
    button: "Entendido",
  },
  {
    targetId: "gracias-balance",
    text: "Estas son tus gracias — tus monedas de fe. Gánalas cada día orando y compartiendo.",
    button: "Siguiente",
  },
  {
    targetId: "heart-card",
    text: "Aquí puedes hablar con tu guía espiritual. Escribe lo que sientes y recibe palabras de Dios para ti.",
    button: "Siguiente",
  },
  {
    targetId: "nav-mural",
    text: "Este es el Mural de Oración — una comunidad que ora junta. ¡Pide oración o ora por alguien!",
    button: "Comenzar ✨",
  },
];

export function OnboardingTooltips() {
  const [enabled, setEnabled] = useState(false);
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const onboarded = readLS<boolean>(STORAGE_KEYS.onboarded, false);
    const shown = readLS<boolean>(STORAGE_KEYS.tooltipsShown, false);
    if (onboarded && !shown) {
      const t = window.setTimeout(() => setEnabled(true), 400);
      return () => window.clearTimeout(t);
    }
  }, []);

  useLayoutEffect(() => {
    if (!enabled) return;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(
        `[data-tooltip-id="${STEPS[i].targetId}"]`,
      );
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        window.setTimeout(() => setRect(el.getBoundingClientRect()), 250);
      } else {
        setRect(null);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [enabled, i]);

  if (!enabled) return null;

  const step = STEPS[i];
  const isLast = i === STEPS.length - 1;

  const next = () => {
    if (isLast) {
      writeLS(STORAGE_KEYS.tooltipsShown, true);
      setEnabled(false);
    } else {
      setI((n) => n + 1);
    }
  };

  // spotlight box (with 8px padding)
  const pad = 8;
  const spotlight = rect
    ? {
        top: Math.max(0, rect.top - pad),
        left: Math.max(0, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  // Card position: below the target if there's room, else above
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
  const showBelow = spotlight ? spotlight.top + spotlight.height + 160 < viewportH : true;
  const cardTop = spotlight
    ? showBelow
      ? spotlight.top + spotlight.height + 12
      : Math.max(16, spotlight.top - 12 - 160)
    : viewportH / 2 - 80;

  return (
    <div className="fixed inset-0 z-[100]" aria-live="polite">
      {/* Overlay with spotlight cutout via 4 rects */}
      {spotlight ? (
        <>
          <div className="absolute left-0 right-0 top-0 bg-black/60" style={{ height: spotlight.top }} />
          <div
            className="absolute left-0 bg-black/60"
            style={{ top: spotlight.top, height: spotlight.height, width: spotlight.left }}
          />
          <div
            className="absolute bg-black/60"
            style={{
              top: spotlight.top,
              left: spotlight.left + spotlight.width,
              right: 0,
              height: spotlight.height,
            }}
          />
          <div
            className="absolute left-0 right-0 bg-black/60"
            style={{ top: spotlight.top + spotlight.height, bottom: 0 }}
          />
          {/* Ring around target */}
          <div
            className="pointer-events-none absolute rounded-2xl"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
              boxShadow: "0 0 0 2px #c9a84c, 0 0 24px rgba(201,168,76,0.55)",
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/60" />
      )}

      {/* Tooltip card */}
      <div
        className="absolute left-1/2 w-[min(360px,calc(100%-32px))] -translate-x-1/2 rounded-2xl bg-white p-5 shadow-2xl animate-fade-in"
        style={{ top: cardTop }}
      >
        <p className="text-[14px] leading-snug" style={{ color: "#2c1810" }}>
          {step.text}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">
            {i + 1} / {STEPS.length}
          </span>
          <button
            type="button"
            onClick={next}
            className="rounded-full px-5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "#1a3a5c" }}
          >
            {step.button}
          </button>
        </div>
      </div>
    </div>
  );
}