import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import appIcon from "@/assets/app-icon.png";
import { STORAGE_KEYS, writeLS, readLS } from "@/lib/storage";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Bienvenido — Clama a Él" },
      { name: "description", content: "Clama a mí y te responderé. — Jeremías 33:3" },
    ],
  }),
  component: Onboarding,
});

const MOODS = [
  { emoji: "😔", label: "Triste" },
  { emoji: "😰", label: "Ansioso" },
  { emoji: "😤", label: "Frustrado" },
  { emoji: "🙏", label: "Agradecido" },
  { emoji: "😊", label: "En paz" },
  { emoji: "😡", label: "Enojado" },
  { emoji: "💔", label: "Corazón roto" },
  { emoji: "😍", label: "Enamorado" },
  { emoji: "🙁", label: "Solo" },
  { emoji: "😕", label: "Confundido" },
  { emoji: "💪", label: "Con fe" },
  { emoji: "😴", label: "Sin fuerzas" },
];

type TraditionId = "catolico" | "evangelico" | "cristiano" | "explorando";
const TRADITIONS: { id: TraditionId; emoji: string; label: string }[] = [
  { id: "catolico", emoji: "✝️", label: "Católico" },
  { id: "evangelico", emoji: "📖", label: "Evangélico" },
  { id: "cristiano", emoji: "🕊️", label: "Cristiano" },
  { id: "explorando", emoji: "🌱", label: "Estoy explorando" },
];

const TOTAL_STEPS = 7;
const CREAM = "#faf7f2";
const INK = "#2c1810";
const MUTED = "#9e8e7e";
const GOLD = "#c9a84c";
const NAVY = "#1a3a5c";

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [tradition, setTradition] = useState<TraditionId | null>(null);

  const finish = () => {
    if (name.trim()) writeLS(STORAGE_KEYS.userName, name.trim());
    if (mood) writeLS(STORAGE_KEYS.currentMood, mood);
    if (tradition) writeLS(STORAGE_KEYS.tradition, tradition);
    writeLS(STORAGE_KEYS.translation, "RV1960");
    writeLS(STORAGE_KEYS.onboarded, true);
    const current = readLS<number>(STORAGE_KEYS.gracias, 0);
    writeLS(STORAGE_KEYS.gracias, current + 30);
    navigate({ to: "/home", replace: true });
  };

  return (
    <div
      className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pt-10 pb-8"
      style={{ background: step === 6 ? "linear-gradient(180deg,#faf7f2 0%,#fef3c7 100%)" : CREAM }}
    >
      {/* Progress dots */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-all"
            style={{
              width: i === step ? 22 : 6,
              height: 6,
              background: i <= step ? GOLD : "#e8e0d5",
            }}
          />
        ))}
      </div>

      <div key={step} className="flex flex-1 flex-col animate-fade-in">
        {step === 0 && <Welcome onNext={() => setStep(1)} />}
        {step === 1 && (
          <NameStep
            name={name}
            setName={setName}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <MoodStep
            name={name}
            mood={mood}
            setMood={setMood}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <TraditionStep
            tradition={tradition}
            setTradition={setTradition}
            onNext={() => setStep(4)}
          />
        )}
        {step === 4 && <GraciasStep onNext={() => setStep(5)} />}
        {step === 5 && (
          <WidgetStep
            onSkip={() => setStep(6)}
            onGoWidgets={() => {
              writeLS(STORAGE_KEYS.onboarded, true);
              if (name.trim()) writeLS(STORAGE_KEYS.userName, name.trim());
              if (mood) writeLS(STORAGE_KEYS.currentMood, mood);
              if (tradition) writeLS(STORAGE_KEYS.tradition, tradition);
              const current = readLS<number>(STORAGE_KEYS.gracias, 0);
              writeLS(STORAGE_KEYS.gracias, current + 30);
              navigate({ to: "/widgets" });
            }}
          />
        )}
        {step === 6 && <GiftStep name={name} onFinish={finish} />}
      </div>
    </div>
  );
}

/* ---------------------- Step 1: Welcome ---------------------- */
function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <img
        src={appIcon}
        alt="Clama a Él"
        className="mb-8 h-20 w-20 rounded-full object-cover"
        style={{ background: NAVY }}
      />
      <h1 className="font-serif-verse leading-tight" style={{ color: INK, fontSize: 40 }}>
        Clama a Él
      </h1>
      <p className="mt-4 italic" style={{ color: MUTED, fontSize: 14 }}>
        Clama a mí y te responderé.
      </p>
      <p className="mt-1 text-xs" style={{ color: MUTED }}>
        — Jeremías 33:3
      </p>
      <div className="mt-16 w-full">
        <PrimaryBtn onClick={onNext}>Comenzar mi camino →</PrimaryBtn>
      </div>
    </div>
  );
}

