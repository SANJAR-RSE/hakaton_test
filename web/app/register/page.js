"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button, Card, Field, inputClass } from "@/components/UI";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !password) {
      setError("Barcha maydonlarni to'ldiring.");
      return;
    }
    if (password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name.trim(), phone.trim(), password);
      router.replace("/appointments");
    } catch (err) {
      setError(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-slate-800">Ro'yxatdan o'tish</h1>
          <p className="mt-1 text-sm text-slate-500">
            Yangi bemor hisobi yarating
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Ism familiya">
            <input
              className={inputClass}
              type="text"
              placeholder="Aziz Karimov"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </Field>

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
              autoComplete="new-password"
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Yuborilmoqda..." : "Ro'yxatdan o'tish"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Hisobingiz bormi?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Kirish
          </Link>
        </p>
      </Card>
    </div>
  );
}
