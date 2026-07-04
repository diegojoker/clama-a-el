import { createFileRoute } from "@tanstack/react-router";
import { Star, ShieldCheck, Heart, Share2, Video, ShoppingBag } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { STORAGE_KEYS, readLS, writeLS } from "@/lib/storage";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/gracias")({
  head: () => ({
    meta: [
      { title: "Gracias — Versículo del Día" },
      { name: "description", content: "Consigue más gracias para profundizar en la Palabra." },
    ],
  }),
  component: GraciasStore,
});

function GraciasStore() {
  const [balance, setBalance] = useState(10);

  useEffect(() => {
    setBalance(readLS(STORAGE_KEYS.gracias, 10));
  }, []);

  const addGracias = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    writeLS(STORAGE_KEYS.gracias, newBalance);
    alert(`¡Has ganado ${amount} gracias!`);
  };

  const buyPackage = (amount: number, price: string) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    writeLS(STORAGE_KEYS.gracias, newBalance);
    alert(`Has comprado el paquete de ${amount} gracias por ${price}`);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-32">
      <ThemeBootstrap />
      
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <h1 className="font-serif-verse text-3xl text-foreground">Gracias</h1>
        <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-sm font-bold text-accent">
          <Star className="h-4 w-4 fill-accent" />
          {balance}
        </div>
      </header>

      <div className="px-6 space-y-8">
        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">
            Ganar gratis
          </h2>
          <div className="space-y-3">
            <ActionCard 
              icon={<Video className="h-5 w-5 text-blue-500" />}
              title="Ver un video corto"
              reward="+3"
              onClick={() => addGracias(3)}
            />
            <ActionCard 
              icon={<Share2 className="h-5 w-5 text-green-500" />}
              title="Compartir la app"
              reward="+5"
              onClick={() => addGracias(5)}
            />
            <ActionCard 
              icon={<ShieldCheck className="h-5 w-5 text-purple-500" />}
              title="Seguir en Instagram"
              reward="+2"
              onClick={() => addGracias(2)}
            />
            <ActionCard 
              icon={<Heart className="h-5 w-5 text-red-500" />}
              title="Calificar la app"
              reward="+10"
              onClick={() => addGracias(10)}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">
            Comprar
          </h2>
          <div className="space-y-4">
            <PriceCard 
              amount={30}
              price="$0.99"
              description="Ideal para empezar"
              onClick={() => buyPackage(30, "$0.99")}
            />
            <PriceCard 
              amount={100}
              price="$2.99"
              isPopular
              description="El más elegido"
              onClick={() => buyPackage(100, "$2.99")}
            />
            <PriceCard 
              amount={300}
              price="$6.99"
              description="Ahorro máximo"
              onClick={() => buyPackage(300, "$6.99")}
            />
          </div>
        </section>

        <p className="text-center text-[10px] text-muted-foreground px-4">
          Las compras ayudan a mantener la app y llevar la Palabra de Dios a más personas. Gracias por tu apoyo.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

function ActionCard({ icon, title, reward, onClick }: { icon: React.ReactNode, title: string, reward: string, onClick: () => void }) {
  return (
    <div className="w-full flex items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-muted shrink-0">
          {icon}
        </div>
        <span className="font-medium text-foreground truncate">{title}</span>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 min-h-[52px] px-5 rounded-2xl bg-primary text-primary-foreground font-medium text-sm flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
      >
        <Star className="h-3.5 w-3.5 fill-primary-foreground" />
        {reward}
      </button>
    </div>
  );
}

function PriceCard({ amount, price, description, isPopular, onClick }: { amount: number, price: string, description: string, isPopular?: boolean, onClick: () => void }) {
  return (
    <div
      className={`w-full relative flex items-center justify-between gap-4 p-5 rounded-2xl bg-card border ${isPopular ? 'border-accent ring-1 ring-accent/20 shadow-lg shadow-accent/5' : 'border-border'}`}
    >
      {isPopular && (
        <span className="absolute -top-3 left-6 px-2 py-0.5 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
          Más Popular
        </span>
      )}
      <div className="text-left">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">{amount}</span>
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Gracias</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        onClick={onClick}
        className="shrink-0 min-h-[52px] px-6 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
      >
        {price}
      </button>
    </div>
  );
}
