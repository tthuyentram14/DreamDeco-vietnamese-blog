# Visual Module Patterns

HTML/CSS patterns cho các module nội dung. Dual approach: Tailwind classes + inline hex fallbacks. Mỗi module type có color scheme riêng.

---

## 1. summary_card

Tóm tắt nhanh đầu bài, highlight key points. Color: **sky**.

```html
<div class="my-10 rounded-xl border border-sky-200 bg-sky-50 p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#eff6ff;border:1px solid #bae6fd;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.08);">
  <p class="m-0 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-medium text-sky-700"
     style="display:inline-flex;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:#fff;color:#0369a1;font-size:12px;font-weight:600;">Tóm tắt nhanh</p>
  <h2 class="mt-2 mb-3 text-xl font-semibold text-gray-950"
      style="margin:8px 0 12px;color:var(--foreground);font-size:1.25rem;font-weight:700;">Tiêu đề tóm tắt</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4"
       style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
    <div class="rounded-lg bg-white p-4"
         style="background:#fff;border:1px solid #dbeafe;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#0f172a;">Key point title</p>
      <p style="margin:6px 0 0;color:#475569;">Mô tả ngắn cho key point này.</p>
    </div>
    <div class="rounded-lg bg-white p-4"
         style="background:#fff;border:1px solid #dbeafe;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#0f172a;">Key point title 2</p>
      <p style="margin:6px 0 0;color:#475569;">Mô tả ngắn cho key point 2.</p>
    </div>
  </div>
</div>
```

---

## 2. checklist_block

Danh sách kiểm tra dạng cards. Color: **emerald**.

```html
<div class="my-10 rounded-xl border border-emerald-200 bg-emerald-50 p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
  <p class="m-0 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-medium text-emerald-700"
     style="display:inline-flex;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:#fff;color:#047857;font-size:12px;font-weight:700;">Checklist thực tế</p>
  <h3 class="mt-2 mb-2 text-lg font-semibold"
      style="margin:8px 0 8px;font-size:1.125rem;font-weight:700;color:#0f172a;">Tiêu đề checklist</h3>
  <div class="space-y-3" style="display:grid;gap:12px;">
    <div class="rounded-lg border border-emerald-100 bg-white p-4"
         style="background:#fff;border:1px solid #bbf7d0;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;">01. Mục kiểm tra đầu tiên</p>
      <p style="margin:6px 0 0;color:#475569;">Giải thích ngắn tại sao cần kiểm tra điều này.</p>
    </div>
    <div class="rounded-lg border border-emerald-100 bg-white p-4"
         style="background:#fff;border:1px solid #bbf7d0;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;">02. Mục kiểm tra thứ hai</p>
      <p style="margin:6px 0 0;color:#475569;">Giải thích ngắn cho mục thứ hai.</p>
    </div>
  </div>
</div>
```

---

## 3. data_table

Bảng so sánh/quyết định với header tối, alternating rows. Color: **slate/neutral**.

```html
<div class="my-10 rounded-xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
  <p class="m-0 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
     style="display:inline-flex;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:#f1f5f9;color:#334155;font-size:12px;font-weight:700;">Bảng quyết định</p>
  <h3 class="mt-2 mb-2 text-lg font-semibold text-gray-950"
      style="margin:8px 0 8px;font-size:1.125rem;font-weight:700;color:#0f172a;">Tiêu đề bảng</h3>
  <p class="mt-0 mb-4 text-sm text-gray-600"
     style="margin:0 0 16px;color:#475569;font-size:14px;">Mô tả ngắn cho bảng này.</p>
  <div class="overflow-x-auto rounded-lg border border-gray-200"
       style="overflow-x:auto;border:1px solid #e5e7eb;border-radius:10px;">
    <table class="w-full min-w-[760px] border-collapse text-sm"
           style="width:100%;min-width:760px;border-collapse:collapse;font-size:14px;">
      <thead class="bg-gray-950 text-white" style="background:#111827;color:#fff;">
        <tr>
          <th class="p-3 text-left font-semibold" style="padding:12px;text-align:left;">Cột 1</th>
          <th class="p-3 text-left font-semibold" style="padding:12px;text-align:left;">Cột 2</th>
          <th class="p-3 text-left font-semibold" style="padding:12px;text-align:left;">Cột 3</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t border-gray-200 bg-white"
            style="border-top:1px solid #e5e7eb;background:#fff;">
          <td class="p-3 font-medium" style="padding:12px;font-weight:700;">Hàng 1</td>
          <td class="p-3" style="padding:12px;">Nội dung</td>
          <td class="p-3" style="padding:12px;">Nội dung</td>
        </tr>
        <tr class="border-t border-gray-200 bg-gray-50"
            style="border-top:1px solid #e5e7eb;background:#f8fafc;">
          <td class="p-3 font-medium" style="padding:12px;font-weight:700;">Hàng 2</td>
          <td class="p-3" style="padding:12px;">Nội dung</td>
          <td class="p-3" style="padding:12px;">Nội dung</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Inline tag/pill trong table cell:**
```html
<span style="display:inline-block;background:#ecfdf5;color:#047857;border-radius:999px;padding:2px 8px;font-size:12px;font-weight:700;">Label text</span>
```

---

## 4. material_palette

Bảng vật liệu/màu sắc với swatches. Color: **amber**.

```html
<div class="my-10 rounded-xl border border-amber-200 bg-amber-50 p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#fffbeb;border:1px solid #fde68a;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
  <p class="m-0 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-700"
     style="display:inline-flex;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:#fff;color:#b45309;font-size:12px;font-weight:700;">Material palette</p>
  <h3 class="mt-2 mb-2 text-lg font-semibold"
      style="margin:8px 0 8px;font-size:1.125rem;font-weight:700;color:#0f172a;">Bảng vật liệu</h3>
  <p style="margin:0 0 16px;color:#475569;font-size:14px;">Mô tả ngắn về bảng vật liệu.</p>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4"
       style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;">
    <div class="rounded-lg border border-amber-100 bg-white p-3"
         style="background:#fff;border:1px solid #fde68a;border-radius:10px;padding:12px;">
      <div style="height:48px;border-radius:8px;background:#2f3a3f;"></div>
      <p style="margin:8px 0 0;font-weight:700;">Tên vật liệu</p>
      <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Mô tả ngắn hợp ở đâu.</p>
    </div>
    <div class="rounded-lg border border-amber-100 bg-white p-3"
         style="background:#fff;border:1px solid #fde68a;border-radius:10px;padding:12px;">
      <div style="height:48px;border-radius:8px;background:#8a9a82;"></div>
      <p style="margin:8px 0 0;font-weight:700;">Tên vật liệu 2</p>
      <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Mô tả ngắn.</p>
    </div>
  </div>
