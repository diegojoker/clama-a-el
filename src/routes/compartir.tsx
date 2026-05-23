import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Share2, Lock, Check, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const TEMPLATES = [
  { 
    id: "clasico", 
    name: "Clásico", 
    price: 0, 
    className: "bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#b8860b]",
    textColor: "text-white",
    logoColor: "text-accent",
    isFree: true 
  },
  { 
    id: "amanecer", 
    name: "Amanecer", 
    price: 2, 
    className: "bg-gradient-to-br from-orange-400 via-rose-500 to-purple-600",
    textColor: "text-white",
    logoColor: "text-white/80",
    isFree: false 
  },
  { 
    id: "cielo", 
    name: "Cielo", 
    price: 2, 
    className: "bg-[#050b18] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a2c4e] via-[#050b18] to-black",
    textColor: "text-white",
    logoColor: "text-white",
    isFree: false,
    stars: true
  },
  { 
    id: "marmol", 
    name: "Mármol", 
    price: 2, 
    className: "bg-[#f5f5f5] bg-[url('https://www.transparenttextures.com/patterns/marble-similar.png')]",
    textColor: "text-slate-900",
    logoColor: "text-[#b8860b]",
    isFree: false 
  },
  { 
    id: "naturaleza", 
    name: "Naturaleza", 
    price: 2, 
    className: "bg-[#1a2f1a] bg-gradient-to-br from-[#1a2f1a] to-[#2d4a2d]",
    textColor: "text-white",
    logoColor: "text-[#b8860b]",
    isFree: false 
  },
  { 
    id: "animado", 
    name: "Animado ✨", 
    price: 5, 
    className: "bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#b8860b] animate-pulse",
    textColor: "text-white",
    logoColor: "text-accent",
    isFree: false,
    badge: "Animado"
  },
];

export const Route = createFileRoute("/compartir")({
  validateSearch: (search: Record<string, unknown>) => ({
    text: (search.text as string) || "El Señor es mi pastor; nada me faltará.",
    reference: (search.reference as string) || "Salmos 23:1",
    book: (search.book as string) || "Salmos",
    chapter: (search.chapter as number) || 23,
    verse: (search.verse as string) || "1",
  }),
  component: CompartirPage,
});

