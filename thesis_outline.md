# KHUNG KHOÁ LUẬN THẠC SĨ
**Tên đề tài dự kiến:** Đề xuất kiến trúc Controllable-LADE nhằm nâng cao tính linh hoạt trong chuyển đổi phong cách ảnh thực sang Anime sử dụng mạng AnimeGANv3

---

## MỞ ĐẦU (3–5 trang)
* **Tính cấp thiết của đề tài:** Phân tích vấn đề "được ăn cả, ngã về không" của các mô hình Style Transfer hiện tại (đặc biệt là AnimeGAN). Ảnh đầu ra thường mất đi các đặc điểm nhận dạng khuôn mặt gốc khi bị áp đặt phong cách mạnh, hoặc giữ được nhận dạng nhưng không mang đủ chất nghệ thuật (Anime).
* **Mục tiêu nghiên cứu:** 
  * Xây dựng kiến trúc nội suy Controllable-LADE (C-LADE) tích hợp tham số $\alpha \in [0, 1]$.
  * Đề xuất chiến lược huấn luyện động (Task-Switching) và hàm mất mát thích ứng.
* **Đối tượng, phạm vi:**
  * **Đối tượng:** Mạng Generative Adversarial Networks (AnimeGANv3), lớp chuẩn hoá LADE.
  * **Phạm vi tác giả:** Trọng tâm vào phong cách vẽ Hayao Miyazaki và Makoto Shinkai (dữ liệu mặc định của AnimeGANv3).
* **Phương pháp nghiên cứu:** Phương pháp kiến trúc mô hình (Model Architecture Engineering) kết hợp thực nghiệm so sánh định lượng và định tính.
* **Ý nghĩa khoa học và thực tiễn:** 
  * *Khoa học:* Đóng góp một cơ chế nội suy tuyến tính trực tiếp trên không gian đặc trưng (Feature Space) tránh sai số.
  * *Thực tiễn:* Ứng dụng để xây dựng công cụ giao diện UI cho phép người dùng tinh chỉnh thanh trượt theo ý muốn theo thời gian thực.
* **Cấu trúc luận văn:** Tóm tắt ngắn gọn các chương 1, 2, 3, 4 và phần kết luận.

---

## Chương 1: TỔNG QUAN (10–15 trang)
* **1.1. Tổng quan về lĩnh vực chuyển đổi phong cách (Image-to-Image translation):** Lịch sử phát triển từ thuật toán Neural Style Transfer của Gatys, đến các mô hình dựa trên GAN (Pix2Pix, CycleGAN).
* **1.2. Các nghiên cứu liên quan trong và ngoài nước:**
  * Các kiến trúc tiên phong: CartoonGAN, ComixGAN.
  * Sự phát triển của họ AnimeGAN (AnimeGANv1, v2, v3).
* **1.3. Khoảng trống nghiên cứu (Research Gap):** Hầu hết các nghiên cứu tập trung vào việc làm thế nào để ảnh *giống* phong cách nhất có thể, nhưng **bỏ qua tính linh hoạt** tuỳ biến của người dùng đối với cường độ phong cách.
* **1.4. Cơ sở chọn đề tài:** Từ khoảng trống trên, việc can thiệp trực tiếp vào tham số tinh chỉnh chuẩn hoá đặc trưng (như LADE trong AnimeGANv3) bằng một biến điều khiển là một hướng tiếp cận chưa được khai thác triệt để, mang tính mới và khả thi cao.

---

## Chương 2: CƠ SỞ LÝ THUYẾT / CƠ SỞ PHƯƠNG PHÁP (15–20 trang)
* **2.1. Neural Networks và Generative Adversarial Networks (GAN):**
  * Lý thuyết nền tảng cơ bản về CNN, Generator, Discriminator.
* **2.2. LADE (Linear Adaptive Instance Denormalization):**
  * Định nghĩa, ý nghĩa: LADE giúp mạng trích xuất thống kê (mean, variance) của biến đổi phong cách và áp đặt lên ảnh gốc.
  * Bất cập của LADE thuần túy (áp đặt 100% phong cách).
* **2.3. Các hàm mất mát (Loss functions) lõi:**
  * Hàm mất mát nội dung (Content Loss - VGG).
  * Hàm mất mát phong cách (Style/Gram Matrix Loss).
  * Hàm mất mát đối nghịch (Adversarial Loss). 
  * Region Smoothing Loss và Color Loss (Đặc thù của AnimeGAN).
