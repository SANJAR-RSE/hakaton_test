"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";
import { useI18n } from "@/lib/I18nContext";

const LANGS = ["uz", "ru", "en"];

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 1020.354 15.354z" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function StethoscopeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4v6a4 4 0 0 0 8 0V4" />
      <path d="M8 18a4 4 0 0 0 4-4v-1" />
      <circle cx="18" cy="17" r="2" />
    </svg>
  );
}

function LogoutIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  return (
    <button
      onClick={toggleTheme}
      aria-label={t("nav.theme")}
      title={t("nav.theme")}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function LangSwitcher() {
  const { lang, setLang, t } = useI18n();
  return (
    <div
      className="flex items-center overflow-hidden rounded-lg border border-slate-200 text-xs font-semibold dark:border-slate-700"
      aria-label={t("nav.language")}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1.5 uppercase transition ${
            lang === l
              ? "bg-brand-600 text-white"
              : "bg-white text-slate-500 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const links = !user
    ? []
    : user.role === "doctor"
    ? [{ href: "/doctor", label: t("nav.queue"), icon: StethoscopeIcon }]
    : [
        { href: "/appointments", label: t("nav.myAppointments"), icon: CalendarIcon },
        { href: "/book", label: t("nav.book"), icon: HomeIcon },
      ];

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-brand-700 dark:text-brand-400">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white dark:bg-brand-500">
              +
            </span>
            <span className="hidden sm:inline">{t("nav.brand")}</span>
          </Link>

          <nav className="flex items-center gap-1">
            {user && (
              <div className="hidden items-center gap-1 sm:flex">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      pathname === l.href
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="ml-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                >
                  {t("nav.logout")}
                </button>
              </div>
            )}

            <div className="ml-1 flex items-center gap-1.5">
              <LangSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>

      {user && (
        <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-slate-100 bg-white/95 backdrop-blur sm:hidden dark:border-slate-800 dark:bg-slate-950/95">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
                  active
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                <Icon />
                <span>{l.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-slate-500 dark:text-slate-400"
          >
            <LogoutIcon />
            <span>{t("nav.logout")}</span>
          </button>
        </nav>
      )}
    </>
  );
}
