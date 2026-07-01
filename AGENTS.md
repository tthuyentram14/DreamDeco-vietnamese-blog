# DreamDeco Content Pipeline v2

## Project Purpose

DreamDeco là dự án tự động hóa nội dung blog nội thất tiếng Việt. Mục tiêu: tạo bài viết production-ready cho website DreamDeco — từ nghiên cứu, SEO, viết bài, tạo ảnh, compose HTML, đến đóng gói JSON sẵn sàng upload database.

Tất cả nội dung phải reader-first, thực dụng, hữu ích, và phù hợp để xuất bản thực tế.

## Skills (6 total)

| # | Skill | Vai trò |
|---|-------|---------|
| 1 | `dreamdeco-web-researcher` | Nghiên cứu web, fact-tagging |
| 2 | `dreamdeco-seo-strategist` | Chiến lược SEO tiếng Việt |
| 3 | `dreamdeco-vietnamese-writer` | Viết bài tiếng Việt production-ready |
| 4 | `dreamdeco-image-creator` | Tạo ảnh nội thất bằng Imagen2 |
| 5 | `dreamdeco-html-composer` | Compose HTML fragment + JSON package |
| 6 | `dreamdeco-content-reviewer` | QA gate cuối cùng |

## Pipeline (Step 0 + 6 bước)

```
Step 0: Topic Intake + Dedup Gate
Step 1: Research         → dreamdeco-web-researcher
Step 2: SEO Planning     → dreamdeco-seo-strategist
Step 3: Writing          → dreamdeco-vietnamese-writer
Step 4: Image Generation → dreamdeco-image-creator
Step 5: HTML + Packaging → dreamdeco-html-composer
Step 6: QA Review        → dreamdeco-content-reviewer
                           ├── PASS → DB upload
                           └── REVISE → Step 3 hoặc 5
```

### Step 0: Topic Intake + Dedup Gate

Trước khi invoke `dreamdeco-web-researcher`, phải chuẩn hóa topic và kiểm tra trùng lặp với các bài đã có trong:

- `outputs/final-posts/json/`
- `outputs/final-posts/html/`
- `outputs/drafts/`
- `outputs/packages/`

Thực hiện theo `skills/dreamdeco-web-researcher/references/topic-intake-dedup-gate.md`.

**Output:** Topic intake brief gồm:

- `working_topic` — topic đã chuẩn hóa, không chỉ là keyword rời
- `pillar` — cụm chủ đề chính, ví dụ: căn hộ nhỏ, mùa mưa, ngân sách, phong cách, nhận nhà, phòng chức năng
- `intent` — hướng dẫn, checklist, so sánh, cảm hứng, cảnh báo rủi ro, tin tức
- `reader_stage` — trước khi mua nhà, nhận nhà, đang ở, cải tạo, mua nội thất, tối ưu vận hành
- `primary_problem` — một vấn đề chính duy nhất người đọc cần giải quyết
- `dreamdeco_angle` — DreamDeco giúp xem trước layout, kiểm tra phù hợp, so sánh phong cách/vật liệu như thế nào
- `overlap_check` — so với slug/title/keyword các bài đã có
- `dedup_decision` — `PASS`, `REVISE_TOPIC`, hoặc `REJECT_DUPLICATE`

**Hard gate:** Không chuyển sang Step 1 nếu `dedup_decision` không phải `PASS`.

Nếu trùng một phần, phải đổi ít nhất một trong các trục: reader stage, room/zone, intent, seasonality, budget level, housing type, hoặc DreamDeco use case. Không tạo bài mới chỉ bằng cách đổi title/slug khi `primary_problem` vẫn giống bài cũ.

### Step 1: Research

Invoke `dreamdeco-web-researcher` với topic.

**Output:** Research brief với fact-tagged claims:
- `fact_sourced` — có nguồn xác minh
- `fact_estimated` — ước tính biên tập
- `opinion_editorial` — quan điểm DreamDeco

Yêu cầu: >= 3 nguồn tham khảo, >= 1 nguồn tiếng Việt.

### Step 2: SEO Planning

Invoke `dreamdeco-seo-strategist` với research brief.

**Output:** SEO plan gồm: primary keyword, secondary keywords, title, slug, meta description, H2/H3 outline, visual module recommendations.

### Step 3: Writing

Invoke `dreamdeco-vietnamese-writer` với research brief + SEO plan.

**Output:** Structured draft gồm: sections, visual_module_data, image placement markers, self-check results.

**Hard gate:** Draft phải >= 8,000 ký tự tiếng Việt public body. Không handoff nếu chưa đạt.

### Step 4: Image Generation

