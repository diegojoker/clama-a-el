import { Link } from "@tanstack/react-router";
import { BookOpen, Settings, Star, Layout, Book, Compass, Flame } from "lucide-react";

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur"
      aria-label="Navegación principal"
    >
      <div className="grid grid-cols-7">
        <Link
          to="/home"
          className="flex flex-col items-center gap-1 py-3 text-[10px] text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <BookOpen className="h-5 w-5" />
          Hoy
        </Link>
        <Link
          to="/explorar"
          className="flex flex-col items-center gap-1 py-3 text-[10px] text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <Compass className="h-5 w-5" />
          Explorar
        </Link>
        <Link
          to="/devocionales"
          className="flex flex-col items-center gap-1 py-3 text-[10px] text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <Flame className="h-5 w-5" />
          Vela
        </Link>
        <Link
          to="/gracias"
          className="flex flex-col items-center gap-1 py-3 text-[10px] text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <Star className="h-5 w-5" />
          Gracias
        </Link>
        <Link
          to="/diario"
          className="flex flex-col items-center gap-1 py-3 text-[10px] text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <Book className="h-5 w-5" />
          Diario
        </Link>
        <Link
          to="/widgets"
          className="flex flex-col items-center gap-1 py-3 text-[10px] text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <Layout className="h-5 w-5" />
          Widgets
        </Link>
        <Link
          to="/settings"
          className="flex flex-col items-center gap-1 py-3 text-[10px] text-muted-foreground transition-colors data-[status=active]:text-accent"
          activeProps={{ "data-status": "active" } as never}
        >
          <Settings className="h-5 w-5" />
          Ajustes
        </Link>
      </div>
    </nav>
  );
}
