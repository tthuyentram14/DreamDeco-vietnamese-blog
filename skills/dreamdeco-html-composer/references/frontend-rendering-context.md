# Frontend Rendering Context

## Cách DreamDeco render content_html

Blog `content_html` được lưu trong database và inject qua React `dangerouslySetInnerHTML`. Content nằm ngoài React component tree — không thể dùng React components hoặc shadcn/ui imports.

**Stack:** Next.js + Tailwind CSS v4 + shadcn/ui

Content kế thừa CSS custom properties và Tailwind utilities từ `globals.css` của app.

## Nguyên tắc styling: Dual approach (chỉ heading/box/figure/CTA/disclosure)

Heading (H2/H3), box màu, `<figure>`, CTA và disclosure phải có **cả Tailwind classes LẪN inline style fallback** với hex values, vì `content_html` nằm ngoài React component tree (Tailwind compile-time không quét được). Đoạn văn thường (trừ sapo) thì để trần, không thêm class/style — xem mục "Body paragraph" bên dưới.

```html
<!-- Pattern chuẩn: class + style song song -->
<div class="my-10 rounded-xl border border-sky-200 bg-sky-50 p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#eff6ff;border:1px solid #bae6fd;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.08);">
```

## Text color palette (hex)

```
#0f172a  — Heading, tiêu đề chính (slate-950)
#1e293b  — Body text đậm (slate-800)
#334155  — Label, badge text trung tính (slate-700)
#475569  — Body text phụ, mô tả trong card (slate-600)
#64748b  — Caption, figcaption, ghi chú nhỏ (slate-500)
```

`var(--foreground)` chỉ dùng cho H2, H3 — nơi cần sync với theme. Các text khác dùng hex.

## Module color schemes

Mỗi module type có bảng màu riêng. KHÔNG dùng chung 1 màu cho tất cả modules.

| Module | BG | Border | Badge BG | Badge Text | Inner Card Border |
|---|---|---|---|---|---|
| summary_card | `#eff6ff` | `#bae6fd` | `#fff` | `#0369a1` | `#dbeafe` |
| checklist | `#ecfdf5` | `#a7f3d0` | `#fff` | `#047857` | `#bbf7d0` |
| material_palette | `#fffbeb` | `#fde68a` | `#fff` | `#b45309` | `#fde68a` |
| step_flow | `#f5f3ff` | `#c4b5fd` | `#fff` | `#6d28d9` | `#ddd6fe` |
| data_table | `#fff` | `#e2e8f0` | `#f1f5f9` | `#334155` | — |
| stat_cards | `#fff` | `#e2e8f0` | — | — | — |
| comparison_grid | `#fff` | `#e2e8f0` | — | — | — |
| timeline | `#fdf2f8` | `#f9a8d4` | `#fff` | `#be185d` | `#fbcfe8` |
| warning/alert | `#fef2f2` | `#fecaca` | `#fff` | `#b91c1c` | `#fecaca` |
| navigation/TOC | `#fff` | `#e2e8f0` | — | `#64748b` | — |

Tailwind class mapping:
- sky: `bg-sky-50 border-sky-200 text-sky-700`
- emerald: `bg-emerald-50 border-emerald-200 text-emerald-700`
- amber: `bg-amber-50 border-amber-200 text-amber-700`
- violet: `bg-violet-50 border-violet-200 text-violet-700`
- slate: `bg-white border-slate-200`
- pink: `bg-pink-50 border-pink-200 text-pink-700`
- red: `bg-red-50 border-red-200 text-red-700`

## Kích thước chuẩn

### Border radius (inline fallback)
```
14px  — Module wrapper (cards, panels, checklist, table container)
10px  — Inner cards, table inner border, sub-cards
12px  — Images
999px — Badge pills, tag labels
8px   — Material swatches, small elements
```

### Shadow (inline fallback)
```
0 1px 3px rgba(15,23,42,0.06)  — Nhẹ (cards, modules)
0 1px 3px rgba(15,23,42,0.08)  — Vừa (summary, featured)
```

### Spacing (inline fallback)
```
margin: 40px 0    — Module spacing
padding: 24px     — Module inner padding
margin: 32px 0    — Figure spacing
margin: 40px 0 16px — H2 spacing
gap: 16px         — Grid gap
gap: 12px         — List item gap
```

