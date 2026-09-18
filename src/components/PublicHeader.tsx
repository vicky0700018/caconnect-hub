"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export function PublicLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
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
      <div className="flex min-w-0 flex-col leading-none">
        <span className="font-semibold tracking-tight text-foreground text-[15px]">
          CAConnect
        </span>
        <span className="mt-0.5 text-[0.625rem] font-medium tracking-wide text-muted-foreground">
          by Bevritti
        </span>
      </div>
    </div>
  );
}

export function PublicHeader({ activeNav }: { activeNav?: string }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 border-b border-rule/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="CAConnect home"
          className="shrink-0 transition-opacity hover:opacity-90"
        >
          <PublicLogo />
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/find-a-ca"
            className={`inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-[0.8rem] font-medium transition-colors ${activeNav === "find-a-ca"
                ? "bg-muted/50 text-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
          >
            Find a CA
          </Link>
          <Link
            href="/#workflows"
            className="inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-[0.8rem] font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          >
            Pricing
          </Link>

          <Link
            href="/login"
            className="inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted/50"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="inline-flex h-7 items-center justify-center gap-1 rounded-md bg-brand hover:bg-brand/90 text-brand-foreground px-3 text-[0.8rem] font-medium transition-all"
          >
            Start free
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/login"
            className="inline-flex h-7 items-center justify-center rounded-md bg-brand hover:bg-brand/90 px-2.5 text-[0.8rem] font-medium text-brand-foreground"
          >
            Start free
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenu((m) => !m)}
            className="flex size-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu ? (
        <div className="border-t border-rule bg-card/95 px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-3 text-sm">
            <Link
              href="/find-a-ca"
              onClick={() => setMobileMenu(false)}
              className="text-left text-muted-foreground transition-colors hover:text-foreground font-medium"
            >
              Find a CA
            </Link>
            <Link
              href="/#workflows"
              onClick={() => setMobileMenu(false)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenu(false)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setMobileMenu(false)}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
            <div className="my-1 border-t border-rule" />
            <button
              onClick={() => {
                setMobileMenu(false);
                router.push("/login");
              }}
              className="text-left font-medium text-foreground"
            >
              Log in
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
