import versesData from "@/data/verses.es.json";

export interface Verse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

export const verses = versesData as Verse[];

function dayIndex(date = new Date()): number {
  // YYYY-MM-DD based deterministic index
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  // days since epoch (local)
  const dayNum = Math.floor(Date.UTC(y, m, d) / 86_400_000);
  return dayNum;
}

export function getVerseOfDay(date = new Date()): Verse {
  const idx = dayIndex(date) % verses.length;
  return verses[(idx + verses.length) % verses.length];
}

export function formatDateEs(date = new Date()): string {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}