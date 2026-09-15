import { useState } from "react";
import { DEMO_EMAIL, DEMO_PASSWORD, checkCredentials } from "@/app/auth";

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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (checkCredentials(email, password)) {
      setError("");
      onSuccess();
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex h-16 items-center justify-between border-b border-border px-5 sm:px-8">
        <button onClick={onBack} className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-sm border border-brand/50 text-[11px] font-semibold text-brand">
            CA
          </span>
          <span className="font-serif text-lg tracking-tight">CAConnect</span>
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

            <button type="submit" className="btn-brand w-full">
              Sign in
            </button>

            <button
              type="button"
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
            <div className="mt-1 text-foreground">{DEMO_EMAIL}</div>
            <div className="text-foreground">{DEMO_PASSWORD}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