## globals.css — CSS custom properties reference

Các var() tokens vẫn dùng được — nhưng chỉ cho H2/H3 color và font-family. Bảng giá trị thực:

### Colors (dùng cho headings)
```css
var(--foreground)         /* oklch(0 0 0) — H2, H3 text color */
var(--font-sans)          /* Be Vietnam Pro, ui-sans-serif, sans-serif, system-ui */
```

### Radius & Shadow (reference — inline styles dùng px trực tiếp)
```css
var(--radius-xl)  /* 14px */    var(--radius-lg)  /* 10px */
var(--shadow-sm)  /* ~ 0 1px 3px rgba(15,23,42,0.06) */
```

## Element patterns

### Lead paragraph
```html
<p class="text-lg text-gray-800"
   style="font-size:1.125rem;line-height:1.75;margin:0 0 24px;color:var(--foreground);font-family:var(--font-sans);">
  Tóm tắt ngắn cho bài viết...
</p>
```

### H2
```html
<h2 id="slug" class="mt-10 mb-4"
    style="margin:40px 0 16px;color:var(--foreground);font-size:1.5rem;font-weight:700;">
  Tiêu đề section
</h2>
```

### H3
```html
<h3 class="mt-6 mb-3"
    style="margin:24px 0 12px;font-size:1.125rem;font-weight:700;color:#0f172a;">
  Tiêu đề phụ
</h3>
```

### Body paragraph
```html
<p>Nội dung bài viết. Không cần class hay style cho p thông thường — kế thừa từ prose wrapper.</p>
```

### Image / Figure
```html
<figure class="my-8" style="margin:32px 0;">
  <img src="https://..." alt="Alt text tiếng Việt" loading="lazy"
       class="w-full h-auto rounded-lg"
       style="max-width:100%;height:auto;border-radius:12px;display:block;" />
  <figcaption style="margin-top:8px;color:#64748b;font-size:14px;">
    Caption tiếng Việt
  </figcaption>
</figure>
```

### TOC / Mục lục
```html
<nav aria-label="Mục lục" class="my-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
     style="margin:40px 0;padding:20px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
  <p class="m-0 text-sm font-semibold text-slate-500"
     style="margin:0 0 10px;color:#64748b;font-size:14px;font-weight:700;">Mục lục</p>
  <ol class="m-0 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"
      style="margin:0;padding-left:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px;color:#334155;">
    <li><a href="#section-id" style="color:#0f172a;text-decoration:none;">Tên section</a></li>
  </ol>
</nav>
```

### AI Disclosure block
```html
<div class="my-10 rounded-xl border border-slate-200 bg-slate-50 p-5"
     style="margin:40px 0;padding:20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;">
  <p style="color:#64748b;font-size:14px;margin:0;">
    Written by AI - Nội dung được tạo bởi AI dựa trên quá trình tổng hợp, biên tập và kiểm tra thông tin từ nhiều nguồn tham khảo.
  </p>
</div>
```

## HTML wrapper

```html
<div class="prose prose-gray max-w-none text-gray-800 leading-relaxed">
  <!-- Toàn bộ content ở đây -->
</div>
```

## Quy tắc

### BẮT BUỘC
- Heading/box/figure/CTA/disclosure có CẢ Tailwind classes VÀ inline style fallback
- Đoạn văn thường (trừ sapo) để trần, không thêm class/style — kế thừa từ wrapper `prose`
- Mỗi module type dùng bảng màu riêng (xem bảng Module color schemes)
- Badge/pill dùng `border-radius:999px`
- Inline styles dùng `px` cho spacing, không dùng `rem`
- H2 phải có `id` attribute cho TOC anchor links
- Inner cards: `background:#fff;border:1px solid [color-100];border-radius:10px;padding:16px`

### CẤM
- Import external CSS, JavaScript, React components, shadcn/ui
- Dùng `var(--primary)`, `var(--tertiary)`, `var(--muted)`, `var(--border)` cho module background/border — dùng hex từ bảng color schemes
- Dùng cùng 1 color scheme cho nhiều modules trong 1 bài

### NGOẠI LỆ
- `var(--foreground)` được dùng cho H2, H3 color (sync theme)
- `var(--font-sans)` được dùng cho lead paragraph font-family
- Material swatches hex cho màu thực tế nội thất
