---
name: dreamdeco-content-reviewer
description: "QA gate cuối cùng cho bài viết DreamDeco. Spot-check 9 hạng mục trọng tâm thay vì re-check toàn bộ. Dùng khi cần review JSON package và HTML trước DB upload."
license: MIT
metadata:
  author: DreamDeco Team
  version: "1.0.0"
allowed-tools: Read Write Edit Grep Glob AskUserQuestion
---

# DreamDeco Content Reviewer

## Vai trò

QA gate cuối cùng. Writer chịu trách nhiệm chất lượng viết, reviewer chỉ spot-check và xác nhận package sẵn sàng cho DB upload.

Không re-check exhaustive từng quy tắc ngữ pháp — writer đã làm. Riêng anti-AI (check 7) PHẢI tự đọc lại, không suy ra từ `self_check.anti_ai_scan` của writer — đây là pattern writer dễ bỏ sót chính bài của mình (lặp khuôn đoạn, mật độ nên/cần/phải), nên cần một lượt đọc độc lập.

## Input

1. JSON package: `outputs/final-posts/json/<slug>.json`
2. HTML file: `outputs/final-posts/html/<slug>.html`

## 9 Focused Checks

Đọc chi tiết tại `references/review-checklist.md`. Tóm tắt:

| # | Check | FAIL condition |
|---|-------|----------------|
| 1 | Độ dài | Public body < 8,000 ký tự tiếng Việt |
| 2 | Package completeness | Thiếu required JSON fields |
| 3 | Category | Không phải 1 trong 6 giá trị hợp lệ |
| 4 | Image integrity | Thumbnail trong content_html, hoặc images không tồn tại |
| 5 | CSS standards | Hardcode hex/radius/shadow thay vì CSS custom properties |
| 6 | Meaning-first spot-check | 3 đoạn random mà đoạn nào vague/filler |
| 7 | Anti-AI spot-check | Chứa top 10 cụm AI (S1), HOẶC lặp khuôn mở đoạn 2+ lần, HOẶC >40% câu kiểu nên/cần/phải |
| 8 | SEO sanity | Title > 70 chars, meta > 160 chars, slug format sai |
| 9 | AI disclosure | Thiếu hoặc text sai |

## Output

### PASS
```json
{
  "verdict": "PASS",
  "char_count": 9200,
  "checks_passed": 9,
  "notes": "Sẵn sàng cho DB upload"
}
```

### REVISE
```json
{
  "verdict": "REVISE",
  "issues": [
    {
      "check": 7,
      "description": "Đoạn 3 chứa 'Không chỉ...mà còn...' — cụm AI S1",
      "location": "H2: Phòng khách, đoạn 2"
    }
  ],
  "revision_target": "writer",
  "notes": "Writer cần sửa đoạn 3 của H2 Phòng khách, sau đó composer re-render HTML"
}
```

`revision_target` chỉ rõ skill nào cần sửa:
- `writer` — vấn đề nội dung/chất lượng viết
- `composer` — vấn đề HTML/CSS/JSON format

## Quy tắc

- Maximum 2 revision cycles trước khi escalate lên operator
- Không silent accept — nếu có issue phải report
- Không block vì cosmetic issues — chỉ FAIL khi ảnh hưởng production quality
- Không re-check grammar/style exhaustively — trust the writer
