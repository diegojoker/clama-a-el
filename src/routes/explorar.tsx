import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Compass, Search, ChevronRight, ArrowLeft, Sparkles, AlertCircle, BookOpen, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import versesData from "@/data/verses.es.json";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { stories } from "@/data/stories";
import { toast } from "sonner";

const TEMAS = [
  { id: "amor", label: "Amor", icon: "❤️" },
  { id: "fe", label: "Fe", icon: "🙏" },
  { id: "esperanza", label: "Esperanza", icon: "🌟" },
  { id: "ansiedad", label: "Ansiedad", icon: "😰" },
  { id: "familia", label: "Familia", icon: "🏠" },
  { id: "matrimonio", label: "Matrimonio", icon: "💍" },
  { id: "duelo", label: "Duelo", icon: "🕊️" },
  { id: "soledad", label: "Soledad", icon: "👤" },
  { id: "perdon", label: "Perdón", icon: "🤝" },
  { id: "fuerza", label: "Fuerza", icon: "💪" },
  { id: "miedo", label: "Miedo", icon: "😨" },
  { id: "gratitud", label: "Gratitud", icon: "🙌" },
  { id: "proposito", label: "Propósito", icon: "🎯" },
  { id: "sanidad", label: "Sanidad", icon: "🏥" },
];

export const Route = createFileRoute("/explorar")({
  component: ExplorarPage,
});

