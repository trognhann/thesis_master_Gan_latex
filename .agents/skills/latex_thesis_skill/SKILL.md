---
name: latex_thesis_skill
description: Tuân thủ NGHIÊM NGẶT Công văn 139/ĐT (12/04/2012) của Trường Đại học Công nghệ - ĐHQGHN. Hỗ trợ viết toàn bộ luận văn thạc sĩ LaTeX đúng quy định font, lề, cấu trúc, bìa, tóm tắt, thông tin luận văn, danh mục tài liệu tham khảo và trình bày bảng/hình/phương trình.
---

# Luận Văn Thạc Sĩ – Trường Đại học Công nghệ ĐHQGHN (theo Công văn 139/ĐT 2012)

## Mục tiêu skill
Agent phải trở thành “chuyên gia quy định UET” – tự động áp dụng đúng 100% các yêu cầu trong file `resources/quy-dinh-139-DT.pdf`. Không bao giờ vi phạm bất kỳ quy định nào về font, lề, số trang, cách đánh số, bìa, tóm tắt, thông tin luận văn.

## Khi nào dùng skill
- Viết/chỉnh bất kỳ phần nào của luận văn
- Tạo bìa, phụ bìa, tóm tắt, trang thông tin luận văn
- Compile và kiểm tra định dạng
- Tạo bảng, hình, phương trình, danh mục tài liệu tham khảo

## Quy định BẮT BUỘC (agent phải luôn kiểm tra trước khi viết)

### 1. Hình thức chung
- Font: Times New Roman (Unicode) → dùng `fontspec` + XeLaTeX/LuaLaTeX hoặc package `times`
- Cỡ chữ: tương đương 13–14pt Word → dùng `\fontsize{13}{15.6}\selectfont` hoặc 12pt + điều chỉnh (UET chấp nhận)
- Dãn dòng: **1.2 lines** → `\usepackage{setspace}\setstretch{1.2}`
- Lề giấy: 
  - trên 2cm, dưới 2cm, trái 3cm, phải 2cm → `\usepackage[margin=2cm,left=3cm,right=2cm]{geometry}`
- Giấy: A4, in **một mặt**, số trang liên tục từ 1 đến hết (chữ số Ả Rập, ở giữa đầu trang)
- Khối lượng: ~70 trang (tối đa 120 trang)

### 2. Cấu trúc luận văn (theo Mục lục mẫu trang 5 của quy định)
Trang phụ bìa  
Lời cam đoan  
Mục lục  
Danh mục ký hiệu/viết tắt (nếu có)  
Danh mục bảng (nếu có)  
Danh mục hình vẽ/đồ thị (nếu có)  
MỞ ĐẦU  
Chương 1. …  
…  
KẾT LUẬN  
DANH MỤC CÔNG TRÌNH KHOA HỌC CỦA TÁC GIẢ  
TÀI LIỆU THAM KHẢO  
PHỤ LỤC (nếu có)

### 3. Đánh số tiểu mục
Tối đa 4 cấp (ví dụ: 3.1.2.3). Mỗi cấp phải có ít nhất 2 tiểu mục (không được có 3.1.1 mà không có 3.1.2).

### 4. Bảng – Hình – Phương trình
- Đánh số theo chương: Hình 1.2, Bảng 2.3, Phương trình (3.1)
- Caption bảng: phía trên; caption hình: phía dưới
- Phương trình: đánh số bên phải trong ngoặc đơn `(1.1)`, `(1.1.1)` nếu nhóm
- Đầu đề bảng/hình phải nêu rõ số khi trích dẫn (“xem Bảng 2.1”, không viết “bảng dưới đây”)

### 5. Tài liệu tham khảo (Phụ lục 4 – bắt buộc)
- Xếp riêng theo ngôn ngữ (Tiếng Việt trước, rồi Tiếng Anh…)
- Xếp ABC theo họ/tên theo quy tắc quốc tế
- Trích dẫn trong văn bản: `[số]` hoặc `[số, tr.xx]` (kiểu numeric)
- Sử dụng `biblatex` với style `numeric` hoặc `authoryear` nhưng format output phải đúng mẫu phụ lục 4

