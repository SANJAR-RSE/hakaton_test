"use client";

export function Loading({ text = "Yuklanmoqda..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl2 border border-red-100 bg-red-50 px-6 py-10 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl">
        ⚠️
      </div>
      <p className="max-w-sm text-sm text-red-700">
        {message || "Nimadir noto'g'ri ketdi. Qayta urinib ko'ring."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Qayta urinish
        </button>
      )}
    </div>
  );
}

export function EmptyState({ icon = "🗒️", title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
      <div className="text-3xl">{icon}</div>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      {subtitle && <p className="max-w-sm text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}

const STATUS_MAP = {
  pending: { label: "Kutilmoqda", className: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Tasdiqlangan", className: "bg-sky-50 text-sky-700 border-sky-200" },
  called: { label: "Chaqirilgan", className: "bg-brand-50 text-brand-700 border-brand-200" },
  done: { label: "Tugagan", className: "bg-slate-100 text-slate-600 border-slate-200" },
  cancelled: { label: "Bekor qilingan", className: "bg-red-50 text-red-600 border-red-200" },
};

export function StatusBadge({ status }) {
  const info = STATUS_MAP[status] || {
    label: status || "Noma'lum",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${info.className}`}
    >
      {info.label}
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
    primary: "bg-brand-600 text-white shadow-soft hover:bg-brand-700",
    secondary: "bg-white text-brand-700 border border-brand-200 hover:bg-brand-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
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
      className={`rounded-xl2 border border-slate-100 bg-white p-5 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-400";

export const selectClass = inputClass;
