# Luận Văn Thạc Sĩ: Mạng đối nghịch tạo sinh trong chuyển đổi ảnh chân dung sang phong cách Anime

**Tác giả:** Nguyễn Trọng Nhân  
**Người hướng dẫn:** TS. Ma Thị Châu  
**Trường Đại học Công nghệ - Đại học Quốc gia Hà Nội**  
**Năm:** 2026  

---

## 📋 Mô tả dự án

Repository này chứa mã nguồn LaTeX của Luận văn Thạc sĩ Khoa học Máy tính theo đề tài **"Mạng đối nghịch tạo sinh trong chuyển đổi ảnh chân dung sang phong cách Anime"** (chú trọng vào kiến trúc DTGAN - AnimeGANv3). 

Luận văn tuân thủ 100% quy chuẩn định dạng theo **Công văn 139/ĐT (12/04/2012)** của Trường Đại học Công nghệ (UET) - ĐHQGHN.

---

## 📁 Cấu trúc thư mục

```
Graduate_Thesis_master_GAN/
├── main.tex                    # File chính của luận văn
├── references.tex              # File chứa các tài liệu tham khảo
├── README.md                   # File này
│
├── chapter/                    # Các chương chính
│   ├── chap0_intro.tex         # Mở đầu
│   ├── chap1_Prologue.tex      # Chương 1: Giới thiệu/Lời nói đầu
│   ├── chap2_main.tex          # Chương 2: Nội dung chính
│   ├── chap3_result.tex        # Chương 3: Kết quả
│   └── chap4_conclusion.tex    # Chương 4: Kết luận
│
├── cover/                      # Phần bìa và mở đầu
│   ├── cover.tex               # Bìa luận văn
│   ├── abstract_en.tex         # Tóm tắt tiếng Anh
│   ├── abstract_vn.tex         # Tóm tắt tiếng Việt
│   ├── acknowledgement.tex     # Lời cảm ơn
│   ├── assurance.tex           # Cam đoan
│   ├── appendix.tex            # Phụ lục
│   └── symbol.tex              # Danh mục ký hiệu
│
├── figChap1/                   # Hình vẽ Chương 1
├── figChap2/                   # Hình vẽ Chương 2
├── figChap3/                   # Hình vẽ Chương 3
│   └── style_results/          # Kết quả style
│
├── figures/                    # Các hình vẽ tổng quát
├── doc/                        # Tài liệu (PDF, mẫu, v.v.)
│   └── Figure/                 # Các hình ảnh tài liệu
│
└── [Các file biên dịch tạm]
    ├── main.aux                # Auxiliary file
    ├── main.toc                # Table of Contents
    ├── main.lof                # List of Figures
    ├── main.lot                # List of Tables
    ├── main.fdb_latexmk        # Latexmk database
    └── pdflatex*.fls           # File list từ quá trình biên dịch
```

---

## 🛠️ Yêu cầu

- **LaTeX Distribution**: TeX Live, MiKTeX, hoặc MacTeX
- **Compiler**: `xelatex` hoặc `lualatex` (để hỗ trợ font tiếng Việt)
- **Thêm gói LaTeX**:
  - `fontspec` - Hỗ trợ fontspec
  - `geometry` - Điều chỉnh lề
  - `setspace` - Điều chỉnh khoảng cách dòng
  - `booktabs`, `graphicx`, `amsmath`
  - `hyperref`, `biblatex` - Xử lý tài liệu tham khảo

---

## 🔨 Hướng dẫn biên dịch

### Phương pháp 1: Sử dụng latexmk (Khuyến nghị)

```bash
latexmk -xelatex -pdf -interaction=nonstopmode main.tex
```

Hoặc để xóa các file tạm sau biên dịch:

```bash
latexmk -xelatex -pdf -interaction=nonstopmode main.tex
latexmk -c  # Xóa file tạm
```

### Phương pháp 2: Biên dịch trực tiếp

```bash
xelatex -interaction=nonstopmode main.tex
xelatex -interaction=nonstopmode main.tex  # Chạy 2 lần để cập nhật tham chiếu
biber main    # Nếu dùng biblatex
xelatex -interaction=nonstopmode main.tex  # Chạy lần thứ 3
```

### Phương pháp 3: Sử dụng VS Code + LaTeX Workshop

1. Cài đặt extension **LaTeX Workshop**
2. Cấu hình `settings.json` để sử dụng XeLaTeX:
   ```json
   "latex-workshop.latex.recipes": [
     {
       "name": "xelatex",
       "tools": ["xelatex"]
     }
   ]
   ```
