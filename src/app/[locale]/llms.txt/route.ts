import { locales, resolveLocale } from "@/lib/i18n";
import { llmsTxtResponse } from "@/lib/llms";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// /en/llms.txt and /it/llms.txt
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  return llmsTxtResponse(await resolveLocale(params));
}