* **2.4. Định nghĩa, công thức và ký hiệu:** Bảng tra cứu các đại lượng (như $x_{in}$, $t_{mean}$, $t_{sigma}$, $\alpha$, v.v.).

---

## Chương 3: THIẾT KẾ – THỰC NGHIỆM – ĐÁNH GIÁ (20–25 trang)
* **3.1. Thiết kế kiến trúc Controllable-LADE (C-LADE):**
  * Đề xuất công thức nội suy tuyến tính cấp Feature: $Feature_{out} = (1 - \alpha) \cdot x + \alpha \cdot x_{style}$.
  * Giải thích quyết định khắc phục sai số nhị phân float32 bằng cách dùng $x$ trực tiếp thay vì dựng lại từ $x_{in}$.
* **3.2. Cải tiến kiến trúc AnimeGANv3:**
  * Cấy C-LADE vào 14 lớp Convolution trong Generator.
  * **Chiến lược Task-Switching:** Kỹ thuật random $\alpha$ trong khoảng $[0.0, 1.0]$ ở mỗi batch (Bao gồm cả cấu hình pre-training ban đầu).
  * **Hàm mất mát linh hoạt (Adaptive Loss Strategy):**
    * *Alpha-weighted Content Loss:* Trọng số bảo toàn nhân dạng lớn khi $\alpha \rightarrow 0$.
    * *Alpha-gated Adversarial Loss:* Đóng/ngắt sức ép từ Discriminator khi $\alpha < 0.5$.
* **3.3. Tổ chức thực nghiệm:**
  * Môi trường: Phần cứng (Kaggle P100), framework (TensorFlow 1.15).
  * Tập dữ liệu: Hayao, Shinkai, tập Train Photo.
* **3.4. Hệ thống tương tác thời gian thực:** Trình bày kiến trúc UI bằng Gradio, cách load mô hình dạng tĩnh một lần (Session/Graph caching) để tăng tốc độ Inference khi kéo trượt $\alpha$.

---

## Chương 4: THẢO LUẬN VÀ ĐÁNH GIÁ (10–15 trang)
* **4.1. Đánh giá tính liên tục của tham số $\alpha$ (Qualitative Analysis):**
  * Trình bày các lưới hình ảnh (Image Grids) đi từ $\alpha = 0 \rightarrow 0.5 \rightarrow 1.0$.
  * Minh hoạ bằng các ảnh từ tập thử nghiệm với các thuộc tính khó (như tóc, mắt người thực không bị méo mó khi ở $\alpha=0.5$).
* **4.2. Đánh giá định lượng (Quantitative Analysis):**
  * Phân tích sự cân bằng giữa hàm mất mát Content và Style theo đồ thị dựa trên các giá trị $\alpha$ khác nhau.
  * Phân tích toán học việc nội suy trực tiếp C-LADE đã giảm thiểu $L1\_error$ so với phiên bản tái cấu trúc truyền thống ($max\_diff \approx 0$).
* **4.3. Ưu điểm và Hạn chế:**
  * *Ưu điểm:* Việc học linh hoạt không làm tăng kích thước bộ nhớ lượng tham số Generator.
  * *Hạn chế:* Dù điều khiển được cường độ, người dùng vẫn phải load riêng từng checkpoint nếu muốn đổi từ Hayao sang Shinkai (Multi-style module có thể là giải pháp mở rộng).

---

## KẾT LUẬN (3–5 trang)
* **Tóm tắt kết quả đạt được:** Hoàn thiện và tích hợp thành công C-LADE vào codebase AnimeGANv3.
* **Khẳng định 3 đóng góp cốt lõi:**
  1. Kiến trúc C-LADE với công thức tránh sai số.
  2. Hệ thống Loss linh hoạt (Alpha-weighted / Alpha-gated) kết hợp Task-Switching rèn luyện mạng từ Epoch đầu tiên.
  3. Giao diện thực nghiệm hiển thị ảnh trực quan, độ trễ thấp phục vụ người dùng cuối.
* **Hướng nghiên cứu tiếp theo:**
  * Đưa thêm Style Vector thay vì chỉ Style Strength $\alpha$ để mô hình có thể tạo phong cách tổng hợp nội suy (Vd: 30% Hayao + 70% Shinkai) chung trong một lần hội tụ duy nhất.
  * Chuyển đổi mô hình lên các nền tảng nhẹ (Tensorflow Lite) sử dụng trên luồng Video realtime.
