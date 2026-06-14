import type { BusinessReport } from "../types";

function escapeMd(text: string): string {
  return text.replace(/\|/g, "\\|");
}

export function toMarkdown(report: BusinessReport): string {
  const { meta, insights } = report;
  const lines: string[] = [];

  lines.push(`# ${meta.title} — ${meta.businessName}`);
  lines.push("");
  lines.push(`**Period:** ${meta.dateRange}`);
  lines.push(`**Generated:** ${meta.generatedAt}`);
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push("");
  const s = insights.engagementSummary;
  lines.push(`- **Total Sessions:** ${s.uniqueSessions}`);
  lines.push(`- **Total Events:** ${s.totalEvents}`);
  if (s.topProduct) {
    lines.push(`- **Most Viewed Product:** ${s.topProduct.name} (${s.topProduct.percentage}%)`);
  }
  if (s.topCta) {
    lines.push(`- **Most Effective CTA:** ${s.topCta.label} (${s.topCta.clicks} clicks)`);
  }
  if (s.topSection) {
    lines.push(`- **Most Viewed Section:** ${s.topSection.section} (${s.topSection.percentage}%)`);
  }
  lines.push("");

  // Top Products
  if (insights.topProducts.length > 0) {
    lines.push("## Top Products");
    lines.push("");
    lines.push("| # | Product | Views | % |");
    lines.push("|---|---|---|---|");
    insights.topProducts.forEach((p, i) => {
      lines.push(`| ${i + 1} | ${escapeMd(p.name)} | ${p.views} | ${p.percentage}% |`);
    });
    lines.push("");
  }

  // Top CTAs
  if (insights.topCtas.length > 0) {
    lines.push("## Top CTAs");
    lines.push("");
    lines.push("| # | CTA | Clicks | % |");
    lines.push("|---|---|---|---|");
    insights.topCtas.forEach((c, i) => {
      lines.push(`| ${i + 1} | ${escapeMd(c.label)} | ${c.clicks} | ${c.percentage}% |`);
    });
    lines.push("");
  }

  // Section Performance
  if (insights.sectionPerformance.length > 0) {
    lines.push("## Section Performance");
    lines.push("");
    lines.push("| # | Section | Views | % |");
    lines.push("|---|---|---|---|");
    insights.sectionPerformance.forEach((s, i) => {
      lines.push(`| ${i + 1} | ${escapeMd(s.section)} | ${s.views} | ${s.percentage}% |`);
    });
    lines.push("");
  }

  // Conversion Paths
  if (insights.conversionPaths.length > 0) {
    lines.push("## Conversion Paths");
    lines.push("");
    lines.push("| Path | Count |");
    lines.push("|---|---|");
    insights.conversionPaths.forEach((p) => {
      lines.push(`| ${escapeMd(p.path.join(" → "))} | ${p.count} |`);
    });
    lines.push("");
  }

  return lines.join("\n");
}
