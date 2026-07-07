# 📋 Checklist tổng hợp yêu cầu từ buổi họp với cô Châu

> Nguồn: buổi họp review luận văn & Google Form khảo sát  
> File gốc: `review_thiese-vi-VN.docx`

---

## 🅰️ PHẦN 1: Chỉnh sửa Google Form khảo sát

### 🔹 Nguyên tắc chung
- [ ] **Bổ sung hình ảnh minh họa** cho mỗi câu hỏi so sánh — người tham gia phải nhìn thấy ảnh trực tiếp mới đánh giá được, tránh bắt họ nhớ ảnh phía trên.
- [ ] Với mỗi phương pháp/mode, **kèm ảnh input + ảnh output** để người dùng chấm điểm hoặc chọn cái họ thích.

### 🔹 Phần 1 – Thông tin nhân khẩu
- [x] **OK, không cần sửa** — đã bao gồm độ tuổi, mức độ quan tâm, hiểu biết về lĩnh vực.

### 🔹 Phần 2 – So sánh ảnh chuyển đổi (QUAN TRỌNG)
- [ ] **Bỏ so sánh với GAN v3 gốc** (vì đó không phải đóng góp của mình, chỉ chạy lại code người ta).
- [ ] **Thay= so sánh 3 ảnh**:
  - Ảnh **Input** (ảnh gốc)
  - Ảnh **Lens mode** (chưa xử lý riêng khuôn mặt)
  - Ảnh **Hybrid mode / Harris 1** (có tách và xử lý riêng khuôn mặt = đóng góp của mình)
- [ ] **Cách bố trí ảnh**: phóng to khuôn mặt và **nhét vào góc trên bên trái/phải** của ảnh chính (đồng nhất vị trí), thay vì tách riêng khó nhìn.
- [ ] Cung cấp **5–7 bộ ảnh** (không phải 1 bộ) để đảm bảo tính thống kê, sau đó tính trung bình.
- [ ] **Không hỏi về "bảo toàn màu sắc/đường nét"** ở phần này vì đó là của nền tảng DTGAN, không phải đóng góp của mình.

### 🔹 Phần 3 – Ảnh nghiêng
- [ ] **Gộp vào Phần 2** — không tách riêng ảnh thẳng/nghiêng vì đều thuộc xử lý khuôn mặt.
- [ ] Thêm nhiều loại input đa dạng: ảnh đơn, ảnh nhóm nhiều người, ảnh nghiêng…

### 🔹 Phần 4 – Đánh giá module trích xuất khuôn mặt
- [ ] **Tách riêng thành bộ câu hỏi cho nhóm chuyên môn** (kỹ sư, lập trình viên, nhiếp ảnh gia, người sáng tạo nội dung) — người dùng thường không hiểu kỹ thuật bên trong.
- [ ] **Bỏ câu 4.1 "so sánh ảnh"** (đã hỏi ở phần trên).
- [ ] **Câu 4.3 (trích xuất đủ tóc, vai, gáy)**: bổ sung hình ảnh minh họa để người ta biết đâu là "đủ".
- [ ] Tập trung vào các tiêu chí: **mắt, biểu cảm, tóc tai, kết cấu da, identity**.

### 🔹 Phần 5 – So sánh với phương pháp khác (TikTok, Snapchat…)
- [ ] **Bổ sung bộ ảnh dài**: mỗi cột là output của một phương pháp (TikTok, Snapchat, phương pháp khác, và của mình) để người dùng chọn cái thích nhất.
- [ ] **Tiêu chí đánh giá phải trùng khớp với phần trên**: mắt, biểu cảm, tóc tai (đồng bộ).

### 🔹 Phần 6 – Ứng dụng
- [ ] **Bỏ câu hỏi "sẵn sàng chờ bao lâu"** — cái này đo được= định lượng (đo giây), không cần hỏi user.

### 🔹 Phần 7 – Ý kiến & góp ý
- [ ] **Rút gọn còn 2 câu hỏi mở**:
  1. Ưu điểm nổi bật của hệ thống là gì?
  2. Nhược điểm cần cải thiện là gì?
- [ ] **Bỏ câu hỏi về style** (vì luận văn chỉ có 2 style, không phải trọng tâm).
- [ ] **Câu cho điểm tổng thể**: giữ lại được.

---

## 🅱️ PHẦN 2: Chỉnh sửa luận văn

### 🔹 Nhận xét tổng thể về cách viết
- [ ] **Chuyển từ dạng liệt kê (gạch đầu dòng) sang văn xuôi**, viết thành đoạn có dẫn dắt, phân tích, bình luận — không viết như báo cáo kỹ thuật.
- [ ] Với ưu điểm/nhược điểm cũng phải viết thành đoạn văn có bình luận, không chỉ liệt kê.

