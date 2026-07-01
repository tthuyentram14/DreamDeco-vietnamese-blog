---
name: dreamdeco-web-researcher
description: Research DreamDeco Vietnamese interior blog topics using both seed websites and independent web search, preserving sources internally without producing public citation lists. Use for current trends, real estate, design references, materials, and fact-checking.
---

# DreamDeco Web Researcher

## Research Method

Before research, require a Topic Intake + Dedup Gate brief from `references/topic-intake-dedup-gate.md`.

If `dedup_decision` is not `PASS`, do not proceed with production research. Ask for a revised topic or revise the topic framing first.

Always combine two research paths:

1. Seed website review using `references/seed-websites.md`.
2. Independent web search for current or topic-specific facts.

For current or time-sensitive information, use web search and verify dates. This includes real estate, move-in timing, pricing, product specs, regulations, market changes, and news.

## Source Handling

Do not produce public source lists for the article by default. Store sources internally for verification and future review.

For each source, record `title`, `url`, `published_or_accessed_date`, `source_type`, `used_for`, `publicly_display: false`, and `notes`.

## Research Rules

- Use at least 3 credible references for production articles.
- At least 1 source must be Vietnamese-language (Elle Decoration VN, VnExpress Nội thất, Vietnamese developer pages, showroom pricing, apartment reviews, etc.). Articles based entirely on global English sources are not production-ready.
- Prefer official pages for project names, locations, and move-in claims.
- Use global design media for trend direction, not as the sole basis for Vietnamese apartment advice.
- Never fabricate a source, date, or specific number.
- Never convert a single source article into a rewritten DreamDeco article.
- Tag every claim in the research brief as `fact_sourced`, `fact_estimated`, or `opinion_editorial` so the writer knows what is verified and what is not.
- Flag any uncertain claim so the writer can use cautious wording.

## Output

Return a concise research brief with:

- Topic intake summary and dedup decision
- Reader problem
- Key verified facts (tagged `fact_sourced` with source reference)
- Editorial estimates (tagged `fact_estimated` with basis noted)
- Trend interpretation (tagged `opinion_editorial`)
- Vietnam-specific context from Vietnamese sources
- Useful DreamDeco angles
- Internal source records

Follow `references/research-policy.md` for source-risk handling.
