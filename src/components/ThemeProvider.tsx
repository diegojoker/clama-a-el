import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, type Theme } from "@/lib/storage";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.theme, "light");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark", "sepia");
    root.classList.add(theme);
  }, [theme]);

  return { theme, setTheme };
}

export function ThemeBootstrap() {
  useTheme();
  return null;
}