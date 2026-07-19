---
name: latex_thesis_and_journal_skill
description: Tuân thủ NGHIÊM NGẶT Công văn 139/ĐT (12/04/2012) của Trường Đại học Công nghệ - ĐHQGHN. Hỗ trợ viết toàn bộ luận văn thạc sĩ LaTeX đúng quy định font, lề, cấu trúc, bìa, tóm tắt, thông tin luận văn, danh mục tài liệu tham khảo và trình bày bảng/hình/phương trình. Đồng thời hỗ trợ viết bài báo khoa học cho tạp chí (journal paper) với chiến lược nâng tầm kỹ thuật thành nghiên cứu, contributions rõ ràng, kiểm định thống kê, và positioning phù hợp.
---

# Luận Văn Thạc Sĩ – Trường Đại học Công nghệ ĐHQGHN (theo Công văn 139/ĐT 2012)

## Mục tiêu skill
Agent phải trở thành “chuyên gia quy định UET” – tự động áp dụng đúng 100% các yêu cầu trong file `resources/quy-dinh-139-DT.pdf`. Không bao giờ vi phạm bất kỳ quy định nào về font, lề, số trang, cách đánh số, bìa, tóm tắt, thông tin luận văn.

## Khi nào dùng skill
### Chế độ Luận văn thạc sĩ
- Viết/chỉnh bất kỳ phần nào của luận văn
- Tạo bìa, phụ bìa, tóm tắt, trang thông tin luận văn
- Compile và kiểm tra định dạng
- Tạo bảng, hình, phương trình, danh mục tài liệu tham khảo

### Chế độ Bài báo tạp chí (Journal Paper)
- Viết/chỉnh bài báo khoa học cho tạp chí từ nội dung luận văn
- Xác định và diễn đạt contributions (đóng góp khoa học)
- Nâng tầm kỹ thuật thành nghiên cứu (học thuật hóa thuật toán, mô hình hóa toán học)
- Viết phần Introduction, Related Work, Methodology, Experiments, Conclusion
- Thiết kế Ablation Study và kiểm định thống kê (Chi-Square, Kruskal-Wallis, t-test)
- Positioning bài báo và phản bác reviewer

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

---

## PHẦN II: CHẾ ĐỘ VIẾT BÀI BÁO KHOA HỌC CHO TẠP CHÍ (JOURNAL PAPER)

### 11. Contributions của bài báo (4 đóng góp chính)

Khi viết bài báo, agent **BẮT BUỘC** phải tổ chức nội dung xoay quanh 4 đóng góp sau:

#### Contribution 1: Kiến trúc Hệ thống lai (Architectural Framework)
- **Nội dung**: Đề xuất Khung làm việc Hybrid (Face-Preserved Hybrid Framework) — pipeline hoàn chỉnh kết hợp xử lý toàn cảnh (Global/Landscape stylization) và xử lý cục bộ (Local face stylization) trong một luồng chạy duy nhất.
- **Điểm nhấn**: Hệ thống tự động nhận biết ngữ cảnh: nếu có khuôn mặt → kích hoạt Hybrid mode; nếu không → graceful degradation về Landscape Mode.
- **Bao gồm**: Tái lập trình hệ thống loss phức tạp (TensorFlow), tối ưu pipeline huấn luyện song song CPU-GPU (Felzenszwalb Superpixel cho Region Smoothing Loss, NL-Means + L0 Smoothing cho Revision Loss chạy song song CPU trong khi GPU forward pass), tiền xử lý dữ liệu (Edge Smoothing, Superpixel segmentation), và tinh chỉnh siêu tham số.
- **Cách diễn đạt mẫu**: "Chúng tôi tái hiện và đánh giá một cách nghiêm ngặt hệ thống loss đa thành phần phức tạp của DTGAN. Đóng góp chính nằm ở việc thiết kế và tối ưu hóa pipeline huấn luyện (bao gồm tiền xử lý song song CPU-GPU để tính toán loss trực tuyến) và tích hợp mượt mà các ràng buộc loss vào một khung làm việc hybrid bảo toàn khuôn mặt."