function ExplorarPage() {
  const [selectedTema, setSelectedTema] = useState<string | null>(null);
  const [iaSearchQuery, setIaSearchQuery] = useState("");
  const [isSearchingIa, setIsSearchingIa] = useState(false);
  const [iaResults, setIaResults] = useState<any[] | null>(null);
  const [gracias, setGracias] = useLocalStorage("gracias_balance", 10);
  const navigate = useNavigate();

  const filteredVerses = useMemo(() => {
    if (!selectedTema) return [];
    return (versesData as any[]).filter((v) => v.temas?.includes(selectedTema)).slice(0, 10);
  }, [selectedTema]);

  const handleIaSearch = () => {
    if (iaSearchQuery.trim().length < 5) {
      toast.error("Describe tu situación con más detalle");
      return;
    }
    if (gracias < 2) {
      toast.error("No tienes suficientes gracias", {
        description: "Necesitas 2 gracias para la búsqueda por IA",
      });
      navigate({ to: "/gracias" });
      return;
    }

    setIsSearchingIa(true);
    // Simulating IA search
    setTimeout(() => {
      setGracias(gracias - 2);
      const results = (versesData as any[])
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(v => ({
          ...v,
          explanation: "Este versículo te recuerda que Dios tiene el control y te ofrece paz en momentos difíciles."
        }));
      setIaResults(results);
      setIsSearchingIa(false);
      toast.success("Búsqueda completada");
    }, 2000);
  };

  if (selectedTema) {
    const temaInfo = TEMAS.find(t => t.id === selectedTema);
    return (
      <div className="flex flex-col min-h-screen pb-20 bg-background animate-in fade-in slide-in-from-right duration-300">
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-background/80 px-4 py-4 backdrop-blur-md border-b border-border">
          <Button variant="ghost" size="icon" onClick={() => setSelectedTema(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">
            {temaInfo?.icon} {temaInfo?.label}
          </h1>
        </header>

        <div className="p-4 space-y-4">
          {filteredVerses.length > 0 ? (
            filteredVerses.map((verse, idx) => (
              <Card 
                key={idx} 
                className="p-5 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer active:scale-[0.98]"
                onClick={() => navigate({ to: "/reader", search: { book: verse.book, chapter: verse.chapter, verse: verse.verse } })}
              >
                <div className="text-accent font-medium mb-2 text-sm uppercase tracking-wider">
                  {verse.reference}
                </div>
                <p className="text-foreground leading-relaxed italic">
                  "{verse.text}"
                </p>
                <div className="mt-4 flex justify-end">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                    Leer capítulo <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <Compass className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Próximamente más versículos sobre este tema.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-background">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-3xl font-bold font-serif text-foreground">Explorar</h1>
        <p className="text-muted-foreground">Clama a mí y te responderé. — Jeremías 33:3</p>
      </header>

      <ScrollArea className="flex-1 px-6">
        <section className="mt-4">
          <Card 
            className="bg-gradient-to-br from-indigo-900 to-amber-900 border-none p-6 text-white cursor-pointer hover:scale-[1.02] transition-transform active:scale-95 mb-8"
            onClick={() => navigate({ to: "/devocionales" })}
          >
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-white/20 text-white border-none">Nuevo</Badge>
              <Flame className="h-6 w-6 text-accent animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold mb-1 font-serif">Devocionales Diarios</h3>
            <p className="text-indigo-100/80 text-sm">Alimento espiritual para cada momento de tu vida.</p>
          </Card>
        </section>

        <section className="mt-4">
          <h2 className="text-lg font-semibold mb-4 text-foreground/80">Versículos por tema</h2>
          <div className="grid grid-cols-2 gap-3">
            {TEMAS.map((tema) => (
              <Button
                key={tema.id}
                variant="outline"
                className="justify-start gap-3 h-14 bg-card/50 border-border/40 hover:bg-accent/5 hover:border-accent/30 transition-all text-sm font-medium"
                onClick={() => setSelectedTema(tema.id)}
              >
                <span className="text-lg">{tema.icon}</span>
                {tema.label}
              </Button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground/80">Historias Bíblicas</h2>
          </div>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {stories.map((story, idx) => {
                const colors = [
                  "from-amber-500 to-orange-600",
                  "from-emerald-500 to-teal-600",
                  "from-blue-500 to-indigo-600",
                  "from-purple-500 to-pink-600",
                  "from-rose-500 to-red-600"
                ];
                const colorClass = colors[idx % colors.length];
                
                return (
                  <Card 
                    key={story.id}
                    className="flex-shrink-0 w-64 overflow-hidden border-none cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
                    onClick={() => navigate({ to: `/explorar/historia/${story.id}` })}
                  >
                    <div className={`h-32 bg-gradient-to-br ${colorClass} p-4 flex items-center justify-center`}>
                      <BookOpen className="h-12 w-12 text-white/40" />
                    </div>
                    <div className="p-4 bg-card">
                      <h3 className="font-bold text-base mb-1 truncate">{story.title}</h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">{story.reference}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </section>

        <section className="mt-10 mb-8">
          <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 border-none p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-20 w-20" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">¿No encuentras lo que buscas?</h3>
              <p className="text-indigo-100/80 text-sm mb-6">
                Describe tu situación y la IA encontrará versículos perfectos para ti.
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={iaSearchQuery}
                  onChange={(e) => setIaSearchQuery(e.target.value)}
                  placeholder="Describe cómo te sientes o qué estás pasando..."
                  className="w-full bg-white/10 border-white/20 rounded-xl p-4 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[100px] resize-none"
                />
                
                <Button 
                  onClick={handleIaSearch}
                  disabled={isSearchingIa}
                  className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12 shadow-lg"
                >
                  {isSearchingIa ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Buscando sabiduría...
                    </span>
                  ) : (
                    "Buscar — 2 gracias ✨"
                  )}
                </Button>

                {iaResults && (
                  <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Resultados para ti
                    </h4>
                    {iaResults.map((verse, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => navigate({ to: "/reader", search: { book: verse.book, chapter: verse.chapter, verse: verse.verse } })}
                      >
                        <div className="text-accent font-bold text-xs mb-1">{verse.reference}</div>
                        <p className="text-sm italic mb-2">"{verse.text}"</p>
                        <p className="text-[10px] text-indigo-200/60 leading-tight">
                          {verse.explanation}
                        </p>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-white/40 hover:text-white"
                      onClick={() => setIaResults(null)}
                    >
                      Limpiar resultados
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
            <AlertCircle className="h-3 w-3" />
            Impulsado por Lovable AI
          </div>
        </section>
      </ScrollArea>
    </div>
  );
}