</div>
```

---

## 5. step_flow

Quy trình theo bước. Color: **violet**.

```html
<div class="my-10 rounded-xl border border-violet-200 bg-violet-50 p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#f5f3ff;border:1px solid #c4b5fd;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
  <p class="m-0 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-medium text-violet-700"
     style="display:inline-flex;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:#fff;color:#6d28d9;font-size:12px;font-weight:700;">Quy trình</p>
  <h3 class="mt-2 mb-2 text-lg font-semibold"
      style="margin:8px 0 8px;font-size:1.125rem;font-weight:700;color:#0f172a;">Tiêu đề quy trình</h3>
  <div class="space-y-3" style="display:grid;gap:12px;">
    <div class="rounded-lg border border-violet-100 bg-white p-4"
         style="background:#fff;border:1px solid #ddd6fe;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#6d28d9;">Bước 1</p>
      <p style="margin:6px 0 0;color:#475569;">Mô tả chi tiết bước 1.</p>
    </div>
    <div class="rounded-lg border border-violet-100 bg-white p-4"
         style="background:#fff;border:1px solid #ddd6fe;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#6d28d9;">Bước 2</p>
      <p style="margin:6px 0 0;color:#475569;">Mô tả chi tiết bước 2.</p>
    </div>
    <div class="rounded-lg border border-violet-100 bg-white p-4"
         style="background:#fff;border:1px solid #ddd6fe;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#6d28d9;">Bước 3</p>
      <p style="margin:6px 0 0;color:#475569;">Mô tả chi tiết bước 3.</p>
    </div>
  </div>
</div>
```

---

## 6. stat_cards

Hiển thị số liệu nổi bật dạng grid. Color: **slate/neutral**.

```html
<div class="my-10 grid grid-cols-2 md:grid-cols-4 gap-4"
     style="margin:40px 0;display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px;">
  <div class="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm"
       style="padding:20px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;text-align:center;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
    <p style="margin:0;font-size:2rem;font-weight:700;color:#0369a1;">65 m²</p>
    <p style="margin:6px 0 0;font-size:13px;color:#64748b;">Diện tích căn hộ</p>
  </div>
  <div class="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm"
       style="padding:20px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;text-align:center;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
    <p style="margin:0;font-size:2rem;font-weight:700;color:#047857;">120 triệu</p>
    <p style="margin:6px 0 0;font-size:13px;color:#64748b;">Ngân sách nội thất</p>
  </div>
</div>
```

---

## 7. comparison_grid

So sánh 2-3 phương án. Color: **slate** wrapper, mỗi option có accent riêng.

```html
<div class="my-10 rounded-xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
  <p class="m-0 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
     style="display:inline-flex;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:#f1f5f9;color:#334155;font-size:12px;font-weight:700;">So sánh</p>
  <h3 class="mt-2 mb-4 text-lg font-semibold"
      style="margin:8px 0 16px;font-size:1.125rem;font-weight:700;color:#0f172a;">Tiêu đề so sánh</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4"
       style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
    <div class="rounded-lg border-2 border-sky-300 bg-sky-50 p-4"
         style="background:#f0f9ff;border:2px solid #7dd3fc;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#0369a1;">Phương án A</p>
      <ul style="margin:10px 0 0;padding-left:18px;color:#475569;font-size:14px;">
        <li>Ưu điểm 1</li>
        <li>Ưu điểm 2</li>
        <li style="color:#b91c1c;">Nhược điểm 1</li>
      </ul>
    </div>
    <div class="rounded-lg border-2 border-amber-300 bg-amber-50 p-4"
         style="background:#fffbeb;border:2px solid #fcd34d;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#b45309;">Phương án B</p>
      <ul style="margin:10px 0 0;padding-left:18px;color:#475569;font-size:14px;">
        <li>Ưu điểm 1</li>
        <li>Ưu điểm 2</li>
        <li style="color:#b91c1c;">Nhược điểm 1</li>
      </ul>
    </div>
  </div>
