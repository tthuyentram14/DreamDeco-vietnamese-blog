# Visual Module Patterns

HTML/CSS patterns cho các module nội dung. Styling bằng Tailwind utility classes — không inline hex/px-radius/shadow (xem `frontend-rendering-context.md`). Mỗi module type có color scheme riêng.

---

## 1. summary_card

Tóm tắt nhanh đầu bài, highlight key points. Color: **sky**.

```html
<div class="my-10 rounded-xl border border-sky-200 bg-sky-50 p-5 md:p-6 shadow-sm">
  <p class="m-0 mb-2.5 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-sky-700">Tóm tắt nhanh</p>
  <h2 class="mt-2 mb-3 text-xl font-bold" style="color:var(--foreground);">Tiêu đề tóm tắt</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="rounded-lg border border-sky-100 bg-white p-4">
      <p class="m-0 font-bold text-slate-950">Key point title</p>
      <p class="mt-1.5 mb-0 text-slate-600">Mô tả ngắn cho key point này.</p>
    </div>
    <div class="rounded-lg border border-sky-100 bg-white p-4">
      <p class="m-0 font-bold text-slate-950">Key point title 2</p>
      <p class="mt-1.5 mb-0 text-slate-600">Mô tả ngắn cho key point 2.</p>
    </div>
  </div>
</div>
```

---

## 2. checklist_block

Danh sách kiểm tra dạng cards. Color: **emerald**.

```html
<div class="my-10 rounded-xl border border-emerald-200 bg-emerald-50 p-5 md:p-6 shadow-sm">
  <p class="m-0 mb-2.5 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-bold text-emerald-700">Checklist thực tế</p>
  <h3 class="mt-2 mb-2 text-lg font-bold" style="color:var(--foreground);">Tiêu đề checklist</h3>
  <div class="grid gap-3">
    <div class="rounded-lg border border-emerald-100 bg-white p-4">
      <p class="m-0 font-bold">01. Mục kiểm tra đầu tiên</p>
      <p class="mt-1.5 mb-0 text-slate-600">Giải thích ngắn tại sao cần kiểm tra điều này.</p>
    </div>
    <div class="rounded-lg border border-emerald-100 bg-white p-4">
      <p class="m-0 font-bold">02. Mục kiểm tra thứ hai</p>
      <p class="mt-1.5 mb-0 text-slate-600">Giải thích ngắn cho mục thứ hai.</p>
    </div>
  </div>
</div>
```

---

## 3. data_table

Bảng so sánh/quyết định với header tối, alternating rows. Color: **slate/neutral**.

```html
<div class="my-10 rounded-xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
  <p class="m-0 mb-2.5 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">Bảng quyết định</p>
  <h3 class="mt-2 mb-2 text-lg font-bold" style="color:var(--foreground);">Tiêu đề bảng</h3>
  <p class="mt-0 mb-4 text-sm text-slate-600">Mô tả ngắn cho bảng này.</p>
  <div class="overflow-x-auto rounded-lg border border-slate-200">
    <table class="w-full min-w-[760px] border-collapse text-sm">
      <thead class="bg-slate-900 text-white">
        <tr>
          <th class="p-3 text-left font-semibold">Cột 1</th>
          <th class="p-3 text-left font-semibold">Cột 2</th>
          <th class="p-3 text-left font-semibold">Cột 3</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t border-slate-200 bg-white">
          <td class="p-3 font-medium">Hàng 1</td>
          <td class="p-3">Nội dung</td>
          <td class="p-3">Nội dung</td>
        </tr>
        <tr class="border-t border-slate-200 bg-slate-50">
          <td class="p-3 font-medium">Hàng 2</td>
          <td class="p-3">Nội dung</td>
          <td class="p-3">Nội dung</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Inline tag/pill trong table cell:**
```html
<span class="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">Label text</span>
```

---

## 4. material_palette

Bảng vật liệu/màu sắc với swatches. Color: **amber**.

Swatch (`div` thể hiện màu vật liệu thực tế) là NGOẠI LỆ duy nhất được dùng inline hex — vì đây là dữ liệu nội dung (màu thật của vật liệu), không phải design token.

```html
<div class="my-10 rounded-xl border border-amber-200 bg-amber-50 p-5 md:p-6 shadow-sm">
  <p class="m-0 mb-2.5 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-bold text-amber-700">Material palette</p>
  <h3 class="mt-2 mb-2 text-lg font-bold" style="color:var(--foreground);">Bảng vật liệu</h3>
  <p class="mb-4 text-sm text-slate-600">Mô tả ngắn về bảng vật liệu.</p>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div class="rounded-lg border border-amber-100 bg-white p-3">
      <div class="h-12 rounded-lg" style="background:#2f3a3f;"></div>
      <p class="mt-2 mb-0 font-bold">Tên vật liệu</p>
      <p class="mt-1 mb-0 text-[13px] text-slate-500">Mô tả ngắn hợp ở đâu.</p>
    </div>
    <div class="rounded-lg border border-amber-100 bg-white p-3">
      <div class="h-12 rounded-lg" style="background:#8a9a82;"></div>
      <p class="mt-2 mb-0 font-bold">Tên vật liệu 2</p>
      <p class="mt-1 mb-0 text-[13px] text-slate-500">Mô tả ngắn.</p>
    </div>
  </div>
