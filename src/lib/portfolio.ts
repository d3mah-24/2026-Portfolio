import en from "@/data/portfolio.en.json";
import it from "@/data/portfolio.it.json";
import type { Locale } from "@/lib/i18n";

// Skill category names are translated, so they are the one part of the schema
// whose keys differ between locales.
export type Portfolio = Omit<typeof en, "skills"> & {
  skills: Record<string, string[]>;
};

// Typing this map against the English file makes `pnpm build` fail when the
// Italian file drifts from the shared schema.
const portfolios: Record<Locale, Portfolio> = { en, it };

export function getPortfolio(locale: Locale): Portfolio {
  return portfolios[locale];
}

export type CurrentWork = {
  text?: string;
  company?: string;
  url?: string;
};

// portfolio.*.json may leave currentWork empty ({}), so every field is optional.
export function getCurrentWork(data: Portfolio): CurrentWork {
  return data.personal.currentWork;
}
