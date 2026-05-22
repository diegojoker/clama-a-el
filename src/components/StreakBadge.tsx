import { Flame } from "lucide-react";

export function StreakBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  const highlight = count >= 3;
  return (
    <div
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs " +
        (highlight
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-border bg-muted text-muted-foreground")
      }
    >
      <Flame className="h-3.5 w-3.5" />
      <span>
        Llevas <strong className="font-semibold">{count}</strong>{" "}
        {count === 1 ? "día" : "días"} con la Palabra
      </span>
    </div>
  );
}