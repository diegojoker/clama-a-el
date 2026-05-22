import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { STORAGE_KEYS, readLS } from "@/lib/storage";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const done = readLS<boolean>(STORAGE_KEYS.onboarded, false);
    navigate({ to: done ? "/home" : "/onboarding", replace: true });
  }, [navigate]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-pulse rounded-full bg-accent/40" />
    </div>
  );
}
