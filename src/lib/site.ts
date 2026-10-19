// Production domain, used for SEO metadata, sitemap, robots.txt and llms.txt.
// SITE_URL wins; on Vercel the production domain is used automatically.
export const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL &&
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "http://localhost:3000";
