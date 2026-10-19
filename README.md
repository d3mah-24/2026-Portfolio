# Backend Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A minimal, monochrome developer portfolio built with Next.js, Tailwind CSS, and TypeScript. All content is driven from one JSON file per language (English and Italian) — fork it, update the JSON, and deploy your own.

## Features

- **JSON-driven content** — All portfolio data lives in `src/data/portfolio.en.json` and `src/data/portfolio.it.json`. No need to touch components.
- **English + Italian** — Pages at `/en` and `/it` (`/` redirects to `/en`), a language switcher that keeps the current section (`/en#projects` → `/it#projects`), and per-language metadata, canonical URLs, hreflang and sitemap entries.
- **Dark mode** — System-aware with manual toggle, flicker-free via inline script.
- **SEO optimized** — OpenGraph image, JSON-LD Person schema, sitemap, robots.txt, canonical URL.
- **LLM-friendly** — Dynamic `/llms.txt` route auto-generated from the portfolio JSON (`/llms.txt` and `/en/llms.txt` in English, `/it/llms.txt` in Italian). When LLM crawlers visit your site, they get a structured, always-up-to-date summary of your profile (see [LLM Discoverability](#seo--llm-discoverability)).
- **OG image** — Auto-generated at build time from your portfolio data using Next.js `ImageResponse`.
- **Vercel Analytics** — Speed Insights + Web Analytics built in.
- **Responsive** — Mobile-first design with monospace typography.
- **Subtle design touches** — Vercel-style grid background, shimmer text animation on the hero name.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/d3mah-24/2026-Portfolio.git
cd 2026-Portfolio

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your domain and optional API keys

# Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Customization

### portfolio.en.json / portfolio.it.json

All content is in [`src/data/portfolio.en.json`](src/data/portfolio.en.json) and its Italian twin [`src/data/portfolio.it.json`](src/data/portfolio.it.json). Both files must have the same structure and the same facts (dates, URLs, companies, tech stacks) — only human-readable text differs. Run `pnpm validate:i18n` after editing them. Update these sections to make it yours:

| Section        | Description                                                      |
| -------------- | ---------------------------------------------------------------- |
| `personal`     | Name, title, bio, email, location, resume path, logo, repo URL   |
| `socials`      | GitHub, LinkedIn, YouTube, Medium, LeetCode (or any links)       |
| `terminal`     | Custom terminal lines shown in the hero section                  |
| `skills`       | Categorized skill lists                                          |
| `experience`   | Work history with company, role, period, and bullet points       |
| `education`    | Degrees, institutions, grades, coursework                        |
| `projects`     | Project name, description, tech stack, GitHub URL, bullet points |
| `achievements` | List of achievements/honours                                     |
| `activities`   | Activities, volunteering, freelancing, writing                   |
| `contact`      | Contact message and Calendly URL                                 |
| `navLinks`     | Controls which sections appear in the navbar                     |

The resume PDF goes in `public/` — update the `resumePath` field in the JSON to match.

### Adding a New Project

Add an entry to the `projects` array in both `portfolio.en.json` and `portfolio.it.json`:

```json
{
  "name": "My Project",
  "description": "Short tagline for the project",
  "tech": ["Spring", "Redis", "Docker"],
  "url": "https://github.com/username/my-project",
  "points": [
    "Built feature X that does Y.",
    "Implemented Z for better performance."
  ]
}
```

### Adding Work Experience

Add an entry to the `experience` array:

```json
{
  "company": "Acme Corp",
  "role": "Software Engineer",
  "period": "Jan 2025 — Present",
  "location": "Remote",
  "tag": "Founding",
  "points": [
    "Led the backend architecture for the core product.",
    "Built CI/CD pipelines using GitHub Actions."
  ]
}
```

### Customizing the Footer

The footer displays `personal.footerName` with the current year, and a "Get it here" link using `personal.repoUrl`. Update these fields in both locale files:

```json
{
  "personal": {
    "footerName": "Your Name",
    "repoUrl": "https://github.com/username/repo"
  }
}
```

### Adding Social Links

Add entries to the `socials` array. The label is used as display text:

```json
{ "label": "GitHub", "url": "https://github.com/username" }
```

### Updating Site Metadata

The page title, description, and OG image are all derived from the locale's JSON file:

- **Title** — `{personal.name.first} {personal.name.last} | {personal.title}`
- **Description** — `personal.bio`
- **OG image** — Auto-generated from name, title, bio, email, and location

### Changing the Monospace Font

The portfolio uses [Fira Code](https://github.com/tonsky/FiraCode) as the monospace font. To change it, update the font import in `src/lib/fonts.ts`:

```tsx
import { Fira_Code } from "next/font/google";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
```

Replace `Fira_Code` with any monospace font from [Google Fonts](https://fonts.google.com/?classification=Monospace) and update the variable name if needed. The CSS variable `--font-fira-code` is used throughout the styles.

### Environment Variables

| Variable   | Required      | Description                                                                                                                                                                                          |
| ---------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SITE_URL` | On Vercel: no | Your production domain (e.g., `https://yourdomain.com`). Falls back to Vercel's production domain, then `http://localhost:3000`. Used for SEO metadata, sitemap, robots.txt, OG image, and llms.txt. |

Set these in `.env.local` for local development and in your Vercel project settings for production.

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           # Root layout per language: <html lang>, metadata, hreflang, JSON-LD
│   │   ├── page.tsx             # Main portfolio page (all sections)
│   │   ├── og.png/route.tsx     # Auto-generated OG image per language (/en/og.png, /it/og.png)
│   │   └── llms.txt/route.ts    # /en/llms.txt and /it/llms.txt
│   ├── global-not-found.tsx # Bilingual 404 for every unknown URL (e.g. /xx, /en/missing)
│   ├── globals.css          # Global styles, grid bg, shimmer animation
│   ├── icon.svg             # Favicon
│   ├── llms.txt/route.ts    # /llms.txt (English)
│   ├── robots.ts            # robots.txt configuration
│   └── sitemap.ts           # Sitemap configuration
├── components/
│   ├── CrossLine.tsx        # Divider line with + markers
│   ├── LanguageSwitcher.tsx # EN | IT switch that keeps the #section
│   ├── Nav.tsx              # Responsive navbar with mobile menu
│   ├── NotFoundView.tsx     # Shared bilingual 404 content
│   ├── Section.tsx          # Reusable section wrapper
│   ├── Terminal.tsx         # Terminal-style component in hero
│   └── ThemeToggle.tsx      # Dark mode toggle (useSyncExternalStore)
├── data/
│   ├── portfolio.en.json    # All portfolio content (English)
│   └── portfolio.it.json    # All portfolio content (Italian)
├── lib/
│   ├── fonts.ts             # Inter + Fira Code
│   ├── i18n.ts              # Supported locales (en, it)
│   ├── llms.ts              # Builds llms.txt for a locale
│   ├── portfolio.ts         # Loads the JSON for a locale
│   └── site.ts              # Site URL (SITE_URL / Vercel production domain)
public/
├── logo.png                 # Apple touch icon (180×180)
├── image.jpg                # Profile photo (personal.imagePath)
└── <your-resume>.pdf        # Downloadable resume (personal.resumePath)
```

## SEO & LLM Discoverability

The site includes several layers for search engines and LLM crawlers:

- **Metadata** — Title, description, keywords, authors, canonical URL
- **OpenGraph & Twitter cards** — Auto-generated image with your name, title, and bio
- **JSON-LD** — `Person` structured data for rich search results
- **Sitemap & robots.txt** — Standard crawling directives, all user agents allowed
- **`/llms.txt`** — A dynamically generated plain-text file following the [llms.txt standard](https://llmstxt.org/). It's auto-generated from the locale JSON files so it never goes stale; `/it/llms.txt` serves the Italian version. Discoverable via a `<link rel="alternate">` tag in the HTML head. Contains your full profile: about, skills, experience, education, projects, achievements, activities, and contact info — structured for LLMs to consume.

## Deployment

### Vercel (Recommended)

1. Fork this repo
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables listed in [`.env.example`](.env.example) in project settings
4. Deploy

### Other Platforms

```bash
pnpm build
pnpm start
```

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, Server Components
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Fira Code](https://github.com/tonsky/FiraCode) — Monospace font
- [Inter](https://rsms.me/inter/) — Sans-serif fallback
- [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights)

## License

MIT — see [LICENSE](LICENSE). Original template © Ali Farhan.
