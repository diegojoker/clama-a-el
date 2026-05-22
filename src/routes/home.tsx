import { useMemo, useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Share2, BookOpen, Star, Sparkles, Heart, Mic, Send } from "lucide-react";
import { VerseCard } from "@/components/VerseCard";
import { StreakBadge } from "@/components/StreakBadge";
import { BottomNav } from "@/components/BottomNav";
import { AdBanner } from "@/components/AdBanner";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { useStreak } from "@/hooks/useStreak";
import { formatDateEs, getVerseOfDay } from "@/lib/verses";
import { STORAGE_KEYS, readLS, writeLS } from "@/lib/storage";

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
  
  const [userName, setUserName] = useState("Hijo de Dios");
  const [balance, setBalance] = useState(10);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUserName(readLS(STORAGE_KEYS.userName, "Hijo de Dios"));
    setBalance(readLS(STORAGE_KEYS.gracias, 10));
  }, []);

  const deductGracias = (amount: number, actionLabel: string) => {
    if (balance < amount) {
      alert("No tienes suficientes gracias. Ve a la tienda para conseguir más.");
      navigate({ to: "/gracias" });
      return false;
    }
    const newBalance = balance - amount;
    setBalance(newBalance);
    writeLS(STORAGE_KEYS.gracias, newBalance);
    alert(`Has usado ${amount} gracias para: ${actionLabel}`);
    return true;
  };

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
      
      <header className="flex items-center justify-between px-6 pt-10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {today}
          </p>
          <h1 className="mt-1 font-serif-verse text-xl text-foreground">
            Hola, {userName}
          </h1>
        </div>
        <button 
          onClick={() => navigate({ to: "/gracias" })}
          className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-sm font-bold text-accent transition-transform active:scale-95"
        >
          <Star className="h-4 w-4 fill-accent" />
          {balance} <span className="text-[10px] font-medium uppercase tracking-wider ml-0.5">gracias</span>
        </button>
      </header>

      <div className="px-6">
        <div className="mb-4 flex justify-center">
          <StreakBadge count={streak} />
        </div>

        <VerseCard verse={verse} />

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => deductGracias(1, "Explicar versículo")}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 transition-colors hover:border-accent/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Explicar</span>
            <span className="text-[9px] font-medium text-muted-foreground flex items-center gap-0.5">
              <Star className="h-2 w-2 fill-accent text-accent" /> 1
            </span>
          </button>

          <button
            type="button"
            onClick={() => deductGracias(2, "Orar con el versículo")}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 transition-colors hover:border-accent/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Orar</span>
            <span className="text-[9px] font-medium text-muted-foreground flex items-center gap-0.5">
              <Star className="h-2 w-2 fill-accent text-accent" /> 2
            </span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 transition-colors hover:border-accent/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Compartir</span>
            <span className="text-[9px] font-medium text-green-600 uppercase">Gratis</span>
          </button>
        </div>

        <div className="mt-10">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            ¿Cómo estás hoy?
          </h2>
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-focus-within ring-accent/20 focus-within:ring-2 focus-within:border-accent/40">
            <textarea
              placeholder="Escribe tus pensamientos o peticiones..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-transparent p-4 pb-14 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[100px] resize-none"
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent">
                <Mic className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-3">
              <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-0.5">
                <Star className="h-2.5 w-2.5 fill-accent text-accent" /> 3 gracias
              </span>
              <button 
                onClick={() => {
                  if (message.trim().length === 0) return;
                  navigate({ to: "/hablar" });
                }}
                className="flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"

                disabled={!message.trim()}
              >
                Hablar
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/reader",
                search: { book: verse.book, chapter: verse.chapter },
              })
            }
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:border-accent"
          >
            <BookOpen className="h-4 w-4" />
            Leer capítulo completo
          </button>
        </div>
      </div>

      <div className="fixed bottom-14 left-1/2 z-30 w-full max-w-md -translate-x-1/2">
        <AdBanner />
      </div>
      <BottomNav />
    </div>
  );
}