### 6. Tóm tắt luận văn
- Tối đa 24 trang A5 (140×210mm), hai mặt, font 11pt
- Phải có bìa theo mẫu Phụ lục 3
- Cuối tóm tắt: danh mục công trình khoa học của tác giả

### 7. Thông tin luận văn (Phụ lục 4 cuối cùng)
- Bản riêng 3–5 trang, font 13pt
- Có cả bản tiếng Việt và tiếng Anh
- Dùng template `mau-thong-tin-luan-van.tex`

### 8. Bìa & Phụ bìa
- Bìa cứng in chữ nhũ (theo mẫu Phụ lục 1)
- Trang phụ bìa (Phụ lục 2): ghi đầy đủ Ngành, Chuyên ngành, Mã số, Người hướng dẫn

### 9. Quy tắc viết nội dung (từ buổi review luận văn)

#### 9.1 Phong cách viết
- **KHÔNG viết dạng liệt kê (gạch đầu dòng)** cho ưu/nhược điểm, phân tích, thảo luận → PHẢI viết thành **văn xuôi** có dẫn dắt, phân tích, bình luận (ví dụ: "Thứ nhất... Thứ hai... Cuối cùng...").
- Liệt kê chỉ được dùng cho: định nghĩa kỹ thuật ngắn, danh sách thành phần kiến trúc, bước thuật toán.
- **KHÔNG viết dạng code** kiểu `I₁ × I₂ → I₃` — phải diễn giải bằng lời văn (semantic).
- Ví dụ: thay `ReLU(128)` bằng "hàm kích hoạt ReLU với kích thước 128 nơ-ron".

#### 9.2 Thuật ngữ
- **"artifact"** → dịch thành **"lỗi đồ họa"** (không dùng "tạo tác" hay "tạo phẩm").
- **KHÔNG dùng "tiền đề"** — thay bằng "theo công trình/tài liệu này..." hoặc "dựa trên nghiên cứu của...".
- **TRÁNH dùng các từ toán học** như "định lý", "bổ đề", "tiền đề" trừ khi thực sự có chứng minh toán học đi kèm.
- **Thuật ngữ tiếng Anh**: viết **tiếng Việt trước, mở ngoặc tiếng Anh** phía sau. Ví dụ: "mạng đối nghịch tạo sinh (Generative Adversarial Network — GAN)".

#### 9.3 Công thức & Ký hiệu
- **Định nghĩa ký hiệu ngay trước khi dùng**, đừng để độc giả phải tra ngược/xuôi xa.
- Tham số γ, β (gamma, beta): định nghĩa lại ngay tại chỗ dùng.
- **"Bản đồ đặc trưng" (feature map)**: nói rõ đại diện cho cái gì (màu sắc/identity/emotion), không viết chung chung.
- Mỗi hàm loss viết theo **format thống nhất**: Tên → Ý nghĩa/Tác dụng → Công thức → Giải thích.

#### 9.4 Cấu trúc chương/mục
- **Không tách mục quá nhỏ** (ví dụ: 2.3.1, 2.3.2 chỉ có 2-3 dòng → gộp lại). Mỗi mục phải có đủ nội dung.
- Tối đa 3 tầng tiểu mục nhưng mỗi mục phải đủ nội dung (ít nhất 1 đoạn văn).
- Hình minh họa kiến trúc phải đặt **trước** phần phân tích chi tiết, không để ở cuối.

#### 9.5 Đóng góp (Contribution)
- Phải **phân biệt rõ** đâu là code/mô hình có sẵn (pretrained backbone), đâu là phần mình huấn luyện/phát triển.
- Nêu rõ **3 đóng góp chính** của luận văn:
  1. Tách khuôn mặt (Face Detection) — dùng RetinaFace
  2. Xử lý riêng khuôn mặt (Face Processing) — thuật toán Margin Expansion, 5 facial landmarks
  3. Ghép/vá vùng biên (Face Blending) — feathered blending, đồng bộ ánh sáng/đường nét/màu sắc