Invoke `dreamdeco-image-creator` với finalized article sections.

**Timing:** Chỉ generate sau khi bài viết và cấu trúc H2/H3 đã finalize. Không generate từ topic/category alone.

**Output:** 1 thumbnail + 2-4 body images, saved vào `outputs/images/`.

### Step 5: HTML + Packaging

Invoke `dreamdeco-html-composer` với approved draft + image metadata.

**Output:**
- `outputs/final-posts/html/<slug>.html`
- `outputs/final-posts/json/<slug>.json`

### Step 6: QA Review

Invoke `dreamdeco-content-reviewer` với JSON package + HTML file.

**Output:** PASS hoặc REVISE.

Nếu REVISE: quay lại step được chỉ định (`revision_target: writer` → Step 3, `revision_target: composer` → Step 5). Maximum 2 revision cycles.

### Post-Pipeline (DB upload)

Sau khi PASS, chạy scripts theo thứ tự:

```bash
node scripts/prepare-supabase-blog-payload.mjs
node scripts/upload-supabase-blogs.mjs
python scripts/upload-supabase-blog-images.py
```

Không upload DB khi chưa có PASS từ reviewer. Không upload khi chưa có cấu hình DB từ user.

## Content Language

- Public content: tiếng Việt
- Internal communication: tiếng Việt hoặc tiếng Hàn (tùy user)

## Content Quality Standard

Mỗi bài viết phải:
- Giải quyết vấn đề thực tế của người đọc
- Hữu ích cho người sống/chuyển vào nhà tại Việt Nam
- Phản ánh góc nhìn nội thất DreamDeco
- Kết hợp lời khuyên thực dụng với ý tưởng thiết kế
- Viết giọng biên tập viên chuyên mục, không marketing
- Không có dấu hiệu AI (anti-AI patterns)
- Không bịa fact, không copy/dịch bài ngoài

## Content Type Tone Rules

| Type | Giọng | Đặc trưng |
|---|---|---|
| `news` | Khách quan, ngắn gọn | Tóm tắt, nguồn, bối cảnh, góc DreamDeco |
| `real_estate_move_in` | Thận trọng, thực dụng | Bảng dự án, checklist, timeline |
| `style` | Biên tập, cảm quan + cụ thể | So sánh phong cách, bảng vật liệu/màu |
| `budget` | Thực tế, so sánh chi phí | Phân bổ ngân sách, bảng so sánh |
| `lifestyle` | Đồng cảm, gắn đời sống | Tình huống, giải pháp theo nhóm |
| `dreamdeco_guide` | Hướng dẫn từng bước | Step flow, checklist, trước/sau |
| `consumer_guide` | Trung lập, cảnh báo rủi ro | Checklist, red flags, disclaimer chuyên gia |

## Image Rules

- Dùng Codex Imagen2 built-in (không API fallback, không placeholder)
- Mỗi bài: 1 thumbnail + 2-4 body images
- Generate SAU khi bài viết finalize (không trước)
- Đa dạng palette, room type, camera angle (không lặp beige/cream)
- Data tables, charts, infographics = HTML/CSS modules, KHÔNG dùng Imagen2

## HTML Rules

- Wrapper: `<div class="prose prose-gray max-w-none text-gray-800 leading-relaxed">`
- Styling: dual approach — mỗi element có cả Tailwind classes lẫn inline style hex/px fallback (`content_html` render ngoài React tree qua `dangerouslySetInnerHTML`, không đảm bảo Tailwind/CSS var luôn sẵn sàng). `var(--foreground)` chỉ dùng cho H2/H3 color. Chi tiết: `skills/dreamdeco-html-composer/references/frontend-rendering-context.md`
- Thumbnail KHÔNG trong production `content_html`
- Visual modules: HTML/CSS components, không JavaScript/React/external CSS
- AI disclosure bắt buộc cuối bài

## DreamDeco Scope

DreamDeco là sản phẩm nội thất ảo và mô phỏng. Đề cập thực dụng:
- ✅ Xem trước layout, kiểm tra phù hợp, so sánh phong cách/vật liệu
- ❌ Chọn nhà thầu, tư vấn pháp lý, giám sát thi công, kiểm tra khuyết tật

Contractor, quote, contract, defect-check = `consumer_guide`, không phải `dreamdeco_guide`.

## Forbidden Actions

- Không tạo mock content, placeholder articles
- Không copy/dịch/rewrite bài ngoài
- Không bịa facts, sources
- Không hiển thị source list trong public body (lưu nội bộ)
- Không upload DB khi chưa có cấu hình + approval
- Không dùng API-key image generation thay Codex Imagen2 built-in
