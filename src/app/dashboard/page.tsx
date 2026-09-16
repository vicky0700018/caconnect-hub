"use client";

import { useRouter } from "next/navigation";
import Shell from "@/app/Shell";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/");
    router.refresh();
  }

  return <Shell onLogout={handleLogout} />;
}
