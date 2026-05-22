import type { Verse } from "@/lib/verses";

export function VerseCard({ verse }: { verse: Verse }) {
  return (
    <article className="rounded-2xl border border-border bg-card px-6 py-10 shadow-sm">
      <p className="font-serif-verse text-[1.75rem] leading-[1.4] text-foreground">
        “{verse.text}”
      </p>
      <p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-accent">
        {verse.reference}
      </p>
    </article>
  );
}