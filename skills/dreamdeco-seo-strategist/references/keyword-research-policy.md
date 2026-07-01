# DreamDeco Keyword Research Policy

Use this policy for SEO planning when keyword data is available.

## Sources To Use

- Google Trends: use to compare search terms, seasonality, regional demand, rising searches, and related searches.
- Google Ads Keyword Planner: use to discover new keyword ideas, commercial intent, ad competition, and CPC direction.
- Search result inspection: use to understand intent, SERP format, and competing content types.

## Keyword Selection Priority

Choose keywords in this order:

1. Reader intent match.
2. Vietnamese naturalness.
3. Relevance to DreamDeco's virtual interior use case.
4. Trend or seasonality signal.
5. Commercial value such as CPC or ad competition.
6. Ability to satisfy the query with original content, images, tables, checklists, or infographics.

High CPC alone is not enough. A high-CPC keyword should be rejected if the article cannot answer the query well.

## Keyword Roles

- `primary_keyword`: one main Vietnamese phrase that defines the article.
- `secondary_keywords`: 3-8 related phrases that fit sections naturally.
- `commercial_keywords`: optional high-intent phrases from Ads/Keyword Planner, used only where relevant.
- `trend_keywords`: optional rising or seasonal phrases from Google Trends.
- `negative_or_avoid_keywords`: terms that are tempting but out of scope, such as legal, construction, or services DreamDeco does not provide.

## Usage Rules

- Use the primary keyword in title or H1 when natural.
- Use secondary keywords in H2/H3 only when the section genuinely covers them.
- Use commercial keywords in body copy only if they match a user decision point.
- Do not repeat keywords mechanically.
- Do not create headings just to fit keywords.
- Do not add keywords about contractor, legal, quote, or construction services to `dreamdeco_guide`.

## Output Fields

When planning SEO, include:

```json
{
  "metadata_keywords": {
    "primary": "string",
    "secondary": ["string"],
    "trend_based": ["string"],
    "commercial_intent": ["string"],
    "avoid": ["string"]
  },
  "keyword_research": {
    "primary_keyword": "string",
    "secondary_keywords": ["string"],
    "trend_keywords": [
      {
        "keyword": "string",
        "source": "google_trends | related_search | search_inspection",
        "reason": "string"
      }
    ],
    "commercial_keywords": [
      {
        "keyword": "string",
        "source": "keyword_planner | ads_data | user_provided",
        "commercial_intent": "high | medium | low",
        "use_or_reject": "use | reject",
        "reason": "string"
      }
    ],
    "negative_or_avoid_keywords": ["string"]
  }
}
```

`metadata_keywords` is the DB/search metadata field. It should be concise and contain only terms that the article actually satisfies. Do not dump every discovered keyword into metadata.

## Warnings

- Google Trends is directional and normalized; do not treat it as exact search volume.
- Keyword Planner data is for advertising planning and may be directional; use it as a commercial-intent signal, not as the only SEO truth.
- Google Search spam policies warn against keyword stuffing. If the article reads unnatural, remove keywords.
