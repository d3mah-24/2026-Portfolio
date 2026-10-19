// Checks that portfolio.en.json and portfolio.it.json describe the same facts
// with the same schema. Run with: pnpm validate:i18n
import { existsSync, readFileSync } from "node:fs";

const read = (locale) =>
  JSON.parse(readFileSync(new URL(`../src/data/portfolio.${locale}.json`, import.meta.url), "utf8"));

const en = read("en");
const it = read("it");
const errors = [];

// 1. Same shape: same keys, array lengths and value types.
//    Skill category names are translated, so only their count and sizes must match.
function compareShape(a, b, path) {
  const type = (v) => (Array.isArray(v) ? "array" : v === null ? "null" : typeof v);
  if (type(a) !== type(b)) return errors.push(`${path}: ${type(a)} vs ${type(b)}`);
  if (Array.isArray(a)) {
    if (a.length !== b.length) return errors.push(`${path}: ${a.length} vs ${b.length} entries`);
    a.forEach((v, i) => compareShape(v, b[i], `${path}[${i}]`));
  } else if (type(a) === "object") {
    if (path === "skills") {
      return compareShape(Object.values(a), Object.values(b), "skills(values)");
    }
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      if (!(k in a) || !(k in b)) errors.push(`${path}.${k}: missing in ${k in a ? "it" : "en"}`);
      else compareShape(a[k], b[k], path ? `${path}.${k}` : k);
    }
  }
}
compareShape(en, it, "");

// 2. Facts that must not change with the language.
const facts = (d) => ({
  name: d.personal.name,
  email: d.personal.email,
  handle: d.personal.handle,
  country: d.personal.address?.country,
  imagePath: d.personal.imagePath,
  repoUrl: d.personal.repoUrl,
  socials: d.socials,
  secondarySocials: d.secondarySocials,
  navHrefs: d.navLinks.map((l) => l.href),
  terminalPrompts: d.terminal.map((t) => t.prompt),
  companies: d.experience.map((e) => e.company),
  periodYears: [...d.experience, ...d.education].map((e) => e.period.match(/\d{4}/g)),
  projects: d.projects.map((p) => ({ name: p.name, url: p.url, tech: p.tech })),
  calendlyUrl: d.contact.calendlyUrl,
});
const enFacts = facts(en);
const itFacts = facts(it);
for (const key of Object.keys(enFacts)) {
  if (JSON.stringify(enFacts[key]) !== JSON.stringify(itFacts[key])) {
    errors.push(`fact "${key}" differs between en and it`);
  }
}

// 3. Linked files must exist (an empty resumePath hides the download).
for (const [locale, d] of [["en", en], ["it", it]]) {
  for (const key of ["resumePath", "logoPath", "imagePath"]) {
    const path = d.personal[key];
    if (path && !existsSync(new URL(`../public${path}`, import.meta.url))) {
      errors.push(`${locale}: personal.${key} points to missing file public${path}`);
    }
  }
}

if (errors.length) {
  console.error(`Locale validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log("Locale data OK: en and it share the same schema and facts.");
