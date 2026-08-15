import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "MedQueue Tashkent",
  description: "Toshkent shifoxonalarida onlayn navbat va tibbiy tarix",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("mq_theme");
    var dark =
      stored === "dark" ||
      (stored !== "light" &&
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) {
      document.documentElement.classList.add("dark");
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen bg-[#f7faf9] text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Providers>
          <Navbar />
          <main className="mx-auto min-h-[calc(100vh-57px)] max-w-4xl px-4 py-6 pb-24 sm:pb-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
