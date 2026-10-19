import { locales, type Locale } from "@/lib/i18n";
import { getCurrentWork, getPortfolio } from "@/lib/portfolio";
import { siteUrl } from "@/lib/site";

// Plain-text profile for LLM crawlers, built from portfolio.<locale>.json.
export function llmsTxtResponse(locale: Locale) {
  const data = getPortfolio(locale);
  const t = data.llms;
  const work = getCurrentWork(data);
  const p = data.personal;
  const fullName = `${p.name.first} ${p.name.last}`;
  const otherVersions = locales
    .filter((l) => l !== locale)
    .map(
      (l) =>
        `- ${t.versions[l]}: ${siteUrl}/${l}/llms.txt`,
    );

  const lines: string[] = [
    `# ${fullName}`,
    "",
    `> ${p.title}. ${p.bio}`,
    "",
    `## ${t.about}`,
    "",
    p.about,
    "",
    [
      ...(work.company
        ? [
            [
              work.text,
              work.url ? `[${work.company}](${work.url})` : work.company,
            ]
              .filter(Boolean)
              .join(" ") + ".",
          ]
        : []),
      data.contact.message,
    ].join(" "),
    "",
    `- ${t.website}: ${siteUrl}/${locale}`,
    `- ${t.email}: ${p.email}`,
    `- ${t.location}: ${p.location}`,
    ...(p.resumePath
      ? [
          `- ${t.resume}${p.resumeLang !== locale ? ` (${p.resumeLang.toUpperCase()})` : ""}: ${siteUrl}${p.resumePath}`,
        ]
      : []),
    ...otherVersions,
    "",
    `## ${t.links}`,
    "",
    ...data.socials.map((s) => `- ${s.label}: ${s.url}`),
    "",
    `## ${data.sectionTitles.skills}`,
    "",
    ...Object.entries(data.skills).flatMap(([category, items]) => [
      `### ${category}`,
      items.join(", "),
      "",
    ]),
    `## ${data.sectionTitles.experience}`,
    "",
    ...data.experience.flatMap((e) => [
      `### ${e.role} (${e.tag}) — ${e.company}`,
      `${e.period} | ${e.location}`,
      "",
      ...e.points.map((pt) => `- ${pt}`),
      "",
    ]),
    `## ${data.sectionTitles.education}`,
    "",
    ...data.education.flatMap((e) => [
      `### ${e.degree} — ${e.institution}`,
      [e.period, e.location, e.grade].filter(Boolean).join(" | "),
      "",
      ...(e.coursework?.length
        ? [`${data.ui.coursework}: ${e.coursework.join(", ")}`, ""]
        : []),
    ]),
    `## ${data.sectionTitles.projects}`,
    "",
    ...data.projects.flatMap((proj) => [
      `### ${proj.name} — ${proj.description}`,
      `${t.tech}: ${proj.tech.join(", ")}`,
      ...(proj.url ? [`${t.link}: ${proj.url}`] : []),
      "",
      ...proj.points.map((pt) => `- ${pt}`),
      "",
    ]),
    `## ${data.sectionTitles.achievements}`,
    "",
    ...data.achievements.map((a) => `- ${a}`),
    "",
    `## ${data.sectionTitles.activities}`,
    "",
    ...data.activities.flatMap((a) => [
      `### ${a.title}`,
      a.description,
      ...("items" in a && a.items ? a.items.map((i) => `- ${i}`) : []),
      ...("url" in a && a.url ? [`${t.readMore}: ${a.url}`] : []),
      "",
    ]),
    `## ${data.sectionTitles.contact}`,
    "",
    data.contact.message,
    "",
    `- ${t.email}: ${p.email}`,
    ...(data.contact.calendlyUrl
      ? [`- ${t.scheduleCall}: ${data.contact.calendlyUrl}`]
      : []),
    "",
    `## ${t.sourceCode}`,
    "",
    `${t.sourceCodeText} ${p.repoUrl}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
