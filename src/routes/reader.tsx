import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ThemeBootstrap } from "@/components/ThemeProvider";
import { z } from "zod";

const searchSchema = z.object({
  book: z.string().default("salmos"),
  chapter: z.coerce.number().default(23),
});

interface ChapterData {
  reference: string;
  translation: string;
  verses: { v: number; text: string }[];
}

const CHAPTERS: Record<string, () => Promise<{ default: ChapterData }>> = {
  "salmos-23": () => import("@/data/chapters/salmos-23.json"),
};

export const Route = createFileRoute("/reader")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Lectura — Versículo del Día" },
    ],
  }),
  loaderDeps: ({ search }) => ({ book: search.book, chapter: search.chapter }),
  loader: async ({ deps }) => {
    const key = `${deps.book}-${deps.chapter}`;
    const loader = CHAPTERS[key];
    if (!loader) return { chapter: null, key };
    const mod = await loader();
    return { chapter: mod.default as ChapterData, key };
  },
  component: Reader,
});

function Reader() {
  const { chapter } = Route.useLoaderData();

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-background px-6 py-8">
      <ThemeBootstrap />
      <Link
        to="/home"
        className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Volver
      </Link>

      {chapter ? (
        <article>
          <h1 className="font-serif-verse text-3xl text-foreground">{chapter.reference}</h1>
          <p className="mt-1 text-xs uppercase tracking-widest text-accent">
            {chapter.translation}
          </p>
          <div className="mt-8 space-y-4">
            {chapter.verses.map((v) => (
              <p key={v.v} className="font-serif-verse text-lg leading-relaxed text-foreground">
                <sup className="mr-1 text-xs font-semibold text-accent">{v.v}</sup>
                {v.text}
              </p>
            ))}
          </div>
        </article>
      ) : (
        <div className="mt-20 text-center">
          <p className="font-serif-verse text-xl text-foreground">
            Capítulo no disponible aún
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Estamos preparando más capítulos. Mientras tanto, vuelve al versículo de hoy.
          </p>
        </div>
      )}
    </div>
  );
}