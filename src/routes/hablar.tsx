import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Star, Mic, Send, Heart, Bookmark, ChevronRight } from "lucide-react";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { STORAGE_KEYS, readLS, writeLS, DiarioEntry } from "@/lib/storage";
import { useEffect, useState, useMemo } from "react";
import { getVerseOfDay } from "@/lib/verses";

export const Route = createFileRoute("/hablar")({
  head: () => ({
    meta: [
      { title: "Desahogo — Versículo del Día" },
      { name: "description", content: "Cuéntame cómo te sientes hoy." },
    ],
  }),
  component: HablarScreen,
});

const HUMORS = [
  { id: "triste", label: "Triste", emoji: "😔" },
  { id: "ansioso", label: "Ansioso", emoji: "😰" },
  { id: "frustrado", label: "Frustrado", emoji: "😤" },
  { id: "agradecido", label: "Agradecido", emoji: "🙏" },
  { id: "en-paz", label: "En paz", emoji: "😊" },
];

function HablarScreen() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10);
  const [humor, setHumor] = useState(HUMORS[0]);
  const [content, setContent] = useState("");
  const [step, setStep] = useState<"write" | "response">("write");
  const [saved, setSaved] = useState(false);

  // Mock AI response logic
  const responseVerse = useMemo(() => getVerseOfDay(), []);
  const responseText = useMemo(() => {
    if (humor.id === "triste") return "Recuerda que Dios está cerca de los que tienen el corazón quebrantado. Él enjugará tus lágrimas.";
    if (humor.id === "ansioso") return "No temas, porque Él está contigo. Su paz, que sobrepasa todo entendimiento, guardará tu corazón.";
    if (humor.id === "frustrado") return "Pon tu camino en manos del Señor; confía en Él, y Él actuará a tu favor en su tiempo perfeito.";
    if (humor.id === "agradecido") return "Qué alegría es ver un corazón que reconoce las bendiciones. Él se deleita en tu gratitud.";
    return "Que su paz siga reinando en tu vida hoy y siempre. Eres luz para los demás.";
  }, [humor]);

  useEffect(() => {
    setBalance(readLS(STORAGE_KEYS.gracias, 10));
  }, []);

  const handleSend = () => {
    if (!content.trim()) return;
    if (balance < 3) {
      alert("No tienes suficientes gracias.");
      navigate({ to: "/gracias" });
      return;
    }

    const newBalance = balance - 3;
    setBalance(newBalance);
    writeLS(STORAGE_KEYS.gracias, newBalance);
    setStep("response");
  };

  const handleSave = () => {
    const entries = readLS<DiarioEntry[]>(STORAGE_KEYS.diario, []);
    const newEntry: DiarioEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      humor: humor.label,
      humorEmoji: humor.emoji,
      content: content,
      responseVerse: {
        text: responseVerse.text,
        reference: responseVerse.reference,
      },
      responseText: responseText,
    };
    writeLS(STORAGE_KEYS.diario, [newEntry, ...entries]);
    setSaved(true);
    alert("Guardado en tu diario espiritual.");
  };

  const addGraciasAnuncio = () => {
    const newBalance = balance + 2;
    setBalance(newBalance);
    writeLS(STORAGE_KEYS.gracias, newBalance);
    alert("Has recibido 2 gracias por ver el anuncio.");
  };

  if (step === "response") {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
        <ThemeBootstrap />
        <header className="px-6 pt-12 pb-6">
          <button onClick={() => navigate({ to: "/home" })} className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </header>

        <div className="flex-1 px-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6 text-accent">
            <Heart className="h-8 w-8 fill-accent" />
          </div>
          
          <h2 className="font-serif-verse text-2xl text-foreground mb-4">
            Palabra de aliento para ti
          </h2>
          
          <div className="relative p-6 bg-card border border-border rounded-3xl mb-8">
            <p className="font-serif italic text-lg text-foreground mb-2">
              "{responseVerse.text}"
            </p>
            <p className="text-xs font-bold text-accent uppercase tracking-widest">
              — {responseVerse.reference}
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-10 max-w-[280px]">
            {responseText}
          </p>

          <div className="w-full space-y-4">
            <button 
              onClick={() => {
                if (balance >= 2) {
                  setBalance(prev => {
                    const next = prev - 2;
                    writeLS(STORAGE_KEYS.gracias, next);
                    return next;
                  });
                  alert("Has recibido una oración especial.");
                } else {
                  alert("No tienes suficientes gracias.");
                }
              }}
              className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2"
            >
              Recibir oración — 2 gracias
              <Star className="h-4 w-4 fill-white" />
            </button>
            <button 
              onClick={handleSave}
              disabled={saved}
              className={`w-full py-4 ${saved ? 'bg-muted text-muted-foreground' : 'bg-card border border-border text-foreground'} font-bold rounded-2xl flex items-center justify-center gap-2`}
            >
              <Bookmark className={`h-4 w-4 ${saved ? 'fill-muted-foreground' : ''}`} />
              {saved ? "Guardado en mi diario" : "Guardar en mi diario"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <ThemeBootstrap />
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <button onClick={() => navigate({ to: "/home" })} className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
          <Star className="h-4 w-4 fill-accent" />
          {balance}
        </div>
      </header>

      <div className="flex-1 px-6 flex flex-col">
        <h1 className="font-serif-verse text-3xl text-foreground mb-6">
          Cuéntame cómo te sientes
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {HUMORS.map((h) => (
            <button
              key={h.id}
              onClick={() => setHumor(h)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                humor.id === h.id 
                  ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" 
                  : "bg-card border-border text-foreground"
              }`}
            >
              <span>{h.emoji}</span>
              {h.label}
            </button>
          ))}
        </div>

        <div className="flex-1 relative flex flex-col">
          <textarea
            placeholder="Escribe lo que sientes..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 w-full bg-card border border-border rounded-3xl p-6 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 resize-none shadow-sm"
          />
          <button className="absolute bottom-4 left-4 p-3 bg-muted rounded-full text-muted-foreground hover:bg-accent/10 hover:text-accent transition-colors">
            <Mic className="h-6 w-6" />
          </button>
        </div>

        <div className="py-8 space-y-4">
          <button 
            onClick={handleSend}
            disabled={!content.trim()}
            className="w-full py-5 bg-[#1a3a5c] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            Enviar — 3 gracias
            <Star className="h-4 w-4 fill-white" />
          </button>
          
          <div className="text-center">
            <button 
              onClick={addGraciasAnuncio}
              className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline"
            >
              ¿Sin gracias suficientes? Ver anuncio +2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
