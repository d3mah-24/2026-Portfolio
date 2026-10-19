import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import data from "@/data/portfolio.json";
import { siteUrl } from "@/lib/site";
import { currentWork } from "@/lib/portfolio";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fullName = `${data.personal.name.first} ${data.personal.name.last}`;
const pageTitle = `${fullName} | ${data.personal.title}`;
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// "Sep 2025" → "2025-09", "2024" → "2024"; anything else (e.g. "Present") → undefined
function toIsoDate(value: string) {
  const year = value.match(/\b(\d{4})\b/)?.[1];
  if (!year) return undefined;
  const month = MONTHS.indexOf(value.trim().slice(0, 3).toLowerCase());
  return month === -1 ? year : `${year}-${String(month + 1).padStart(2, "0")}`;
}

// "Sep 2025 - Present" / "Feb 2024 — Sep 2025" / "2024" → ISO start and (optional) end
function parsePeriod(period: string) {
  const [start, end] = period.split(/\s+[—–-]\s+/);
  const startDate = toIsoDate(start);
  const endDate = end && toIsoDate(end);
  return {
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
}

const { address, handle } = data.personal;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: pageTitle,
  description: data.personal.bio,
  authors: [{ name: fullName }],
  creator: fullName,
  keywords: [
    fullName,
    `${fullName} portfolio`,
    `${fullName} ${data.personal.title}`,
    "python backend developer",
    "backend developer",
    "Software Engineer",
    "django developer",
    "frappe developer",
    "erpnext developer",
  ],
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/logo.png",
  },
  openGraph: {
    title: pageTitle,
    description: data.personal.bio,
    url: siteUrl,
    siteName: fullName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${fullName} — ${data.personal.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: data.personal.bio,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${firaCode.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="alternate"
          type="text/plain"
          href="/llms.txt"
          title="LLM Information"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: fullName,
              ...(handle && { alternateName: handle }),
              url: siteUrl,
              description: data.personal.bio,
              inLanguage: "en-US",
              publisher: {
                "@type": "Person",
                name: fullName,
                url: siteUrl,
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
              url: siteUrl,
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
                  ...parsePeriod(e.period),
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
