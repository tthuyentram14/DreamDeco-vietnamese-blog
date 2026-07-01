# Topic Intake + Dedup Gate

Use this gate before starting DreamDeco web research. The goal is to prevent multiple articles from solving the same reader problem with slightly different titles.

## When To Run

Run this before Step 1 Research for every new production article.

Do not start source research, SEO planning, writing, or image generation until this gate returns `dedup_decision: PASS`.

## Existing Content Inventory

Check existing topics in:

- `outputs/final-posts/json/`
- `outputs/final-posts/html/`
- `outputs/drafts/`
- `outputs/packages/`

Compare against:

- slug
- title
- excerpt
- category/content type
- primary keyword
- secondary keywords
- H2 outline when available
- reader problem or checklist promise

## Topic Intake Fields

Produce this brief:

```json
{
  "working_topic": "string",
  "pillar": "small_apartment | rainy_season | budget | style | move_in | room_specific | lifestyle | consumer_risk | news | other",
  "intent": "how_to | checklist | comparison | inspiration | risk_warning | news_context | buying_guide",
  "reader_stage": "before_buying_home | handover_move_in | currently_living | renovation | furniture_shopping | daily_operation",
  "primary_problem": "string",
  "target_reader": "string",
  "housing_type": "apartment | studio | townhouse | rental | resale_home | other",
  "room_or_zone": "whole_home | living_room | bedroom | kitchen | entry | balcony_logia | bathroom | storage | other",
  "seasonality": "none | rainy_season | hot_humid | tet | year_end | summer | other",
  "budget_level": "not_applicable | low | mid | premium | mixed",
  "dreamdeco_angle": "string",
  "overlap_check": [
    {
      "existing_slug": "string",
      "overlap_level": "none | low | medium | high",
      "overlap_reason": "string",
      "difference_needed": "string"
    }
  ],
  "dedup_decision": "PASS | REVISE_TOPIC | REJECT_DUPLICATE",
  "final_topic_for_research": "string"
}
```

## Decision Rules

Use `PASS` when the topic has a distinct reader problem and a distinct content promise.

Use `REVISE_TOPIC` when the topic is useful but too close to an existing article. Revise at least one major axis before Step 1:

- reader stage
- room or zone
- intent
- seasonality
- budget level
- housing type
- DreamDeco use case

Use `REJECT_DUPLICATE` when the topic would answer the same primary problem as an existing article and cannot be meaningfully repositioned.

Changing only the title, slug, primary keyword, or number in a list is not enough to pass deduplication.

## Overlap Heuristics

Treat overlap as `high` if two or more of these are the same:

- same primary problem
- same reader stage
- same seasonality
- same room or whole-home scope
- same checklist or how-to promise
- same DreamDeco CTA/use case

Treat overlap as `medium` if the topic shares the same pillar but has a clearly different reader stage or room focus.

Treat overlap as `low` if it belongs to the same broad category but solves a different practical problem.

## Examples

Existing: `can-ho-mua-mua-giam-am-moc-mui-bi`

- New topic "Căn hộ mùa mưa: cách giảm ẩm mốc" → `REJECT_DUPLICATE`
- New topic "Nhận nhà chung cư mùa mưa: checklist đo và kiểm trước khi mua đồ" → `REVISE_TOPIC` or `PASS` only if framed as handover/move-in, not general anti-humidity layout
- New topic "Phòng ngủ mùa nóng ẩm cho người khó ngủ" → `PASS` because the reader problem, room, and intent differ

## Editorial Rotation Guidance

Avoid publishing several articles in a row from the same pillar unless the reader stage and practical problem are clearly different.

After two articles in one pillar, prefer a new pillar such as:

- budget planning
- style comparison
- small apartment layout
- room-specific furniture buying
- rental-friendly setup
- family lifestyle needs
- storage and organization

## Output Use

Pass `final_topic_for_research` and the full intake brief into `dreamdeco-web-researcher`.

The researcher should preserve the intake framing and avoid drifting back into an already-covered article angle.
