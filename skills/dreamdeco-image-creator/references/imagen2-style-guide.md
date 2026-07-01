# Imagen2 Style Guide

## Base Style

Create realistic editorial interior images. The image should look like a newly produced DreamDeco visual, not a copy of any source image.

## Recommended Prompt Ingredients

- Vietnamese apartment, villa, studio, or family home context
- Modern interior styling
- Natural daylight
- Realistic furniture scale
- Livable layout
- Materials suitable for Vietnam's climate
- Clean composition with enough negative space for blog readability

## Section-Matched Image Direction

Do not generate a generic "beautiful interior" for a body image. Each image must be anchored to the final article section where it will appear.

For each image prompt, specify:

- Article section or paragraph it supports
- Reader decision the image clarifies
- Room type or zone
- One dominant material story
- One distinct color palette
- Camera angle and distance
- What should be visibly different from other images in the same batch

## Batch Diversity Rules

When generating multiple posts or multiple images in one post, avoid same-looking outputs.

Default palette warning: do not let DreamDeco images collapse into pale brown, beige, tan, cream, or light-wood warm-neutral interiors. Those palettes are valid and often useful, but they are not the automatic brand default.

Thumbnail grid rule: when articles appear together in a listing grid, thumbnails must be distinguishable at a glance. Do not produce four neighboring thumbnails that all read as the same beige/light-brown apartment with similar daylight, sofa, rug, and window framing. Rotate dominant palette, room type, focal object, camera distance, and material story across thumbnails.

Before thumbnail generation, perform a thumbnail-neighbor check:

- Review current batch thumbnails first.
- If available, review the latest 6-12 existing DreamDeco thumbnails from local outputs or the issue-provided listing screenshot.
- Note repeated signals: dominant palette, sofa/window/rug pattern, room type, camera angle, lighting, and focal object.
- Pick a new thumbnail direction that differs on at least three of those signals.
- Beige, cream, light wood, and warm neutral may still be used, but not when the nearby grid already has the same dominant look.

For every article with 3+ images:

- Use at least two clearly different color families.
- Use beige/light-brown/warm-neutral palettes only when they serve the article. They may appear, but the overall image set and recent thumbnail batch must not become visually monotonous.
- Assign each image a named palette before prompting, and make that palette visible through wall color, furniture, textile, material, accent object, or greenery.
- If a generated result still looks like a repeated beige/light-brown default compared with recent thumbnails, regenerate with a stronger alternate palette or a clearly different composition.

Vary at least four of these per image:

- palette: clay/terracotta, cool grey/blue, olive/sage, black/white contrast, muted pastels, walnut/dark green, light oak/cream, stainless/stone
- room type: entry, dining corner, living room, bedroom, balcony, work nook, storage wall, sofa detail, material close-up
- lighting: morning rain light, overcast daylight, late afternoon warm light, bright noon, evening practical lamps
- camera: wide corner, eye-level sofa view, top-down planning view, close material detail, doorway view, corridor-to-room view
- household cue: children storage, compact work desk, wet umbrella buffer, pet-free clean floor, family dining, product measuring tape, phone preview
- material: rattan, microcement, washable fabric, porcelain tile, dark walnut, brushed metal, laminate, textured plaster

Use palette options that fit the article, for example:

- Rainy-season apartment: cool grey-blue, sage green, waterproof charcoal, pale tile plus fresh green.
- Tropical Vietnamese balcony: white/green, rattan/leaf green, terracotta/clay, sky blue accents.
- Korean minimal: pale wood can appear, but add soft grey, muted blue, off-white, black line accents, or calm green rather than all beige.
- European classic: deep cream may pair with burgundy, navy, forest green, brass, stone grey, or dark walnut.
- Indochine: dark wood, patterned tile, muted yellow, deep green, black trim, terracotta, or off-white contrast.
- Budget studio/rental: practical laminate, white/charcoal, color-block storage, compact accent colors, not premium beige showroom styling.
- Family lifestyle: washable colors, soft green/blue, warm coral accents, kid-safe storage colors, practical contrast.

If the prompts for two different assets could describe the same image, rewrite one before generating.

## Prohibited Visuals

- Visible text
- Watermarks
- Fake logos
- Distorted furniture
- Unrealistic room geometry
- Direct resemblance to a source image
- Downloaded or edited source assets
- Repeating the same beige/wood/minimal apartment look across unrelated articles
- Repeating pale brown, beige, tan, cream, light-oak, or warm-neutral dominance across neighboring thumbnails or a batch
- Using "warm neutral" as the main palette without a section-specific reason and without checking thumbnail-grid diversity
- Generic showroom scenes that do not explain the section they accompany

## Output Naming

Use slug-based filenames where possible:

- `outputs/images/thumbnails/<slug>-thumbnail.webp`
- `outputs/images/body/<slug>-body-01.webp`
