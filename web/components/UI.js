"use client";

import { useI18n } from "@/lib/I18nContext";

export function Loading({ text }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500 dark:text-slate-400">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600 dark:border-brand-900 dark:border-t-brand-400" />
      <p className="text-sm">{text || t("common.loading")}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-red-100 bg-red-50 px-6 py-10 text-center dark:border-red-900/50 dark:bg-red-950/40">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl dark:bg-red-900/50">
        ⚠️
      </div>
      <p className="max-w-sm text-sm text-red-700 dark:text-red-300">
        {message || t("common.error")}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
        >
          {t("common.retry")}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = "🗒️", title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900/50">
      <div className="text-3xl">{icon}</div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      {subtitle && (
        <p className="max-w-sm text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}

const STATUS_STYLES = {
  pending:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/60",
  confirmed:
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700/60",
  called:
    "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/40 dark:text-brand-300 dark:border-brand-700/60",
  done: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600",
  cancelled:
    "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/60",
};

export function StatusBadge({ status }) {
  const { t } = useI18n();
  const label = status ? t(`status.${status}`) : t("common.unknown");
  const className = STATUS_STYLES[status] || STATUS_STYLES.done;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  type = "button",
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";
  const variants = {
    primary: "bg-brand-600 text-white shadow-soft hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600",
    secondary:
      "bg-white text-brand-700 border border-brand-200 hover:bg-brand-50 dark:bg-slate-900 dark:text-brand-300 dark:border-brand-700/60 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
    danger:
      "bg-white text-red-600 border border-red-200 hover:bg-red-50 dark:bg-slate-900 dark:text-red-400 dark:border-red-800/60 dark:hover:bg-red-950/40",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl2 border border-slate-100 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-900/40 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:placeholder:text-slate-500";

export const selectClass = inputClass;
