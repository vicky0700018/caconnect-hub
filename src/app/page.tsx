"use client";

import { useRouter } from "next/navigation";
import Landing from "@/marketing/Landing";

export default function HomePage() {
  const router = useRouter();

  return (
    <Landing
      onLogin={() => router.push("/login")}
      onStart={() => router.push("/login")}
    />
  );
}
