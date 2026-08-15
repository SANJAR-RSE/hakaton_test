"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useI18n } from "@/lib/I18nContext";
import { errorMessage } from "@/lib/api";
import { Button, Card, Field, inputClass } from "@/components/UI";

export default function RegisterPage() {
  const { register } = useAuth();
  const { t } = useI18n();
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
      setError(t("register.validationError"));
      return;
    }
    if (password.length < 4) {
      setError(t("register.passwordLengthError"));
      return;
    }
    setSubmitting(true);
    try {
      await register(name.trim(), phone.trim(), password);
      router.replace("/appointments");
    } catch (err) {
      setError(errorMessage(err, t, "register.submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {t("register.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("register.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label={t("register.nameLabel")}>
            <input
              className={inputClass}
              type="text"
              placeholder="Aziz Karimov"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </Field>

          <Field label={t("register.phoneLabel")}>
            <input
              className={inputClass}
              type="tel"
              placeholder="+998901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
            />
          </Field>

          <Field label={t("register.passwordLabel")}>
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
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? t("register.submitting") : t("register.submit")}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          {t("register.haveAccount")}{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            {t("register.loginLink")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
