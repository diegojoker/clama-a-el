import { Link } from "@tanstack/react-router";
import { BookOpen, Settings, Star, Book, Compass, HandHeart } from "lucide-react";

export function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/95 backdrop-blur"
      aria-label="Navegación principal"
    >
      <div className="grid grid-cols-6">
        <Link
          to="/home"
          className="flex flex-col items-center gap-1 py-3 text-[10px] font-medium text-muted-foreground transition-colors data-[status=active]:font-bold data-[status=active]:text-foreground"
          activeProps={{ "data-status": "active" } as never}
        >
          <BookOpen className="h-5 w-5" />
          Hoy
        </Link>
        <Link
          to="/explorar"
          className="flex flex-col items-center gap-1 py-3 text-[10px] font-medium text-muted-foreground transition-colors data-[status=active]:font-bold data-[status=active]:text-foreground"
          activeProps={{ "data-status": "active" } as never}
        >
          <Compass className="h-5 w-5" />
          Explorar
        </Link>
        <Link
          to="/gracias"
          className="flex flex-col items-center gap-1 py-3 text-[10px] font-medium text-muted-foreground transition-colors data-[status=active]:font-bold data-[status=active]:text-foreground"
          activeProps={{ "data-status": "active" } as never}
        >
          <Star className="h-5 w-5" />
          Gracias
        </Link>
        <Link
          to="/diario"
          className="flex flex-col items-center gap-1 py-3 text-[10px] font-medium text-muted-foreground transition-colors data-[status=active]:font-bold data-[status=active]:text-foreground"
          activeProps={{ "data-status": "active" } as never}
        >
          <Book className="h-5 w-5" />
          Diario
        </Link>
        <Link
          to="/mural"
          className="flex flex-col items-center gap-1 py-3 text-[10px] font-medium text-muted-foreground transition-colors data-[status=active]:font-bold data-[status=active]:text-foreground"
          activeProps={{ "data-status": "active" } as never}
        >
          <HandHeart className="h-5 w-5" />
          Mural
        </Link>
        <Link
          to="/settings"
          className="flex flex-col items-center gap-1 py-3 text-[10px] font-medium text-muted-foreground transition-colors data-[status=active]:font-bold data-[status=active]:text-foreground"
          activeProps={{ "data-status": "active" } as never}
        >
          <Settings className="h-5 w-5" />
          Ajustes
        </Link>
      </div>
    </nav>
  );
}
