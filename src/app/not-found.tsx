import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center text-foreground">
      <h1 className="font-serif text-4xl font-bold">404</h1>
      <p className="mt-2 text-muted-foreground">Page not found</p>
      <Link
        href="/dashboard"
        className="mt-6 rounded border border-border px-4 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
