import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Shell from "@/app/Shell";
import Landing from "@/marketing/Landing";
import Login from "@/marketing/Login";
import { readLoggedIn, writeLoggedIn } from "@/app/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CAConnect — practice management for Indian CA firms" },
      {
        name: "description",
        content:
          "Client deadlines, document collection, GST reconciliation, fee tracking and AI-drafted notice replies for CA firms of one to five people.",
      },
      { property: "og:title", content: "CAConnect — practice management for Indian CA firms" },
      {
        property: "og:description",
        content:
          "Client deadlines, document collection, GST reconciliation, fee tracking and AI-drafted notice replies for CA firms of one to five people.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type View = "landing" | "login" | "app";

function App() {
  const [view, setView] = useState<View>("landing");

  // Restore the demo login state after hydration (localStorage is browser-only).
  useEffect(() => {
    if (readLoggedIn()) setView("app");
  }, []);

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
