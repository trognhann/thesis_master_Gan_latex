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