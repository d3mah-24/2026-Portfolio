import { defaultLocale } from "@/lib/i18n";
import { llmsTxtResponse } from "@/lib/llms";

export const dynamic = "force-static";

// /llms.txt stays the English (default) profile; /it/llms.txt has the Italian one.
export function GET() {
  return llmsTxtResponse(defaultLocale);
}
