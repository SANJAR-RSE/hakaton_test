"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Loading } from "@/components/UI";

export default function HomePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!token || !user) {
      router.replace("/login");
    } else if (user.role === "doctor") {
      router.replace("/doctor");
    } else {
      router.replace("/appointments");
    }
  }, [loading, token, user, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loading text="Yo'naltirilmoqda..." />
    </div>
  );
}
