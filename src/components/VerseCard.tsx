import type { Verse } from "@/lib/verses";
import verseBg from "@/assets/verse-bg.jpg.asset.json";

interface VerseCardProps {
  verse: Verse;
  onInterpret?: () => void;
  onShare?: () => void;
}

export function VerseCard({ verse, onInterpret, onShare }: VerseCardProps) {
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

        {(onInterpret || onShare) && (
          <div className="mt-8 flex gap-3">
            {onInterpret && (
              <button
                type="button"
                onClick={onInterpret}
                className="rounded-full border border-white/40 bg-white/5 px-5 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                Interpretar
              </button>
            )}
            {onShare && (
              <button
                type="button"
                onClick={onShare}
                className="rounded-full border border-white/40 bg-white/5 px-5 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                Compartir
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}