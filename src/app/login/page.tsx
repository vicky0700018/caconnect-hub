"use client";

import { useRouter } from "next/navigation";
import Login from "@/marketing/Login";

export default function LoginPage() {
  const router = useRouter();

  return (
    <Login
      onSuccess={() => {
        router.push("/dashboard");
        router.refresh();
      }}
      onBack={() => {
        router.push("/");
      }}
    />
  );
}
