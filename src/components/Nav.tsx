"use client";

import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { CrossLine } from "./CrossLine";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n";

interface NavProps {
  locale: Locale;
  links: { href: string; label: string }[];
  name: string;
  // Where the name links to; "#" scrolls to the top of the portfolio page.
  homeHref?: string;
  resumePath?: string;
  // Language of the resume PDF, which may differ from the page (e.g. English CV on /it).
  resumeLang?: string;
  ui: {
    resume: string;
    menuOpen: string;
    menuClose: string;
    toggleMenu: string;
    toggleTheme: string;
    language: string;
  };
}

export function Nav({
  locale,
  links,
  name,
  homeHref = "#",
  resumePath,
  resumeLang = locale,
  ui,
}: NavProps) {
  const [open, setOpen] = useState(false);
  const resumeLabel =
    resumeLang === locale ? ui.resume : `${ui.resume} (${resumeLang.toUpperCase()})`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-5 md:px-10 flex items-center justify-between h-14">
        <a
          href={homeHref}
          className="text-black dark:text-white font-bold text-sm tracking-wider"
        >
          {name}
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-200 uppercase tracking-widest"
            >
              {l.label}
            </a>
          ))}
          <LanguageSwitcher locale={locale} label={ui.language} />
          <ThemeToggle label={ui.toggleTheme} />
          {resumePath && (
            <a
              href={resumePath}
              target="_blank"
              type="application/pdf"
              hrefLang={resumeLang}
              className="text-xs text-white dark:text-black bg-black dark:bg-white px-4 py-1.5 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors duration-200 uppercase tracking-widest"
            >
              {resumeLabel}
            </a>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher locale={locale} label={ui.language} />
          <ThemeToggle label={ui.toggleTheme} />
          <button
            onClick={() => setOpen(!open)}
            className="text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white text-sm min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={ui.toggleMenu}
            aria-expanded={open}
          >
            {open ? ui.menuClose : ui.menuOpen}
          </button>
        </div>
      </div>

      {/* Vercel-style bottom line with + markers */}
      <div className="hidden lg:block max-w-4xl mx-auto">
        <CrossLine />
      </div>
      <div className="lg:hidden h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-black/95 backdrop-blur-sm">
          <div className="px-5 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest py-3"
              >
                {l.label}
              </a>
            ))}
            {resumePath && (
              <a
                href={resumePath}
                target="_blank"
                type="application/pdf"
                hrefLang={resumeLang}
                className="text-xs text-white dark:text-black bg-black dark:bg-white px-4 py-3 hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors uppercase tracking-widest w-fit mt-2"
              >
                {resumeLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
