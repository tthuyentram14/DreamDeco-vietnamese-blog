---
name: dreamdeco-image-creator
description: Generate original DreamDeco interior blog images with Codex Imagen2, including one thumbnail and 2-4 body images. Use when production articles need real newly generated images, not copied or edited source assets.
---

# DreamDeco Image Creator

## Required Tool

Use Codex Imagen2 through the available built-in image generation capability. Do not stop at prompts. Generate actual images for production use.

Do not use OpenAI API keys, CLI image generation, `OPENAI_API_KEY`, custom SDK scripts, PIL-drawn placeholder images, SVG stand-ins, HTML/CSS mock images, downloaded stock images, or locally fabricated graphics as substitutes for Codex Imagen2 output. API/CLI fallback is forbidden for routine DreamDeco production because it can create extra external API cost. The only valid production image source is the built-in Codex Imagen2/image generation tool output.

If the built-in tool renders an image in the conversation but the file path is not obvious, locate the saved output before continuing. Check `$CODEX_HOME/generated_images/`, `%USERPROFILE%\.codex\generated_images\`, and any Codex app-provided generated image directory. Copy the selected generated bitmap into the workspace path required by this project:

- thumbnail: `outputs/images/thumbnails/<slug>-thumbnail.<ext>`
- body image: `outputs/images/body/<slug>-body-NN.<ext>`

Do not declare the image step complete until the workspace files exist and visual inspection confirms they are actual generated interior images, not old unrelated images or placeholders.

If no saved Imagen2 bitmap file can be found after generation, stop and report the blocker. Do not create a replacement image locally. Do not upload placeholders to Supabase. Do not continue to HTML composition, packaging, QA, DB upload, or publish handoff.

Generate images only after the article classification, article draft, H2/H3 structure, and image placements are finalized. The required order is: classify the article first, write the article content for that classification second, then generate images from the finalized section content third. Prompts must be derived from the actual article sections, not from an early topic guess or classification label alone.

Before generating, create an image direction map from the final article:

- Match each image to one concrete section, paragraph, or reader decision.
- Write the purpose of the image in one sentence before the prompt.
- Derive every prompt from the article's actual content, not from the broad blog category. Name the exact room, user situation, problem, material, season, budget level, or decision point from the section it supports.
- Classify the article before prompting. The image direction map must explicitly choose and justify:
  - Cultural/style family: for example European classic, Nordic, Korean minimal, Japanese wabi-sabi, Vietnamese tropical modern, Indochine, industrial, contemporary luxury, budget rental, or family practical.
  - Housing type: apartment, studio/one-room, villa, townhouse/tube house, rental room, officetel-like compact unit, balcony/terrace, garden house, or commercial/home-office space.
  - Space scale: micro, small, medium apartment, large family home, or villa-scale.
  - User scenario: single renter, couple, young family, multigenerational family, pet owner, remote worker, landlord/stager, move-in buyer, or renovation planner.
  - Room/zone: living room, bedroom, kitchen, dining, entry, balcony, storage wall, work corner, kids zone, bathroom, garden, or before/after preview scene.
- The selected classification must visibly change the generated image. A Korean-minimal studio, a European-style villa living room, and a Vietnamese tropical apartment balcony must not share the same furniture silhouette, palette, camera framing, or decor language.
- Do not reuse the same palette, furniture set, camera angle, or room type across the same content batch unless the article explicitly needs a before/after comparison.
- If multiple posts are produced in one run, vary locale cues, layout, lighting, color temperature, material emphasis, and camera distance across posts.
- Do not use pale brown, beige, tan, cream, light wood, or warm neutral palettes as the automatic default. These palettes are valid interior choices and may be used when they fit the article, but they must be intentional and balanced against other palettes across thumbnails and batches.
- Each article image set must include at least two clearly different color families when it has 3+ images. Examples: terracotta/clay, sage/olive, deep green/walnut, cool grey/blue, black/white contrast, muted pastel, indigo/stone, brass/dark wood, tropical green/white, or stainless/charcoal.
- Thumbnail palette rotation is required. In a listing grid, adjacent or recent DreamDeco thumbnails should not all read as the same light-brown/beige apartment. Before creating a thumbnail, choose a distinct dominant palette and visual identity from recent/related thumbnails whenever possible.
- Before generating a new thumbnail, inspect the current batch thumbnails and, when available, the latest 6-12 existing DreamDeco thumbnails from `outputs/images/thumbnails/`, `outputs/final-posts/json/`, `outputs/db-ready/`, or the site/listing screenshot supplied in the issue. Record the observed repeated palette, room type, focal object, and camera framing, then choose a thumbnail direction that is visibly different while still matching the article.
- Color choices must come from the interior style, room function, Vietnamese climate/context, material story, and reader decision. A bedroom article, balcony article, rainy-season article, villa article, budget studio article, and sofa-buying article should not all become the same light-brown apartment. Some can be beige/wood when appropriate; the set must not be visually monotonous.
- Reject prompts that only say "modern Vietnamese apartment", "warm neutral", "natural daylight", or similarly generic direction without a section-specific visual reason.
- Every body image must answer: what does this image help the reader understand at this exact paragraph?
- Before calling Imagen2, write a diversity plan covering palette, camera distance, room type, composition, lighting, focal object, and Vietnamese context cue for each image. No two images in the same article may share more than two of those seven attributes unless intentionally paired.
- Thumbnail images must be visually distinct from body images. A thumbnail should summarize the article's main promise and is also used by the DreamDeco detail template as the top/featured image. Body images should illustrate specific sections.

## Image Set

For each article, generate image assets by role:

- `thumbnail_image`: 1 image for listing cards, related posts, and sharing.
- `content_images`: 2 to 4 images matched to article sections.

Save generated files under:

- `outputs/images/thumbnails/`
- `outputs/images/body/`

These files must be copied from the built-in Imagen2 output. They must not be produced by local drawing code, screenshots of text, diagrams, CSS, or simple generated color blocks.

## Originality Rules

Images must be completely newly generated.

Do not reuse, download, edit, trace, or closely imitate source website images. Do not add visible text, watermarks, or fake logos. Source images may be used only to understand broad trends, material cues, color direction, or spatial context.

## Visual Direction

Follow `references/imagen2-style-guide.md`.

Images should be interior-focused, realistic, modern, refined, suitable for Vietnamese apartments, villas, or homes, practical, livable, premium, and accessible.

For batch production, maintain visual diversity:

- News images may feel editorial and current, with compact urban-apartment realism.
- Style images must visibly differ by style family, palette, furniture silhouette, material, and mood.
- Budget images should show affordable, practical choices, not premium showroom uniformity.
- Lifestyle images should show real household zones, movement, storage, and family-use cues.
- DreamDeco guide images should show input/result logic, not generic finished interiors only.
- Consumer guide images should focus on product fit, scale, material, or comparison cues.
- Avoid repeated safe defaults across thumbnails and batches: beige sofas, cream walls, arched decor, centered living-room wide shots, identical sunlit window angles, generic wood floors, and the same warm neutral palette across posts.
- Beige/wood/cream results are acceptable when they match the article, but repeated same-looking light-brown/beige thumbnails across different posts are a generation failure. If Imagen2 returns a thumbnail that looks too similar to recent thumbnails, regenerate with a stronger alternate palette, layout, room type, or focal object before finalizing.
- Use article-specific variation such as monsoon-season moisture control, balcony heat, rental apartment constraints, small-family storage, pet-friendly layouts, tropical materials, compact Ho Chi Minh apartments, Hanoi tube-house constraints, villa garden transitions, or budget furniture tradeoffs when the article supports it.
- For style-family articles, exaggerate the differences enough for a reader to recognize the category at a glance:
  - European classic: symmetry, molding, richer upholstery, stone/metal accents, formal composition.
  - Korean minimal: low visual noise, pale wood, compact storage, soft indirect lighting, clean apartment proportions.
  - Vietnamese tropical modern: ventilation, balcony greenery, rattan/bamboo/wood, humidity-aware materials, brighter daylight.
  - Indochine: patterned tile, dark wood, shutters, colonial-tropical balance.
  - Budget rental/studio: compact multifunction furniture, visible constraints, practical storage, less premium finish.
- Do not turn all styles into the same modern showroom with minor color changes.

## What Imagen2 Must Not Generate

Do not use Imagen2 for:

- Data tables
- Charts
- Bar charts
- Process diagrams
- Step flows
- Timelines
- Budget or savings infographics
- Checklists

Build those as HTML/CSS modules through `dreamdeco-html-composer`. Use Imagen2 only for realistic interior scenes, style boards, material mood images, or spatial visuals that support the final article sections.

## Output Metadata

For every image, return role, file path, generation prompt, Vietnamese alt text, intended article placement, recommended aspect ratio, and notes on why it supports the reader.

Also return a short visual diversity audit:

- Palette
- Camera angle/distance
- Room/space type
- Main material cue
- Main article-specific detail
- Why it is not visually redundant with the other images
- Classification used: style family, housing type, scale, user scenario, and room/zone
