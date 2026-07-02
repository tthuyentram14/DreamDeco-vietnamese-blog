---
name: dreamdeco-html-composer
description: "Chuyển draft bài viết DreamDeco thành HTML fragment và JSON package sẵn sàng cho DB upload. Gộp html-composer + content-packager thành một skill. Dùng khi cần compose HTML và đóng gói JSON từ draft đã duyệt và ảnh đã tạo."
license: MIT
metadata:
  author: DreamDeco Team
  version: "1.0.0"
allowed-tools: Read Write Edit Grep Glob AskUserQuestion
---

# DreamDeco HTML Composer

## Vai trò

Nhận draft đã duyệt từ writer + image metadata từ image-creator → xuất ra:
1. HTML fragment cho content area (`outputs/final-posts/html/<slug>.html`)
2. JSON package cho DB upload (`outputs/final-posts/json/<slug>.json`)

## Input

1. **Article draft** từ `dreamdeco-vietnamese-writer` — sections, visual_module_data, image placements
2. **Image metadata** từ `dreamdeco-image-creator` — file paths, alt text, roles, placements

## References

Đọc trước khi compose:
- `references/frontend-rendering-context.md` — CSS tokens bắt buộc, dangerouslySetInnerHTML rules
- `references/visual-module-patterns.md` — HTML/CSS patterns cho 10 module types
- `references/json-package-schema.md` — JSON contract cho DB scripts

## Quy trình

### Bước 1: Compose HTML fragment

Wrapper bắt buộc:
```html
<div class="prose prose-gray max-w-none text-gray-800 leading-relaxed">
  <!-- content here -->
</div>
```

**Styling rules (dual approach — chỉ áp dụng cho heading/box/figure/CTA/disclosure):**
- `content_html` được inject qua `dangerouslySetInnerHTML`, nằm ngoài React component tree — Tailwind compile-time **không quét được** utility class bên trong nó, nên với heading (H2/H3), box màu, `<figure>`, CTA và disclosure, style inline mới là thứ quyết định hiển thị thật. Các phần này phải có CẢ Tailwind classes VÀ inline style fallback với hex values.
- Mỗi module type dùng color scheme riêng (sky, emerald, amber, violet, pink, slate) — xem `references/frontend-rendering-context.md`
- Inline styles dùng `px` cho spacing/radius, hex cho colors
- `var(--foreground)` chỉ dùng cho H2, H3 text color
- Border radius: wrapper `14px`, inner cards `10px`, images `12px`, pills `999px`
- Shadow: `0 1px 3px rgba(15,23,42,0.06)`
- KHÔNG dùng `var(--primary)`, `var(--muted)`, `var(--border)` cho module styling

**Đoạn văn thường (body paragraph) thì ngược lại — để trần, không thêm class hay style gì cả**, trừ đoạn sapo đầu tiên. Lý do: chúng kế thừa style từ wrapper `<div class="prose prose-gray max-w-none text-gray-800 leading-relaxed">` — wrapper đó nằm trong source code app nên Tailwind quét được bình thường, không cần lớp bảo hiểm inline style. Thêm class/style vào `<p>` thường là sai so với mẫu thật, không phải "thêm cho chắc".

**HTML phải bao gồm:**
- Tóm tắt ngắn (lead paragraph)
- Mục lục cho bài dài (> 4 H2)
- H2/H3 sections với nội dung từ draft
- Body images bằng `<figure>` với alt text tiếng Việt
- Visual modules render từ `visual_module_data`
- CTA DreamDeco
- AI disclosure cuối bài

**Thumbnail rule:**
- Production `content_html` KHÔNG chứa thumbnail image
- Template detail page render thumbnail từ `blogs.thumbnail` + `public.resources`
- Nếu `thumbnail_image.file_path` xuất hiện như `<img src>` trong `content_html` → lỗi, phải xóa

### Bước 2: Render visual modules

Chuyển `visual_module_data` từ draft thành HTML/CSS components. Mỗi module phải:
- Có badge pill (`border-radius:999px;background:#fff`) + heading rõ ràng
- Có spacing `margin:40px 0` (class `my-10`)
- Dùng color scheme riêng per module type (sky, emerald, amber, violet, pink, slate)
- Rotate color schemes — KHÔNG lặp cùng 1 color cho 2 modules trong bài
- Inner cards: `background:#fff;border:1px solid [color-100];border-radius:10px;padding:16px`

Xem `references/visual-module-patterns.md` cho template từng loại.

### Bước 3: Tạo JSON package

Xuất JSON khớp contract tại `references/json-package-schema.md`. JSON phải pass được `prepare-supabase-blog-payload.mjs` và `upload-supabase-blogs.mjs`.

### Bước 4: Self-check

- [ ] Heading/box/figure/CTA/disclosure có CẢ Tailwind classes VÀ inline style fallback
- [ ] Đoạn văn thường (trừ sapo) không bị lỡ tay thêm class/style — để trần, kế thừa từ wrapper `prose`
- [ ] Mỗi module dùng color scheme riêng (không trùng trong bài)
- [ ] Không hardcode hex ngoài material swatches (dữ liệu nội dung)
- [ ] Thumbnail KHÔNG trong content_html
- [ ] Mỗi body image có `<figure>` + alt text tiếng Việt, border-radius:12px
- [ ] Visual modules render đúng type với badge pill
- [ ] H2 có `id` attribute cho TOC anchor
- [ ] JSON package đủ required fields
- [ ] AI disclosure present và đúng text
- [ ] Không có empty containers/boxes
- [ ] Spacing `margin:40px 0` giữa các modules

## Output

```
outputs/final-posts/html/<slug>.html    — HTML fragment
outputs/final-posts/json/<slug>.json    — JSON package
```

## Quy tắc quan trọng

- Visual modules (tables, charts, checklists, step flows, infographics) = HTML/CSS. Không dùng Imagen2 cho data visualization.
- Không import React components, JavaScript, external CSS, shadcn/ui imports trong fragment.
- Dual approach (Tailwind classes + inline hex fallbacks) chỉ áp dụng cho heading/box/figure/CTA/disclosure — đoạn văn thường để trần. Xem `references/visual-module-patterns.md` cho templates.
- Không tạo mock content, placeholder text, hoặc empty modules.
