import { useState } from "react";

const NAV_LINKS = [
  { label: "Find a CA", href: "#find-a-ca" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const MODULES = [
  ["Client register", "Every client, PAN, GSTIN and contact person in one searchable list."],
  ["Compliance calendar", "Statutory due dates mapped to each client, month by month."],
  ["Document collection & KYC", "Request, chase and store client documents without email threads."],
  ["GST 2A/2B reconciliation", "Match purchase registers against portal data and flag mismatches."],
  ["TDS return workflow", "Quarterly returns tracked from challan to filing acknowledgement."],
  ["Audit workpapers & checklists", "Standard checklists, reviewer sign-off and workpaper trails."],
  ["Notice tracker", "Every notice, hearing date and reply status in one register."],
  ["Income Tax status", "Filing stage, refunds and assessment status per assessee."],
  ["Fee register", "Bills raised, receipts, outstanding and write-offs by client."],
  ["Advance Tax", "Instalment computation and reminders across all four quarters."],
  ["Client Emails", "Drafted, sent and pending client correspondence, logged."],
  ["Team", "Assign work, see load per member and track review status."],
  ["Marketplace", "Find empanelment work and collaborate with other firms."],
];

const STEPS = [
  ["01", "Add your clients", "Import a list or add clients one by one with PAN, GSTIN and contacts."],
  ["02", "Track compliance, documents and fees", "Due dates, document requests and billing stay attached to the client."],
  ["03", "Run the firm from one place", "One dashboard for the whole team, every morning."],
];

const FEATURES = [
  ["Built for small firms", "Designed for practices of one to five people, not enterprise finance teams."],
  ["Indian statutory calendar", "GST, TDS, Income Tax and audit dates already mapped."],
  ["AI-assisted drafting", "Turn a notice into a first-draft reply in seconds, then edit."],
  ["Nothing to install", "Runs in the browser. Set up in under five minutes."],
  ["Client-wise view", "Open one client and see deadlines, documents, notices and fees together."],
  ["Clear fee tracking", "Know what is billed, received and outstanding without a spreadsheet."],
];

const PLANS = [
  { name: "Starter", price: "Free", note: "Up to 10 clients", features: ["Client register", "Compliance calendar", "Document requests", "Email support"] },
  { name: "Solo", price: "₹999", per: "/mo", note: "For a single practitioner", features: ["Unlimited clients", "GST 2A/2B reconciliation", "Fee register", "Notice tracker"], highlight: true },
  { name: "Pro", price: "₹1,999", per: "/mo", note: "For a growing practice", features: ["Everything in Solo", "TDS & audit workflows", "AI-assisted drafting", "Priority support"] },
  { name: "Team", price: "₹2,999", per: "/mo", note: "For firms up to five people", features: ["Everything in Pro", "Team assignment & review", "Marketplace access", "Onboarding help"] },
];

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-sm border border-brand/50 text-[11px] font-semibold text-brand">
        CA
      </span>
      <span className="font-serif text-lg tracking-tight">CAConnect</span>
    </div>
  );
}

