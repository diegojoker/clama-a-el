import { useEffect, useState } from "react";
import { STORAGE_KEYS, readLS, writeLS } from "@/lib/storage";

interface StreakData {
  count: number;
  lastOpenISO: string; // YYYY-MM-DD
}

function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86_400_000);
}

export function useStreak(): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const today = todayISO();
    const prev = readLS<StreakData | null>(STORAGE_KEYS.streak, null);
    let next: StreakData;
    if (!prev) {
      next = { count: 1, lastOpenISO: today };
    } else if (prev.lastOpenISO === today) {
      next = prev;
    } else {
      const gap = daysBetween(prev.lastOpenISO, today);
      if (gap === 1) {
        next = { count: prev.count + 1, lastOpenISO: today };
      } else if (gap > 1) {
        next = { count: 1, lastOpenISO: today };
      } else {
        // gap <= 0 (clock skew) — keep
        next = prev;
      }
    }
    writeLS(STORAGE_KEYS.streak, next);
    setCount(next.count);
  }, []);

  return count;
}