import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Sparkles, Share2, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { stories } from "@/data/stories";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";

export const Route = createFileRoute("/explorar/historia/$storyId")({
  component: StoryPage,
});

function StoryPage() {
  const { storyId } = useParams({ from: "/explorar/historia/$storyId" });
  const navigate = useNavigate();
  const story = stories.find((s) => s.id === storyId);
  const [gracias, setGracias] = useLocalStorage("gracias_balance", 10);
  const [isAiReflecting, setIsAiReflecting] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-xl font-bold mb-4">Historia no encontrada</h1>
        <Button onClick={() => navigate({ to: "/explorar" })}>Volver a Explorar</Button>
      </div>
    );
  }

  const handleAiReflection = () => {
    if (gracias < 2) {
      toast.error("No tienes suficientes gracias");
      navigate({ to: "/gracias" });
      return;
    }

    setIsAiReflecting(true);
    setTimeout(() => {
      setGracias(gracias - 2);
      setReflection(
        `Esta historia de ${story.title} nos enseña que incluso en los momentos de mayor incertidumbre, hay un propósito mayor guiando nuestros pasos. Así como los personajes bíblicos enfrentaron desafíos, tus retos actuales también son oportunidades para fortalecer tu fe y ver la mano de Dios actuando en tu vida.`
      );
      setIsAiReflecting(false);
      toast.success("Reflexión generada");
    }, 2000);
  };

  const handleShare = () => {
    const text = `Acabo de leer la historia de "${story.title}" (${story.reference}) en Bible App. ¡Es muy inspiradora!`;
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copiado al portapapeles");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md p-4 border-b flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/explorar" })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 overflow-hidden">
          <h1 className="font-bold truncate">{story.title}</h1>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-2xl mx-auto p-6">
          <div className="mb-8">
            <h2 className="text-4xl font-bold font-serif mb-2 leading-tight">{story.title}</h2>
            <p className="text-accent font-medium tracking-wide uppercase text-xs">{story.reference}</p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            {story.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-lg leading-relaxed mb-6 text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>

          {reflection && (
            <Card className="mt-10 p-6 bg-accent/5 border-accent/20 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 text-accent mb-3">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Reflexión para ti</span>
              </div>
              <p className="text-foreground italic leading-relaxed">
                "{reflection}"
              </p>
            </Card>
          )}

          <div className="mt-12 space-y-4">
            <Button 
              className="w-full h-14 text-lg font-bold gap-3" 
              onClick={() => navigate({ to: "/reader", search: { book: story.book, chapter: story.chapter } })}
            >
              <BookOpen className="h-5 w-5" />
              Leer los versículos
            </Button>

            <Button 
              variant="outline" 
              className="w-full h-14 text-lg font-bold gap-3 border-accent/20 text-accent hover:bg-accent/5"
              onClick={handleAiReflection}
              disabled={isAiReflecting}
            >
              <Sparkles className="h-5 w-5" />
              {isAiReflecting ? "Pensando..." : "¿Qué significa para mi vida? — 2 ✨"}
            </Button>

            <Button 
              variant="ghost" 
              className="w-full h-14 text-lg font-medium gap-3 text-muted-foreground"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Compartir esta historia
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