#### Contribution 2: Thuật toán Margin Expansion (Algorithm & Engineering)
- **Nội dung**: Thuật toán Mở rộng vùng khuôn mặt có ràng buộc (Symmetric Margin Expansion Algorithm) — mã giả (pseudo-code) cho thuật toán mở rộng bounding box 6 bước với hệ số margin = 0.5.
- **Điểm nhấn**: Bộ quy tắc toán học giúp mở rộng đối xứng 1:1, tự động bo tròn lấy toàn bộ phần tóc, tai, cổ, vai; tự động xử lý edge cases ở biên ảnh.
- **PHẢI viết dưới dạng bài toán tối ưu hóa hình học có ràng buộc** (xem Mục 11.5).

#### Contribution 3: Kỹ thuật Feathered Blending (Algorithm & Engineering)
- **Nội dung**: Xử lý ranh giới ghép ảnh bằng mặt nạ alpha thu nhỏ biên (delta = 8%) + bộ lọc mờ Gaussian.
- **Điểm nhấn**: Giải quyết khác biệt độ phân giải và phong cách giữa vùng mặt (512×512) và vùng nền (độ phân giải gốc).
- **PHẢI viết dưới góc độ Xử lý tín hiệu số** (xem Mục 11.6).

#### Contribution 4: Khảo sát & Đánh giá (Evaluation & User Study)
- **Nội dung**: Khảo sát độc lập 42 người tham gia (người dùng phổ thông + chuyên gia đồ họa/nghệ thuật số).
- **Điểm nhấn**: Bằng chứng thực nghiệm rằng Hybrid mode cải thiện đáng kể chất lượng ngũ quan, kết cấu da, và bảo toàn danh tính so với phương pháp truyền thống.
- **PHẢI có kiểm định thống kê** (xem Mục 11.2 chiến lược 4).

#### Cách trình bày Contributions trong Introduction (mẫu tiếng Anh)

```
The main contributions of this paper are summarized as follows:

1. We propose an end-to-end, constraint-aware hybrid framework for photo-to-anime 
   translation, which adaptively coordinates global landscape stylization and 
   high-resolution local face synthesis.

2. We design an innovative Symmetric Margin Expansion algorithm (margin = 0.5) 
   that preserves critical facial context (hair, ears, and neck) under strict 
   1:1 ratio constraints, coupled with a Gaussian-based Feathered Blending 
   technique to eliminate boundary artifacts during image reconstruction.

3. We successfully optimize and train the double-tail model using a parallelized 
   CPU-GPU pipeline for real-time loss computations (superpixel and L_0 smoothing), 
   achieving a highly lightweight deployment model (9.1 MB ONNX) capable of 
   running at 42 FPS.

4. We conduct extensive quantitative and qualitative evaluations, including a 
   structured User Study with 42 active participants, demonstrating that our 
   hybrid approach outperforms state-of-the-art baselines in identity preservation 
   and visual quality.
```

### 12. Chiến lược nâng tầm kỹ thuật thành nghiên cứu (BẮT BUỘC áp dụng)

Khi viết bài báo, agent **PHẢI** áp dụng 5 chiến lược sau để nâng tầm nội dung từ "mô tả kỹ thuật" thành "nghiên cứu khoa học":

#### 12.1 Học thuật hóa Margin Expansion
- **KHÔNG viết** như đoạn code cắt ảnh thông thường.
- **PHẢI viết** thành bài toán tối ưu hóa hình học có ràng buộc (Constrained Geometric Optimization).
- Định nghĩa B* = [x₁*, y₁*, x₂*, y₂*] là nghiệm của bài toán tối ưu đa mục tiêu.
- Thêm biểu đồ phân tích Information Entropy: khi margin tăng từ 0.0→0.5, Entropy thông tin thị giác tăng (Generator học chuyển tiếp tự nhiên hơn); vượt 0.5 → nhiễu background lấn át khuôn mặt.
- **Biện luận con số 0.5** — đây là giá trị tối ưu thực nghiệm, cần diễn giải thuyết phục.

