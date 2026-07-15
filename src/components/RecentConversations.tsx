import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { STORAGE_KEYS, readLS, type DiarioEntry } from "@/lib/storage";

function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.floor((startOf(now) - startOf(d)) / 86400000);
  if (days <= 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
}

function truncate(s: string, n = 40) {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + "…";
}

export function RecentConversations() {
  const navigate = useNavigate();
  const [items, setItems] = useState<DiarioEntry[]>([]);

  useEffect(() => {
    setItems(readLS<DiarioEntry[]>(STORAGE_KEYS.diario, []).slice(0, 3));
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-6 px-6">
      <div className="mb-3 flex items-center justify-between">
        <h2
          className="font-serif-verse"
          style={{ color: "#2c1810", fontSize: 16, fontWeight: 600 }}
        >
          Conversaciones recientes
        </h2>
        <button
          type="button"
          onClick={() => navigate({ to: "/diario" })}
          style={{ color: "#c9a84c", fontSize: 12 }}
          className="font-medium"
        >
          Ver todas →
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => navigate({ to: "/diario" })}
            className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left transition-transform active:scale-[0.99]"
            style={{ border: "1px solid #e8e0d5" }}
          >
            <div
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base"
              style={{ background: "#faf7f2" }}
              aria-hidden="true"
            >
              💬
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate"
                style={{ color: "#2c1810", fontSize: 13, fontWeight: 500 }}
              >
                {truncate(c.content || c.humor, 40)}
              </p>
              <p style={{ color: "#9e8e7e", fontSize: 11 }}>{relativeDate(c.date)}</p>
            </div>
            <span style={{ color: "#9e8e7e" }} aria-hidden="true">
              ›
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
