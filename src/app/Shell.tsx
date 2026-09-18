"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  FileText,
  Receipt,
  Landmark,
  ClipboardCheck,
  Building2,
  Percent,
  Scale,
  GitCompare,
  Mail,
  Store,
} from "lucide-react";
import { NAV, StoreProvider, useStore, type Page } from "./store";
import { Toasts } from "./ui";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Deadlines from "./pages/Deadlines";
import Documents from "./pages/Documents";
import Fees from "./pages/Fees";
import TDSReturns from "./pages/TDSReturns";
import Audits from "./pages/Audits";
import IncomeTax from "./pages/IncomeTax";
import AdvanceTax from "./pages/AdvanceTax";
import NoticeTracker from "./pages/NoticeTracker";
import AddNoticeMatter from "./pages/AddNoticeMatter";
import GSTReconciliation from "./pages/GSTReconciliation";
import ClientEmails from "./pages/ClientEmails";
import DraftEmail from "./pages/DraftEmail";
import Team from "./pages/Team";
import Marketplace from "./pages/Marketplace";

const NAV_ITEMS: {
  id: Page;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "Dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "Clients", name: "Clients", icon: Users },
  { id: "Deadlines", name: "Deadlines", icon: CalendarClock },
  { id: "Documents", name: "Documents", icon: FileText },
  { id: "Fees", name: "Fees", icon: Receipt },
  { id: "TDS Returns", name: "TDS Returns", icon: Landmark },
  { id: "Audits", name: "Audits", icon: ClipboardCheck },
  { id: "Income Tax", name: "Income Tax", icon: Building2 },
  { id: "Advance Tax", name: "Advance Tax", icon: Percent },
  { id: "Notice Tracker", name: "Notice Tracker", icon: Scale },
  { id: "GST Reconciliation", name: "GST Reconciliation", icon: GitCompare },
  { id: "Client Emails", name: "Client Emails", icon: Mail },
  { id: "Team", name: "Team", icon: Users },
  { id: "Marketplace", name: "Marketplace", icon: Store },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { page, setPage } = useStore();
  return (
    <nav className="flex h-full flex-col bg-sidebar">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <span className="grid h-6 w-6 place-items-center rounded-sm border border-border-strong text-[11px] font-semibold">
          CA
        </span>
        <span className="font-serif text-lg tracking-tight">CAConnect</span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto p-2.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            page === item.id ||
            (item.id === "Notice Tracker" && page === "Add notice matter") ||
            (item.id === "Client Emails" && page === "Draft a client email");
          return (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                onNavigate?.();
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[13.5px] transition-colors ${
                active
                  ? "bg-accent font-medium text-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              <Icon className={`size-4.5 shrink-0 ${active ? "text-foreground" : "text-muted-foreground"}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-success"></span>
        <span>MongoDB Database Connected</span>
      </div>
    </nav>
  );
}

function Header({ onMenu, onLogout }: { onMenu: () => void; onLogout?: () => void }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("caconnect_theme") as "dark" | "light" | null;
      if (saved === "light") {
        setTheme("light");
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        setTheme("dark");
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch {
      // fallback
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("caconnect_theme", next);
      if (next === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch {
      // ignore
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:px-8">
      <button
        onClick={onMenu}
        aria-label="Open navigation"
        className="rounded border border-border px-2 py-1 text-sm lg:hidden"
      >
        ☰
      </button>
      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors inline-flex items-center justify-center cursor-pointer"
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
        <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-surface-2 text-[11px] font-semibold text-foreground">
          ST
        </span>
        <span className="hidden text-[13px] text-foreground sm:inline">Sthambhalliance</span>
        {onLogout ? (
          <button
            onClick={onLogout}
            className="rounded border border-border px-2 py-1 text-[12px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}

function Body() {
  const { page } = useStore();
  switch (page) {
    case "Dashboard":
      return <Dashboard />;
    case "Clients":
      return <Clients />;
    case "Deadlines":
      return <Deadlines />;
    case "Documents":
      return <Documents />;
    case "Fees":
      return <Fees />;
    case "TDS Returns":
      return <TDSReturns />;
    case "Audits":
      return <Audits />;
    case "Income Tax":
      return <IncomeTax />;
    case "Advance Tax":
      return <AdvanceTax />;
    case "Notice Tracker":
      return <NoticeTracker />;
    case "Add notice matter":
      return <AddNoticeMatter />;
    case "GST Reconciliation":
      return <GSTReconciliation />;
    case "Client Emails":
      return <ClientEmails />;
    case "Draft a client email":
      return <DraftEmail />;
    case "Team":
      return <Team />;
    case "Marketplace":
      return <Marketplace />;
    default:
      return <Dashboard />;
  }
}

function Frame({ onLogout }: { onLogout?: () => void }) {
  const [menu, setMenu] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-52 border-r border-border lg:block xl:w-60">
        <Sidebar />
      </aside>
      {menu ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 left-0 w-60 border-r border-border">
            <Sidebar onNavigate={() => setMenu(false)} />
          </div>
        </div>
      ) : null}
      <div className="lg:pl-52 xl:pl-60">
        <Header onMenu={() => setMenu(true)} onLogout={onLogout} />
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <Body />
        </main>
      </div>
      <Toasts />
    </div>
  );
}

export default function Shell({ onLogout }: { onLogout?: () => void }) {
  return (
    <StoreProvider>
      <Frame onLogout={onLogout} />
    </StoreProvider>
  );
}
