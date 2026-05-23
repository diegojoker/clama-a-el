import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Star, Check, Lock, X } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { STORAGE_KEYS, readLS, writeLS } from "@/lib/storage";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/widgets")({
  head: () => ({
    meta: [
      { title: "Widgets — Clama a Él" },
      { name: "description", content: "Personaliza tu pantalla de inicio con temas sagrados." },
    ],
  }),
  component: WidgetsScreen,
});

interface WidgetTheme {
  id: string;
  name: string;
  price: number;
  previewColor: string;
  previewTextColor: string;
  isLimited?: boolean;
}

const THEMES: WidgetTheme[] = [
  { id: "clasico", name: "Clásico", price: 0, previewColor: "bg-[#f4ecd8]", previewTextColor: "text-[#1a3a5c]" },
  { id: "cielo", name: "Cielo Nocturno", price: 10, previewColor: "bg-[#1a1c2c]", previewTextColor: "text-white" },
  { id: "amanecer", name: "Amanecer", price: 15, previewColor: "bg-gradient-to-br from-orange-200 to-rose-300", previewTextColor: "text-rose-900" },
  { id: "acuarela", name: "Acuarela", price: 20, previewColor: "bg-[#e0f2f1]", previewTextColor: "text-teal-800" },
  { id: "dorado", name: "Dorado Sagrado", price: 25, previewColor: "bg-[#c9a84c]", previewTextColor: "text-white" },
  { id: "minimalista", name: "Minimalista", price: 10, previewColor: "bg-white border border-gray-100", previewTextColor: "text-black" },
  { id: "navidad", name: "Navidad", price: 20, previewColor: "bg-red-700", previewTextColor: "text-white", isLimited: true },
];

function WidgetsScreen() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(10);
  const [unlocked, setUnlocked] = useState<string[]>(["clasico"]);
  const [activeTheme, setActiveTheme] = useState("clasico");
  const [selectedTheme, setSelectedTheme] = useState<WidgetTheme | null>(null);

  useEffect(() => {
    setBalance(readLS(STORAGE_KEYS.gracias, 10));
    setUnlocked(readLS(STORAGE_KEYS.unlockedWidgets, ["clasico"]));
    setActiveTheme(readLS(STORAGE_KEYS.activeWidgetTheme, "clasico"));
  }, []);

  const handleUnlock = (theme: WidgetTheme) => {
    if (balance < theme.price) {
      alert("No tienes suficientes gracias.");
      navigate({ to: "/gracias" });
      return;
    }

    const newBalance = balance - theme.price;
    const newUnlocked = [...unlocked, theme.id];
    
    setBalance(newBalance);
    setUnlocked(newUnlocked);
    
    writeLS(STORAGE_KEYS.gracias, newBalance);
    writeLS(STORAGE_KEYS.unlockedWidgets, newUnlocked);
    
    setSelectedTheme(null);
    alert(`¡Has desbloqueado el tema ${theme.name}!`);
  };

  const handleApply = (themeId: string) => {
    setActiveTheme(themeId);
    writeLS(STORAGE_KEYS.activeWidgetTheme, themeId);
    alert("Tema aplicado al widget.");
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-32">
      <ThemeBootstrap />
      
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <h1 className="font-serif-verse text-3xl text-foreground">Widgets</h1>
        <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
          <Star className="h-4 w-4 fill-accent" />
          {balance}
        </div>
      </header>

      <div className="px-6">
        <div className="grid grid-cols-2 gap-4">
          {THEMES.map((theme) => {
            const isUnlocked = unlocked.includes(theme.id);
            const isActive = activeTheme === theme.id;

            return (
              <button
                key={theme.id}
                onClick={() => isUnlocked ? handleApply(theme.id) : setSelectedTheme(theme)}
                className="group relative flex flex-col gap-2 text-left"
              >
                <div className={`aspect-[4/3] w-full rounded-2xl p-4 flex flex-col justify-center gap-1 shadow-sm transition-all group-hover:scale-[1.02] ${theme.previewColor} ${isActive ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}`}>
                  <div className={`h-1 w-8 rounded-full opacity-30 ${theme.previewTextColor.replace('text-', 'bg-')}`} />
                  <div className={`text-[8px] font-serif leading-tight ${theme.previewTextColor}`}>
                    "Tu palabra es una lámpara a mis pies..."
                  </div>
                  <div className={`text-[6px] font-bold opacity-60 ${theme.previewTextColor}`}>
                    Salmos 119:105
                  </div>
                  
                  {isActive && (
                    <div className="absolute top-2 right-2 bg-accent text-white p-1 rounded-full">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center rounded-2xl backdrop-blur-[1px]">
                      <Lock className="h-5 w-5 text-white/80" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground truncate">{theme.name}</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    {theme.price === 0 ? (
                      <span className="text-green-600 font-bold">Gratis</span>
                    ) : (
                      <div className="flex items-center gap-0.5 text-accent font-bold">
                        <Star className="h-2.5 w-2.5 fill-accent" />
                        {theme.price}
                      </div>
                    )}
                    {theme.isLimited && (
                      <span className="ml-1 px-1 bg-red-100 text-red-600 font-bold rounded-[2px] text-[8px] uppercase">
                        Limitada
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal de desbloqueo */}
      {selectedTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-card rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedTheme.name}</h3>
                  <p className="text-sm text-muted-foreground">Previa del widget</p>
                </div>
                <button 
                  onClick={() => setSelectedTheme(null)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className={`aspect-[4/3] w-full rounded-2xl p-6 flex flex-col justify-center gap-2 mb-8 ${selectedTheme.previewColor}`}>
                <div className={`h-1.5 w-12 rounded-full opacity-30 ${selectedTheme.previewTextColor.replace('text-', 'bg-')}`} />
                <div className={`text-sm font-serif italic ${selectedTheme.previewTextColor}`}>
                  "Tu palabra es una lámpara a mis pies y una lumbrera en mi camino."
                </div>
                <div className={`text-xs font-bold opacity-60 ${selectedTheme.previewTextColor}`}>
                  Salmos 119:105
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleUnlock(selectedTheme)}
                  className="w-full py-4 bg-accent text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  Desbloquear — {selectedTheme.price} gracias
                  <Star className="h-4 w-4 fill-white" />
                </button>
                <button
                  onClick={() => navigate({ to: "/gracias" })}
                  className="w-full py-4 bg-muted text-foreground font-bold rounded-2xl transition-colors hover:bg-muted/80"
                >
                  Ganar gracias gratis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
