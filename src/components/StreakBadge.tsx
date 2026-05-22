import { Flame } from "lucide-react";

export function StreakBadge({ count }: { count: number }) {
  // If count is 0, we still show "0 días" as requested by common app patterns or specific user flow
  const highlight = count >= 1;
  return (
    <div
      className={
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors " +
        (highlight
          ? "border-accent/40 bg-accent/5 text-accent"
          : "border-border bg-muted text-muted-foreground")
      }
    >
      <Flame className={`h-3.5 w-3.5 ${highlight ? "fill-accent" : ""}`} />
      <span>
        🔥 Llevas <strong className="font-bold">{count}</strong>{" "}
        {count === 1 ? "día" : "días"} con la Palabra
      </span>
    </div>
  );
}