"use client";

import { ThemeProvider } from "@/lib/ThemeContext";
import { I18nProvider } from "@/lib/I18nContext";
import { AuthProvider } from "@/lib/AuthContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>{children}</AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
