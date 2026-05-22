import { Link } from "@tanstack/react-router";
import { BookOpen, Settings } from "lucide-react";

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur"
      aria-label="Navegación principal"
    >
      <div className="grid grid-cols-2">
        <Link
          to="/home"
          className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <BookOpen className="h-5 w-5" />
          Hoy
        </Link>
        <Link
          to="/settings"
          className="flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <Settings className="h-5 w-5" />
          Ajustes
        </Link>
      </div>
    </nav>
  );
}