</div>
```

---

## 8. timeline

Sự kiện theo thời gian / lộ trình. Color: **pink**.

```html
<div class="my-10 rounded-xl border border-pink-200 bg-pink-50 p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#fdf2f8;border:1px solid #f9a8d4;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
  <p class="m-0 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-medium text-pink-700"
     style="display:inline-flex;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:#fff;color:#be185d;font-size:12px;font-weight:700;">Timeline</p>
  <h3 class="mt-2 mb-2 text-lg font-semibold"
      style="margin:8px 0 8px;font-size:1.125rem;font-weight:700;color:#0f172a;">Lộ trình thực hiện</h3>
  <div class="space-y-3" style="display:grid;gap:12px;">
    <div class="rounded-lg border border-pink-100 bg-white p-4"
         style="background:#fff;border:1px solid #fbcfe8;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#be185d;">Tuần 1-2</p>
      <p style="margin:6px 0 0;color:#475569;">Đo đạc, lên bản vẽ, chọn phong cách.</p>
    </div>
    <div class="rounded-lg border border-pink-100 bg-white p-4"
         style="background:#fff;border:1px solid #fbcfe8;border-radius:10px;padding:16px;">
      <p style="margin:0;font-weight:700;color:#be185d;">Tuần 3-4</p>
      <p style="margin:6px 0 0;color:#475569;">Đặt hàng, thi công phần thô.</p>
    </div>
  </div>
</div>
```

---

## 9. warning_block

Cảnh báo, lưu ý quan trọng. Color: **red**.

```html
<div class="my-10 rounded-xl border border-red-200 bg-red-50 p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:#fef2f2;border:1px solid #fecaca;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.06);">
  <p class="m-0 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-medium text-red-700"
     style="display:inline-flex;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:#fff;color:#b91c1c;font-size:12px;font-weight:700;">Lưu ý</p>
  <h3 class="mt-2 mb-2 text-lg font-semibold"
      style="margin:8px 0 8px;font-size:1.125rem;font-weight:700;color:#0f172a;">Tiêu đề cảnh báo</h3>
  <div class="space-y-3" style="display:grid;gap:12px;">
    <div class="rounded-lg border border-red-100 bg-white p-4"
         style="background:#fff;border:1px solid #fecaca;border-radius:10px;padding:16px;">
      <p style="margin:0;color:#475569;">Nội dung cảnh báo hoặc lưu ý quan trọng.</p>
    </div>
  </div>
</div>
```

---

## 10. cta_dreamdeco

Call-to-action cho DreamDeco. Color: **sky** (nhẹ hơn summary).

```html
<div class="my-10 rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-5 md:p-6 shadow-sm"
     style="margin:40px 0;padding:24px;background:linear-gradient(135deg,#eff6ff,#fff);border:1px solid #bae6fd;border-radius:14px;box-shadow:0 1px 3px rgba(15,23,42,0.08);">
  <h3 class="mt-0 mb-2 text-lg font-semibold"
      style="margin:0 0 8px;font-size:1.125rem;font-weight:700;color:#0f172a;">Thử trước bằng DreamDeco</h3>
  <p style="margin:0 0 16px;color:#475569;font-size:14px;">Mô tả ngắn về cách DreamDeco giúp ích cho bài viết này.</p>
  <a href="https://dreamdeco.vn" target="_blank"
     class="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white"
     style="display:inline-flex;padding:8px 16px;background:#0284c7;color:#fff;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;">
    Khám phá DreamDeco →
  </a>
</div>
```

---

## Nguyên tắc chung

1. **Dual approach**: Mọi element CẦN CẢ Tailwind classes VÀ inline style fallback
2. **Color uniqueness**: KHÔNG dùng cùng color scheme cho 2 modules trong 1 bài. Rotate qua: sky → emerald → amber → violet → pink → slate
3. **Spacing**: Mỗi module `margin:40px 0` (class `my-10`)
4. **Border radius**: wrapper `14px`, inner cards `10px`, pills `999px`, images `12px`
5. **Shadow**: `0 1px 3px rgba(15,23,42,0.06)` cho tất cả modules
6. **Badge pattern**: Luôn có badge pill ở đầu module với `border-radius:999px;background:#fff;font-size:12px;font-weight:700`
7. **Responsive**: Dùng `grid` + `auto-fit` + `minmax` cho multi-column layouts
8. **Inner cards**: `background:#fff;border:1px solid [color-100];border-radius:10px;padding:16px`
9. **Numbered items**: Dùng `01.`, `02.`, `03.` cho checklist items
10. **Không empty containers**: Mỗi module phải có data thực từ draft
