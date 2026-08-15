"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Loading } from "@/components/UI";

/**
 * Wrap a page's content to guard it behind auth (and optionally a role).
 * Redirects to /login when not authenticated, or to the correct home
 * page when authenticated with the wrong role.
 */
export default function RequireAuth({ role, children }) {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  const wrongRole = role && user && user.role !== role;

  useEffect(() => {
    if (loading) return;
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    if (wrongRole) {
      router.replace(user.role === "doctor" ? "/doctor" : "/appointments");
    }
  }, [loading, token, user, wrongRole, router]);

  if (loading || !token || !user || wrongRole) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loading />
      </div>
    );
  }

  return children;
}
