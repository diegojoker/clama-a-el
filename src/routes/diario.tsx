import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Book, Calendar, ChevronRight, MessageSquare } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { STORAGE_KEYS, readLS, DiarioEntry } from "@/lib/storage";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Mi Diario — Versículo del Día" },
      { name: "description", content: "Tu camino espiritual paso a paso." },
    ],
  }),
  component: DiarioScreen,
});

function DiarioScreen() {
  const [entries, setEntries] = useState<DiarioEntry[]>([]);

  useEffect(() => {
    setEntries(readLS<DiarioEntry[]>(STORAGE_KEYS.diario, []));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-32">
      <ThemeBootstrap />
      
      <header className="px-6 pt-12 pb-6">
        <h1 className="font-serif-verse text-3xl text-foreground">Diario Espiritual</h1>
        <p className="text-sm text-muted-foreground mt-1">Guarda tus conversaciones con Dios.</p>
      </header>

      <div className="px-6">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Book className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Tu diario está vacío.</p>
            <p className="text-xs">Habla hoy y guarda tu primer desahogo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all hover:border-accent/30"
              >
                <div className="p-4 flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" role="img" aria-label={entry.humor}>
                      {entry.humorEmoji}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-accent tracking-widest">{entry.humor}</span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDate(entry.date)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                
                <div className="p-4 border-t border-border/50">
                  <p className="text-sm text-foreground line-clamp-2 italic mb-3">
                    "{entry.content}"
                  </p>
                  
                  <div className="bg-accent/5 p-3 rounded-xl border border-accent/10">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      Palabra recibida:
                    </p>
                    <p className="text-xs font-serif text-foreground italic leading-tight">
                      "{entry.responseVerse.text.substring(0, 60)}..."
                    </p>
                    <p className="text-[8px] font-bold text-muted-foreground mt-1">
                      {entry.responseVerse.reference}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
