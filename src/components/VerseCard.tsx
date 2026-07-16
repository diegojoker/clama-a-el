import type { Verse } from "@/lib/verses";
import verseBg from "@/assets/verse-bg.jpg.asset.json";
import { Search, Share2, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface VerseCardProps {
  verse: Verse;
  onInterpret?: () => void;
  onShare?: () => void;
  onWidget?: () => void;
  onReadChapter?: () => void;
  moodEmoji?: string;
  moodLabel?: string;
}

const REVEAL_KEY = "vdd:verseRevealedDate";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function VerseCard({ verse, onInterpret, onShare, onWidget, onReadChapter, moodEmoji, moodLabel }: VerseCardProps) {
  const [revealed, setRevealed] = useState(true);
  const [animating, setAnimating] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 90 + Math.random() * 40;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
        };
      }),
    []
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(REVEAL_KEY);
      setRevealed(stored === todayKey());
    } catch {
      setRevealed(true);
    }
  }, []);

  const handleReveal = () => {
    if (revealed || animating) return;
    setAnimating(true);
    // reveal content after flash (300ms) so it fades in during dissipation
    window.setTimeout(() => {
      setRevealed(true);
      try {
        window.localStorage.setItem(REVEAL_KEY, todayKey());
      } catch {
        /* ignore */
      }
    }, 300);
    window.setTimeout(() => setAnimating(false), 1300);
  };

  const overlayOpacity = revealed ? 0.4 : 0.75;

  return (
    <article
      onClick={!revealed ? handleReveal : undefined}
      role={!revealed ? "button" : undefined}
      tabIndex={!revealed ? 0 : undefined}
      onKeyDown={(e) => {
        if (!revealed && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleReveal();
        }
      }}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-border bg-[#2c1810] shadow-lg"
      style={!revealed ? { cursor: "pointer" } : undefined}
    >
      <img
        src={verseBg.url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div
        className="absolute inset-0 bg-black transition-opacity duration-500"
        style={{ opacity: overlayOpacity }}
      />
      {moodEmoji && moodLabel && (
        <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] text-white backdrop-blur-sm">
          <span>{moodEmoji}</span>
          <span>{moodLabel}</span>
        </div>
      )}
      {/* Divine orb + flash + particles */}
      {!revealed && (
        <>
          <div className={"divine-orb" + (animating ? " divine-orb-flash" : "")} aria-hidden="true" />
          {animating && (
            <>
              {particles.map((p, i) => (
                <span
                  key={i}
                  className="divine-particle"
                  style={{ ["--px" as string]: `${p.x}px`, ["--py" as string]: `${p.y}px` }}
                  aria-hidden="true"
                />
              ))}
            </>
          )}
        </>
      )}
      {animating && revealed && (
        <div className="divine-dissipate" aria-hidden="true" />
      )}
      <div className="relative flex h-full flex-col items-center justify-center px-7 py-8 text-center">
        {!revealed ? (
          <div className="flex flex-col items-center justify-center pt-24">
            <p className="font-serif-verse text-[17px] leading-snug text-white">
              Hay una palabra para ti hoy
            </p>
            <p className="mt-3 animate-fade-hint text-[13px] text-white/60">
              Toca para recibir
            </p>
          </div>
        ) : (
          <>
        <span
          className={"mb-4 text-[10px] uppercase tracking-[0.25em] text-white/80" + (animating ? " verse-line-in" : "")}
          style={animating ? { animationDelay: "0.6s" } : undefined}
        >
          Versículo del día
        </span>
        <p
          className={"font-serif-verse text-xl font-semibold leading-[1.4] italic text-white" + (animating ? " verse-line-in" : "")}
          style={animating ? { animationDelay: "0.7s" } : undefined}
        >
          “{verse.text}”
        </p>
        <p
          className={"mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]" + (animating ? " verse-line-in" : "")}
          style={animating ? { animationDelay: "0.85s" } : undefined}
        >
          {verse.reference}
        </p>
        {onReadChapter && (
          <button
            type="button"
            onClick={onReadChapter}
            className={"mt-1 text-[11px] text-[#c9a84c] hover:underline" + (animating ? " verse-line-in" : "")}
            style={animating ? { animationDelay: "0.9s" } : undefined}
          >
            Leer capítulo completo →
          </button>
        )}

        {(onInterpret || onShare || onWidget) && (
          <div className={"mt-8 flex w-full flex-col items-center gap-3" + (animating ? " verse-buttons-in" : "")}>
            {(onInterpret || onShare) && (
              <div className="flex w-full gap-3">
                {onInterpret && (
                  <button
                    type="button"
                    onClick={onInterpret}
                    className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/15 px-4 py-[10px] text-[13px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                  >
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Interpretar
                  </button>
                )}
                {onShare && (
                  <button
                    type="button"
                    onClick={onShare}
                    className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/15 px-4 py-[10px] text-[13px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
                  >
                    <Share2 className="h-4 w-4" aria-hidden="true" />
                    Compartir
                  </button>
                )}
              </div>
            )}
            {onWidget && (
              <button
                type="button"
                onClick={onWidget}
                className="h-11 w-[60%] inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/15 px-4 py-[10px] text-[13px] font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                En mi pantalla
              </button>
            )}
          </div>
        )}
          </>
        )}
      </div>
    </article>
  );
}