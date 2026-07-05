import { useMemo, useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Share2, BookOpen, Star, Sparkles, Heart, Mic } from "lucide-react";
import { VerseCard } from "@/components/VerseCard";
import { StreakBadge } from "@/components/StreakBadge";
import { BottomNav } from "@/components/BottomNav";
import { AdBanner } from "@/components/AdBanner";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { useStreak } from "@/hooks/useStreak";
import { formatDateEs, getVerseOfDay } from "@/lib/verses";
import { STORAGE_KEYS, readLS, writeLS } from "@/lib/storage";
import { BibleSearch } from "@/components/BibleSearch";
import { toast } from "sonner";

const WEEK_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];
const MOODS = [
  { emoji: "😔", label: "Triste" },
  { emoji: "😰", label: "Ansioso" },
  { emoji: "😤", label: "Frustrado" },
  { emoji: "🙏", label: "Agradecido" },
  { emoji: "😊", label: "En paz" },
  { emoji: "😡", label: "Enojado" },
  { emoji: "💔", label: "Corazón roto" },
  { emoji: "😍", label: "Enamorado" },
  { emoji: "🙁", label: "Solo" },
  { emoji: "😕", label: "Confundido" },
  { emoji: "💪", label: "Con fe" },
  { emoji: "😴", label: "Sin fuerzas" },
];
const TEMAS_HOY = [
  { id: "paz", label: "Paz interior", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80" },
  { id: "familia", label: "Familia", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80" },
  { id: "trabajo", label: "Trabajo", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80" },
  { id: "salud", label: "Salud emocional", image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&q=80" },
  { id: "fe", label: "Fe", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80" },
  { id: "relaciones", label: "Relaciones", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80" },
];

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Hoy — Clama a Él" },
      { name: "description", content: "Clama a mí y te responderé. — Jeremías 33:3" },
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
  const [mood, setMood] = useState<string | null>(null);

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
    const text = `“${verse.text}”\n— ${verse.reference}\n\nClama a Él`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Clama a Él", text });
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
      
      <header className="flex h-8 items-center justify-between px-6">
        <p className="truncate text-[12px] text-muted-foreground">
          {today} · Hola, {userName}
        </p>
        <button
          onClick={() => navigate({ to: "/gracias" })}
          className="flex items-center gap-1 text-[12px] font-bold text-accent transition-transform active:scale-95"
        >
          <Star className="h-3.5 w-3.5 fill-accent" />
          {balance}
          <span className="ml-0.5 text-[10px] font-medium uppercase tracking-wider">gracias</span>
        </button>
      </header>

      <div className="px-6">
        <div className="mb-4 flex justify-center">
          <StreakBadge count={streak} />
        </div>

        {/* Mood selector */}
        <section className="mb-4 rounded-2xl border border-accent/40 bg-card p-4">
          <h2 className="font-serif-verse text-sm text-muted-foreground">Tu estado ahora</h2>
          <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {MOODS.map((m) => {
              const active = mood === m.label;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setMood(m.label)}
                  className={
                    "flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors " +
                    (active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-accent/40")
                  }
                >
                  <span className="text-base leading-none">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] font-medium text-accent">
            Tu versículo y tu guía se adaptan a cómo te sientes
          </p>
        </section>

        {/* Conversation CTA */}
        <button
          type="button"
          onClick={() => navigate({ to: "/hablar" })}
          className="mb-6 flex w-full items-center justify-between gap-4 rounded-2xl bg-primary p-5 text-left text-primary-foreground transition-transform active:scale-[0.99]"
        >
          <div className="flex-1">
            <p className="font-serif-verse text-lg leading-snug">¿Qué hay en tu corazón hoy?</p>
            <p className="mt-1 text-xs text-primary-foreground/70">
              Cuéntame y recibirás palabras que necesitas escuchar
            </p>
          </div>
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
            <Mic className="h-5 w-5" />
          </div>
        </button>

        <VerseCard
          verse={verse}
          onInterpret={() => deductGracias(1, "Interpretar versículo")}
          onShare={onShare}
        />

        <div className="mt-6">
          <BibleSearch />
        </div>

        {/* Tu camino de hoy */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-4">
          <h2 className="font-serif-verse text-lg text-foreground">Tu camino de hoy</h2>
          <div className="mt-4 flex justify-between">
            {WEEK_LETTERS.map((letter, i) => {
              const todayIdx = new Date().getDay();
              const isToday = i === todayIdx;
              const isCompleted = !isToday && i < todayIdx && (todayIdx - i) <= streak;
              const isFuture = i > todayIdx;
              return (
                <div
                  key={i}
                  className={
                    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold " +
                    (isCompleted
                      ? "bg-accent text-white"
                      : isToday
                        ? "border-2 border-accent text-foreground"
                        : isFuture
                          ? "border border-border text-muted-foreground"
                          : "border border-border text-muted-foreground")
                  }
                >
                  {letter}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center font-serif-verse text-base text-foreground">
            🔥 {streak} {streak === 1 ? "día seguido" : "días seguidos"}
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/devocionales" })}
            className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-primary px-6 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Comenzar el día →
          </button>
        </section>

        {/* Temas de hoy */}
        <section className="mt-8 -mx-6">
          <h2 className="mb-3 px-6 font-serif-verse text-lg text-foreground">Temas de hoy</h2>
          <div className="flex gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TEMAS_HOY.map((tema) => (
              <button
                key={tema.id}
                onClick={() =>
                  toast.info("Chat temático próximamente", {
                    description: `${tema.label} — 2 gracias`,
                  })
                }
                className="relative flex-shrink-0 overflow-hidden rounded-xl active:scale-95 transition-transform"
                style={{
                  width: 160,
                  height: 100,
                  backgroundImage: `url(${tema.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 text-left font-serif-verse text-sm font-medium text-white drop-shadow">
                  {tema.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => deductGracias(1, "Explicar versículo")}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 transition-colors hover:border-accent/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Orar</span>
            <span className="text-[9px] font-medium text-muted-foreground flex items-center gap-0.5">
              <Star className="h-2 w-2 fill-accent text-accent" /> 2
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate({ 
              to: "/compartir", 
              search: { 
                text: verse.text, 
                reference: verse.reference,
                book: verse.book,
                chapter: verse.chapter,
                verse: verse.verse
              } 
            })}
            className="flex flex-col items-center gap-1.5 rounded-2xl bg-card border border-border p-3 transition-colors hover:border-accent/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Share2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">Compartir</span>
            <span className="text-[9px] font-medium text-accent uppercase">Gratis</span>
          </button>
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
