"use client";

import { useSyncExternalStore } from "react";
import { localeNames, locales, type Locale } from "@/lib/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
}

function subscribe(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const getHash = () => window.location.hash;
const getServerHash = () => "";

// Keeps the visitor's section when switching: /en#projects → /it#projects.
// The hash is part of the href (not added on click), so middle-click and
// "open in new tab" keep it too. Plain links (full page load) because each
// locale has its own <html lang>.
export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center border border-neutral-200 dark:border-neutral-800 text-[11px] uppercase tracking-widest"
    >
      {locales.map((l) => {
        const active = l === locale;
        return (
          <a
            key={l}
            href={`/${l}${hash}`}
            hrefLang={l}
            lang={l}
            title={localeNames[l]}
            aria-current={active ? "true" : undefined}
            className={`px-2.5 py-1.5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white ${
              active
                ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
            }`}
          >
            {l}
            {/* Accessible name starts with the visible "EN"/"IT" (WCAG 2.5.3) */}
            <span className="sr-only"> {localeNames[l]}</span>
          </a>
        );
      })}
    </div>
  );
}
