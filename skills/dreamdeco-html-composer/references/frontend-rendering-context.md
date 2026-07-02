# Frontend Rendering Context

## Cách DreamDeco render content_html

Blog `content_html` được lưu trong database và inject qua React `dangerouslySetInnerHTML`. Content nằm ngoài React component tree — không thể dùng React components hoặc shadcn/ui imports.

**Stack:** Next.js + Tailwind CSS v4 + shadcn/ui

Content kế thừa CSS custom properties và Tailwind utilities từ `globals.css` của app — vì `content_html` render vào cùng document, dùng chung stylesheet với phần còn lại của trang. Tailwind utility classes (`bg-sky-50`, `rounded-xl`, `shadow-sm`...) áp dụng bình thường bất kể element được tạo bởi React hay set qua `innerHTML`, vì CSS cascade dựa trên class selector chứ không phụ thuộc React tree.

## Nguyên tắc styling: Dual approach (chỉ heading/box/figure/CTA/disclosure)

Heading (H2/H3), box màu, `<figure>`, CTA và disclosure phải có **cả Tailwind classes LẪN inline style fallback** với hex values, vì `content_html` nằm ngoài React component tree (Tailwind compile-time không quét được). Đoạn văn thường (trừ sapo) thì để trần, không thêm class/style — xem mục "Body paragraph" bên dưới.

```html
<!-- Pattern chuẩn: chỉ Tailwind classes, không inline hex/radius/shadow -->
<div class="my-10 rounded-xl border border-sky-200 bg-sky-50 p-5 md:p-6 shadow-sm">
```

Chỉ dùng inline `style` khi:
- Cần `var(--foreground)` / `var(--font-sans)` cho H2/H3, lead paragraph (token không có class Tailwind tương ứng)
- Layout grid cần `auto-fit`/`minmax` — dùng Tailwind arbitrary value class (`grid-cols-[repeat(auto-fit,minmax(220px,1fr))]`), không phải inline style
- Material swatch: màu thực tế của vật liệu nội thất (dữ liệu nội dung, không phải design token)

## Text color

```
text-slate-950   — Heading, tiêu đề chính
text-slate-800   — Body text đậm
text-slate-700   — Label, badge text trung tính
text-slate-600   — Body text phụ, mô tả trong card
text-slate-500   — Caption, figcaption, ghi chú nhỏ
```

`var(--foreground)` chỉ dùng cho H2, H3 — nơi cần sync với theme. Các text khác dùng Tailwind text color class.

## Module color schemes

Mỗi module type có bảng màu riêng qua Tailwind class. KHÔNG dùng chung 1 màu cho tất cả modules.

| Module | BG | Border | Badge BG | Badge Text | Inner Card Border |
|---|---|---|---|---|---|
| summary_card | `bg-sky-50` | `border-sky-200` | `bg-white` | `text-sky-700` | `border-sky-100` |
| checklist | `bg-emerald-50` | `border-emerald-200` | `bg-white` | `text-emerald-700` | `border-emerald-100` |
| material_palette | `bg-amber-50` | `border-amber-200` | `bg-white` | `text-amber-700` | `border-amber-100` |
| step_flow | `bg-violet-50` | `border-violet-200` | `bg-white` | `text-violet-700` | `border-violet-100` |
| data_table | `bg-white` | `border-slate-200` | `bg-slate-100` | `text-slate-700` | — |
| stat_cards | `bg-white` | `border-slate-200` | — | — | — |
| comparison_grid | `bg-white` | `border-slate-200` | — | — | — |
| timeline | `bg-pink-50` | `border-pink-200` | `bg-white` | `text-pink-700` | `border-pink-100` |
| warning/alert | `bg-red-50` | `border-red-200` | `bg-white` | `text-red-700` | `border-red-100` |
| navigation/TOC | `bg-white` | `border-slate-200` | — | `text-slate-500` | — |

## Kích thước chuẩn (Tailwind class)

### Border radius
```
rounded-xl    — Module wrapper (cards, panels, checklist, table container)
rounded-lg    — Inner cards, table inner border, sub-cards, images
rounded-full  — Badge pills, tag labels
```

### Shadow
```
shadow-sm   — Cards, modules, summary, featured
```

### Spacing
```
my-10   — Module spacing
p-5 md:p-6   — Module inner padding
my-8    — Figure spacing
mt-10 mb-4   — H2 spacing
gap-4   — Grid gap
gap-3   — List item gap
```

## globals.css — CSS custom properties reference

Các var() tokens dùng cho phần không có Tailwind utility tương ứng:

```css
var(--foreground)         /* oklch(0 0 0) — H2, H3 text color */
var(--font-sans)          /* Be Vietnam Pro, ui-sans-serif, sans-serif, system-ui */
```

Màu, radius, shadow còn lại: dùng Tailwind utility class trực tiếp (utilities này tự map sang CSS custom properties của Tailwind v4, không cần khai báo lại bằng inline style).

## Element patterns

### Lead paragraph
```html
<p class="text-lg text-slate-800 leading-relaxed mb-6"
   style="color:var(--foreground);font-family:var(--font-sans);">
  Tóm tắt ngắn cho bài viết...
</p>
```

### H2
```html
<h2 id="slug" class="mt-10 mb-4 text-2xl font-bold" style="color:var(--foreground);">
  Tiêu đề section
</h2>
```

### H3
```html
<h3 class="mt-6 mb-3 text-lg font-bold" style="color:var(--foreground);">
  Tiêu đề phụ
</h3>
```

### Body paragraph
```html
<p>Nội dung bài viết. Không cần class hay style cho p thông thường — kế thừa từ prose wrapper.</p>
```

### Image / Figure
```html
<figure class="my-8">
  <img src="https://..." alt="Alt text tiếng Việt" loading="lazy"
       class="w-full h-auto rounded-lg" />
  <figcaption class="mt-2 text-sm text-slate-500">
    Caption tiếng Việt
  </figcaption>
</figure>
```

### TOC / Mục lục
```html
<nav aria-label="Mục lục" class="my-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
  <p class="m-0 mb-2.5 text-sm font-bold text-slate-500">Mục lục</p>
  <ol class="m-0 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm pl-5 text-slate-700">
    <li><a href="#section-id" class="text-slate-950 no-underline">Tên section</a></li>
  </ol>
</nav>
```

### AI Disclosure block
```html
<div class="my-10 rounded-xl border border-slate-200 bg-slate-50 p-5">
  <p class="text-sm text-slate-500 m-0">
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
- Badge/pill dùng `rounded-full`
- H2 phải có `id` attribute cho TOC anchor links
- Inner cards: `bg-white border border-[color]-100 rounded-lg p-4`

### CẤM
- Import external CSS, JavaScript, React components, shadcn/ui
- Hardcode hex color, `border-radius: Npx`, hoặc `box-shadow` không chứa `var(...)` trong inline style
- Dùng cùng 1 color scheme cho nhiều modules trong 1 bài

### NGOẠI LỆ
- `var(--foreground)` được dùng cho H2, H3 color (sync theme)
- `var(--font-sans)` được dùng cho lead paragraph font-family
- Material swatches hex cho màu thực tế nội thất