### 🔹 Rà soát thuật ngữ
- [ ] **Thuật ngữ "artifact"**: đổi thành **"lỗi đồ họa"** (không dùng cách dịch hiện tại).
- [ ] **Bỏ từ "tiền đề"** (trang 23) — thay= "theo tài liệu/công trình này…".
- [ ] **Tránh dùng các từ toán học** như "định lý", "bổ đề", "tiền đề" trừ khi thực sự chứng minh được (dễ bị hỏi và trượt).
- [ ] **Thuật ngữ tiếng Anh**: viết **tiếng Việt trước, mở ngoặc tiếng Anh** phía sau.

### 🔹 Cách trình bày công thức & mô tả kỹ thuật
- [ ] **Không viết dạng code** kiểu `I₁ × I₂ → I₃` — phải diễn giải= lời văn (semantic).
- [ ] Ví dụ `ReLU(128)`: diễn giải là "hàm kích hoạt ReLU với kích thước…".
- [ ] **Định nghĩa ký hiệu ngay trước khi dùng**, đừng để độc giả phải tra ngược/xuôi xa.
- [ ] **"Bản đồ đặc trưng"** — nói rõ đại diện cho cái gì (màu sắc/identity/emotion), không viết chung chung.
- [ ] Tham số **γ, β (gamma, beta)**: định nghĩa lại ngay tại chỗ dùng, không để độc giả phải tìm xa.

### 🔹 Cấu trúc chương/mục
- [ ] **Không tách mục quá nhỏ** (2.3.1, 2.3.2 quá ngắn → gộp lại). Tối đa 3 tầng nhưng mỗi mục phải đủ nội dung.
- [ ] **Hình 2.4 (kiến trúc GAN)**: chuyển lên phía trên, không để ở mục Loss function.
- [ ] Trong mục **Loss function**: khoanh vùng các loss trên hình và diễn giải từng loss, đổi tiêu đề thành "**Các loss được sử dụng trong kiến trúc**".
- [ ] Với mỗi hàm loss, viết theo **format thống nhất**: Tên → Ý nghĩa/tác dụng → Công thức → Giải thích.

### 🔹 Phần đánh giá / thực nghiệm
- [ ] **Bộ dữ liệu anime**: bổ sung **nguồn gốc, số lượng, phong cách** cho 2 tập dữ liệu.
- [ ] **Ảnh input huấn luyện**: mô tả cụ thể — nguồn X lấy bao nhiêu ảnh, nguồn Y bao nhiêu ảnh, tổng bao nhiêu.
- [ ] **Chỉ số đánh giá (FID, PSNR, LPIPS…)**: bổ sung **công thức đầy đủ** cho từng chỉ số.
- [ ] **Ảnh minh họa kết quả**:
  - Trong luận văn: mỗi nhóm ảnh (đơn/nhiều người/nghiêng) tăng lên **2 ảnh** thay vì 1.
  - Tạo **Phụ lục A** = link folder trên Google Drive chứa **10 ảnh input–output mỗi nhóm**, đánh chỉ mục cẩn thận.

### 🔹 Làm rõ đóng góp (contribution)
- [ ] **Viết lại rõ contribution** — hiện tại đang không phân biệt được đâu là code có sẳn (pretrained backbone), đâu là phần mình huấn luyện lại.
- [ ] Làm nổi bật 3 đóng góp chính:
  1. **Tách khuôn mặt** (dùng RetinaFace hoặc backbone nhẹ)
  2. **Xử lý riêng khuôn mặt** (huấn luyện lại phần detect 5 điểm: 2 mắt, mũi, 2 đầu môi)
  3. **Ghép/vá vùng biên** để đồng bộ về ánh sáng, đường nét, màu sắc với background
- [ ] Diễn đạt lại phần này để dùng cho **Chương 1** (nêu contribution mạnh mẽ hơn).

---

## 🅲️ PHẦN 3: Lịch trình & tiến độ

- [ ] **Đăng ký seminar**: hạn **26/6**
- [ ] **Seminar (5–7 phút)**: báo cáo tiến độ — bài toán, nền tảng, đóng góp, mô hình huấn luyện, kết quả, web, khảo sát, số chương đã viết.
- [ ] **Trước seminar**: gửi cô Xem nội dung định báo cáo.
- [ ] **Bảo vệ**: từ **24/8 – 13/9** (nửa cuối tháng 8) → có đủ thời gian hoàn thiện khảo sát.
- [ ] **Thứ tự làm việc**:
  1. Sửa form khảo sát → gửi cô Xem lại
  2. Triển khai khảo sát càng sớm càng tốt (càng nhiều feedback càng khách quan)
  3. Song song sửa luận văn theo góp ý
  4. Tổng hợp số liệu → đưa vào luận văn
