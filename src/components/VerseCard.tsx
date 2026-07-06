import type { Verse } from "@/lib/verses";
import verseBg from "@/assets/verse-bg.jpg.asset.json";
import { Search, Share2, Smartphone } from "lucide-react";

interface VerseCardProps {
  verse: Verse;
  onInterpret?: () => void;
  onShare?: () => void;
  onWidget?: () => void;
  onReadChapter?: () => void;
}

export function VerseCard({ verse, onInterpret, onShare, onWidget, onReadChapter }: VerseCardProps) {
  return (
    <article
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-border bg-[#2c1810] shadow-lg"
    >
      <img
        src={verseBg.url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-black/35" />
      <div className="relative flex h-full flex-col items-center justify-center px-7 py-8 text-center">
        <span className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/80">
          Versículo del día
        </span>
        <p className="font-serif-verse text-[1.5rem] leading-[1.4] italic text-white">
          “{verse.text}”
        </p>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#c9a84c]">
          {verse.reference}
        </p>
        {onReadChapter && (
          <button
            type="button"
            onClick={onReadChapter}
            className="mt-1 text-[11px] text-[#c9a84c] hover:underline"
          >
            Leer capítulo completo →
          </button>
        )}

        {(onInterpret || onShare || onWidget) && (
          <div className="mt-8 flex w-full flex-col items-center gap-3">
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
      </div>
    </article>
  );
}