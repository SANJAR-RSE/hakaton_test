"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "mq_theme";

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return null;
}

function getSystemTheme() {
  try {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  } catch {
    /* ignore */
  }
  return "light";
}

export function ThemeProvider({ children }) {
  // Server va birinchi klient render har doim "light" bilan boshlanadi (hydration
  // mismatch bo'lmasligi uchun) — inline script <html>ga "dark" klassini kerak bo'lsa
  // allaqachon qo'ygan (FOUC yo'q), bu yerda faqat React state mount'dan keyin
  // haqiqiy qiymatga sinxronlanadi.
  const [theme, setThemeState] = useState("light");
  const hasExplicitChoice = useRef(false);

  useEffect(() => {
    const stored = getStoredTheme();
    hasExplicitChoice.current = stored !== null;
    setThemeState(stored || getSystemTheme());

    // Foydalanuvchi hali hech qanday tanlov qilmagan bo'lsa — tizim mavzusi
    // real vaqtda o'zgarsa, sahifa ham unga ergashib tursin.
    let mql;
    function handleSystemChange(e) {
      if (!hasExplicitChoice.current) {
        setThemeState(e.matches ? "dark" : "light");
      }
    }
    try {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener("change", handleSystemChange);
    } catch {
      /* ignore */
    }
    return () => {
      try {
        mql && mql.removeEventListener("change", handleSystemChange);
      } catch {
        /* ignore */
      }
    };
  }, []);

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((next) => {
    hasExplicitChoice.current = true;
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      hasExplicitChoice.current = true;
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme ThemeProvider ichida ishlatilishi kerak");
  }
  return ctx;
}
