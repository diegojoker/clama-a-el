import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Compass, Search, ChevronRight, ArrowLeft, Sparkles, AlertCircle, BookOpen, Flame, Share2 } from "lucide-react";
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
  { id: "amor", label: "Amor", icon: "❤️", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80" },
  { id: "fe", label: "Fe", icon: "🙏", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" },
  { id: "esperanza", label: "Esperanza", icon: "🌟", image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80" },
  { id: "ansiedad", label: "Ansiedad", icon: "😰", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" },
  { id: "familia", label: "Familia", icon: "🏠", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80" },
  { id: "matrimonio", label: "Matrimonio", icon: "💍", image: "https://images.unsplash.com/photo-1503785640985-f62e3aeee448?w=800&q=80" },
  { id: "duelo", label: "Duelo", icon: "🕊️", image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80" },
  { id: "soledad", label: "Soledad", icon: "👤", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80" },
  { id: "perdon", label: "Perdón", icon: "🤝", image: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?w=800&q=80" },
  { id: "fuerza", label: "Fuerza", icon: "💪", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80" },
  { id: "miedo", label: "Miedo", icon: "😨", image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80" },
  { id: "gratitud", label: "Gratitud", icon: "🙌", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80" },
  { id: "proposito", label: "Propósito", icon: "🎯", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80" },
  { id: "sanidad", label: "Sanidad", icon: "🏥", image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80" },
];

export const Route = createFileRoute("/explorar")({
  component: ExplorarPage,
});

function ExplorarPage() {
  const [selectedTema, setSelectedTema] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const preselect = window.localStorage.getItem("explorar:preselect_tema");
    if (preselect) {
      try {
        setSelectedTema(JSON.parse(preselect));
      } catch {
        setSelectedTema(preselect);
      }
      window.localStorage.removeItem("explorar:preselect_tema");
    }
  }, []);

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
                <div className="mt-4 flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-green-600 gap-1.5"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ 
                        to: "/compartir", 
                        search: { 
                          text: verse.text, 
                          reference: verse.reference,
                          book: verse.book,
                          chapter: verse.chapter,
                          verse: verse.verse
                        } 
                      });
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase">Compartir</span>
                  </Button>
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

      <ScrollArea className="flex-1 px-4">
        {/* IA Search Card - Now at the Top */}
        <section className="mt-4 mb-8">
          <Card className="bg-primary text-primary-foreground border-none p-4 pr-4 overflow-hidden relative rounded-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="h-20 w-20" />
            </div>
            <div className="relative z-10 w-full">
              <h3 className="text-lg font-serif-verse mb-2 overflow-hidden text-ellipsis whitespace-nowrap">Encuentra el versículo perfecto para ti</h3>
              <p className="text-primary-foreground/80 text-sm mb-6 line-clamp-2">
                Describe lo que estás viviendo y la IA encontrará las palabras exactas que necesitas.
              </p>
              
              <div className="space-y-4 w-full">
                <textarea
                  value={iaSearchQuery}
                  onChange={(e) => setIaSearchQuery(e.target.value)}
                  placeholder="Describe cómo te sientes o qué estás pasando..."
                  className="w-full bg-primary-foreground/10 border border-primary-foreground/20 rounded-xl p-4 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/50 min-h-[100px] resize-none"
                />
                
                <Button 
                  onClick={handleIaSearch}
                  disabled={isSearchingIa}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold h-12 shadow-lg rounded-2xl"
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
                        className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-xl p-4 cursor-pointer hover:bg-primary-foreground/10 transition-colors"
                        onClick={() => navigate({ to: "/reader", search: { book: verse.book, chapter: verse.chapter, verse: verse.verse } })}
                      >
                        <div className="text-accent font-bold text-xs mb-1">{verse.reference}</div>
                        <p className="text-sm italic mb-2">"{verse.text}"</p>
                        <p className="text-[10px] text-primary-foreground/60 leading-tight">
                          {verse.explanation}
                        </p>
                      </div>
                    ))}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-primary-foreground/50 hover:text-primary-foreground"
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

        <section className="mb-8">
          <Card 
            className="bg-primary text-primary-foreground border-none p-5 cursor-pointer hover:scale-[1.02] transition-transform active:scale-95 rounded-2xl"
            onClick={() => navigate({ to: "/devocionales" })}
          >
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-primary-foreground/15 text-primary-foreground border-none">Nuevo</Badge>
              <Flame className="h-6 w-6 text-accent animate-pulse" />
            </div>
            <h3 className="text-xl font-serif-verse mb-1">Devocionales Diarios</h3>
            <p className="text-primary-foreground/80 text-xs">Alimento espiritual para cada momento de tu vida.</p>
          </Card>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-foreground/80">Versículos por tema</h2>
          <div className="grid grid-cols-2 gap-3">
            {TEMAS.map((tema) => (
              <button
                key={tema.id}
                onClick={() => setSelectedTema(tema.id)}
                className="relative h-24 rounded-2xl overflow-hidden group active:scale-[0.98] transition-transform text-left"
                style={{
                  backgroundImage: `url(${tema.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 group-hover:from-black/80 transition-colors" />
                <div className="relative z-10 h-full flex items-end justify-between p-3">
                  <span className="font-serif-verse text-white text-lg font-medium drop-shadow-md">
                    {tema.label}
                  </span>
                  <span className="text-lg drop-shadow-md">{tema.icon}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-10">
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
                    className="flex-shrink-0 w-[140px] overflow-hidden border-none cursor-pointer hover:scale-[1.02] transition-transform active:scale-95"
                    onClick={() => navigate({ to: `/explorar/historia/${story.id}` })}
                  >
                    <div className={`h-24 bg-gradient-to-br ${colorClass} p-4 flex items-center justify-center`}>
                      <BookOpen className="h-8 w-8 text-white/40" />
                    </div>
                    <div className="p-3 bg-card whitespace-normal">
                      <h3 className="font-bold text-sm mb-1 line-clamp-2 leading-tight">{story.title}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{story.reference}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </section>
      </ScrollArea>
    </div>
  );
}
