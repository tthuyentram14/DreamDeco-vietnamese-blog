# JSON Package Schema

JSON package phải khớp với contract của `scripts/prepare-supabase-blog-payload.mjs` và `scripts/upload-supabase-blogs.mjs`.

## Required fields

```json
{
  "title": "string — Tiêu đề bài viết tiếng Việt",
  "slug": "string — URL slug, lowercase, hyphenated (e.g. 'can-ho-65m2-phong-cach-japandi')",
  "content_html": "string — Full HTML fragment (wrapper div included)",
  "meta_description": "string — Meta description < 160 ký tự",
  "excerpt": "string — Đoạn trích ngắn cho listing/preview",
  "category": "string — Một trong 6 giá trị bên dưới",

  "thumbnail_image": {
    "file_path": "string — e.g. 'outputs/images/thumbnails/slug-thumbnail.webp'",
    "alt_text": "string — Alt text tiếng Việt",
    "role": "thumbnail_image"
  },

  "content_images": [
    {
      "file_path": "string — e.g. 'outputs/images/body/slug-body-01.webp'",
      "alt_text": "string — Alt text tiếng Việt",
      "role": "content_image",
      "placement": "string — Section reference (e.g. 'phong-khach-japandi')"
    }
  ],

  "keyword_research": {
    "primary_keyword": "string",
    "secondary_keywords": ["string"],
    "commercial_keywords": ["string"],
    "trend_keywords": ["string"]
  }
}
```

## Category values

Phải là 1 trong 6 giá trị (khớp với `categoryToHashtag()` trong prepare script):

| Category | Hashtags tự động |
|---|---|
| `news_magazine` | Tin tức nội thất, Xu hướng nội thất, Căn hộ Việt Nam |
| `global_local_styles` | Phong cách nội thất, K-minimal, Japandi |
| `budget_scale` | Ngân sách thông minh, Căn hộ nhỏ, Mua sắm tiết kiệm |
| `lifestyle_age` | Gia đình & lối sống, Căn hộ gia đình, Lưu trữ thông minh |
| `dreamdeco_guide` | Hướng dẫn DreamDeco, AI thiết kế nội thất, Mô phỏng nội thất |
| `consumer_guide` | Mua sắm nội thất, Chọn sofa, Căn hộ nhỏ |

## Downstream processing

### prepare-supabase-blog-payload.mjs

Script đọc từ `outputs/final-posts/json/*.json` và:
1. Strip thumbnail image từ `content_html` (nếu vô tình có)
2. Lọc `content_images` chỉ giữ images thực sự xuất hiện trong `content_html`
3. Deduplicate slugs trong batch
4. Map category → hashtags
5. Tạo blog row: `{ title, slug, content (= content_html), view_count: 0, share_count: 0, status: false, description (= meta_description) }`
6. Output: `outputs/db-ready/development/*.json`

### upload-supabase-blogs.mjs

Script kiểm tra:
- `MIN_PUBLIC_BODY_CHARS = 8000` — strip HTML tags rồi đếm ký tự
- Upsert blog rows vào Supabase
- Tạo hashtag joins

### upload-supabase-blog-images.py

Script xử lý:
- Convert images sang WebP
- Upload lên Supabase Storage bucket
- Upsert `public.resources` table
- Update blog thumbnail reference

## Validation rules

Trước khi xuất JSON package, kiểm tra:

1. ✅ `title` không rỗng, < 70 ký tự
2. ✅ `slug` lowercase, chỉ chứa [a-z0-9-]
3. ✅ `content_html` không rỗng, không chứa `thumbnail_image.file_path` như `<img src>`
4. ✅ `meta_description` < 160 ký tự
5. ✅ `category` là 1 trong 6 giá trị hợp lệ
6. ✅ `thumbnail_image.file_path` tồn tại
7. ✅ `content_images` có 2-4 items, mỗi item có file_path
8. ✅ Public body text (strip HTML) >= 8,000 ký tự tiếng Việt

## Output location

```
outputs/final-posts/json/<slug>.json
outputs/final-posts/html/<slug>.html
```
