# Luận Văn Thạc Sĩ: Mạng Đối Kháng Sinh Thành (GAN)

**Trường Đại học Công nghệ - Đại học Quốc gia Hà Nội**

Năm 2025 - 2026

---

## 📋 Mô tả dự án

Dự án này là luận văn thạc sĩ về **Mạng Đối Kháng Sinh Thành (Generative Adversarial Networks - GANs)**, được thực hiện tại Trường Đại học Công nghệ, ĐHQGHN. Luận văn tuân thủ đầy đủ quy định của **Công văn 139/ĐT (12/04/2012)** về hình thức và cấu trúc luận văn thạc sĩ.

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

Luận văn được tổ chức theo cấu trúc tiêu chuẩn:

1. **Phần bìa**: Bìa, phụ bìa, cam đoan, lời cảm ơn
2. **Mục lục**: Tự động sinh từ `\tableofcontents`
3. **Danh mục**: Ký hiệu, bảng, hình vẽ
4. **Mở đầu** (chap0_intro.tex): Tổng quan vấn đề, mục tiêu
5. **Chương 1** (chap1_Prologue.tex): Nền tảng lý thuyết
6. **Chương 2** (chap2_main.tex): Phương pháp và đóng góp chính
7. **Chương 3** (chap3_result.tex): Kết quả thực nghiệm
8. **Chương 4** (chap4_conclusion.tex): Kết luận và hướng phát triển
9. **Tài liệu tham khảo**: Từ file `references.tex` hoặc `.bib`
10. **Phụ lục**: Thêm nội dung phụ trợ (nếu cần)

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

*Thay thế bằng tên của bạn*

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
