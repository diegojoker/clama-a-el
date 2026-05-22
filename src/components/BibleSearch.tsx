import { useState, useMemo } from "react";
import { Search, BookOpen, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import versesData from "@/data/verses.es.json";

interface Verse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

export function BibleSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];

    const lowerQuery = query.toLowerCase().trim();
    
    // Exact reference match attempt (e.g. "Juan 3:16")
    const exactMatch = (versesData as Verse[]).find(
      v => v.reference.toLowerCase().includes(lowerQuery)
    );

    if (exactMatch && exactMatch.reference.toLowerCase() === lowerQuery) {
      return [exactMatch];
    }

    // Keyword search
    return (versesData as Verse[]).filter(v => 
      v.text.toLowerCase().includes(lowerQuery) || 
      v.reference.toLowerCase().includes(lowerQuery)
    ).slice(0, 20); // Limit results for performance
  }, [query]);

  const handleSelect = (v: Verse) => {
    navigate({
      to: "/reader",
      search: { book: v.book, chapter: v.chapter },
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Buscar versículo... ej: Juan 3:16 o Salmos 23"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-card border border-border rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 transition-all"
        />
      </div>

      {results.length > 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1">
            Resultados
          </h3>
          <div className="grid gap-2">
            {results.map((v, i) => (
              <button
                key={`${v.reference}-${i}`}
                onClick={() => handleSelect(v)}
                className="flex items-start gap-3 p-4 bg-card border border-border rounded-2xl text-left transition-colors hover:border-accent/40 active:scale-[0.98]"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mb-1">
                    {v.reference}
                  </p>
                  <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                    {v.text}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground mt-auto" />
              </button>
            ))}
          </div>
        </div>
      )}

      {query.trim().length >= 2 && results.length === 0 && (
        <div className="py-8 text-center bg-muted/30 rounded-2xl border border-dashed border-border">
          <p className="text-sm text-muted-foreground">No se encontraron versículos</p>
        </div>
      )}
    </div>
  );
}
