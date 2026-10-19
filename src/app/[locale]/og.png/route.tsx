import { ImageResponse } from "next/og";
import { locales, resolveLocale } from "@/lib/i18n";
import { getPortfolio } from "@/lib/portfolio";

export const dynamic = "force-static";
export const dynamicParams = false;

// Referenced (with a localized alt) from the og:image / twitter:image tags in
// [locale]/layout.tsx. A plain route rather than opengraph-image.tsx, because
// that convention can't give each locale its own alt text.
const ogImageSize = { width: 1200, height: 630 };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// One image per locale, so the bio matches the page language: /en/og.png, /it/og.png
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { personal } = getPortfolio(await resolveLocale(params));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#010001",
          color: "#ffffff",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#737373",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
            }}
          >
            {personal.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginTop: "16px",
            }}
          >
            {`${personal.name.first} ${personal.name.last}`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#a3a3a3",
              lineHeight: 1.6,
              maxWidth: "800px",
              marginTop: "24px",
            }}
          >
            {personal.bio}
          </div>
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "40px",
              fontSize: 16,
              color: "#525252",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            <span>{personal.email}</span>
            <span>·</span>
            <span>{personal.location}</span>
          </div>
        </div>
      </div>
    ),
    { ...ogImageSize },
  );
}
