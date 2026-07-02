# Vietnamese Writing Standards

Tài liệu này gộp 3 tiêu chuẩn thành 1: anti-AI patterns, ngữ pháp tiếng Việt, và meaning-first principle. Dùng chủ yếu ở lượt biên tập sau draft; trong lúc viết, ưu tiên mạch ý và tình huống thật.

---

## 1. Anti-AI Patterns — Danh sách KHÔNG VIẾT

### QA gate — khớp substring nguyên văn, không xét ngữ cảnh

`scripts/qa-single-blog-package.mjs` fail bài ngay khi `content_html` chứa nguyên văn 1 trong 10 cụm dưới đây, bất kể ngữ cảnh câu — kể cả khi cụm đứng riêng, không đi kèm phần diễn giải quen thuộc (vd. "Không chỉ" bị chặn dù không có "mà còn" theo sau). Tránh tuyệt đối cả 10 cụm này, không chỉ tránh cấu trúc rộng hơn ở S1-S3 bên dưới:

- "Hãy cùng khám phá"
- "Hãy cùng tìm hiểu"
- "Không chỉ"
- "thực sự rất"
- "hoàn toàn mới mẻ"
- "Hy vọng bài viết"
- "Bạn đã bao giờ"
- "Vậy thì"
- "Đặc biệt hơn"
- "Tóm lại, có thể thấy"

### Mức S1 (Critical) — Một lần xuất hiện đã là dấu hiệu AI

**Cụm mở đầu công thức:**
- ❌ "Ngày nay" / "Trong thời đại" / "Trong bối cảnh hiện nay"
- ❌ "Hãy cùng khám phá" / "Hãy cùng tìm hiểu"
- ❌ "Bạn đã bao giờ nghĩ đến" / "Bạn có biết rằng"

**Cụm kết luận AI:**
- ❌ "Hy vọng bài viết giúp bạn" / "Hy vọng thông tin trên hữu ích"
- ❌ "Tóm lại, có thể thấy rằng"
- ❌ "Trên đây là những chia sẻ"

**Cấu trúc AI đặc trưng:**
- ❌ "Không chỉ... mà còn..." (khi dùng để nối 2 ý bất kỳ)
- ❌ "Điều này có nghĩa là" / "Điều này cho thấy"
- ❌ "Đóng vai trò quan trọng trong"

### Mức S2 (Strong) — 1-2 lần chấp nhận, 3+ lần là dấu hiệu AI

**Từ hype/intensifier rỗng:**
- ❌ "thực sự rất" / "hoàn toàn mới mẻ" / "vô cùng quan trọng"
- ❌ "tuyệt vời" / "tối ưu" / "hoàn hảo" (khi không kèm chi tiết cụ thể)
- ❌ "sang trọng, tinh tế, hiện đại" (tricolon tính từ)

**Cấu trúc lặp:**
- ❌ 3+ câu liên tiếp bắt đầu cùng pattern
- ❌ "Đặc biệt hơn" / "Đáng chú ý hơn" / "Quan trọng hơn" liên tiếp
- ❌ "một cách + tính từ" lặp nhiều lần ("một cách hiệu quả", "một cách tối ưu")

**Giọng dịch (translationese):**
- ❌ "Được" bị động quá nhiều ("được thiết kế", "được trang bị", "được bố trí" liên tiếp)
- ❌ Chuỗi "của" dài ("sự kết hợp của vật liệu của phòng khách của căn hộ")
- ❌ "Trong khi" dùng sai nghĩa (dùng như "whereas" tiếng Anh)
- ❌ "Mang lại" lặp nhiều lần trong bài
- ❌ "Nhằm mục đích" (dùng "để" cho ngắn)

### Mức S3 (Weak) — Đơn lẻ ổn, kết hợp nhiều thì có vấn đề

- ❌ Dấu phẩy quá nhiều trong 1 câu (5+ dấu phẩy)
- ❌ Em dash (—) dùng liên tục
- ❌ Ba chấm (...) cuối đoạn
- ❌ "Vậy thì" mở đầu đoạn

### Mức S4 (Structural) — nhịp điệu bài, không phải từ ngữ

Đây là dấu hiệu AI mà Ctrl+F không bắt được, vì không nằm ở cụm từ cấm mà ở cách bài được dựng. Một bài có thể không chứa cụm nào ở S1-S3 và vẫn đọc ra AI vì lý do này.

