import type { Metadata } from "next";
import "./globals.css";
import { NotFoundView } from "@/components/NotFoundView";
import { ThemeScript } from "@/components/ThemeScript";
import { inter, firaCode } from "@/lib/fonts";

// Every unmatched URL, e.g. /xx or /en/missing (bilingual, since the language is unknown)
export const metadata: Metadata = {
  title: "404 · Page not found",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased transition-colors duration-300">
        <NotFoundView />
      </body>
    </html>
  );
}