</div>
```

---

## 5. step_flow

Quy trình theo bước. Color: **violet**.

```html
<div class="my-10 rounded-xl border border-violet-200 bg-violet-50 p-5 md:p-6 shadow-sm">
  <p class="m-0 mb-2.5 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-bold text-violet-700">Quy trình</p>
  <h3 class="mt-2 mb-2 text-lg font-bold" style="color:var(--foreground);">Tiêu đề quy trình</h3>
  <div class="grid gap-3">
    <div class="rounded-lg border border-violet-100 bg-white p-4">
      <p class="m-0 font-bold text-violet-700">Bước 1</p>
      <p class="mt-1.5 mb-0 text-slate-600">Mô tả chi tiết bước 1.</p>
    </div>
    <div class="rounded-lg border border-violet-100 bg-white p-4">
      <p class="m-0 font-bold text-violet-700">Bước 2</p>
      <p class="mt-1.5 mb-0 text-slate-600">Mô tả chi tiết bước 2.</p>
    </div>
    <div class="rounded-lg border border-violet-100 bg-white p-4">
      <p class="m-0 font-bold text-violet-700">Bước 3</p>
      <p class="mt-1.5 mb-0 text-slate-600">Mô tả chi tiết bước 3.</p>
    </div>
  </div>
</div>
```

---

## 6. stat_cards

Hiển thị số liệu nổi bật dạng grid. Color: **slate/neutral**.

```html
<div class="my-10 grid grid-cols-2 md:grid-cols-4 gap-4">
  <div class="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
    <p class="m-0 text-3xl font-bold text-sky-700">65 m²</p>
    <p class="mt-1.5 mb-0 text-[13px] text-slate-500">Diện tích căn hộ</p>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
    <p class="m-0 text-3xl font-bold text-emerald-700">120 triệu</p>
    <p class="mt-1.5 mb-0 text-[13px] text-slate-500">Ngân sách nội thất</p>
  </div>
</div>
```

---

## 7. comparison_grid

So sánh 2-3 phương án. Color: **slate** wrapper, mỗi option có accent riêng.

```html
<div class="my-10 rounded-xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
  <p class="m-0 mb-2.5 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">So sánh</p>
  <h3 class="mt-2 mb-4 text-lg font-bold" style="color:var(--foreground);">Tiêu đề so sánh</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="rounded-lg border-2 border-sky-300 bg-sky-50 p-4">
      <p class="m-0 font-bold text-sky-700">Phương án A</p>
      <ul class="mt-2.5 mb-0 pl-4.5 text-sm text-slate-600">
        <li>Ưu điểm 1</li>
        <li>Ưu điểm 2</li>
        <li class="text-red-700">Nhược điểm 1</li>
      </ul>
    </div>
    <div class="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
      <p class="m-0 font-bold text-amber-700">Phương án B</p>
      <ul class="mt-2.5 mb-0 pl-4.5 text-sm text-slate-600">
        <li>Ưu điểm 1</li>
        <li>Ưu điểm 2</li>
        <li class="text-red-700">Nhược điểm 1</li>
      </ul>
    </div>
  </div>
