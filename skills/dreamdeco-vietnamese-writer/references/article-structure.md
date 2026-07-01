# Article Structure

## Yêu cầu độ dài

- **Hard gate**: 8,000-12,000 ký tự tiếng Việt public body
- Chỉ đếm text reader-facing: loại trừ HTML tags, JSON metadata, image URLs, schema fields, source notes nội bộ
- Bài dưới 8,000 ký tự = chưa hoàn thành, không handoff
- Không pad filler để đạt số — mỗi section phải mang giá trị đọc

## Section-length budget

Dùng length budget sau khi đã có mạch bài sơ bộ. Mục tiêu là tránh bài thiếu chiều sâu, không phải ép mọi H2 dài đều nhau. Nếu một section chỉ cần 700 ký tự nhưng section khác cần 1,800 ký tự để giải thích đánh đổi thật, ưu tiên logic đọc.

### Template budget theo content type

**Style article (9,000-11,000 ký tự):**
```
Mở bài (fact/tình huống):              500-700
H2: Đặc trưng phong cách:           1,500-2,000
H2: Bảng màu và vật liệu:           1,500-2,000
H2: Áp dụng cho căn hộ Việt Nam:     1,500-2,000
H2: So sánh với phong cách khác:     1,000-1,500
H2: Sai lầm thường gặp:               800-1,200
Góc DreamDeco + CTA:                   500-800
Visual modules text:                    500-800
```

**Budget article (9,000-11,000 ký tự):**
```
Mở bài (range giá thực tế):            500-700
H2: Phân bổ ngân sách:              1,500-2,000
H2: So sánh lựa chọn:               1,500-2,000
H2: Cách tiết kiệm thực tế:         1,500-2,000
H2: Bẫy chi phí cần tránh:          1,000-1,500
H2: Bảng ưu tiên mua sắm:            800-1,200
Góc DreamDeco + CTA:                   500-800
Visual modules text:                    500-800
```

**How-to/Guide (8,000-10,000 ký tự):**
```
Mở bài (vấn đề cụ thể):               400-600
H2: Bước 1:                         1,200-1,800
H2: Bước 2:                         1,200-1,800
H2: Bước 3:                         1,200-1,800
H2: Lỗi thường gặp:                   800-1,200
H2: Checklist kiểm tra:               600-1,000
Góc DreamDeco + CTA:                   500-700
Visual modules text:                    400-600
```

## Cấu trúc mở bài

Luôn mở bằng 1 trong 3 cách:

1. **Fact cụ thể**: "Căn hộ 65 m2 tại quận 7..."
2. **Tình huống người đọc**: "Gia đình 4 người trong căn 70 m2: hai phòng ngủ nhưng chỉ một góc học bài."
3. **Số liệu thực tế**: "Hơn 60% chủ nhà sửa lại phòng bếp trong 2 năm đầu, phần lớn vì chọn sai kích thước tủ."

KHÔNG mở bằng: câu hỏi tu từ, câu chung chung, quote inspirational.

## Cấu trúc section

Mỗi H2 section cần có vai trò rõ trong bài, nhưng không bắt buộc đi cùng một công thức. Tùy nội dung, section có thể là:

1. Một tình huống thực và cách xử lý
2. Một so sánh giữa hai lựa chọn
3. Một checklist ngắn
4. Một cảnh báo rủi ro
5. Một ví dụ layout/vật liệu/ngân sách

Ít nhất phần lớn section phải có chi tiết cụ thể: ví dụ thực tế, số liệu từ brief, vật liệu, kích thước, điều kiện ánh sáng, khí hậu, thói quen sinh hoạt hoặc đánh đổi chi phí.

Không mở section bằng: "Tiếp theo, chúng ta sẽ...", "Một điều quan trọng không kém là...", "Đặc biệt hơn..."

## Kết bài

- 1-2 câu tóm tắt hành động cụ thể (không lặp mở bài)
- CTA DreamDeco nếu phù hợp (1-2 câu, gắn nội dung bài)
- Không dùng: "Hy vọng bài viết giúp bạn", "Trên đây là những chia sẻ"

## Visual module markers

Đánh dấu trong draft để HTML composer render:

```
[MODULE: data_table | key-name]
[MODULE: checklist_block | key-name]
[MODULE: step_flow | key-name]
[MODULE: timeline | key-name]
[MODULE: stat_cards | key-name]
[MODULE: comparison_grid | key-name]
[MODULE: material_palette | key-name]
[MODULE: savings_infographic | key-name]
[MODULE: bar_chart | key-name]
[MODULE: trend_cards | key-name]
```

### Khi nào dùng module nào

| Thông tin | Module |
|---|---|
| So sánh 3+ items (vật liệu, dự án, sản phẩm) | `data_table` |
| Danh sách kiểm tra trước khi làm/mua | `checklist_block` |
| Quy trình 3+ bước | `step_flow` |
| Sự kiện theo thời gian | `timeline` |
| Số liệu nổi bật (giá, diện tích, %) | `stat_cards` |
| So sánh 2 phương án | `comparison_grid` |
| Bảng màu/vật liệu | `material_palette` |
| Tiết kiệm chi phí | `savings_infographic` |
| So sánh tỷ lệ/phần trăm | `bar_chart` |
| Xu hướng đang lên/xuống | `trend_cards` |

**Quy tắc:** Dùng module khi nó làm thông tin dễ đọc hơn. Không biến mọi ý so sánh nhỏ thành bảng; nếu văn xuôi tự nhiên và rõ hơn, giữ văn xuôi.

## Image placement markers

```
[IMAGE: section-key | Mô tả ngắn cho image creator]
```

Ví dụ:
```
[IMAGE: phong-khach-japandi | Phòng khách căn hộ 65m2, gỗ sồi sáng, gốm thô, đèn trần thấp, tường trắng]
[IMAGE: ban-cong-cay-xanh | Ban công hướng tây với cau tiểu trâm và lưỡi hổ, chậu đất nung]
```

Mỗi bài cần: 1 thumbnail + 2-4 body images. Image placements đặt sau section liên quan.

## AI Disclosure

Mỗi bài kết thúc với ghi chú (để HTML composer render):

```
Written by AI - Nội dung được tạo bởi AI dựa trên quá trình tổng hợp, biên tập và kiểm tra thông tin từ nhiều nguồn tham khảo.
```
