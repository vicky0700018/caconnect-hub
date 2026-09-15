import { useState } from "react";
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
      <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV.map((item) => {
          const active =
            page === item ||
            (item === "Notice Tracker" && page === "Add notice matter") ||
            (item === "Client Emails" && page === "Draft a client email");
          return (
            <button
              key={item}
              onClick={() => {
                setPage(item as Page);
                onNavigate?.();
              }}
              className={`block w-full rounded px-3 py-1.5 text-left text-[13px] transition-colors ${
                active
                  ? "border border-border-strong bg-accent text-foreground"
                  : "border border-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
      <div className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
        Frontend demo · mock data only
      </div>
    </nav>
  );
}

function Header({ onMenu }: { onMenu: () => void }) {
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
          aria-label="Theme"
          className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </svg>
        </button>
        <span className="grid h-7 w-7 place-items-center rounded-full border border-border bg-surface-2 text-[11px] font-semibold">
          ST
        </span>
        <span className="hidden text-[13px] text-foreground sm:inline">Sthambhalliance</span>
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

function Frame() {
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
        <Header onMenu={() => setMenu(true)} />
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <Body />
        </main>
      </div>
      <Toasts />
    </div>
  );
}

export default function Shell() {
  return (
    <StoreProvider>
      <Frame />
    </StoreProvider>
  );
}
