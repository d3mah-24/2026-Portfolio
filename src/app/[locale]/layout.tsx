import type { Metadata } from "next";
import "../globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeScript } from "@/components/ThemeScript";
import { inter, firaCode } from "@/lib/fonts";
import { locales, resolveLocale, type Locale } from "@/lib/i18n";
import { getCurrentWork, getPortfolio } from "@/lib/portfolio";
import { siteUrl } from "@/lib/site";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

// Only /en and /it exist (prerendered). Every other URL, including /xx and
// /en/missing, is a 404 served by app/global-not-found.tsx.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const MONTHS: Record<Locale, string[]> = {
  en: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
  it: ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"],
};

// "Sep 2025" (en) / "Set 2025" (it) → "2025-09", "2024" → "2024"; anything else (e.g. "Present") → undefined
function toIsoDate(value: string, locale: Locale) {
  const year = value.match(/\b(\d{4})\b/)?.[1];
  if (!year) return undefined;
  const prefix = value.trim().slice(0, 3).toLowerCase();
  const month = MONTHS[locale].indexOf(prefix);
  return month === -1 ? year : `${year}-${String(month + 1).padStart(2, "0")}`;
}

// "Sep 2025 - Present" / "Feb 2024 — Sep 2025" / "2024" → ISO start and (optional) end
function parsePeriod(period: string, locale: Locale) {
  const [start, end] = period.split(/\s+[—–-]\s+/);
  const startDate = toIsoDate(start, locale);
  const endDate = end && toIsoDate(end, locale);
  return {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
}

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const data = getPortfolio(locale);
  const fullName = `${data.personal.name.first} ${data.personal.name.last}`;
  const pageTitle = `${fullName} | ${data.personal.title}`;
  const ogImage = {
    url: `/${locale}/og.png`,
    width: 1200,
    height: 630,
    alt: `${fullName} — ${data.personal.title}`,
  };

  return {
    metadataBase: new URL(siteUrl),
    title: pageTitle,
    description: data.personal.bio,
    authors: [{ name: fullName }],
    creator: fullName,
    keywords: data.seo.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `/${l}`])),
        "x-default": "/en",
      },
    },
    icons: {
      icon: "/icon.svg",
      apple: "/logo.png",
    },
    openGraph: {
      title: pageTitle,
      description: data.personal.bio,
      url: `/${locale}`,
      siteName: fullName,
      type: "website",
      locale: data.seo.ogLocale,
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => getPortfolio(l).seo.ogLocale),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: data.personal.bio,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const locale = await resolveLocale(params);
  const data = getPortfolio(locale);
  const currentWork = getCurrentWork(data);
  const { address, handle } = data.personal;
  const fullName = `${data.personal.name.first} ${data.personal.name.last}`;
  const pageUrl = `${siteUrl}/${locale}`;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="alternate"
          type="text/plain"
          href={`/${locale}/llms.txt`}
          title="LLM Information"
        />
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: fullName,
              ...(handle && { alternateName: handle }),
              url: pageUrl,
              description: data.personal.bio,
              inLanguage: locale,
              publisher: {
                "@type": "Person",
                name: fullName,
                url: pageUrl,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: fullName,
              givenName: data.personal.name.first,
              familyName: data.personal.name.last,
              ...(handle && { alternateName: handle }),
              url: pageUrl,
              ...(data.personal.imagePath && {
                image: `${siteUrl}${data.personal.imagePath}`,
              }),
              jobTitle: data.personal.title,
              hasOccupation: {
                "@type": "Occupation",
                name: data.personal.title,
                ...(data.personal.nationality && {
                  occupationLocation: {
                    "@type": "Country",
                    name: data.personal.nationality,
                  },
                }),
              },
              ...(currentWork.company && {
                worksFor: {
                  "@type": "Organization",
                  name: currentWork.company,
                  ...(currentWork.url && { url: currentWork.url }),
                },
              }),
              description: data.personal.bio,
              email: `mailto:${data.personal.email}`,
              ...(data.personal.gender && { gender: data.personal.gender }),
              ...(data.personal.birthDate && {
                birthDate: data.personal.birthDate,
              }),
              ...(data.personal.birthPlace && {
                birthPlace: {
                  "@type": "Place",
                  name: data.personal.birthPlace,
                },
              }),
              ...(data.personal.nationality && {
                nationality: {
                  "@type": "Country",
                  name: data.personal.nationality,
                },
              }),
              knowsLanguage: data.personal.languages,
              ...(data.personal.height
                ? {
                    height: {
                      "@type": "QuantitativeValue",
                      value: data.personal.height,
                      unitCode: "CMT",
                    },
                  }
                : {}),
              ...(data.personal.weight
                ? {
                    weight: {
                      "@type": "QuantitativeValue",
                      value: data.personal.weight,
                      unitCode: "KGM",
                    },
                  }
                : {}),
              ...(data.personal.parent && {
                parent: {
                  "@type": "Person",
                  name: data.personal.parent,
                },
              }),
              ...(address && {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: address.locality,
                  addressRegion: address.region,
                  addressCountry: address.country,
                },
              }),
              workLocation: {
                "@type": "Place",
                name: data.personal.location,
              },
              alumniOf: data.education.map(
                (e: {
                  institution: string;
                  degree: string;
                  period: string;
                  location: string;
                }) => ({
                  "@type": "OrganizationRole",
                  alumniOf: {
                    "@type": "EducationalOrganization",
                    name: e.institution,
                    address: e.location,
                  },
                  ...parsePeriod(e.period, locale),
                  roleName: e.degree,
                }),
              ),
              hasCredential: data.education.map(
                (e: { degree: string; institution: string }) => ({
                  "@type": "EducationalOccupationalCredential",
                  name: e.degree,
                  credentialCategory: "degree",
                  recognizedBy: {
                    "@type": "EducationalOrganization",
                    name: e.institution,
                  },
                }),
              ),
              knowsAbout: Object.values(data.skills).flat(),
              skills: Object.values(data.skills).flat(),
              sameAs: [
                ...data.socials.map((s: { url: string }) => s.url),
                ...data.secondarySocials.map((s: { url: string }) => s.url),
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased transition-colors duration-300">
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