3. Nhấn `Ctrl+Alt+B` để biên dịch

---

## 📖 Cấu trúc nội dung

Luận văn được phân bố cấu trúc thư mục chi tiết theo các chương:

1. **Trang bìa & Tóm tắt**: Cấu hình tại folder `cover/` (Bìa ngoài, Bìa lót tiếng Việt và Tiếng Anh)
2. **Mục lục, Hình/Bảng**: Tự động đánh số cấu hình trong `main.tex`
3. **MỞ ĐẦU** (`chap0_intro.tex`): Tính cấp thiết, mục tiêu và đối tượng nghiên cứu
4. **CHƯƠNG 1** (`chap1_Prologue.tex`): Cơ sở lý thuyết và tổng quan nghiên cứu
5. **CHƯƠNG 2** (`chap2_main.tex`): Phương pháp nghiên cứu đề xuất (DTGAN, LADE loss)
6. **CHƯƠNG 3** (`chap3_result.tex`): Thực nghiệm và đánh giá kết quả
7. **KẾT LUẬN** (`chap4_conclusion.tex`): Kết luận và Hướng phát triển tiếp theo
8. **Tài liệu tham khảo** (`references.tex`): Trích dẫn theo quy chuẩn UET

---

## ✅ Yêu cầu định dạng (Công văn 139/ĐT 2012)

Luận văn tuân thủ các yêu cầu sau:

- **Font chữ**: Times New Roman (Unicode)
- **Cỡ chữ**: 12-13pt (tương đương Word 13-14pt)
- **Dãn dòng**: 1.2 lines
- **Lề giấy**: 
  - Trên: 2cm
  - Dưới: 2cm
  - Trái: 3cm
  - Phải: 2cm
- **Giấy**: A4, in một mặt
- **Số trang**: Liên tục từ 1 đến hết (ở giữa đầu trang)
- **Độ dài**: ~70 trang (tối đa 120 trang)

---

## 📝 Ghi chú quan trọng

### Thêm chương mới
Để thêm chương mới:

1. Tạo file `chap{n}_name.tex` trong thư mục `chapter/`
2. Thêm dòng sau vào `main.tex`:
   ```latex
   \input{chapter/chap{n}_name}
   ```

### Thêm hình vẽ
Hình vẽ được tổ chức theo chương:

```latex
\begin{figure}[h!]
  \centering
  \includegraphics[width=0.8\textwidth]{figChap2/image_name.png}
  \caption{Mô tả hình vẽ}
  \label{fig:chap2_name}
\end{figure}
```

### Thêm bảng
Bảng được đánh số theo chương:

```latex
\begin{table}[h!]
  \centering
  \caption{Mô tả bảng}
  \label{tab:chap1_name}
  \begin{tabular}{|c|c|c|}
    \hline
    % Nội dung bảng
  \end{tabular}
\end{table}
```

### Tài liệu tham khảo
- Sử dụng `.bib` file hoặc file `references.tex`
- Trích dẫn trong văn bản: `\cite{key}` hoặc `\cite[tr.xx]{key}`

---

## 🔍 Kiểm tra chất lượng

Trước khi nộp, kiểm tra:

- [ ] Tất cả chương được include đúng
- [ ] Tất cả hình vẽ được tham chiếu đúng
- [ ] Tất cả tài liệu tham khảo được biên dịch
- [ ] Không có lỗi biên dịch (warnings)
- [ ] Số trang phù hợp quy định
- [ ] Font, lề, dãn dòng đúng theo quy định
- [ ] Mục lục, danh mục tự động sinh chính xác

---

## 👨‍💻 Tác giả

**Nguyễn Trọng Nhân**  
*Học viên Thạc sĩ ngành Khoa học Máy tính (Mã số: 24025149)*  
*Trường Đại học Công nghệ (UET) - Đại học Quốc gia Hà Nội*

---

## 📚 Tài liệu tham khảo

- [Công văn 139/ĐT (12/04/2012)](https://uet.vnu.edu.vn) - Quy định định dạng luận văn
- [LaTeX Documentation](https://www.latex-project.org/)
- [Overleaf Guides](https://www.overleaf.com/learn) - Hướng dẫn LaTeX online

---

## 📞 Hỗ trợ

Nếu gặp vấn đề khi biên dịch hoặc định dạng, liên hệ:
- Phòng Đào tạo Trường Đại học Công nghệ
- Hoặc tham khảo tài liệu hướng dẫn viết luận văn chính thức