/* ---------------------- Step 2: Name ---------------------- */
function NameStep({
  name,
  setName,
  onNext,
}: {
  name: string;
  setName: (s: string) => void;
  onNext: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const valid = name.trim().length > 0;
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif-verse text-center" style={{ color: INK, fontSize: 24 }}>
        ¿Cómo te llamas?
      </h1>
      <p className="mt-2 text-center text-sm" style={{ color: MUTED }}>
        Queremos acompañarte de manera personal
      </p>
      <div className="mt-10">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Tu nombre..."
          className="w-full bg-white text-center outline-none"
          style={{
            border: `2px solid ${focused ? GOLD : "#e8e0d5"}`,
            borderRadius: 12,
            fontSize: 18,
            padding: 16,
            color: INK,
          }}
        />
      </div>
      <div className="mt-auto pt-8">
        <PrimaryBtn disabled={!valid} onClick={onNext}>
          Siguiente →
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ---------------------- Step 3: Mood ---------------------- */
function MoodStep({
  name,
  mood,
  setMood,
  onNext,
}: {
  name: string;
  mood: string | null;
  setMood: (s: string) => void;
  onNext: () => void;
}) {
  const display = name.trim() || "hijo de Dios";
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif-verse text-center leading-tight" style={{ color: INK, fontSize: 22 }}>
        ¿Cómo te encuentras hoy, {display}?
      </h1>
      <p className="mt-2 text-center text-sm" style={{ color: MUTED }}>
        Tu versículo y tu guía se adaptarán a cómo te sientes
      </p>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {MOODS.map((m) => {
          const active = mood === m.label;
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => setMood(m.label)}
              className="flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-xs transition-colors"
              style={{
                background: active ? NAVY : "#ffffff",
                color: active ? "#ffffff" : INK,
                border: `1px solid ${active ? NAVY : "#e8e0d5"}`,
              }}
            >
              <span className="text-xl leading-none">{m.emoji}</span>
              <span style={{ fontSize: 12 }}>{m.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-auto pt-8">
        <PrimaryBtn disabled={!mood} onClick={onNext}>
          Siguiente →
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ---------------------- Step 4: Tradition ---------------------- */
function TraditionStep({
  tradition,
  setTradition,
  onNext,
}: {
  tradition: TraditionId | null;
  setTradition: (t: TraditionId) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif-verse text-center" style={{ color: INK, fontSize: 22 }}>
        ¿Cómo describes tu fe?
      </h1>
      <p className="mt-2 text-center text-sm" style={{ color: MUTED }}>
        Para acompañarte mejor en tu camino
      </p>
      <div className="mt-6 space-y-3">
        {TRADITIONS.map((t) => {
          const active = tradition === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTradition(t.id)}
              className="flex w-full items-center gap-3 text-left transition-colors"
              style={{
                background: active ? "#f0f4f8" : "#ffffff",
                border: `1px solid ${active ? NAVY : "#e8e0d5"}`,
                borderRadius: 12,
                padding: 16,
                color: INK,
              }}
            >
              <span className="text-2xl leading-none">{t.emoji}</span>
              <span className="text-[15px] font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-auto pt-8">
        <PrimaryBtn disabled={!tradition} onClick={onNext}>
          Siguiente →
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ---------------------- Step 5: Gracias explanation ---------------------- */
function GraciasStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-2 flex justify-center">
        <span className="coin-glow text-[64px] leading-none">⭐</span>
      </div>
      <h1 className="mt-4 font-serif-verse text-center" style={{ color: INK, fontSize: 24 }}>
        Las gracias son tus monedas
      </h1>
      <p className="mt-2 text-center" style={{ color: MUTED, fontSize: 14 }}>
        Gánalas haciendo cosas buenas. Úsalas para recibir más.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div
          style={{
            background: "#f0faf4",
            border: "1px solid #e8e0d5",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <p className="mb-2 font-semibold" style={{ color: "#166534", fontSize: 12 }}>
            ✅ Cómo ganarlas
          </p>
          <ul className="space-y-1" style={{ color: INK, fontSize: 12 }}>
            <li>• Orar cada día +5</li>
            <li>• Orar por alguien +1</li>
            <li>• Compartir un versículo +1</li>
            <li>• Invitar un amigo +10</li>
          </ul>
        </div>
        <div
          style={{
            background: "#f0f4fa",
            border: "1px solid #e8e0d5",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <p className="mb-2 font-semibold" style={{ color: NAVY, fontSize: 12 }}>
            ✨ Para qué usarlas
          </p>
          <ul className="space-y-1" style={{ color: INK, fontSize: 12 }}>
            <li>• Hablar con tu guía</li>
            <li>• Versículos especiales</li>
            <li>• Temas del día</li>
            <li>• Fondos de widget</li>
          </ul>
        </div>
      </div>

      <p className="mt-6 text-center italic" style={{ color: MUTED, fontSize: 12 }}>
        Como monedas de fe — cuanto más das, más recibes.
      </p>

      <div className="mt-auto pt-8">
        <PrimaryBtn onClick={onNext}>Entendido →</PrimaryBtn>
      </div>
    </div>
  );
}

/* ---------------------- Step 6: Widget ---------------------- */
function WidgetStep({
  onSkip,
  onGoWidgets,
}: {
  onSkip: () => void;
  onGoWidgets: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="font-serif-verse text-center" style={{ color: INK, fontSize: 22 }}>
        Lleva la Palabra contigo
      </h1>
      <p className="mt-2 text-center text-sm" style={{ color: MUTED }}>
        Añade el versículo del día a tu pantalla de inicio — gratis
      </p>

      {/* Widget preview */}
      <div
        className="relative mt-6 overflow-hidden"
        style={{
          borderRadius: 16,
          padding: 20,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=70)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(26,58,92,0.6)" }} />
        <div className="relative">
          <p className="text-[10px] tracking-widest text-white/70">VERSÍCULO DEL DÍA</p>
          <p className="mt-2 font-serif-verse text-white" style={{ fontSize: 18, lineHeight: 1.35 }}>
            "Todo lo puedo en Cristo que me fortalece."
          </p>
          <p className="mt-2 text-xs font-semibold" style={{ color: GOLD }}>
            Filipenses 4:13
          </p>
          <p className="mt-4 text-[10px] text-white/70">Clama a Él</p>
        </div>
      </div>

      <ol className="mt-5 space-y-2" style={{ color: INK, fontSize: 13 }}>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: NAVY }}>1</span>
          Mantén presionada tu pantalla
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: NAVY }}>2</span>
          Toca el ícono +
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: NAVY }}>3</span>
          Busca "Clama a Él"
        </li>
      </ol>

      <div className="mt-auto space-y-2 pt-6">
        <PrimaryBtn onClick={onGoWidgets}>Ver todos los widgets →</PrimaryBtn>
        <button
          type="button"
          onClick={onSkip}
          className="w-full py-2 text-sm"
          style={{ color: MUTED }}
        >
          Hacer después
        </button>
      </div>
    </div>
  );
}

/* ---------------------- Step 7: Gift ---------------------- */
function GiftStep({ name, onFinish }: { name: string; onFinish: () => void }) {
  const display = name.trim() || "amigo";
  const stars = Array.from({ length: 8 }).map((_, i) => {
    const size = 12 + ((i * 3) % 13);
    const left = 6 + ((i * 13) % 88);
    const delay = (i * 0.18).toFixed(2);
    return { size, left, delay, key: i };
  });
  return (
    <div className="relative flex flex-1 flex-col text-center">
      {/* Falling stars */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {stars.map((s) => (
          <span
            key={s.key}
            className="star-fall absolute top-0"
            style={{
              left: `${s.left}%`,
              fontSize: s.size,
              animationDelay: `${s.delay}s`,
              color: GOLD,
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      <div className="mt-8">
        <h1 className="font-serif-verse" style={{ color: INK, fontSize: 22 }}>
          ¡{display}, te regalamos
        </h1>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span style={{ color: GOLD, fontSize: 72, fontWeight: 700, lineHeight: 1 }}>30</span>
          <span className="text-4xl">⭐</span>
        </div>
        <p className="mt-2 font-serif-verse" style={{ color: INK, fontSize: 20 }}>
          gracias de bienvenida
        </p>
        <p className="mx-auto mt-4 max-w-xs" style={{ color: MUTED, fontSize: 13 }}>
          Úsalas para hablar con tu guía espiritual, descubrir versículos especiales y personalizar tu experiencia.
        </p>
      </div>
      <div className="mt-auto pt-8">
        <PrimaryBtn onClick={onFinish}>Comenzar mi camino ✨</PrimaryBtn>
      </div>
    </div>
  );
}

/* ---------------------- shared button ---------------------- */
function PrimaryBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full py-4 text-sm font-semibold uppercase tracking-widest text-white transition-opacity"
      style={{
        background: NAVY,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}