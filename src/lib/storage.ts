export type Theme = "light" | "dark" | "sepia";
export type Translation = "RV1960" | "NVI" | "BJ";

export const STORAGE_KEYS = {
  onboarded: "vdd:onboarded",
  translation: "vdd:translation",
  theme: "vdd:theme",
  notifyTime: "vdd:notifyTime",
  streak: "vdd:streak",
  gracias: "vdd:gracias",
  userName: "vdd:user_name",
  unlockedWidgets: "vdd:unlocked_widgets",
  activeWidgetTheme: "vdd:active_widget_theme",
  diario: "vdd:diario",
  mural: "vdd:mural",
  currentMood: "vdd:current_mood",
  tradition: "vdd:tradition",
  tooltipsShown: "vdd:tooltips_shown",
} as const;

export interface DiarioEntry {
  id: string;
  date: string;
  humor: string;
  humorEmoji: string;
  content: string;
  responseVerse: {
    text: string;
    reference: string;
  };
  responseText: string;
}

export function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLS<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}