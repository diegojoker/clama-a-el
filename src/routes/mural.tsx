import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { HandHeart, Loader2, Plus, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "@/components/BottomNav";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { STORAGE_KEYS, readLS, writeLS } from "@/lib/storage";
import verseBg from "@/assets/verse-bg.jpg";

const PRAYED_KEY = "vdd:mural_prayed_today";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

const PRAYER_BY_CATEGORY: Record<Category, (name: string) => string> = {
  Salud: (n) =>
    `Señor, te pedimos por ${n}. Que tu mano sanadora la cubra en este momento. Que la paz que sobrepasa todo entendimiento guarde su corazón y su mente. Amén.`,
  Familia: (n) =>
    `Padre, levantamos a ${n} y a su familia ante ti. Une sus corazones con tu amor y que tu gracia cubra cada necesidad. Amén.`,
  Trabajo: (n) =>
    `Dios, abre puertas para ${n} que ningún hombre pueda cerrar. Guía sus pasos y que tu propósito se cumpla en su vida. Amén.`,
  Fe: (n) =>
    `Señor, fortalece la fe de ${n} en este momento. Que sienta tu presencia cerca y que tu Palabra sea lámpara a sus pies. Amén.`,
  Otro: (n) =>
    `Padre celestial, te pedimos por ${n}. Tú conoces cada necesidad de su corazón. Que tu amor y tu gracia sean suficientes hoy. Amén.`,
};

export const Route = createFileRoute("/mural")({
  head: () => ({
    meta: [
      { title: "Mural de Oración — Clama a Él" },
      { name: "description", content: "Comparte tus peticiones y ora por otros." },
    ],
  }),
  component: MuralScreen,
});

type Category = "Salud" | "Familia" | "Trabajo" | "Fe" | "Otro";
const CATEGORIES: Category[] = ["Salud", "Familia", "Trabajo", "Fe", "Otro"];
type CategoryFilter = "Todos" | Category;
const CATEGORY_FILTERS: CategoryFilter[] = ["Todos", ...CATEGORIES];
type SortMode = "recientes" | "orados";

type ReactionKey = "orando" | "amor" | "fe";
const REACTIONS: { key: ReactionKey; emoji: string; label: string }[] = [
  { key: "orando", emoji: "🙏", label: "Orando" },
  { key: "amor", emoji: "❤️", label: "Con amor" },
  { key: "fe", emoji: "✨", label: "Fe" },
];

interface MuralPost {
  id: string;
  text: string;
  category: Category;
  moodEmoji?: string;
  moodLabel?: string;
  name: string;
  anonymous: boolean;
  date: string; // ISO
  reactions: Record<ReactionKey, number>;
  userReactions: Record<ReactionKey, boolean>;
  prayedBy: number;
}

const SEED_POSTS: MuralPost[] = [
  {
    id: "seed-1",
    text:
      "Mi mamá está en el hospital esperando resultados. Necesito paz y fuerzas para acompañarla. Que Dios extienda su mano sanadora sobre ella.",
    category: "Salud",
    moodEmoji: "😰",
    moodLabel: "Ansiosa",
    name: "María",
    anonymous: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    reactions: { orando: 24, amor: 12, fe: 8 },
    userReactions: { orando: false, amor: false, fe: false },
    prayedBy: 7,
  },
  {
    id: "seed-2",
    text:
      "Estoy buscando trabajo hace meses. Pido oración para tener discernimiento y paciencia mientras espero la puerta que Dios tiene para mí.",
    category: "Trabajo",
    moodEmoji: "😔",
    moodLabel: "Desanimado",
    name: "Anónimo",
    anonymous: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    reactions: { orando: 41, amor: 19, fe: 22 },
    userReactions: { orando: false, amor: false, fe: false },
    prayedBy: 15,
  },
  {
    id: "seed-3",
    text:
      "Siento que mi fe se ha enfriado. Necesito volver a encontrarme con Dios de verdad. Oren para que mi corazón sea renovado.",
    category: "Fe",
    moodEmoji: "🌫️",
    moodLabel: "Perdido",
    name: "Anónimo",
    anonymous: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    reactions: { orando: 58, amor: 33, fe: 45 },
    userReactions: { orando: false, amor: false, fe: false },
    prayedBy: 22,
  },
];

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ahora";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `hace ${d} d`;
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  return ((parts[0][0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function MuralScreen() {
  const [posts, setPosts] = useState<MuralPost[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("Todos");
  const [sortMode, setSortMode] = useState<SortMode>("recientes");
  const [prayedPosts, setPrayedPosts] = useState<Record<string, boolean>>({});
  const [generatedFor, setGeneratedFor] = useState<MuralPost | null>(null);
  const [insufficientOpen, setInsufficientOpen] = useState(false);
  const [floaters, setFloaters] = useState<{ id: number; postId: string }[]>([]);

  useEffect(() => {
    const existing = readLS<MuralPost[] | null>(STORAGE_KEYS.mural, null);
    if (existing && existing.length > 0) {
      setPosts(existing);
    } else {
      setPosts(SEED_POSTS);
      writeLS(STORAGE_KEYS.mural, SEED_POSTS);
    }
    setPrayedPosts(readLS<Record<string, boolean>>("vdd:mural_prayed", {}));
  }, []);

  const persist = (next: MuralPost[]) => {
    setPosts(next);
    writeLS(STORAGE_KEYS.mural, next);
  };

  const toggleReaction = (postId: string, key: ReactionKey) => {
    const next = posts.map((p) => {
      if (p.id !== postId) return p;
      const active = p.userReactions[key];
      return {
        ...p,
        reactions: { ...p.reactions, [key]: p.reactions[key] + (active ? -1 : 1) },
        userReactions: { ...p.userReactions, [key]: !active },
      };
    });
    persist(next);
  };

  const prayFor = (postId: string) => {
    if (prayedPosts[postId]) return;
    const next = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            reactions: { ...p.reactions, orando: p.reactions.orando + 1 },
            userReactions: { ...p.userReactions, orando: true },
            prayedBy: p.prayedBy + 1,
          }
        : p
    );
    persist(next);
    const nextPrayed = { ...prayedPosts, [postId]: true };
    setPrayedPosts(nextPrayed);
    writeLS("vdd:mural_prayed", nextPrayed);
    const balance = readLS<number>(STORAGE_KEYS.gracias, 10);
    writeLS(STORAGE_KEYS.gracias, balance + 1);
    const fid = Date.now();
    setFloaters((f) => [...f, { id: fid, postId }]);
    setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== fid)), 1200);
  };

  const generatePrayer = (post: MuralPost) => {
    const balance = readLS<number>(STORAGE_KEYS.gracias, 10);
    if (balance < 2) {
      setInsufficientOpen(true);
      return;
    }
    writeLS(STORAGE_KEYS.gracias, balance - 2);
    setGeneratedFor(post);
  };

  const addPost = (post: MuralPost) => {
    const next = [post, ...posts];
    persist(next);
    setModalOpen(false);
    toast.success("Petición publicada 🙏");
  };

  const visiblePosts = useMemo(() => {
    const filtered =
      categoryFilter === "Todos"
        ? posts
        : posts.filter((p) => p.category === categoryFilter);
    const sorted = [...filtered];
    if (sortMode === "recientes") {
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      sorted.sort((a, b) => {
        const sum = (p: MuralPost) => p.reactions.orando + p.reactions.amor + p.reactions.fe;
        return sum(b) - sum(a);
      });
    }
    return sorted;
  }, [posts, categoryFilter, sortMode]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-32">
      <ThemeBootstrap />

      <header className="flex items-center justify-between px-6 pt-10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Comunidad</p>
          <h1 className="mt-1 font-serif-verse text-3xl" style={{ color: "#2c1810" }}>
            Mural de Oración
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-white"
          style={{ background: "#1a3a5c" }}
        >
          <Plus className="h-4 w-4" />
          Pedir oración
        </button>
      </header>

      <div className="px-4 pt-2">
        {posts.length === 0 ? (
          <EmptyState onCreate={() => setModalOpen(true)} />
        ) : (
          <>
            <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORY_FILTERS.map((c) => {
                const active = categoryFilter === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategoryFilter(c)}
                    className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                    style={
                      active
                        ? { background: "#1a3a5c", color: "#ffffff", border: "1px solid #1a3a5c" }
                        : { background: "#faf7f2", color: "#2c1810", border: "1px solid #e8e0d5" }
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
            <div className="mb-3 flex items-center justify-end gap-1 rounded-full p-1" style={{ background: "#faf7f2", border: "1px solid #e8e0d5", width: "fit-content", marginLeft: "auto" }}>
              {([
                { k: "recientes", label: "Más recientes" },
                { k: "orados", label: "Más orados" },
              ] as { k: SortMode; label: string }[]).map((o) => {
                const active = sortMode === o.k;
                return (
                  <button
                    key={o.k}
                    type="button"
                    onClick={() => setSortMode(o.k)}
                    className="rounded-full px-3 py-1 text-[11px] font-medium transition-colors"
                    style={
                      active
                        ? { background: "#1a3a5c", color: "#ffffff" }
                        : { background: "transparent", color: "#2c1810" }
                    }
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
            {visiblePosts.length === 0 ? (
              <div className="mt-12 flex flex-col items-center gap-4 px-6 text-center">
                <div className="text-4xl">🙏</div>
                <p className="font-serif-verse text-base" style={{ color: "#9e8e7e" }}>
                  No hay peticiones en esta categoría aún
                </p>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="rounded-xl px-5 py-2.5 text-sm font-medium text-white"
                  style={{ background: "#1a3a5c" }}
                >
                  Ser el primero →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {visiblePosts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                expanded={!!expanded[p.id]}
                onToggleExpand={() =>
                  setExpanded((e) => ({ ...e, [p.id]: !e[p.id] }))
                }
                onReact={(k) => toggleReaction(p.id, k)}
                onPray={() => prayFor(p.id)}
                onGenerate={() => generatePrayer(p)}
                hasPrayed={!!prayedPosts[p.id]}
                floating={floaters.some((f) => f.postId === p.id)}
              />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <PedirOracionModal onClose={() => setModalOpen(false)} onSubmit={addPost} />
      )}

      {generatedFor && (
        <GeneratedPrayerModal post={generatedFor} onClose={() => setGeneratedFor(null)} />
      )}

      {insufficientOpen && (
        <InsufficientModal onClose={() => setInsufficientOpen(false)} />
      )}

      <BottomNav />
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mt-16 flex flex-col items-center gap-4 px-6 text-center">
      <div className="text-5xl">🙏</div>
      <p className="font-serif-verse text-lg" style={{ color: "#9e8e7e" }}>
        Sé el primero en pedir oración
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="rounded-xl px-5 py-2.5 text-sm font-medium text-white"
        style={{ background: "#1a3a5c" }}
      >
        Pedir oración
      </button>
    </div>
  );
}

function PostCard({
  post,
  expanded,
  onToggleExpand,
  onReact,
  onPray,
  onGenerate,
  hasPrayed,
  floating,
}: {
  post: MuralPost;
  expanded: boolean;
  onToggleExpand: () => void;
  onReact: (k: ReactionKey) => void;
  onPray: () => void;
  onGenerate: () => void;
  hasPrayed: boolean;
  floating: boolean;
}) {
  const showToggle = post.text.length > 140;
  return (
    <article
      className="rounded-2xl p-4"
      style={{ background: "#ffffff", border: "1px solid #e8e0d5" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ background: "#1a3a5c" }}
          >
            {initialsOf(post.name)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-sm font-medium" style={{ color: "#2c1810" }}>
                {post.name}
              </span>
              {post.moodEmoji && (
                <span
                  className="rounded-full px-2 py-0.5 text-[11px]"
                  style={{ background: "#faf7f2", color: "#2c1810" }}
                >
                  {post.moodEmoji} {post.moodLabel}
                </span>
              )}
            </div>
            <span
              className="mt-1 inline-block rounded-full px-2 py-0.5 text-[11px]"
              style={{ background: "#faf7f2", border: "1px solid #e8e0d5", color: "#2c1810" }}
            >
              {post.category}
            </span>
          </div>
        </div>
        <span className="shrink-0 text-[11px]" style={{ color: "#9e8e7e" }}>
          {relativeDate(post.date)}
        </span>
      </div>

      <p
        className={"mt-3 text-sm " + (expanded ? "" : "line-clamp-3")}
        style={{ color: "#2c1810", lineHeight: 1.6 }}
      >
        {post.text}
      </p>
      {showToggle && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="mt-1 text-xs font-medium"
          style={{ color: "#1a3a5c" }}
        >
          {expanded ? "ver menos" : "ver más"}
        </button>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {REACTIONS.map((r) => {
          const active = post.userReactions[r.key];
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => onReact(r.key)}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors"
              style={
                active
                  ? { background: "#1a3a5c", color: "#ffffff", border: "1px solid #1a3a5c" }
                  : { background: "#faf7f2", color: "#2c1810", border: "1px solid #e8e0d5" }
              }
            >
              <span>{r.emoji}</span>
              <span className="font-medium">{post.reactions[r.key]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={onPray}
            disabled={hasPrayed}
            className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors"
            style={
              hasPrayed
                ? { background: "#c9a84c", color: "#ffffff", border: "1px solid #c9a84c" }
                : { background: "#faf7f2", color: "#2c1810", border: "1px solid #c9a84c" }
            }
          >
            {hasPrayed ? "Orando 🙏" : "Orar 🙏 +1 gracia"}
          </button>
          {floating && (
            <span
              className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-bold"
              style={{ color: "#c9a84c", animation: "float-up 1.2s ease-out forwards" }}
            >
              +1 ⭐
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onGenerate}
          className="text-[11px]"
          style={{ color: "#9e8e7e" }}
        >
          Generar oración — 2 gracias ⭐
        </button>
      </div>
      <p className="mt-2 text-[11px]" style={{ color: "#9e8e7e" }}>
        {post.prayedBy} han orado
      </p>
    </article>
  );
}

function PedirOracionModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (post: MuralPost) => void;
}) {
  const [anonymous, setAnonymous] = useState(true);
  const [category, setCategory] = useState<Category>("Fe");
  const [text, setText] = useState("");

  const currentMood = useMemo(
    () => readLS<{ emoji: string; label: string } | null>("vdd:current_mood", null),
    []
  );
  const userName = useMemo(() => readLS<string>(STORAGE_KEYS.userName, "Hijo de Dios"), []);

  const submit = () => {
    if (text.trim().length < 5) {
      toast.error("Escribe un poco más tu petición");
      return;
    }
    const post: MuralPost = {
      id: `p-${Date.now()}`,
      text: text.trim(),
      category,
      moodEmoji: currentMood?.emoji,
      moodLabel: currentMood?.label,
      name: anonymous ? "Anónimo" : userName,
      anonymous,
      date: new Date().toISOString(),
      reactions: { orando: 0, amor: 0, fe: 0 },
      userReactions: { orando: false, amor: false, fe: false },
      prayedBy: 0,
    };
    onSubmit(post);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative z-10 w-full max-w-md rounded-t-3xl bg-background p-6 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-border" />

        <div className="flex items-center justify-between">
          <h2 className="font-serif-verse text-2xl text-foreground">Comparte tu petición</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-1 text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
          <button
            type="button"
            onClick={() => setAnonymous(true)}
            className={
              "rounded-full py-2 text-sm font-medium transition-colors " +
              (anonymous ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")
            }
          >
            Anónimo
          </button>
          <button
            type="button"
            onClick={() => setAnonymous(false)}
            className={
              "rounded-full py-2 text-sm font-medium transition-colors " +
              (!anonymous ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")
            }
          >
            Con mi nombre
          </button>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Categoría
          </p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                  style={
                    active
                      ? { background: "#1a3a5c", color: "#ffffff", border: "1px solid #1a3a5c" }
                      : { background: "#faf7f2", color: "#2c1810", border: "1px solid #e8e0d5" }
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 280))}
            placeholder="Cuéntanos por qué necesitas oración..."
            rows={5}
            className="w-full resize-none rounded-2xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <div className="mt-1 text-right text-[11px] text-muted-foreground">
            {text.length}/280
          </div>
        </div>

        <button
          type="button"
          onClick={submit}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-medium text-white"
          style={{ background: "#1a3a5c" }}
        >
          <HandHeart className="h-4 w-4" />
          Publicar en el Mural
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full py-2 text-sm text-muted-foreground"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

function GeneratedPrayerModal({ post, onClose }: { post: MuralPost; onClose: () => void }) {
  const prayer = useMemo(() => {
    const name = post.anonymous ? "esta persona" : post.name;
    return `Padre Celestial, hoy me acerco a Ti para interceder por ${name}. Tú conoces cada detalle de su corazón y de la situación que atraviesa en el área de ${post.category.toLowerCase()}. Extiende Tu mano poderosa y derrama Tu paz, Tu consuelo y Tu sabiduría. Recuérdale que no camina solo, que Tu amor le sostiene y que Tu tiempo es perfecto. Fortalece su fe y renueva su esperanza. En el nombre de Jesús, amén. 🙏`;
  }, [post]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-6 shadow-2xl"
        style={{ background: "#faf7f2" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif-verse text-2xl" style={{ color: "#2c1810" }}>
            Oración por {post.anonymous ? "esta petición" : post.name}
          </h2>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-full p-1" style={{ color: "#9e8e7e" }}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <p
          className="mt-4 font-serif-verse text-base"
          style={{ color: "#2c1810", lineHeight: 1.7 }}
        >
          {prayer}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl py-3 text-sm font-medium text-white"
          style={{ background: "#1a3a5c" }}
        >
          Amén
        </button>
      </div>
    </div>
  );
}

function InsufficientModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative z-10 w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl"
        style={{ background: "#faf7f2" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-4xl">⭐</div>
        <h2 className="mt-2 font-serif-verse text-xl" style={{ color: "#2c1810" }}>
          No tienes suficientes gracias
        </h2>
        <p className="mt-2 text-sm" style={{ color: "#9e8e7e" }}>
          Necesitas 2 gracias para generar una oración.
        </p>
        <a
          href="/gracias"
          className="mt-5 inline-block w-full rounded-2xl py-3 text-sm font-medium text-white"
          style={{ background: "#1a3a5c" }}
        >
          Conseguir gracias
        </a>
        <button type="button" onClick={onClose} className="mt-2 w-full py-2 text-sm" style={{ color: "#9e8e7e" }}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
