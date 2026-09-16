"use client";

import { useEffect, useState } from "react";
import Shell from "@/app/Shell";
import Landing from "@/marketing/Landing";
import Login from "@/marketing/Login";
import { readLoggedIn, writeLoggedIn } from "@/app/auth";

type View = "landing" | "login" | "app";

export default function HomePage() {
  const [view, setView] = useState<View>("landing");
  const [mounted, setMounted] = useState(false);

  // Restore the demo login state after hydration (localStorage is browser-only)
  useEffect(() => {
    setMounted(true);
    if (readLoggedIn()) {
      setView("app");
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-sm border border-brand/50 text-[11px] font-semibold text-brand">
            CA
          </span>
          <span className="font-serif text-lg tracking-tight text-foreground">CAConnect</span>
        </div>
      </div>
    );
  }

  if (view === "app") {
    return (
      <Shell
        onLogout={() => {
          writeLoggedIn(false);
          setView("landing");
        }}
      />
    );
  }

  if (view === "login") {
    return (
      <Login
        onSuccess={() => {
          writeLoggedIn(true);
          setView("app");
        }}
        onBack={() => setView("landing")}
      />
    );
  }

  return <Landing onLogin={() => setView("login")} onStart={() => setView("login")} />;
}