#### 12.2 Mô hình hóa Feathered Blending dưới dạng xử lý tần số
- Giải thích dưới góc độ Xử lý tín hiệu số (Signal Processing).
- Chứng minh phép ghép trực tiếp (Hard Cut-and-Paste) tạo tần số cao dị thường tại ranh giới.
- Mô hình hóa Feathered Blending = bộ lọc thông thấp thích ứng không gian (spatially-adaptive low-pass filter) dựa trên khoảng cách Euclide đến tâm khuôn mặt.
- Sử dụng công thức Gaussian thích ứng.

#### 12.3 Bổ sung Ablation Study
Bài báo **PHẢI** có các thí nghiệm so sánh:
- **Face Detector Ablation**: So sánh RetinaFace (MobileNet 0.25) vs MTCNN vs YOLOv8-face về mAP, dung lượng, latency. Vẽ biểu đồ Pareto (FPS vs FID).
- **Blending Ablation**: So sánh định tính + định lượng (FID/LPIPS cục bộ vùng biên) giữa: (1) Ghép trực tiếp, (2) Feathered Blending, (3) Poisson Image Editing.
- **Kết luận**: Feathered Blending là giải pháp tối ưu nhất cho hệ thống real-time.

#### 12.4 Kiểm định thống kê User Study
Phần khảo sát **PHẢI** viết theo chuẩn HCI (Human-Computer Interaction):
- Chia 42 người thành 2 nhóm: **Experts** (họa sĩ, giảng viên mỹ thuật, nhà nghiên cứu) và **Laypersons** (người dùng phổ thông).
- Thực hiện kiểm định **Chi-Square Test** hoặc **Kruskal-Wallis Test** trên kết quả Likert scale.
- Nếu p < 0.01 → khẳng định: "Sự vượt trội của Hybrid-DTGAN trong bảo toàn danh tính khuôn mặt và độ sắc nét thị giác đã được chứng minh là có ý nghĩa thống kê lớn, đồng thuận bởi cả chuyên gia đồ họa và người dùng phổ thông."
- Bổ sung **t-test / ANOVA** nếu cần so sánh giữa các nhóm.

#### 12.5 Positioning bài báo
- **KHÔNG viết** đây là "nghiên cứu cải tiến GAN".
- **PHẢI định vị** thuộc nhánh **"Resource-Constrained Edge Artificial Intelligence"** (Trí tuệ nhân tạo hiệu năng cao trên thiết bị cấu hình hạn chế).
- **Nhấn mạnh**: "Trong kỷ nguyên của các mô hình Diffusion khổng lồ (tốn hàng chục GB VRAM, mất vài giây để sinh một bức ảnh), nghiên cứu này đề xuất một giải pháp thay thế cực kỳ thực tế: Chỉ với 9.1 MB và chạy mượt mà ở 42 FPS, hệ thống vẫn đạt chất lượng bảo toàn danh tính tương đương. Đây là hướng tiếp cận có giá trị cho triển khai trên thiết bị di động hoặc máy chủ Web cấu hình thấp."

### 13. Chi tiết Đóng góp Hệ thống (Contribution 1)

Khi viết phần Methodology/System Architecture, agent phải trình bày:

#### 13.1 Kiến trúc hệ thống lai
- Mô tả pipeline hoàn chỉnh: Input → Face Detection (RetinaFace) → Branching Logic → Landscape Mode / Hybrid Mode → Output.
- Giải thích cơ chế graceful degradation.
- Vẽ/mô tả sơ đồ kiến trúc.

