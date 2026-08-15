import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "MedQueue Tashkent",
  description: "Toshkent shifoxonalarida onlayn navbat va tibbiy tarix",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body className="min-h-screen bg-[#f7faf9] text-slate-900 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-57px)] max-w-4xl px-4 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