function CompartirPage() {
  const search = useSearch({ from: "/compartir" });
  const navigate = useNavigate();
  const [gracias, setGracias] = useLocalStorage("gracias_balance", 10);
  const [unlockedTemplates, setUnlockedTemplates] = useLocalStorage<string[]>("unlocked_share_templates", ["clasico"]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("clasico");
  const [format, setFormat] = useState<"stories" | "square">("stories");
  const [unlockingTemplate, setUnlockingTemplate] = useState<typeof TEMPLATES[0] | null>(null);

  const selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

  const handleTemplateSelect = (template: typeof TEMPLATES[0]) => {
    if (unlockedTemplates.includes(template.id)) {
      setSelectedTemplateId(template.id);
    } else {
      setUnlockingTemplate(template);
    }
  };

  const handleUnlock = () => {
    if (!unlockingTemplate) return;
    if (gracias < unlockingTemplate.price) {
      toast.error("Gracias insuficientes");
      setUnlockingTemplate(null);
      navigate({ to: "/gracias" });
      return;
    }

    setGracias(gracias - unlockingTemplate.price);
    setUnlockedTemplates([...unlockedTemplates, unlockingTemplate.id]);
    setSelectedTemplateId(unlockingTemplate.id);
    setUnlockingTemplate(null);
    toast.success(`Template "${unlockingTemplate.name}" desbloqueado`);
  };

  const handleShare = () => {
    const isFree = selectedTemplate.id === "clasico" && format === "stories";
    const extraCost = format === "square" ? 1 : 0;
    
    if (!isFree && !unlockedTemplates.includes(selectedTemplate.id)) {
        toast.error("Desbloquea primero el fondo");
        return;
    }

    if (extraCost > 0 && gracias < extraCost) {
        toast.error("Gracias insuficientes para el formato cuadrado");
        return;
    }

    if (extraCost > 0) {
        setGracias(gracias - extraCost);
    }

    toast.success("Preparando imagen para compartir...");
    // Mock sharing logic
    setTimeout(() => {
        toast.success("¡Imagen lista para compartir!");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background pb-10">
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md p-4 border-b flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-bold">Comparte la Palabra</h1>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8 max-w-[390px] mx-auto">
          {/* Card Preview */}
          <div className="flex justify-center">
            <div 
              className={`
                ${selectedTemplate.className} 
                ${format === "stories" ? "aspect-[9/16] w-[260px]" : "aspect-square w-[260px]"}
                relative flex flex-col items-center justify-center p-8 shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden
              `}
            >
              {selectedTemplate.stars && (
                  <div className="absolute inset-0 pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute bg-white rounded-full animate-pulse"
                            style={{
                                width: Math.random() * 2 + 'px',
                                height: Math.random() * 2 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's'
                            }}
                          />
                      ))}
                  </div>
              )}

              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                <QuoteIcon className={`h-8 w-8 ${selectedTemplate.logoColor} opacity-50 mb-2`} />
                <p className={`text-xl font-serif font-bold italic leading-tight ${selectedTemplate.textColor}`}>
                  "{search.text}"
                </p>
                <p className={`${selectedTemplate.logoColor} font-bold text-xs uppercase tracking-widest`}>
                  {search.reference}
                </p>
              </div>

              <div className="mt-auto pt-6 flex flex-col items-center space-y-1 relative z-10">
                <h4 className={`text-lg font-bold font-serif ${selectedTemplate.logoColor}`}>Clama a Él</h4>
                <p className={`text-[8px] uppercase tracking-tighter opacity-70 ${selectedTemplate.textColor}`}>
                  Clama a mí y te responderé. — Jeremías 33:3
                </p>
              </div>
            </div>
          </div>

          {/* Template Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Fondo del card
            </h3>
            <ScrollArea className="w-full whitespace-nowrap pb-2">
              <div className="flex gap-3">
                {TEMPLATES.map((template) => {
                  const isUnlocked = unlockedTemplates.includes(template.id);
                  const isSelected = selectedTemplateId === template.id;
                  
                  return (
                    <div 
                      key={template.id}
                      className="flex flex-col items-center space-y-2"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className={`
                        w-16 h-24 rounded-lg cursor-pointer relative overflow-hidden transition-all border-2
                        ${isSelected ? "border-accent scale-105" : "border-transparent opacity-80"}
                        ${template.className}
                      `}>
                        {!isUnlocked && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Lock className="h-4 w-4 text-white" />
                          </div>
                        )}
                        {isSelected && isUnlocked && (
                          <div className="absolute top-1 right-1 bg-accent rounded-full p-0.5">
                            <Check className="h-2 w-2 text-white" />
                          </div>
                        )}
                        {template.badge && (
                          <div className="absolute bottom-1 left-0 right-0 bg-accent/90 text-[6px] font-bold text-center text-white py-0.5">
                            {template.badge}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-muted-foreground">{template.name}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Format Selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Formato
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant={format === "stories" ? "default" : "outline"}
                className={`h-12 ${format === "stories" ? "bg-slate-900" : ""}`}
                onClick={() => setFormat("stories")}
              >
                Stories 9:16
              </Button>
              <Button 
                variant={format === "square" ? "default" : "outline"}
                className={`h-12 relative ${format === "square" ? "bg-slate-900" : ""}`}
                onClick={() => setFormat("square")}
              >
                Cuadrado 1:1
                <span className="absolute -top-2 -right-1 bg-accent text-[8px] px-1 rounded-full text-white">
                  1 ✨
                </span>
              </Button>
            </div>
          </div>

          {/* Main Button */}
          <div className="pt-4">
            <Button 
              className="w-full h-14 text-lg font-bold bg-[#0a192f] hover:bg-[#112240] text-white rounded-xl shadow-lg gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
              Compartir gratis
            </Button>
            <p className="text-center text-[10px] text-muted-foreground mt-4 italic">
              El logo y Jeremías 33:3 se incluyen siempre en cada diseño.
            </p>
          </div>
        </div>
      </ScrollArea>

      {/* Unlock Dialog */}
      <Dialog open={!!unlockingTemplate} onOpenChange={(open) => !open && setUnlockingTemplate(null)}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Desbloquear fondo
            </DialogTitle>
            <DialogDescription>
              Usa tus gracias para obtener este diseño exclusivo para tus versículos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center py-4">
            <div className={`w-32 h-48 rounded-xl shadow-lg border-4 border-accent/20 ${unlockingTemplate?.className}`}></div>
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button className="w-full h-12 font-bold bg-accent hover:bg-accent/90" onClick={handleUnlock}>
              Confirmar — {unlockingTemplate?.price} ✨
            </Button>
            <Button variant="ghost" className="w-full h-12 text-accent" onClick={() => navigate({ to: "/gracias" })}>
              Ganar gracias gratis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V3L21.017 3V15C21.017 18.3137 18.3307 21 15.017 21H14.017ZM3.01697 21L3.01697 18C3.01697 16.8954 3.9124 16 5.01697 16H8.01697C8.56925 16 9.01697 15.5523 9.01697 15V9C9.01697 8.44772 8.56925 8 8.01697 8H5.01697C3.9124 8 3.01697 7.10457 3.01697 6V3L10.017 3V15C10.017 18.3137 7.33068 21 4.01697 21H3.01697Z" />
    </svg>
  );
}
