import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Smartphone, BookOpen } from "lucide-react";
import appIcon from "@/assets/app-icon.png";
import { STORAGE_KEYS, writeLS, type Translation } from "@/lib/storage";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Bienvenido — Versículo del Día" },
      { name: "description", content: "Configura tu experiencia diaria con la Palabra." },
    ],
  }),
  component: Onboarding,
});

const TRANSLATIONS: { id: Translation; name: string; desc: string; available: boolean }[] = [
  { id: "RV1960", name: "Reina Valera 1960", desc: "Tradición protestante clásica", available: true },
  { id: "NVI", name: "Nueva Versión Internacional", desc: "Lenguaje contemporáneo", available: false },
  { id: "BJ", name: "Biblia de Jerusalén", desc: "Tradición católica de estudio", available: false },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [translation, setTranslation] = useState<Translation>("RV1960");

  const finish = () => {
    writeLS(STORAGE_KEYS.onboarded, true);
    writeLS(STORAGE_KEYS.translation, translation);
    navigate({ to: "/home", replace: true });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={
                "h-1.5 rounded-full transition-all " +
                (i === step ? "w-8 bg-accent" : "w-1.5 bg-border")
              }
            />
          ))}
        </div>
        {step < 2 && (
          <button
            type="button"
            onClick={finish}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Saltar
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center">
        {step === 0 && (
          <div className="text-center">
            <img
              src={appIcon}
              alt="Clama a Él"
              width={120}
              height={120}
              className="mx-auto mb-8 h-28 w-28 rounded-3xl shadow-lg"
            />
            <h1 className="font-serif-verse text-4xl leading-tight text-foreground">
              Clama a Él
            </h1>
            <p className="mt-2 text-sm italic text-muted-foreground">
              Clama a mí y te responderé. — Jeremías 33:3
            </p>
            <p className="mt-6 text-base text-muted-foreground">
              Un versículo cada día para acompañarte, fortalecerte e inspirar tu camino.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-3xl bg-primary text-primary-foreground">
              <Smartphone className="h-14 w-14" />
            </div>
            <h1 className="font-serif-verse text-4xl leading-tight text-foreground">
              Instala el widget
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Coloca el versículo del día en tu pantalla de inicio y recíbelo apenas enciendas el móvil.
            </p>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-6 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent/15 text-accent">
                <BookOpen className="h-10 w-10" />
              </div>
              <h1 className="font-serif-verse text-3xl leading-tight text-foreground">
                Elige tu traducción
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Puedes cambiarla cuando quieras en Ajustes.
              </p>
            </div>
            <div className="space-y-3">
              {TRANSLATIONS.map((t) => {
                const selected = translation === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    disabled={!t.available}
                    onClick={() => t.available && setTranslation(t.id)}
                    className={
                      "w-full rounded-xl border px-4 py-4 text-left transition-all " +
                      (selected
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card hover:border-accent/40") +
                      (t.available ? "" : " opacity-50")
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.desc}</div>
                      </div>
                      {!t.available && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          Próximamente
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        {step < 2 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-colors hover:opacity-90"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            className="w-full rounded-full bg-accent py-4 text-sm font-semibold uppercase tracking-widest text-accent-foreground transition-colors hover:opacity-90"
          >
            Empezar
          </button>
        )}
      </div>
    </div>
  );
}