**Lặp cấu trúc mở đoạn:**
- ❌ 2+ đoạn liên tiếp (không chỉ câu) mở bằng cùng khuôn: "Ở bước X... Ở bước Y... Ở bước Z...", "Với A... Với B...", "Khi X... Khi Y..."
- ✅ Sửa: đổi khuôn câu mở, hoặc gộp 2 đoạn lại nếu ý liên quan chặt

**Mật độ câu mệnh lệnh-khuyên quá cao:**
- ❌ Hơn ~40% số câu trong bài chứa "nên", "cần", "phải", "cần được" — bài đọc như cẩm nang hướng dẫn liên tục, không có câu trần thuật/quan sát/so sánh xen kẽ
- ✅ Sửa: thay một phần câu khuyên bằng câu nêu hiện tượng, hệ quả, hoặc so sánh thực tế (không ra lệnh)

**"Được" bị động rải rác (không chỉ liên tiếp):**
- S2 đã cấm "được" liên tiếp; ở đây là mật độ tổng thể — quá 8 lần "được [động từ]" trên mỗi 1.000 từ, dù rải rác khắp bài, vẫn tạo giọng dịch
- ✅ Sửa: chuyển một phần sang câu chủ động ("Chủ nhà chọn..." thay vì "...được chọn bởi chủ nhà")

**Danh sách/bảng đối xứng tuyệt đối:**
- ❌ Mọi list trong bài đều tròn đúng 5 mục, mọi bảng đều đúng 3 cột, mọi H2 đều dài bằng nhau — sự cân đối hoàn hảo này tự nó là tín hiệu máy tạo, vì người viết thật hiếm khi liệt kê đều tăm tắp ở mọi section
- ✅ Sửa: để độ dài/số mục lệch tự nhiên theo nội dung thực tế (4 mục ở chỗ này, 6 mục ở chỗ khác, có chỗ không cần liệt kê mà viết văn xuôi)

**Độ dài câu quá đều (monotone cadence):**
- ❌ Hầu hết câu đều rơi đúng vào khung 15-30 từ như rule khuyến nghị — tuân thủ tuyệt đối khung này lại tạo nhịp đều giả tạo
- ✅ Sửa: chủ động xen câu rất ngắn (dưới 8 từ, dùng để nhấn) và thỉnh thoảng một câu dài phức hợp, giống cách biên tập viên thật viết — khung 15-30 từ là phổ biến nhất chứ không phải bắt buộc cho mọi câu

### Thay thế bằng gì?

| AI pattern | Thay bằng |
|---|---|
| "Ngày nay, xu hướng nội thất..." | Mở bằng fact/tình huống cụ thể |
| "Không chỉ đẹp mà còn tiện dụng" | Nêu cụ thể: "Kệ mở vừa trưng đồ vừa phân chia phòng khách và bếp" |
| "thực sự rất quan trọng" | Bỏ, hoặc nêu hậu quả: "Chọn sai kích thước sofa — lối đi còn 50 cm, không đủ cho xe đẩy em bé" |
| "Hy vọng bài viết giúp bạn" | Kết bằng hành động cụ thể: "Bước đầu tiên: đo phòng khách trước khi xem sofa" |
| "sang trọng, tinh tế, hiện đại" | Chọn 1 từ + giải thích: "Gạch terrazzo tông xám mang lại vẻ hiện đại mà vẫn dễ lau" |

---

## 2. Ngữ pháp tiếng Việt

### Dấu thanh (hỏi/ngã)

Quy tắc nhớ: **Ngang-sắc-hỏi, huyền-ngã-nặng** (nhóm cùng thanh điệu).

Lỗi thường gặp:

| ❌ Sai | ✅ Đúng | Ghi chú |
|---|---|---|
| sử dụng | sử dụng | Đúng rồi, không sửa |
| xử lý | xử lý | Đúng rồi |
| kỹ thuật | kĩ thuật hoặc kỹ thuật | Cả hai chấp nhận, nhất quán trong bài |
| nghỉ rằng | nghĩ rằng | nghĩ = suy nghĩ, nghỉ = nghỉ ngơi |

### Phụ âm đầu

| Cặp | Ví dụ cần phân biệt |
|---|---|
| d/gi | dành (để dành) vs giành (giành giải) |
| s/x | sáng (ánh sáng) vs xáng (xáng cạp) |
| ch/tr | chuyện (câu chuyện) vs truyện (truyện ngắn) |
| n/l | nên (nên làm) vs lên (đi lên) |

