import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Flame, Sparkles, Lock, CheckCircle2, ArrowLeft, Book, MessageCircle, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { dailyDevotionals, devotionalSeries } from "@/data/devotionals";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/devocionales")({
  component: DevocionalesPage,
});

function DevocionalesPage() {
  const navigate = useNavigate();
  const [gracias, setGracias] = useLocalStorage("gracias_balance", 10);
  const [unlockedSeries, setUnlockedSeries] = useLocalStorage<string[]>("unlocked_series", []);
  const [seriesProgress, setSeriesProgress] = useLocalStorage<Record<string, number>>("series_progress", {});
  const [isGeneratingIa, setIsGeneratingIa] = useState(false);
  const [iaDevotional, setIaDevotional] = useState<any | null>(null);
  const [showFullDaily, setShowFullDaily] = useState(false);

  const daily = dailyDevotionals["default"];

  const handleGenerateIa = () => {
    if (gracias < 3) {
      toast.error("No tienes suficientes gracias", { description: "Necesitas 3 gracias para un devocional personalizado" });
      navigate({ to: "/gracias" });
      return;
    }
    setIsGeneratingIa(true);
    setTimeout(() => {
      setGracias(gracias - 3);
      setIaDevotional({
        verse: "Filipenses 4:7",
        verseText: "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.",
        reflection: "Hoy la IA percibe que buscas serenidad. Esta reflexión de 150 palabras está diseñada para recordarte que la paz no es la ausencia de problemas, sino la presencia de Dios en medio de ellos. Tu corazón puede estar tranquilo porque no depende de tus circunstancias, sino de Su promesa inquebrantable.",
        application: "¿Qué situación específica entregarás hoy a Dios para recibir Su paz?"
      });
      setIsGeneratingIa(false);
      toast.success("Devocional generado con éxito");
    }, 2500);
  };

  const handleUnlockSeries = (series: any) => {
    if (unlockedSeries.includes(series.id)) return;
    if (gracias < series.price) {
      toast.error("Gracias insuficientes");
      navigate({ to: "/gracias" });
      return;
    }
    setGracias(gracias - series.price);
    setUnlockedSeries([...unlockedSeries, series.id]);
    toast.success(`Serie "${series.title}" desbloqueada`);
  };

  if (iaDevotional) {
    return (
      <div className="flex flex-col min-h-screen bg-background pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="p-4 border-b flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
          <Button variant="ghost" size="icon" onClick={() => setIaDevotional(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold">Tu Devocional Especial</h1>
        </header>
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            <Card className="p-6 border-accent/20 bg-accent/5">
              <div className="text-accent font-bold text-sm mb-2">{iaDevotional.verse}</div>
              <p className="text-xl font-serif italic">"{iaDevotional.verseText}"</p>
            </Card>
            
            <div className="prose prose-slate dark:prose-invert">
              <h3 className="text-xl font-bold">Reflexión Personalizada</h3>
              <p className="text-lg leading-relaxed">{iaDevotional.reflection}</p>
            </div>

            <Card className="p-6 bg-slate-900 text-white border-none">
              <h4 className="font-bold text-accent mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Aplicación Práctica
              </h4>
              <p>{iaDevotional.application}</p>
            </Card>

            <div className="space-y-3 pt-6">
              <Button 
                className="w-full h-14 gap-3 bg-accent hover:bg-accent/90"
                onClick={() => navigate({ to: "/hablar" })}
              >
                <MessageCircle className="h-5 w-5" />
                Iniciar conversación — 2 ✨
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-14 gap-3"
                onClick={() => {
                  toast.success("Guardado en tu Diario");
                  setIaDevotional(null);
                }}
              >
                <Save className="h-5 w-5" />
                Guardar en Diario
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">Devocionales</h1>
          <p className="text-muted-foreground italic text-xs">Clama a mí y te responderé. — Jeremías 33:3</p>
        </div>
        <div className="bg-accent/10 p-3 rounded-full">
          <Flame className="h-6 w-6 text-accent animate-pulse" />
        </div>
      </header>

      <ScrollArea className="flex-1 px-6">
        <section className="mt-4">
          <Card className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-amber-900 border-none p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Book className="h-24 w-24 rotate-12" />
            </div>
            <div className="relative z-10">
              <Badge className="mb-3 bg-white/20 text-white border-none">Devocional del Día</Badge>
              <h2 className="text-2xl font-bold mb-3">{daily.title}</h2>
              <p className="text-indigo-100/80 text-sm line-clamp-3 mb-6">
                {daily.content}
              </p>
              <Button 
                variant="secondary" 
                className="w-full font-bold"
                onClick={() => setShowFullDaily(true)}
              >
                Leer completo
              </Button>
            </div>
          </Card>
        </section>

        <section className="mt-8">
          <Card className="p-6 border-accent/30 bg-white dark:bg-slate-900 shadow-xl shadow-accent/5">
            <div className="flex items-center gap-2 text-accent mb-2">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Lovable AI</span>
            </div>
            <h3 className="text-xl font-bold mb-1">Devocional para ti hoy</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Basado en cómo te sientes, la IA crea una reflexión especial para ti.
            </p>
            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-12"
              onClick={handleGenerateIa}
              disabled={isGeneratingIa}
            >
              {isGeneratingIa ? "Conectando con la sabiduría..." : "Generar mi devocional — 3 ✨"}
            </Button>
          </Card>
        </section>

        <section className="mt-10 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-foreground/80 px-1">Series Temáticas</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {devotionalSeries.map((series) => {
                const isUnlocked = unlockedSeries.includes(series.id);
                const progress = seriesProgress[series.id] || 0;
                
                return (
                  <Card 
                    key={series.id}
                    className={`flex-shrink-0 w-56 p-5 border-border/40 relative overflow-hidden transition-all ${!isUnlocked ? 'opacity-80' : 'hover:border-accent/50 cursor-pointer'}`}
                    onClick={() => isUnlocked ? toast.info("Serie en progreso") : handleUnlockSeries(series)}
                  >
                    {!isUnlocked && (
                      <div className="absolute top-3 right-3">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <h4 className="font-bold text-base mb-1 whitespace-normal">{series.title}</h4>
                    <p className="text-xs text-muted-foreground mb-4">{series.duration} días</p>
                    
                    {isUnlocked ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-medium">
                          <span>Progreso</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full text-xs font-bold border-accent/20 text-accent">
                        Desbloquear — {series.price} ✨
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </section>
      </ScrollArea>

      {showFullDaily && (
        <div className="fixed inset-0 z-50 bg-background animate-in slide-in-from-bottom duration-300">
          <header className="p-4 border-b flex items-center justify-between">
            <h1 className="font-bold">Devocional del Día</h1>
            <Button variant="ghost" size="icon" onClick={() => setShowFullDaily(false)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </header>
          <ScrollArea className="h-full p-8 pb-20">
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold font-serif">{daily.title}</h2>
              <Card className="p-5 border-accent/20 bg-accent/5">
                <p className="text-lg font-serif italic">"{daily.verseText}"</p>
                <div className="mt-2 text-accent font-bold text-sm text-right">— {daily.verseReference}</div>
              </Card>
              <div className="text-lg leading-relaxed space-y-4">
                {daily.content.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <Button className="w-full mt-10" onClick={() => setShowFullDaily(false)}>Cerrar</Button>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