#### 13.2 Pipeline huấn luyện song song CPU-GPU
- Mô tả cách đẩy tác vụ nặng sang CPU (Felzenszwalb Superpixel, NL-Means + L0 Smoothing) trong khi GPU forward pass.
- Giải thích cách giải quyết bottleneck phần cứng.
- **Cách diễn đạt**: "Mặc dù không trực tiếp phát minh ra các công thức toán học của các hàm loss, đóng góp rất quan trọng để hệ thống loss hoạt động được trong thực tế."

#### 13.3 Tiền xử lý dữ liệu
- Tự xây dựng pipeline: thu thập → làm sạch → tạo tập dữ liệu đích.
- Chạy thuật toán Edge Smoothing từ ảnh anime gốc.
- Phân mảnh tập ảnh thực → thư mục superpixel `seg_train_5-0.8-50/`.

#### 13.4 Hyperparameter Tuning
- Mô tả quá trình tinh chỉnh để đạt đường cong hội tụ (Hình 4.1, 4.2, 4.3) mà không mode collapse hay gradient explosion.
- Liệt kê các trọng số loss cụ thể: λ_c = 10.0 (Color Loss), λ_adv^m = 0.02 (Main Adversarial Loss), v.v.
- Nêu rõ hạ tầng: GPU RTX A5000.

### 14. Chi tiết Đóng góp Margin Expansion (Contribution 2)

Khi viết phần Margin Expansion trong bài báo, agent **BẮT BUỘC** trình bày theo 4 bước:

#### 14.1 Định nghĩa ký hiệu toán học
- Ảnh gốc I có kích thước H×W.
- Bounding box thô từ RetinaFace: B = [x₁, y₁, x₂, y₂].
- Hệ số mở rộng: m = 0.5 (mở rộng thêm 50% kích thước khuôn mặt thô về mỗi phía).
- Bounding box tối ưu cần tìm: B* = [x₁*, y₁*, x₂*, y₂*].

#### 14.2 Mô hình hóa bài toán tối ưu (Optimization Formulation)
- Định nghĩa B* là nghiệm của bài toán tối ưu hóa đa mục tiêu có ràng buộc (Constrained Multi-Objective Optimization).
- Ràng buộc 1: Aspect Ratio 1:1 (khớp đầu vào 512×512 của Generator).
- Ràng buộc 2: Diện tích mục tiêu ~ (1+2m)² × diện tích B gốc.
- Ràng buộc 3: B* ⊂ I (không vượt biên ảnh).
- Ràng buộc 4: Đối xứng tâm (symmetric expansion).

#### 14.3 Geometric Derivation (Các bước giải)
- Thuật toán là closed-form solution cho hệ tối ưu trên dưới ảnh hưởng Edge Cases.
- **Bước 1**: Xác định biên độ mở rộng ngang tối đa trong biên ảnh; bảo đảm đối xứng tâm trục hoành.
- **Bước 2**: Áp đặt ràng buộc vuông 1:1 lên trục tung.
- **Bước 3**: Phân nhánh điều chỉnh dọc (Vertical Translation) + Clamping — tọa độ dọc chia đều khoảng bù 2 phía, cắt lề (clamp) không vượt biên trên/dưới.
- Chuyển đổi thuật toán 6 bước thành **pseudo-code** hoặc **sơ đồ khối**.

#### 14.4 Ý nghĩa khoa học (Scientific Significance)
Giải thích dưới góc độ Lý thuyết thông tin (Information Theory) và GAN Stability:

**Bảo toàn entropy kết cấu cục bộ (Local Structural Entropy Preservation)**:
- m = 0 (crop sát mặt) → Generator thiếu thông tin biên tóc/vai → đường nét đứt gãy tại biên → Generator sinh kết cấu tóc bị cụt hoặc lỗi loang màu.
- m = 0.5 → thông tin ngữ cảnh được tối đa hóa → cung cấp đầy đủ cho Region Smoothing Loss và Content Loss hoạt động hiệu quả nhất.