### Loại từ (classifier)

| ❌ Sai | ✅ Đúng |
|---|---|
| một con bàn | một cái bàn |
| một cái mèo | một con mèo |
| một chiếc ghế sofa | một bộ ghế sofa (nếu là bộ) hoặc một chiếc ghế sofa (nếu là 1 chiếc) |

### Dấu câu

- Dấu phẩy: ngắt ý, không quá 4 dấu phẩy/câu
- Dấu chấm phẩy: chỉ dùng khi liệt kê phức tạp
- Ngoặc kép: cho trích dẫn trực tiếp, không lạm dụng cho nhấn mạnh
- Không dùng dấu chấm than (!) trong bài editorial (trừ quote)

### Nhất quán phong cách

- Chọn 1 cách viết và giữ xuyên suốt: "DreamDeco" (không "Dream Deco", "dreamdeco")
- Số: viết chữ cho 1-10, viết số cho 11+, luôn viết số cho kích thước/giá
- Đơn vị: "m2" hoặc "m²" — nhất quán, không trộn
- Ngày: DD/MM/YYYY hoặc "tháng 6/2026" — nhất quán

---

## 3. Meaning-First Principle

**Quy tắc:** Mỗi đoạn phải có thông tin làm bài tiến lên. Câu chủ lực trong đoạn nên chứa ít nhất 1 trong các yếu tố sau:

- **Tình huống cụ thể**: "Gia đình 4 người trong căn 70 m2"
- **Vị trí/không gian**: "Ban công hướng tây, tầng 15"
- **Vấn đề thực tế**: "Cửa tủ lạnh không mở hết vì sát tường bếp"
- **Đánh đổi**: "Sàn gỗ đẹp hơn gạch nhưng phồng khi ẩm cao"
- **Điều cần kiểm tra**: "Đo khoảng cách kéo ghế ra khỏi bàn — cần ít nhất 70 cm"
- **Hành động cụ thể**: "Dán mẫu sơn 30x30 cm lên tường, xem dưới đèn buổi tối trước khi chọn"

**Test:** Nếu xóa một câu hoặc cả đoạn mà bài không mất thông tin gì → phần đó thừa, phải viết lại hoặc xóa. Không cần ép mọi câu đều chứa số đo hoặc ví dụ; câu chuyển ý ngắn vẫn cần thiết nếu giúp nhịp đọc tự nhiên.

**Cụm vague cần tránh:**

| ❌ Vague | ✅ Cụ thể |
|---|---|
| "tạo cảm giác ấm áp cho không gian" | "Tường sơn cam đất phản chiếu ánh đèn vàng 3000K, phòng ấm hơn dù không bật sưởi" |
| "tối ưu hóa không gian sống" | "Kệ âm tường sâu 35 cm thay tủ đứng — phòng ngủ rộng thêm 60 cm chiều ngang" |
| "mang đến trải nghiệm thoải mái" | "Sofa góc L kê sát cửa sổ, ngồi đọc sách buổi chiều có gió và ánh sáng tự nhiên" |
| "phù hợp với phong cách sống hiện đại" | "Bàn ăn gập tường 80x60 cm — mở ra khi ăn, gập lại làm thêm 0,5 m2 lối đi vào bếp" |

**Từ/cụm bị cấm trong public body:**
- `đụng đồ`, `ra chất`, `mất mood`, `đổi mood`
- `theo tên gọi`, `tên phong cách rõ ràng`
- `cái áo khoác lên căn hộ`, `đi khỏi ví`
- English leakage không cần thiết: `entry` → khu cửa vào, `accent` → điểm nhấn, `moodboard` → bảng tham khảo, `showroom` → nhà mẫu

---

## Checklist nhanh sau khi có draft

1. Đọc lại 3 đoạn đầu — có mở bằng fact không?
2. Ctrl+F tìm top 10 cụm AI (danh sách S1 ở trên) — phải = 0
3. Đếm ký tự public body — >= 8,000?
4. Chọn 3 câu bất kỳ — mỗi câu có meaning cụ thể?
5. Dấu thanh, loại từ — đọc lại 1 lượt
6. Xưng hô nhất quán xuyên suốt?
7. Có đoạn nào liên tiếp mở cùng khuôn câu không? (S4)
8. Ước lượng tỷ lệ câu chứa nên/cần/phải — có quá 40% không? (S4)
9. List/bảng trong bài có đều tăm tắp số mục không, hay lệch tự nhiên? (S4)
