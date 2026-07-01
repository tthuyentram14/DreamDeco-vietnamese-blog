# Review Checklist — 9 Focused Checks

## Check 1: Độ dài public body

- Strip tất cả HTML tags, entities, scripts, styles từ `content_html`
- Đếm ký tự Unicode còn lại (chỉ text reader-facing)
- **FAIL** nếu < 8,000 ký tự
- **WARN** nếu > 12,000 ký tự (kiểm tra có padding không)

## Check 2: Package completeness

Required fields trong JSON:

```
title             — string, không rỗng
slug              — string, không rỗng
content_html      — string, không rỗng
meta_description  — string, không rỗng
excerpt           — string, không rỗng
category          — string, 1 trong 6 giá trị
thumbnail_image   — object với file_path, alt_text, role
content_images    — array, 2-4 items, mỗi item có file_path
keyword_research  — object với primary_keyword
```

**FAIL** nếu thiếu bất kỳ field nào.

## Check 3: Category validity

Phải là 1 trong:
- `news_magazine`
- `global_local_styles`
- `budget_scale`
- `lifestyle_age`
- `dreamdeco_guide`
- `consumer_guide`

**FAIL** nếu giá trị khác.

## Check 4: Image integrity

1. `thumbnail_image.file_path` phải reference file thực (kiểm tra path hợp lệ)
2. Mỗi `content_images[].file_path` phải reference file thực
3. `thumbnail_image.file_path` KHÔNG được xuất hiện như `<img src="...">` trong `content_html`
4. Content images referenced trong HTML phải match `content_images` array
5. Không có `featured_image` riêng (DreamDeco dùng thumbnail)

**FAIL** nếu vi phạm bất kỳ điều nào.

## Check 5: CSS standards

Scan `content_html` cho:
- Hardcoded hex colors: regex `#[0-9A-Fa-f]{3,8}` (ngoại trừ material palette swatches)
- Hardcoded radius: `border-radius: \d+px`
- Hardcoded shadows: `box-shadow:` không chứa `var(`
- JavaScript, `<script>`, React components, external CSS imports

**FAIL** nếu có hardcoded values ngoài material swatches.

Cách phân biệt swatch vs hardcode:
- Swatch: nằm trong element nhỏ (width/height <= 5rem), có context palette/color/material
- Hardcode: áp dụng cho card, section, background lớn

## Check 6: Meaning-first spot-check

Chọn 3 đoạn không liền nhau từ body text. Mỗi đoạn phải:
- Nêu tình huống, vị trí, vấn đề, đánh đổi, điều cần kiểm tra, hoặc hành động cụ thể
- Không phải câu chung chung có thể áp dụng cho bất kỳ bài nội thất nào

**FAIL** nếu bất kỳ đoạn nào chỉ là filler/vague prose.

## Check 7: Anti-AI spot-check (lexical + structural)

### 7a. Lexical — top 10 S1 patterns

Scan `content_html` cho:

1. "Hãy cùng khám phá" / "Hãy cùng tìm hiểu"
2. "Không chỉ...mà còn..."
3. "thực sự rất"
4. "hoàn toàn mới mẻ"
5. 3+ câu liên tiếp bắt đầu cùng pattern
6. "Hy vọng bài viết" / "Hy vọng thông tin"
7. "Bạn đã bao giờ"
8. "Vậy thì"
9. "Đặc biệt hơn"
10. "Tóm lại, có thể thấy"

**FAIL** nếu bất kỳ pattern nào xuất hiện.

### 7b. Structural — nhịp điệu bài (xem chi tiết tại `dreamdeco-vietnamese-writer/references/vietnamese-writing-standards.md` mục S4)

Lexical scan không bắt được dấu hiệu AI nằm ở cách dựng bài. Đọc lướt toàn bài và kiểm tra 4 điểm sau:

1. **Lặp khuôn mở đoạn**: có 2+ đoạn liên tiếp mở bằng cùng cấu trúc không (vd "Ở bước X... Ở bước Y...", "Với A... Với B...")? → **FAIL** nếu có.
2. **Mật độ khuyên-mệnh lệnh**: ước lượng nhanh tỷ lệ câu chứa "nên/cần/phải/cần được" trên tổng số câu trong 2-3 đoạn mẫu. → **FAIL** nếu ước lượng vượt ~40% (bài đọc như liệt kê lời khuyên liên tục, thiếu câu trần thuật/so sánh xen kẽ).
3. **Đối xứng list/bảng**: nếu bài có 3+ list hoặc bảng, kiểm tra số mục mỗi cái — đều tăm tắp cùng một số (vd tất cả đúng 5 mục) là dấu hiệu cần xem lại. → **WARN** (không tự FAIL, nhưng cộng dồn nếu đi kèm vi phạm khác ở check này).
4. **Nhịp câu quá đều**: lấy 1 đoạn dài bất kỳ, ước lượng độ dài các câu — nếu gần như mọi câu đều rơi đúng khung 15-30 từ, không có câu rất ngắn hay câu dài phức hợp xen kẽ → **WARN**.

**FAIL** nếu mục 1 hoặc 2 vi phạm. **WARN** (note trong output, không chặn PASS một mình) nếu chỉ mục 3 hoặc 4 vi phạm — nhưng nếu cả 3 và 4 cùng vi phạm, nâng thành **FAIL** vì đó là dấu hiệu rõ của giọng máy tạo.

## Check 8: SEO sanity

| Field | Rule |
|---|---|
| `title` | < 70 ký tự |
| `meta_description` | < 160 ký tự |
| `slug` | Lowercase, chỉ [a-z0-9-], không dấu tiếng Việt |
| `primary_keyword` | Xuất hiện trong title hoặc H2 đầu tiên |

**FAIL** nếu vi phạm.

## Check 9: AI disclosure

`content_html` phải chứa text:
```
Written by AI - Nội dung được tạo bởi AI dựa trên quá trình tổng hợp, biên tập và kiểm tra thông tin từ nhiều nguồn tham khảo.
```

**FAIL** nếu thiếu, bị cắt, hoặc mojibake.

---

## Verdict logic

- **PASS**: Tất cả 9 checks pass
- **REVISE**: Bất kỳ check nào FAIL
  - Issues thuộc check 6, 7: `revision_target: "writer"`
  - Issues thuộc check 2, 4, 5, 9: `revision_target: "composer"`
  - Issues thuộc check 1: `revision_target: "writer"` (cần viết thêm nội dung)
  - Issues thuộc check 3, 8: `revision_target: "writer"` hoặc `"composer"` tùy nguyên nhân

## Content-type specific checks (bổ sung, không thay thế 9 checks chính)

| Content type | Kiểm tra thêm |
|---|---|
| `news` | Có stat/trend module khi có số liệu |
| `real_estate_move_in` | Danh sách 3+ dự án → phải dùng data_table |
| `style` | So sánh phong cách → cần comparison_grid hoặc material_palette |
| `budget` | Claim tiết kiệm → cần savings_infographic hoặc stat_cards |
| `lifestyle` | Nhiều nhóm người dùng → cần bảng hoặc comparison_grid |
| `dreamdeco_guide` | 3+ bước → cần step_flow |
| `consumer_guide` | Có red flags → cần checklist hoặc red-flag cards |

Thiếu module phù hợp = **WARN** (không FAIL, nhưng khuyến nghị sửa).