export default function Landing({ onLogin, onStart }: { onLogin: () => void; onStart: () => void }) {
  const [menu, setMenu] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={onLogin}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </button>
            <button onClick={onStart} className="btn-brand">
              Start free
            </button>
          </nav>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label="Open menu"
            className="rounded border border-border px-2 py-1 text-sm md:hidden"
          >
            ☰
          </button>
        </div>
        {menu ? (
          <div className="border-t border-border px-5 py-3 md:hidden">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenu(false)}
                  className="text-sm text-muted-foreground"
                >
                  {l.label}
                </a>
              ))}
              <button onClick={onLogin} className="text-left text-sm text-muted-foreground">
                Log in
              </button>
              <button onClick={onStart} className="btn-brand w-full">
                Start free
              </button>
            </div>
          </div>
        ) : null}
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24">
        <p className="text-[11px] tracking-[0.18em] text-brand">
          PRACTICE MANAGEMENT FOR INDIAN CA FIRMS
        </p>
        <h1 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
          Run your CA firm
          <br />
          without the chaos
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Client deadlines, document collection, GST reconciliation, fee tracking and AI-drafted IT
          notice replies — in one place, built for firms of one to five people.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={onStart} className="btn-brand">
            Start free — no credit card
          </button>
          <a href="#how-it-works" className="btn-ghost-line">
            See how it works
          </a>
        </div>
        <p className="mt-4 text-[12px] text-muted-foreground">
          Free for up to 10 clients · Set up in under 5 minutes
        </p>
      </section>

      {/* Drafting */}
      <section className="border-t border-border bg-surface/40 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-brand">AI-ASSISTED DRAFTING</p>
            <h2 className="mt-4 font-serif text-3xl tracking-tight sm:text-4xl">
              An hour of drafting, in half a minute
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Paste the notice, pick the client, and get a structured first draft with the facts,
              the relevant section and the documents to attach. You review and edit — it never
              files anything on its own.
            </p>
            <ul className="mt-6 space-y-2 text-[13px] text-muted-foreground">
              <li>· Section-wise reply structure</li>
              <li>· Suggested annexure list</li>
              <li>· Editable before anything leaves the firm</li>
            </ul>
          </div>
          <div className="card-surface overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-[12px] text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-brand/70" />
              Notice reply · draft
            </div>
            <div className="space-y-4 p-4">
              <div className="rounded border border-border bg-surface-2 p-3">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Notice received
                </p>
                <p className="mt-2 text-[13px] leading-relaxed">
                  Notice u/s 143(1)(a) — mismatch between reported income and Form 26AS for
                  AY 2025-26. Client: Sample Traders LLP. Response due in 12 days.
                </p>
              </div>
              <div className="rounded border border-brand/30 bg-surface-2 p-3">
                <p className="text-[11px] uppercase tracking-wider text-brand">Draft reply</p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  With reference to the intimation dated 12 June, we submit that the difference
                  arises from professional receipts already offered to tax under the head Business
                  Income. A reconciliation statement and ledger extract are annexed…
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                  <span className="rounded border border-border px-2 py-0.5">Reconciliation.pdf</span>
                  <span className="rounded border border-border px-2 py-0.5">Ledger-extract.pdf</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Demo text only. No client information is used.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            What you open at nine in the morning
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
            Today's deadlines, documents still pending with clients, notices with a hearing date and
            fees outstanding — before the first phone call of the day.
          </p>
          <div className="card-surface mt-9 overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <Logo />
              <span className="text-[12px] text-muted-foreground">Dashboard preview</span>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Due this week", "14", "GST, TDS and IT filings"],
                ["Documents pending", "23", "With clients for over 5 days"],
                ["Open notices", "6", "2 with hearing dates"],
                ["Fees outstanding", "₹4.860L", "Across 18 clients"],
              ].map(([label, value, sub]) => (
                <div key={label} className="rounded border border-border bg-surface-2 p-4">
                  <p className="text-[12px] text-muted-foreground">{label}</p>
                  <p className="mt-2 font-serif text-2xl">{value}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border p-4">
              <div className="space-y-2">
                {[
                  ["GSTR-3B · Sample Traders LLP", "Due in 2 days"],
                  ["TDS 24Q · Demo Industries Pvt Ltd", "Due in 5 days"],
                  ["Tax audit · Example Foods", "Workpapers in review"],
                ].map(([task, status]) => (
                  <div
                    key={task}
                    className="flex flex-wrap items-center justify-between gap-2 rounded border border-border px-3 py-2 text-[13px]"
                  >
                    <span>{task}</span>
                    <span className="text-[12px] text-muted-foreground">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-[12px] text-muted-foreground">
            Sign in with the demo credentials to open the full working dashboard.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-border bg-surface/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map(([n, title, body]) => (
              <div key={n} className="border-t border-border-strong pt-5">
                <p className="font-serif text-2xl text-brand">{n}</p>
                <h3 className="mt-3 text-[15px] font-medium">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="find-a-ca" className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Everything a practice runs on
          </h2>
          <p className="mt-4 max-w-2xl text-[15px] text-muted-foreground">
            Thirteen modules that cover the working week of an Indian CA firm.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map(([title, body]) => (
              <div key={title} className="card-surface p-4 transition-colors hover:border-brand/40">
                <h3 className="text-[14px] font-medium">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-surface/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">Why firms switch</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(([title, body]) => (
              <div key={title}>
                <h3 className="text-[14px] font-medium">
                  <span className="mr-2 text-brand">—</span>
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">Simple pricing</h2>
          <p className="mt-4 text-[15px] text-muted-foreground">
            Start free. Upgrade when the client list grows.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`card-surface flex flex-col p-5 ${
                  p.highlight ? "border-brand/50" : ""
                }`}
              >
                <p className="text-[13px] text-muted-foreground">{p.name}</p>
                <p className="mt-3 font-serif text-3xl">
                  {p.price}
                  {p.per ? (
                    <span className="text-[13px] font-sans text-muted-foreground">{p.per}</span>
                  ) : null}
                </p>
                <p className="mt-2 text-[12px] text-muted-foreground">{p.note}</p>
                <ul className="mt-5 flex-1 space-y-2 text-[13px] text-muted-foreground">
                  {p.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
                <button
                  onClick={onStart}
                  className={`mt-6 ${p.highlight ? "btn-brand" : "btn-ghost-line"} w-full`}
                >
                  Start free
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border bg-surface/40 py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Ready to run your CA firm without the chaos?
          </h2>
          <div className="mt-8">
            <button onClick={onStart} className="btn-brand">
              Start free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:px-8 md:flex-row md:justify-between">
          <div>
            <Logo />
            <p className="mt-3 text-[13px] text-muted-foreground">Built for Indian CA firms</p>
          </div>
          <div className="flex flex-wrap gap-6 text-[13px] text-muted-foreground">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="transition-colors hover:text-foreground">
                {l.label}
              </a>
            ))}
            <button onClick={onLogin} className="transition-colors hover:text-foreground">
              Log in
            </button>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl px-5 text-[12px] text-muted-foreground sm:px-8">
          © 2026 CAConnect · Built for Indian CA firms
        </div>
      </footer>
    </div>
  );
}
