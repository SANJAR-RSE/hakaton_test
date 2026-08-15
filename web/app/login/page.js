"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button, Card, Field, inputClass } from "@/components/UI";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!phone.trim() || !password) {
      setError("Telefon raqam va parolni kiriting.");
      return;
    }
    setSubmitting(true);
    try {
      const user = await login(phone.trim(), password);
      if (user.role === "doctor") {
        router.replace("/doctor");
      } else {
        router.replace("/appointments");
      }
    } catch (err) {
      setError(err.message || "Kirishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-slate-800">Xush kelibsiz</h1>
          <p className="mt-1 text-sm text-slate-500">
            Hisobingizga kiring
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Telefon raqam">
            <input
              className={inputClass}
              type="tel"
              placeholder="+998901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </Field>

          <Field label="Parol">
            <input
              className={inputClass}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Kirilmoqda..." : "Kirish"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Hisobingiz yo'qmi?{" "}
          <Link href="/register" className="font-medium text-brand-600 hover:underline">
            Ro'yxatdan o'tish
          </Link>
        </p>
      </Card>
    </div>
  );
}
