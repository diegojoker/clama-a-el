import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { BottomNav } from "@/components/BottomNav";
import { STORAGE_KEYS, readLS } from "@/lib/storage";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil — Versículo del Día" },
      { name: "description", content: "Tu perfil espiritual." },
    ],
  }),
  component: PerfilScreen,
});

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "H";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "H";
}

function PerfilScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState("Hijo de Dios");
  const [mood, setMood] = useState<string | null>(null);

  useEffect(() => {
    setName(readLS(STORAGE_KEYS.userName, "Hijo de Dios"));
    setMood(readLS<string | null>("vdd:current_mood", null));
  }, []);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-32">
      <ThemeBootstrap />
      <header className="flex h-12 items-center px-6">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
      </header>

      <div className="flex flex-col items-center px-6 pt-4">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-semibold text-white"
          style={{ background: "#1a3a5c" }}
        >
          {initialsOf(name)}
        </div>
        <h1 className="mt-4 font-serif-verse text-2xl text-foreground">{name}</h1>
        {mood && (
          <p className="mt-2 text-sm text-muted-foreground">Hoy te sientes: {mood}</p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}