**Triệt tiêu biến dạng tỷ lệ (Scale Distortion Elimination)**:
- Không khóa cứng 1:1 ở bước 2 → resize tùy ý về 512×512 → méo ảnh (aspect ratio distortion) → khuôn mặt bị kéo dẹt/dài → phá hủy Identity Preservation.
- Khóa cứng 1:1 → phép biến đổi affine = phép đồng dạng (Isometry) → bảo toàn nguyên vẹn tỷ lệ ngũ quan.

### 15. Chi tiết Đóng góp Feathered Blending (Contribution 3)

Khi viết phần Feathered Blending, agent **BẮT BUỘC** trình bày dưới góc độ Xử lý tín hiệu số (Signal Processing), Lý thuyết không gian-tỷ lệ (Scale-Space Theory), và Hệ thống thị giác người (HVS).

#### 15.1 Đặt vấn đề: Hiện tượng dị thường tần số cao (High-Frequency Boundary Artifacts)
Khi ghép trực tiếp (hard cut-and-paste) I_face (512×512) vào I_bg:

**Sự bất nhất dải tần (Spectral Inconsistency)**:
- Vùng biên tạo bước nhảy đột ngột giá trị pixel (step discontinuity).
- Trong miền tần số ↔ hàm Delta Dirac → sinh spurious high-frequency harmonics không tồn tại trong ảnh thực lẫn ảnh anime đích.

**Hiệu ứng dải Mach (Mach Bands Effect)**:
- HVS tự động tăng cường tương phản tại ranh giới sắc nét (lateral inhibition của tế bào thần kinh thị giác).
- Mắt người lập tức phát hiện vết ghép → giảm tính chân thực nghệ thuật.

#### 15.2 Mô hình hóa toán học
Đề xuất bộ lọc chuyển tiếp thích ứng không gian (Spatially-Adaptive Transition Filter) qua mặt nạ alpha + Gaussian kernel:

**Bước 1 — Boundary-Aware Binary Mask**:
- Định nghĩa mặt nạ nhị phân M.
- Tham số thu hẹp lề δ xác định động theo tỷ lệ kích thước hình học khuôn mặt → bảo toàn cấu trúc trung tâm.
- **PHẢI viết thành công thức toán.**

**Bước 2 — Gaussian Scale-Space Convolution**:
- Làm mịn M bằng tích chập Gaussian G_σ.
- Theo Scale-Space Theory (Lindeberg): Gaussian kernel = bộ lọc tuyến tính duy nhất không sinh cực trị giả (spurious extrema) tại ranh giới.

**Bước 3 — Adaptive Alpha Compositing**:
- I_out(x,y) = nội suy tuyến tính có trọng số không gian (Spatially-weighted linear interpolation) giữa I_face và I_bg.

#### 15.3 Phản bác Poisson Image Editing
Agent phải chuẩn bị lập luận khoa học phản bác reviewer:

**Sự không tương thích với Style Transfer (Color Bleeding)**:
- Poisson Editing bắt buộc thay đổi phân phối màu sắc vùng nguồn (I_face) để khớp gradient vùng đích (I_bg).
- Trong bài toán anime → phá hủy bộ màu phẳng cel-shading tinh tế → hiện tượng loang màu / xỉn màu khuôn mặt.

**Độ phức tạp tính toán**:
- Poisson Editing: giải hệ phương trình tuyến tính thưa kích thước lớn (hệ Dirichlet) → O(N log N) hoặc O(N) với nhiều vòng lặp → không thể real-time trên thiết bị cấu hình yếu.
- Feathered Blending: tích chập Gaussian tách biệt (separable convolution) → O(N) cực kỳ ổn định → bảo toàn mục tiêu real-time 42 FPS / 9.1 MB ONNX.

