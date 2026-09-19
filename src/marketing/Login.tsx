"use client";

import { useState } from "react";

const DEMO_EMAIL = "demo@caconnect.com";
const DEMO_PASSWORD = "demo123";

export default function Login({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      setLoading(false);
      onSuccess();
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-5 sm:px-8">
        <button onClick={onBack} className="flex items-center gap-2.5 text-left">
          <svg viewBox="0 0 32 32" className="size-6 shrink-0" aria-hidden="true">
            <rect width="32" height="32" rx="7" className="fill-foreground"></rect>
            <path
              d="M10 7h8.5L23 11.5V25a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"
              className="fill-background"
            ></path>
            <path d="M18.5 7 23 11.5h-4.5V7z" className="fill-muted-foreground"></path>
            <path
              d="m12.2 17.6 2.6 2.6 5-5.4"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-foreground"
            ></path>
          </svg>
          <div className="flex flex-col leading-none">
            <span className="font-semibold tracking-tight text-foreground text-[14px]">CAConnect</span>
            <span className="mt-0.5 text-[10px] font-medium text-muted-foreground">by Bevritti</span>
          </div>
        </button>
        <button
          onClick={onBack}
          className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to site
        </button>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your CA practice</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[13px] text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                placeholder="you@firm.in"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[13px] text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="••••••••"
              />
            </div>

            {error ? (
              <p className="rounded border border-danger/40 bg-danger-soft/40 px-3 py-2 text-[13px] text-danger">
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={loading} className="btn-brand w-full">
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setEmail(DEMO_EMAIL);
                setPassword(DEMO_PASSWORD);
                setError("");
              }}
              className="btn-ghost-line w-full"
            >
              Use Demo Credentials
            </button>
          </form>

          <div className="mt-6 rounded border border-border bg-surface px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
            Demo credentials
            <div className="mt-1 text-foreground font-mono">{DEMO_EMAIL}</div>
            <div className="text-foreground font-mono">{DEMO_PASSWORD}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
