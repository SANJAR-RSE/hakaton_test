"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import uz from "../locales/uz.json";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

const DICTS = { uz, ru, en };
const LANG_KEY = "mq_lang";
const DEFAULT_LANG = "uz";

const I18nContext = createContext(null);

function getInitialLang() {
  if (typeof window === "undefined") return DEFAULT_LANG;
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && DICTS[stored]) return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANG;
}

function lookup(dict, path) {
  return path
    .split(".")
    .reduce((acc, key) => (acc && typeof acc === "object" ? acc[key] : undefined), dict);
}

function interpolate(str, vars) {
  if (!vars) return str;
  return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
  );
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
    try {
      document.documentElement.lang = lang;
    } catch {
      /* ignore */
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    if (DICTS[next]) setLangState(next);
  }, []);

  const t = useCallback(
    (key, vars) => {
      const dict = DICTS[lang] || DICTS[DEFAULT_LANG];
      let value = lookup(dict, key);
      if (value === undefined) {
        value = lookup(DICTS[DEFAULT_LANG], key);
      }
      if (value === undefined) return key;
      if (typeof value === "string") return interpolate(value, vars);
      return value;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n I18nProvider ichida ishlatilishi kerak");
  }
  return ctx;
}