### 16. Quy tắc viết bài báo

#### 16.1 Phong cách viết
- **Dùng "giải pháp hệ thống"** thay vì "thử nghiệm mô hình".
- **Viết ở ngôi "We"** (chúng tôi) cho bài báo tiếng Anh.
- **KHÔNG dùng liệt kê gạch đầu dòng** cho phần phân tích, thảo luận → viết văn xuôi.
- Liệt kê chỉ dùng cho: bước thuật toán, thành phần kiến trúc, contributions tóm tắt.

#### 16.2 Positioning
- Trong Introduction, định vị nghiên cứu thuộc nhánh **"Resource-Constrained Edge AI"**.
- So sánh với các mô hình Diffusion lớn (hàng chục GB VRAM, vài giây/ảnh) để nhấn mạnh ưu thế thực tế.

#### 16.3 Thuật ngữ
- Tuân thủ Mục 9.2 (luận văn) cho bản tiếng Việt.
- Bài tiếng Anh: dùng thuật ngữ chuẩn quốc tế, viết italic cho tên thuật toán/framework lần đầu xuất hiện.

#### 16.4 Phân biệt đóng góp
- Phải **phân biệt rõ** đâu là code/mô hình có sẵn (pretrained backbone), đâu là phần mình huấn luyện/phát triển.
- Khi nói về loss functions: "Mặc dù không trực tiếp phát minh ra các công thức toán học..., nhưng đóng góp rất quan trọng để hệ thống loss hoạt động được trong thực tế."

### 17. Notes & TODO (agent cần lưu ý)

- **Kiểm định thống kê**: cần chạy t-test/ANOVA/Chi-Square trên dữ liệu User Study.
- **Margin tự động**: hiện giờ margin = 0.5 là fix cứng (giá trị tối ưu thực nghiệm) → cần diễn giải thuyết phục hoặc thiết kế thuật toán tự động tính margin.
- **Delta tự động**: hệ số lề δ = 8% trong Feathered Blending → delta có tự động được không?
- **Tên tạp chí mục tiêu**: chưa xác định → cần người dùng cung cấp để chọn template LaTeX phù hợp.
- **Ngôn ngữ bài báo**: chưa xác định (tiếng Anh hay tiếng Việt).
- **Template LaTeX**: chưa có file `.cls`/`.sty` của tạp chí → cần người dùng cung cấp.

### 18. Tham khảo nội dung gốc

Toàn bộ hướng dẫn chi tiết về cách nâng tầm nghiên cứu nằm trong file:
`resources/Anime-Nhân-Luận văn-Tạp chí.docx`

Agent **PHẢI** đọc file này trước khi viết bất kỳ phần nào của bài báo.

---

## PHẦN III: HƯỚNG DẪN AGENT THỰC HIỆN (BẮT BUỘC)

### Chế độ Luận văn
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

### Chế độ Bài báo tạp chí
1. Luôn đọc `resources/Anime-Nhân-Luận văn-Tạp chí.docx` trước khi viết bất kỳ phần nào.
2. Xác định Contribution nào đang viết (1–4) và áp dụng đúng chiến lược nâng tầm (Mục 12).
3. Tuân thủ cấu trúc: Title → Abstract → Keywords → Introduction (với Contributions) → Related Work → Methodology → Experiments (với Ablation Study) → Conclusion → References.
4. Phải có công thức toán học cho Margin Expansion (Mục 14) và Feathered Blending (Mục 15).
5. Phải có kiểm định thống kê cho User Study (Mục 12.4).
6. Positioning theo "Resource-Constrained Edge AI" (Mục 12.5).
7. Khi viết hoặc chỉnh sửa nội dung, **phải luôn update các nguồn và trích dẫn** vào file `.bib`.
8. Nếu người dùng chưa cung cấp template tạp chí, sử dụng template IEEE hoặc hỏi người dùng.