</div>
```

---

## 8. timeline

Sự kiện theo thời gian / lộ trình. Color: **pink**.

```html
<div class="my-10 rounded-xl border border-pink-200 bg-pink-50 p-5 md:p-6 shadow-sm">
  <p class="m-0 mb-2.5 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-bold text-pink-700">Timeline</p>
  <h3 class="mt-2 mb-2 text-lg font-bold" style="color:var(--foreground);">Lộ trình thực hiện</h3>
  <div class="grid gap-3">
    <div class="rounded-lg border border-pink-100 bg-white p-4">
      <p class="m-0 font-bold text-pink-700">Tuần 1-2</p>
      <p class="mt-1.5 mb-0 text-slate-600">Đo đạc, lên bản vẽ, chọn phong cách.</p>
    </div>
    <div class="rounded-lg border border-pink-100 bg-white p-4">
      <p class="m-0 font-bold text-pink-700">Tuần 3-4</p>
      <p class="mt-1.5 mb-0 text-slate-600">Đặt hàng, thi công phần thô.</p>
    </div>
  </div>
</div>
```

---

## 9. warning_block

Cảnh báo, lưu ý quan trọng. Color: **red**.

```html
<div class="my-10 rounded-xl border border-red-200 bg-red-50 p-5 md:p-6 shadow-sm">
  <p class="m-0 mb-2.5 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-bold text-red-700">Lưu ý</p>
  <h3 class="mt-2 mb-2 text-lg font-bold" style="color:var(--foreground);">Tiêu đề cảnh báo</h3>
  <div class="grid gap-3">
    <div class="rounded-lg border border-red-100 bg-white p-4">
      <p class="m-0 text-slate-600">Nội dung cảnh báo hoặc lưu ý quan trọng.</p>
    </div>
  </div>
</div>
```

---

## 10. cta_dreamdeco

Call-to-action cho DreamDeco. Color: **sky** (nhẹ hơn summary).

```html
<div class="my-10 rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 md:p-6 shadow-sm">
  <h3 class="mt-0 mb-2 text-lg font-bold" style="color:var(--foreground);">Thử trước bằng DreamDeco</h3>
  <p class="mb-4 text-sm text-slate-600">Mô tả ngắn về cách DreamDeco giúp ích cho bài viết này.</p>
  <a href="https://dreamdeco.vn" target="_blank"
     class="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white no-underline">
    Khám phá DreamDeco →
  </a>
</div>
```

---

## Nguyên tắc chung

1. **CSS custom properties**: Styling bằng Tailwind utility classes (backed bởi CSS var của Tailwind v4) — không hardcode hex/px-radius/shadow trong inline style
2. **Color uniqueness**: KHÔNG dùng cùng color scheme cho 2 modules trong 1 bài. Rotate qua: sky → emerald → amber → violet → pink → slate
3. **Spacing**: Mỗi module `my-10`
4. **Border radius**: wrapper `rounded-xl`, inner cards `rounded-lg`, pills `rounded-full`, images `rounded-lg`
5. **Shadow**: `shadow-sm` cho tất cả modules
6. **Badge pattern**: Luôn có badge pill ở đầu module với `rounded-full bg-white text-xs font-bold`
7. **Responsive**: Dùng `grid` + Tailwind `grid-cols-*` responsive breakpoints; nếu cần `auto-fit`/`minmax` dùng arbitrary value class (`grid-cols-[repeat(auto-fit,minmax(220px,1fr))]`)
8. **Inner cards**: `bg-white border border-[color]-100 rounded-lg p-4`
9. **Numbered items**: Dùng `01.`, `02.`, `03.` cho checklist items
10. **Không empty containers**: Mỗi module phải có data thực từ draft
11. **Ngoại lệ hex**: chỉ material swatch (màu thực tế vật liệu) và `var(--foreground)`/`var(--font-sans)` cho heading/lead paragraph
