import { useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Share2, BookOpen } from "lucide-react";
import { VerseCard } from "@/components/VerseCard";
import { StreakBadge } from "@/components/StreakBadge";
import { BottomNav } from "@/components/BottomNav";
import { AdBanner } from "@/components/AdBanner";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { useStreak } from "@/hooks/useStreak";
import { formatDateEs, getVerseOfDay } from "@/lib/verses";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Hoy — Versículo del Día" },
      { name: "description", content: "Tu versículo bíblico de hoy." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const streak = useStreak();
  const verse = useMemo(() => getVerseOfDay(), []);
  const today = useMemo(() => formatDateEs(), []);

  const onShare = async () => {
    const text = `“${verse.text}”\n— ${verse.reference}\n\nVersículo del Día`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Versículo del Día", text });
        return;
      } catch {
        /* user cancelled */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      alert("Versículo copiado al portapapeles");
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-32">
      <ThemeBootstrap />
      <header className="px-6 pt-10 pb-4">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
          {today}
        </p>
        <h1 className="mt-1 font-serif-verse text-2xl text-foreground">
          Versículo de hoy
        </h1>
      </header>

      <div className="px-6">
        <VerseCard verse={verse} />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/reader",
                search: { book: verse.book, chapter: verse.chapter },
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:opacity-90"
          >
            <BookOpen className="h-4 w-4" />
            Leer más
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-accent"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <StreakBadge count={streak} />
        </div>
      </div>

      <div className="fixed bottom-14 left-1/2 z-30 w-full max-w-md -translate-x-1/2">
        <AdBanner />
      </div>
      <BottomNav />
    </div>
  );
}