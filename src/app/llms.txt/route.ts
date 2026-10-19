import data from "@/data/portfolio.json";
import { siteUrl } from "@/lib/site";
import { currentWork as work } from "@/lib/portfolio";

export const dynamic = "force-static";

export function GET() {
  const p = data.personal;
  const fullName = `${p.name.first} ${p.name.last}`;

  const lines: string[] = [
    `# ${fullName}`,
    "",
    `> ${p.title}. ${p.bio}`,
    "",
    "## About",
    "",
    `${fullName} is a Backend Software Engineer with experience building backend systems, business applications, and integrations using Python, Django, and Frappe/ERPNext. His work includes REST APIs, business process automation, ERP customization, and third-party system integrations.`,
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
    `- Website: ${siteUrl}`,
    `- Email: ${p.email}`,
    `- Location: ${p.location}`,
    ...(p.resumePath ? [`- Resume: ${siteUrl}${p.resumePath}`] : []),
    "",
    "## Links",
    "",
    ...data.socials.map((s) => `- ${s.label}: ${s.url}`),
    "",
    "## Skills",
    "",
    ...Object.entries(data.skills).flatMap(([category, items]) => [
      `### ${category}`,
      (items as string[]).join(", "),
      "",
    ]),
    "## Experience",
    "",
    ...data.experience.flatMap((e) => [
      `### ${e.role} (${e.tag}) — ${e.company}`,
      `${e.period} | ${e.location}`,
      "",
      ...e.points.map((pt) => `- ${pt}`),
      "",
    ]),
    "## Education",
    "",
    ...data.education.flatMap((e) => [
      `### ${e.degree} — ${e.institution}`,
      [e.period, e.location, e.grade].filter(Boolean).join(" | "),
      "",
      ...(e.coursework?.length
        ? [`Coursework: ${e.coursework.join(", ")}`, ""]
        : []),
    ]),
    "## Projects",
    "",
    ...data.projects.flatMap((proj) => [
      `### ${proj.name} — ${proj.description}`,
      `Tech: ${proj.tech.join(", ")}`,
      ...(proj.url ? [`Link: ${proj.url}`] : []),
      "",
      ...proj.points.map((pt) => `- ${pt}`),
      "",
    ]),
    "## Achievements",
    "",
    ...data.achievements.map((a) => `- ${a}`),
    "",
    "## Activities",
    "",
    ...data.activities.flatMap((a) => [
      `### ${a.title}`,
      a.description,
      ...("items" in a && a.items ? a.items.map((i) => `- ${i}`) : []),
      ...("url" in a && a.url ? [`Read more: ${a.url}`] : []),
      "",
    ]),
    "## Contact",
    "",
    data.contact.message,
    "",
    `- Email: ${p.email}`,
    ...(data.contact.calendlyUrl
      ? [`- Schedule a call: ${data.contact.calendlyUrl}`]
      : []),
    "",
    "## Source Code",
    "",
    `This portfolio is open source: ${p.repoUrl}`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
