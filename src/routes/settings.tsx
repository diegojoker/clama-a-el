import { createFileRoute } from "@tanstack/react-router";
import { Star, Share2, Sun, Moon, BookOpen } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useTheme } from "@/components/ThemeProvider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS, type Theme, type Translation } from "@/lib/storage";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Ajustes — Versículo del Día" }],
  }),
  component: Settings,
});

const TRANSLATIONS: { id: Translation; name: string; available: boolean }[] = [
  { id: "RV1960", name: "Reina Valera 1960", available: true },
  { id: "NVI", name: "Nueva Versión Internacional", available: false },
  { id: "BJ", name: "Biblia de Jerusalén", available: false },
];

const THEMES: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Claro", icon: Sun },
  { id: "dark", label: "Oscuro", icon: Moon },
  { id: "sepia", label: "Sepia", icon: BookOpen },
];

function Settings() {
  const { theme, setTheme } = useTheme();
  const [translation, setTranslation] = useLocalStorage<Translation>(
    STORAGE_KEYS.translation,
    "RV1960"
  );
  const [notifyTime, setNotifyTime] = useLocalStorage<string>(
    STORAGE_KEYS.notifyTime,
    "08:00"
  );

  const onShareApp = async () => {
    const text = "Descubre el Versículo del Día — tu palabra diaria de Dios.";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Versículo del Día", text });
        return;
      } catch {
        /* cancelled */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alert("Mensaje copiado al portapapeles");
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background px-6 pt-10 pb-28">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Preferencias</p>
        <h1 className="mt-1 font-serif-verse text-3xl text-foreground">Ajustes</h1>
      </header>

      <Section title="Notificación diaria">
        <label className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4">
          <span className="text-sm text-foreground">Hora del recordatorio</span>
          <input
            type="time"
            value={notifyTime}
            onChange={(e) => setNotifyTime(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </label>
      </Section>

      <Section title="Traducción bíblica">
        <div className="space-y-2">
          {TRANSLATIONS.map((t) => {
            const selected = translation === t.id;
            return (
              <button
                key={t.id}
                type="button"
                disabled={!t.available}
                onClick={() => t.available && setTranslation(t.id)}
                className={
                  "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all " +
                  (selected
                    ? "border-accent bg-accent/10"
                    : "border-border bg-card hover:border-accent/40") +
                  (t.available ? "" : " opacity-50")
                }
              >
                <span className="text-sm font-medium text-foreground">{t.name}</span>
                {!t.available && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Próximamente
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Tema visual">
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((t) => {
            const Icon = t.icon;
            const selected = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTheme(t.id)}
                className={
                  "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 transition-all " +
                  (selected
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-card text-foreground hover:border-accent/40")
                }
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{t.label}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Comunidad">
        <div className="space-y-2">
          <button
            type="button"
            onClick={() =>
              typeof window !== "undefined" &&
              window.open("https://play.google.com", "_blank", "noopener,noreferrer")
            }
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 text-left transition-colors hover:border-accent/40"
          >
            <Star className="h-5 w-5 text-accent" />
            <div>
              <div className="text-sm font-medium text-foreground">Valora la app</div>
              <div className="text-xs text-muted-foreground">Ayúdanos con una reseña</div>
            </div>
          </button>
          <button
            type="button"
            onClick={onShareApp}
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 text-left transition-colors hover:border-accent/40"
          >
            <Share2 className="h-5 w-5 text-accent" />
            <div>
              <div className="text-sm font-medium text-foreground">Comparte con amigos</div>
              <div className="text-xs text-muted-foreground">Lleva la Palabra a más personas</div>
            </div>
          </button>
        </div>
      </Section>

      <BottomNav />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}