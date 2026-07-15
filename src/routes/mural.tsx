import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { HandHeart, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { BottomNav } from "@/components/BottomNav";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { STORAGE_KEYS, readLS, writeLS } from "@/lib/storage";

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

  useEffect(() => {
    const existing = readLS<MuralPost[] | null>(STORAGE_KEYS.mural, null);
    if (existing && existing.length > 0) {
      setPosts(existing);
    } else {
      setPosts(SEED_POSTS);
      writeLS(STORAGE_KEYS.mural, SEED_POSTS);
    }
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
    const balance = readLS<number>(STORAGE_KEYS.gracias, 10);
    if (balance < 1) {
      toast.error("No tienes gracias suficientes", {
        description: "Consigue más gracias en la tienda.",
      });
      return;
    }
    writeLS(STORAGE_KEYS.gracias, balance - 1);
    const next = posts.map((p) =>
      p.id === postId ? { ...p, prayedBy: p.prayedBy + 1 } : p
    );
    persist(next);
    toast.success("Oración enviada 🙏", {
      description: "Tu oración fue añadida al mural.",
    });
  };

  const addPost = (post: MuralPost) => {
    const next = [post, ...posts];
    persist(next);
    setModalOpen(false);
    toast.success("Petición publicada 🙏");
  };

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
          <div className="flex flex-col gap-3">
            {posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                expanded={!!expanded[p.id]}
                onToggleExpand={() =>
                  setExpanded((e) => ({ ...e, [p.id]: !e[p.id] }))
                }
                onReact={(k) => toggleReaction(p.id, k)}
                onPray={() => prayFor(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <PedirOracionModal onClose={() => setModalOpen(false)} onSubmit={addPost} />
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
}: {
  post: MuralPost;
  expanded: boolean;
  onToggleExpand: () => void;
  onReact: (k: ReactionKey) => void;
  onPray: () => void;
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

      <div className="mt-3 flex items-center justify-between">
        <span className="text-[11px]" style={{ color: "#9e8e7e" }}>
          {post.prayedBy} han orado
        </span>
        <button
          type="button"
          onClick={onPray}
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: "#c9a84c" }}
        >
          Orar por esta persona — 1 gracia ⭐
        </button>
      </div>
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