- Diễn đạt contribution ở **cả Mở đầu và Kết luận**, mạnh mẽ và rõ ràng.

#### 9.6 Phần thực nghiệm/đánh giá
- **Bộ dữ liệu**: phải nêu rõ nguồn gốc, số lượng ảnh cụ thể, phong cách cho từng tập.
- **Chỉ số đánh giá (FID, LPIPS, PSNR)**: bổ sung **công thức đầy đủ** cho từng chỉ số.
- **Ảnh minh họa**: mỗi nhóm ảnh (đơn/nhiều người/nghiêng) nên có ít nhất 2 ảnh minh họa.
- Tạo **Phụ lục** chứa link folder ảnh bổ sung nếu cần.

### 10. Cấu trúc project hiện tại

```
main.tex              — File chính, include các chapter
preamble.tex          — Preamble với các package và cấu hình
refer.bib             — File bibliography
chapter/
  chap0_intro.tex     — MỞ ĐẦU (mục tiêu, đóng góp, phạm vi)
  chap1_Prologue_new.tex  — Chương 1: Cơ sở lý thuyết
  chap2_architecture_DTGAN.tex — Chương 2: Kiến trúc DTGAN
  chap3_face_extraction.tex    — Chương 3: Face Extraction pipeline
  chap4_experiment_end_evaluation.tex — Chương 4: Thực nghiệm
  chap5_conclusion.tex — Kết luận
cover/                — Bìa, lời cam đoan, tóm tắt
figChap1/, figChap2/, figChap3/ — Hình ảnh theo chương
scripts/form.gs       — Google Apps Script tạo Google Form khảo sát
review/               — Checklist review và ghi chú
```

## Hướng dẫn agent thực hiện (bắt buộc)

1. Luôn đọc `main.tex` (file main) và `resources/quy-dinh-139-DT.pdf` trước khi trả lời.
2. Sử dụng preamble chuẩn (có sẵn trong resources hoặc tự tạo):
   ```latex
   \documentclass[12pt,a4paper]{report}
   \usepackage{fontspec}
   \setmainfont{Times New Roman}
   \usepackage[margin=2cm,left=3cm,right=2cm]{geometry}
   \usepackage{setspace}\setstretch{1.2}
   \usepackage{booktabs,graphicx,amsmath,hyperref}
   \usepackage[style=numeric,sorting=ynt]{biblatex}
   \addbibresource{thesis.bib}
   ```
3. Đảm bảo file được biên dịch bằng `xelatex` hoặc `lualatex` để hỗ trợ font tiếng Việt (fontspec) và Unicode. Nếu người dùng muốn dùng `pdflatex`, nhắc họ thay thế sử dụng gói lệnh `\usepackage{mathptmx}` hoặc `\usepackage{tgtermes}` kèm theo `\usepackage[utf8]{inputenc}` và `\usepackage[T5]{fontenc}`.
4. Tự động kiểm tra file `main.tex` hiện tại để xem các quy định 139/ĐT (margin, font, dãn dòng) đã được đáp ứng chưa. Nếu dãn dòng đang sai (ví dụ `setspace`), tự chèn dòng `\setstretch{1.2}`.
5. Khi viết hoặc chỉnh sửa nội dung, **phải luôn update các nguồn và trích dẫn (citations) một cách đầy đủ**, đảm bảo thêm vào file `refer.bib` (nếu cần) và dùng lệnh trích dẫn chính xác trong văn bản.
6. **Luôn tuân thủ quy tắc viết nội dung (Mục 9)** — đặc biệt: viết văn xuôi thay liệt kê, dùng đúng thuật ngữ, định nghĩa ký hiệu tại chỗ, format loss thống nhất, phân biệt rõ đóng góp.