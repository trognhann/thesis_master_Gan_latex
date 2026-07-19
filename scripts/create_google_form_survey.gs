/**
 * =============================================================================
 * KHẢO SÁT ĐÁNH GIÁ HỆ THỐNG CHUYỂN ĐỔI ẢNH ANIME - AnimeGANv3 (DTGAN)
 * =============================================================================
 * 
 * Google Apps Script tạo Google Form tự động cho luận văn thạc sĩ.
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Truy cập https://script.google.com
 * 2. Tạo project mới (New Project)
 * 3. Xóa code mặc định, paste toàn bộ file này vào
 * 4. Nhấn "Run" (chọn hàm createAnimeGANSurvey)
 * 5. Cấp quyền khi được yêu cầu (chọn tài khoản Google → Advanced → Go to...)
 * 6. Form sẽ được tạo tự động trong Google Drive của bạn
 * 7. Mở Google Drive → tìm form "Khảo sát đánh giá..."
 * 
 * SAU KHI TẠO FORM:
 * - Upload ảnh thủ công vào các vị trí đã đánh dấu [THÊM ẢNH TẠI ĐÂY]
 * - Ảnh nằm trong thư mục: figChap3/style_results/ của repo
 * - Hoặc chạy hàm uploadImagesToDrive() để upload ảnh lên Drive trước
 * 
 * Tác giả: Nguyễn Trọng Nhân - 24025149
 * Luận văn: Mạng đối nghịch tạo sinh trong chuyển đổi ảnh chân dung sang phong cách Anime
 * =============================================================================
 */

function createAnimeGANSurvey() {
  // =====================================================
  // TẠO FORM
  // =====================================================
  var form = FormApp.create('Khảo sát đánh giá hệ thống chuyển đổi ảnh chân dung sang phong cách Anime (AnimeGANv3)');
  
  form.setDescription(
    '📋 KHẢO SÁT ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG CHUYỂN ĐỔI ẢNH ANIME\n\n' +
    'Xin chào! Cảm ơn bạn đã dành thời gian tham gia khảo sát.\n\n' +
    'Khảo sát này là một phần của luận văn thạc sĩ nghiên cứu về hệ thống chuyển đổi ảnh chân dung sang phong cách anime ' +
    'sử dụng mạng đối nghịch tạo sinh (GAN) - cụ thể là kiến trúc AnimeGANv3 (DTGAN).\n\n' +
    'Hệ thống có 3 chế độ xử lý:\n' +
    '• Face Mode: Phát hiện và cắt riêng vùng khuôn mặt, chuyển đổi ở độ phân giải cao (512×512)\n' +
    '• Landscape Mode: Xử lý toàn bộ ảnh, giữ nguyên bố cục và nền\n' +
    '• Hybrid Mode: Kết hợp cả hai - nền được xử lý Landscape, từng khuôn mặt được xử lý Face Mode rồi ghép lại\n\n' +
    '⏱️ Thời gian ước tính: 8-12 phút\n' +
    '🔒 Mọi thông tin được bảo mật và chỉ phục vụ mục đích nghiên cứu.\n\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Nguyễn Trọng Nhân - MSSV: 24025149\n' +
    'Trường Đại học Công nghệ - ĐHQGHN\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
  );
  
  form.setConfirmationMessage(
    '🎉 Cảm ơn bạn đã hoàn thành khảo sát!\n\n' +
    'Phản hồi của bạn rất có giá trị cho nghiên cứu của chúng tôi.\n' +
    'Nếu bạn muốn trải nghiệm hệ thống, vui lòng liên hệ qua email.\n\n' +
    'Trân trọng,\n' +
    'Nguyễn Trọng Nhân'
  );
  
  form.setCollectEmail(false);
  form.setAllowResponseEdits(true);
  form.setLimitOneResponsePerUser(false);
  form.setProgressBar(true);
  form.setPublishingSummary(true);

  // =====================================================
  // PHẦN 1: THÔNG TIN NGƯỜI THAM GIA
  // =====================================================
  
  form.addSectionHeaderItem()
    .setTitle('PHẦN 1: THÔNG TIN NGƯỜI THAM GIA')
    .setHelpText(
      'Các thông tin cá nhân dưới đây giúp chúng tôi phân tích kết quả khảo sát theo nhóm đối tượng. ' +
      'Tất cả thông tin đều không bắt buộc và được bảo mật.'
    );

  // 1.1 Họ và tên
  form.addTextItem()
    .setTitle('1.1. Họ và tên')
    .setHelpText('Không bắt buộc')
    .setRequired(false);

  // 1.2 Email
  form.addTextItem()
    .setTitle('1.2. Email liên hệ')
    .setHelpText('Không bắt buộc - Nếu bạn muốn nhận kết quả nghiên cứu')
    .setRequired(false);

  // 1.3 Nhóm tuổi
  form.addMultipleChoiceItem()
    .setTitle('1.3. Nhóm tuổi')
    .setChoiceValues([
      'Dưới 18 tuổi',
      '18 - 24 tuổi',
      '25 - 34 tuổi',
      '35 - 44 tuổi',
      '45 tuổi trở lên'
    ])
    .setRequired(true);

  // 1.4 Giới tính
  form.addMultipleChoiceItem()
    .setTitle('1.4. Giới tính')
    .setChoiceValues([
      'Nam',
      'Nữ',
      'Không muốn trả lời'
    ])
    .setRequired(true);

  // 1.5 Nghề nghiệp
  form.addMultipleChoiceItem()
    .setTitle('1.5. Nghề nghiệp / Lĩnh vực hoạt động')
    .setChoiceValues([
      'Sinh viên / Học sinh',
      'Kỹ sư CNTT / Lập trình viên',
      'Nhà nghiên cứu / Giảng viên',
      'Thiết kế đồ họa / Nghệ thuật số',
      'Nhiếp ảnh gia / Sáng tạo nội dung',
      'Nhân viên văn phòng',
      'Kinh doanh / Marketing',
      'Khác'
    ])
    .showOtherOption(true)
    .setRequired(true);

  // 1.6 Mức độ quen thuộc với anime
  form.addScaleItem()
    .setTitle('1.6. Mức độ quen thuộc của bạn với phong cách anime/manga')
    .setHelpText('1 = Không biết gì | 2 = Biết sơ qua | 3 = Thỉnh thoảng xem | 4 = Xem thường xuyên | 5 = Fan cuồng nhiệt')
    .setBounds(1, 5)
    .setLabels('Không biết gì', 'Fan cuồng nhiệt')
    .setRequired(true);

  // 1.7 Mức độ quen thuộc với AI
  form.addScaleItem()
    .setTitle('1.7. Mức độ hiểu biết của bạn về AI / Deep Learning')
    .setHelpText('1 = Không biết | 2 = Nghe qua | 3 = Hiểu cơ bản | 4 = Có kinh nghiệm | 5 = Chuyên gia')
    .setBounds(1, 5)
    .setLabels('Không biết', 'Chuyên gia')
    .setRequired(true);

  // 1.8 Đã dùng app chuyển đổi anime chưa
  form.addMultipleChoiceItem()
    .setTitle('1.8. Bạn đã từng sử dụng ứng dụng/filter chuyển đổi ảnh sang phong cách anime chưa?')
    .setHelpText('Ví dụ: TikTok filter, Meitu, Prisma, Lensa AI, Waifu2x, v.v.')
    .setChoiceValues([
      'Chưa bao giờ',
      'Đã dùng 1-2 lần',
      'Thỉnh thoảng sử dụng',
      'Sử dụng thường xuyên'
    ])
    .setRequired(true);

  // =====================================================
  // PHẦN 2: ĐÁNH GIÁ CHẤT LƯỢNG TỔNG THỂ
  // =====================================================
  
  form.addPageBreakItem()
    .setTitle('PHẦN 2: ĐÁNH GIÁ CHẤT LƯỢNG CHUYỂN ĐỔI TỔNG THỂ')
    .setHelpText(
      'Dưới đây là các ảnh chân dung gốc và kết quả chuyển đổi sang phong cách anime bằng hệ thống AnimeGANv3.\n\n' +
      'Vui lòng quan sát kỹ các cặp ảnh (gốc → anime) và đánh giá chất lượng theo các tiêu chí.\n\n' +
      '📌 LƯU Ý: Các ảnh mẫu sẽ được hiển thị bên dưới. Hãy quan sát kỹ trước khi trả lời.'
    );

  // Placeholder cho ảnh - Người dùng cần thêm ảnh thủ công
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ ảnh mẫu 1: Ảnh chân dung đơn (1 người)')
    .setHelpText(
      '[THÊM ẢNH TẠI ĐÂY]\n' +
      '• Ảnh gốc: figChap3/style_results/a1.png\n' +
      '• Kết quả Hybrid Mode: figChap3/style_results/e1.jpg\n' +
      '• Kết quả Face Mode: figChap3/style_results/d1.jpg\n\n' +
      'Mô tả: Ảnh chân dung cô gái đứng trên bãi biển, cầm ly nước dừa, mặc áo vàng.'
    );

  // 2.1 Chất lượng tổng thể
  form.addScaleItem()
    .setTitle('2.1. Chất lượng tổng thể của ảnh anime đã chuyển đổi')
    .setHelpText('1 = Rất kém | 2 = Kém | 3 = Trung bình | 4 = Tốt | 5 = Rất tốt')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  // 2.2 Bảo toàn nhận dạng
  form.addScaleItem()
    .setTitle('2.2. Mức độ bảo toàn đặc điểm nhận dạng (nhận ra là cùng một người)')
    .setHelpText('1 = Không nhận ra | 2 = Rất khó nhận ra | 3 = Nhận ra một phần | 4 = Dễ nhận ra | 5 = Nhận ra ngay')
    .setBounds(1, 5)
    .setLabels('Không nhận ra', 'Nhận ra ngay')
    .setRequired(true);

  // 2.3 Tính thẩm mỹ
  form.addScaleItem()
    .setTitle('2.3. Tính thẩm mỹ / Đẹp mắt của ảnh đầu ra')
    .setHelpText('1 = Xấu | 2 = Không đẹp lắm | 3 = Bình thường | 4 = Đẹp | 5 = Rất đẹp')
    .setBounds(1, 5)
    .setLabels('Xấu', 'Rất đẹp')
    .setRequired(true);

  // 2.4 Tính tự nhiên
  form.addScaleItem()
    .setTitle('2.4. Tính tự nhiên của ảnh (không bị méo, không có artifact bất thường)')
    .setHelpText('1 = Rất méo/lỗi | 2 = Có nhiều lỗi | 3 = Chấp nhận được | 4 = Tự nhiên | 5 = Rất tự nhiên')
    .setBounds(1, 5)
    .setLabels('Rất méo/lỗi', 'Rất tự nhiên')
    .setRequired(true);

  // 2.5 Giống phong cách anime
  form.addScaleItem()
    .setTitle('2.5. Mức độ giống phong cách anime thực sự (so với phim hoạt hình Nhật Bản)')
    .setHelpText('1 = Không giống anime | 2 = Hơi giống | 3 = Giống ở mức trung bình | 4 = Khá giống | 5 = Rất giống anime')
    .setBounds(1, 5)
    .setLabels('Không giống', 'Rất giống anime')
    .setRequired(true);

  // 2.6 Chất lượng đường nét
  form.addScaleItem()
    .setTitle('2.6. Chất lượng đường nét và viền (line art) trong ảnh anime')
    .setHelpText('1 = Rất thô | 2 = Thô | 3 = Trung bình | 4 = Mịn | 5 = Rất mịn và sắc nét')
    .setBounds(1, 5)
    .setLabels('Rất thô', 'Rất mịn')
    .setRequired(true);

  // 2.7 Chất lượng màu sắc
  form.addScaleItem()
    .setTitle('2.7. Chất lượng màu sắc và tông màu của ảnh anime')
    .setHelpText('1 = Sai màu hoàn toàn | 2 = Nhiều sai lệch | 3 = Chấp nhận được | 4 = Hài hòa | 5 = Rất đẹp và hài hòa')
    .setBounds(1, 5)
    .setLabels('Sai màu', 'Rất hài hòa')
    .setRequired(true);

  // 2.8 Bảo toàn chi tiết khuôn mặt
  form.addScaleItem()
    .setTitle('2.8. Mức độ bảo toàn chi tiết khuôn mặt (mắt, mũi, miệng, biểu cảm)')
    .setHelpText('1 = Mất hoàn toàn | 2 = Mất nhiều | 3 = Giữ được một phần | 4 = Giữ tốt | 5 = Giữ rất tốt')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn', 'Giữ rất tốt')
    .setRequired(true);

  // =====================================================
  // PHẦN 3: SO SÁNH BỘ ẢNH MẪU 2 (ẢNH NHÓM)
  // =====================================================

  form.addPageBreakItem()
    .setTitle('PHẦN 3: SO SÁNH CÁC CHẾ ĐỘ XỬ LÝ')
    .setHelpText(
      'Hệ thống có 3 chế độ xử lý ảnh:\n\n' +
      '🔵 Hybrid Mode: Kết hợp Landscape (nền) + Face Mode (từng khuôn mặt) → ghép lại bằng feathered blending\n' +
      '🟢 Landscape Mode: Xử lý toàn bộ ảnh gốc → giữ bố cục nhưng chi tiết mặt có thể kém\n' +
      '🟡 Face Mode: Chỉ cắt và xử lý vùng khuôn mặt ở 512×512 → chi tiết cao nhưng mất nền\n\n' +
      'Hãy quan sát các bộ ảnh so sánh dưới đây và trả lời câu hỏi.'
    );

  // --- Bộ so sánh 1: Ảnh 1 người ---
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ so sánh 1: Ảnh chân dung đơn')
    .setHelpText(
      '[THÊM 4 ẢNH TẠI ĐÂY theo thứ tự]\n' +
      '(a) Hybrid Mode: figChap3/style_results/e1.jpg\n' +
      '(b) Landscape Mode: figChap3/style_results/b1.jpg\n' +
      '(c) Cắt mặt từ Landscape: figChap3/style_results/c1.png\n' +
      '(d) Face Mode: figChap3/style_results/d1.jpg\n\n' +
      'Ảnh gốc: figChap3/style_results/a1.png'
    );

  form.addMultipleChoiceItem()
    .setTitle('3.1. [Bộ 1] Bạn thích kết quả của chế độ nào nhất?')
    .setChoiceValues([
      '(a) Hybrid Mode - Kết hợp nền anime + mặt chi tiết',
      '(b) Landscape Mode - Xử lý toàn bộ ảnh',
      '(d) Face Mode - Chỉ xử lý vùng khuôn mặt'
    ])
    .setRequired(true);

  // --- Bộ so sánh 2: Ảnh nhóm ---
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ so sánh 2: Ảnh nhóm (2 người)')
    .setHelpText(
      '[THÊM 4 ẢNH TẠI ĐÂY theo thứ tự]\n' +
      '(a) Hybrid Mode: figChap3/style_results/e2.jpg\n' +
      '(b) Landscape Mode: figChap3/style_results/b2.jpg\n' +
      '(c) Cắt mặt từ Landscape: figChap3/style_results/c2.png\n' +
      '(d) Face Mode: figChap3/style_results/d2.jpg\n\n' +
      'Ảnh gốc: figChap3/style_results/a2.png'
    );

  form.addMultipleChoiceItem()
    .setTitle('3.2. [Bộ 2] Bạn thích kết quả của chế độ nào nhất cho ảnh nhóm?')
    .setChoiceValues([
      '(a) Hybrid Mode - Kết hợp nền anime + mặt chi tiết',
      '(b) Landscape Mode - Xử lý toàn bộ ảnh',
      '(d) Face Mode - Chỉ xử lý vùng khuôn mặt (mặt lớn nhất)'
    ])
    .setRequired(true);

  // --- Bộ so sánh 3: Ảnh góc nghiêng ---
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ so sánh 3: Ảnh chân dung góc nghiêng')
    .setHelpText(
      '[THÊM 4 ẢNH TẠI ĐÂY theo thứ tự]\n' +
      '(a) Hybrid Mode: figChap3/style_results/e3.jpg\n' +
      '(b) Landscape Mode: figChap3/style_results/b3.jpg\n' +
      '(c) Cắt mặt từ Landscape: figChap3/style_results/c3.png\n' +
      '(d) Face Mode: figChap3/style_results/d3.jpg\n\n' +
      'Ảnh gốc: figChap3/style_results/a3.png'
    );

  form.addMultipleChoiceItem()
    .setTitle('3.3. [Bộ 3] Bạn thích kết quả của chế độ nào nhất cho ảnh góc nghiêng?')
    .setChoiceValues([
      '(a) Hybrid Mode - Kết hợp nền anime + mặt chi tiết',
      '(b) Landscape Mode - Xử lý toàn bộ ảnh',
      '(d) Face Mode - Chỉ xử lý vùng khuôn mặt'
    ])
    .setRequired(true);

  // --- Đánh giá chi tiết từng chế độ ---
  form.addSectionHeaderItem()
    .setTitle('📊 Đánh giá chi tiết từng chế độ')
    .setHelpText('Dựa trên tất cả các bộ ảnh bạn vừa xem, hãy đánh giá từng chế độ theo các tiêu chí.');

  // Hybrid Mode
  form.addScaleItem()
    .setTitle('3.4. Hybrid Mode — Độ sắc nét khuôn mặt')
    .setBounds(1, 5)
    .setLabels('Rất mờ', 'Rất sắc nét')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.5. Hybrid Mode — Bảo toàn chi tiết (mắt, mũi, miệng)')
    .setBounds(1, 5)
    .setLabels('Mất hết chi tiết', 'Giữ đầy đủ')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.6. Hybrid Mode — Bảo toàn nền / bối cảnh')
    .setBounds(1, 5)
    .setLabels('Mất nền', 'Giữ tốt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.7. Hybrid Mode — Tính tự nhiên tổng thể (mặt + nền hài hòa)')
    .setBounds(1, 5)
    .setLabels('Rất giả', 'Rất tự nhiên')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.8. Hybrid Mode — Đường ghép giữa mặt và nền có tự nhiên không?')
    .setHelpText('Đánh giá xem viền ghép giữa vùng mặt (Face Mode) và nền (Landscape) có lộ không')
    .setBounds(1, 5)
    .setLabels('Rất lộ, rõ ràng', 'Hoàn toàn không thấy')
    .setRequired(true);

  // Landscape Mode
  form.addScaleItem()
    .setTitle('3.9. Landscape Mode — Độ sắc nét khuôn mặt')
    .setBounds(1, 5)
    .setLabels('Rất mờ', 'Rất sắc nét')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.10. Landscape Mode — Bảo toàn chi tiết (mắt, mũi, miệng)')
    .setBounds(1, 5)
    .setLabels('Mất hết chi tiết', 'Giữ đầy đủ')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.11. Landscape Mode — Bảo toàn nền / bối cảnh')
    .setBounds(1, 5)
    .setLabels('Mất nền', 'Giữ tốt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.12. Landscape Mode — Tính tự nhiên tổng thể')
    .setBounds(1, 5)
    .setLabels('Rất giả', 'Rất tự nhiên')
    .setRequired(true);

  // Face Mode
  form.addScaleItem()
    .setTitle('3.13. Face Mode — Độ sắc nét khuôn mặt')
    .setBounds(1, 5)
    .setLabels('Rất mờ', 'Rất sắc nét')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.14. Face Mode — Bảo toàn chi tiết (mắt, mũi, miệng)')
    .setBounds(1, 5)
    .setLabels('Mất hết chi tiết', 'Giữ đầy đủ')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.15. Face Mode — Tính tự nhiên tổng thể')
    .setBounds(1, 5)
    .setLabels('Rất giả', 'Rất tự nhiên')
    .setRequired(true);

  // Xếp hạng tổng thể giữa 3 chế độ
  form.addMultipleChoiceItem()
    .setTitle('3.16. Tổng thể, bạn thích chế độ nào nhất cho ẢNH CHÂN DUNG ĐƠN (1 người)?')
    .setChoiceValues([
      'Hybrid Mode (kết hợp mặt + nền)',
      'Landscape Mode (xử lý toàn ảnh)',
      'Face Mode (chỉ vùng mặt)'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('3.17. Tổng thể, bạn thích chế độ nào nhất cho ẢNH NHÓM (nhiều người)?')
    .setChoiceValues([
      'Hybrid Mode (kết hợp mặt + nền)',
      'Landscape Mode (xử lý toàn ảnh)',
      'Face Mode (chỉ mặt lớn nhất)'
    ])
    .setRequired(true);

  // =====================================================
  // PHẦN 4: ĐÁNH GIÁ MODULE FACE EXTRACTION
  // =====================================================
  
  form.addPageBreakItem()
    .setTitle('PHẦN 4: ĐÁNH GIÁ MODULE TRÍCH XUẤT KHUÔN MẶT (Face Extraction)')
    .setHelpText(
      'Module Face Extraction sử dụng RetinaFace (mạng phát hiện khuôn mặt) để:\n' +
      '1. Tự động phát hiện khuôn mặt trong ảnh\n' +
      '2. Mở rộng vùng cắt (margin = 50%) để bao gồm tóc, tai, cổ\n' +
      '3. Cắt và resize về 512×512 trước khi chuyển đổi anime\n\n' +
      'Hãy đánh giá tầm quan trọng và hiệu quả của module này.'
    );

  form.addScaleItem()
    .setTitle('4.1. Tầm quan trọng: Việc phát hiện và cắt riêng khuôn mặt trước khi chuyển đổi anime có quan trọng không?')
    .setHelpText('1 = Không quan trọng, xử lý toàn ảnh là đủ | 5 = Rất quan trọng, ảnh hưởng lớn đến chất lượng')
    .setBounds(1, 5)
    .setLabels('Không quan trọng', 'Rất quan trọng')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('4.2. So sánh: Khi nhìn ảnh Face Mode (cắt mặt riêng) vs vùng mặt trong Landscape Mode, mức cải thiện chất lượng là?')
    .setHelpText('1 = Không cải thiện / tệ hơn | 3 = Cải thiện vừa phải | 5 = Cải thiện rõ rệt')
    .setBounds(1, 5)
    .setLabels('Không cải thiện', 'Cải thiện rõ rệt')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('4.3. Vùng cắt khuôn mặt (margin) có bao gồm đủ bối cảnh không? (tóc, tai, cổ, vai)')
    .setHelpText('Quan sát ảnh Face Mode (d1, d2, d3) — vùng cắt có đủ rộng không?')
    .setChoiceValues([
      'Quá ít — Cắt mất tóc, tai',
      'Vừa đủ — Bao gồm đủ tóc, tai, cổ',
      'Quá rộng — Thừa nhiều nền không cần thiết',
      'Không chắc chắn'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('4.4. Chất lượng kết cấu da (skin texture) trong ảnh Face Mode')
    .setHelpText('Ảnh anime nên có da mịn, đặc trưng phong cách hoạt hình')
    .setBounds(1, 5)
    .setLabels('Thô, giữ nguyên ảnh thật', 'Mịn, rất anime')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('4.5. Chất lượng mắt trong ảnh Face Mode')
    .setHelpText('Mắt là đặc trưng quan trọng nhất trong anime — nên to, sáng, long lanh')
    .setBounds(1, 5)
    .setLabels('Không giống anime', 'Rất anime, long lanh')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('4.6. Bảo toàn biểu cảm khuôn mặt (expression) sau chuyển đổi')
    .setHelpText('Biểu cảm gốc (cười, nghiêm túc...) có được giữ lại trong ảnh anime không?')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn biểu cảm', 'Giữ nguyên biểu cảm')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('4.7. Bảo toàn đặc điểm nhận diện cá nhân (khuôn mặt, kiểu tóc)')
    .setHelpText('Người xem có thể nhận ra đây là cùng một người với ảnh gốc không?')
    .setBounds(1, 5)
    .setLabels('Không nhận ra', 'Nhận ra ngay lập tức')
    .setRequired(true);

  // =====================================================
  // PHẦN 5: SO SÁNH VỚI CÁC PHƯƠNG PHÁP / ỨNG DỤNG KHÁC
  // =====================================================

  form.addPageBreakItem()
    .setTitle('PHẦN 5: SO SÁNH VỚI CÁC PHƯƠNG PHÁP KHÁC')
    .setHelpText(
      'Nếu bạn đã từng sử dụng các ứng dụng/filter chuyển đổi ảnh sang phong cách anime khác, ' +
      'hãy so sánh với kết quả của AnimeGANv3.\n\n' +
      'Nếu chưa từng dùng, hãy trả lời dựa trên cảm nhận của bạn về kết quả AnimeGANv3.'
    );

  form.addCheckboxItem()
    .setTitle('5.1. Bạn đã từng sử dụng ứng dụng/filter anime nào sau đây? (Chọn tất cả đã dùng)')
    .setChoiceValues([
      'TikTok Anime Filter',
      'Snapchat Anime Lens',
      'Meitu / Beauty Plus',
      'Prisma',
      'Lensa AI',
      'Waifu2x',
      'Photo Lab',
      'AI Anime Filter (trên mạng xã hội)',
      'Chưa dùng bất kỳ ứng dụng nào'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addScaleItem()
    .setTitle('5.2. So với các ứng dụng/filter anime bạn đã dùng, chất lượng ảnh anime của AnimeGANv3 như thế nào?')
    .setHelpText('Nếu chưa từng dùng app khác, hãy chọn 3 (Trung bình)')
    .setBounds(1, 5)
    .setLabels('Kém hơn nhiều', 'Tốt hơn nhiều')
    .setRequired(true);

  // Đánh giá grid cho các tiêu chí
  var gridItem5_3 = form.addGridItem();
  gridItem5_3.setTitle('5.3. Đánh giá AnimeGANv3 theo các tiêu chí so với ứng dụng anime khác');
  gridItem5_3.setHelpText('1 = Kém hơn nhiều | 2 = Kém hơn | 3 = Tương đương | 4 = Tốt hơn | 5 = Tốt hơn nhiều');
  gridItem5_3.setRows([
    'Chất lượng khuôn mặt',
    'Bảo toàn nhận dạng',
    'Tính thẩm mỹ / đẹp mắt',
    'Phong cách anime chân thực',
    'Xử lý nền / bối cảnh',
    'Đa dạng phong cách'
  ]);
  gridItem5_3.setColumns(['1 - Kém hơn nhiều', '2 - Kém hơn', '3 - Tương đương', '4 - Tốt hơn', '5 - Tốt hơn nhiều']);
  gridItem5_3.setRequired(true);

  // Xếp hạng tiêu chí quan trọng
  var gridItem5_4 = form.addGridItem();
  gridItem5_4.setTitle('5.4. Khi đánh giá ảnh anime, bạn coi trọng tiêu chí nào nhất?');
  gridItem5_4.setHelpText('1 = Ít quan trọng | 5 = Cực kỳ quan trọng');
  gridItem5_4.setRows([
    'Chất lượng chi tiết khuôn mặt (mắt, mũi, miệng)',
    'Bảo toàn đặc điểm nhận dạng cá nhân',
    'Tính thẩm mỹ / đẹp mắt',
    'Giống phong cách anime thực sự',
    'Bảo toàn nền / bối cảnh',
    'Không có lỗi / artifact',
    'Tốc độ xử lý nhanh',
    'Đa dạng phong cách (nhiều style khác nhau)'
  ]);
  gridItem5_4.setColumns(['1', '2', '3', '4', '5']);
  gridItem5_4.setRequired(true);

  // =====================================================
  // PHẦN 6: ĐÁNH GIÁ ỨNG DỤNG THỰC TẾ
  // =====================================================

  form.addPageBreakItem()
    .setTitle('PHẦN 6: ĐÁNH GIÁ TÍNH ỨNG DỤNG THỰC TẾ')
    .setHelpText(
      'Đánh giá khả năng ứng dụng thực tế của hệ thống AnimeGANv3 trong đời sống.'
    );

  form.addScaleItem()
    .setTitle('6.1. Bạn có sẵn sàng sử dụng hệ thống này để chuyển đổi ảnh cá nhân không?')
    .setHelpText('1 = Hoàn toàn không | 5 = Chắc chắn sẽ dùng')
    .setBounds(1, 5)
    .setLabels('Hoàn toàn không', 'Chắc chắn sẽ dùng')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('6.2. Bạn sẽ sử dụng ảnh anime được tạo ra cho mục đích gì? (Chọn tất cả phù hợp)')
    .setChoiceValues([
      'Ảnh đại diện (avatar) trên mạng xã hội',
      'Chia sẻ trên Facebook / Instagram / TikTok',
      'In ấn (poster, sticker, quà tặng)',
      'Tạo nội dung sáng tạo (blog, video)',
      'Giải trí cá nhân',
      'Dùng trong game / ứng dụng',
      'Thiết kế đồ họa chuyên nghiệp',
      'Không có mục đích cụ thể'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addScaleItem()
    .setTitle('6.3. Nếu hệ thống này là một ứng dụng web miễn phí, bạn có giới thiệu cho bạn bè không?')
    .setHelpText('1 = Chắc chắn không | 5 = Chắc chắn sẽ giới thiệu')
    .setBounds(1, 5)
    .setLabels('Chắc chắn không', 'Chắc chắn giới thiệu')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6.4. Bạn mong muốn sử dụng hệ thống trên nền tảng nào?')
    .setChoiceValues([
      'Website (truy cập bằng trình duyệt)',
      'Ứng dụng điện thoại (iOS/Android)',
      'Phần mềm trên máy tính (Desktop app)',
      'Bot trên Telegram / Messenger / Zalo',
      'Không quan tâm nền tảng'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addScaleItem()
    .setTitle('6.5. Bạn sẵn sàng chờ bao lâu để xử lý MỘT ảnh? (Đánh giá mức chấp nhận)')
    .setHelpText('1 = Phải dưới 1 giây | 2 = Dưới 3 giây | 3 = Dưới 10 giây | 4 = Dưới 30 giây | 5 = Không quan tâm thời gian')
    .setBounds(1, 5)
    .setLabels('Dưới 1 giây', 'Không quan tâm')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('6.6. Bạn có sẵn sàng trả phí cho dịch vụ chuyển đổi ảnh anime chất lượng cao không?')
    .setChoiceValues([
      'Không, tôi chỉ dùng miễn phí',
      'Có, nếu giá dưới 10.000 VNĐ/ảnh',
      'Có, nếu giá dưới 50.000 VNĐ/ảnh',
      'Có, sẵn sàng trả phí cho gói tháng/năm',
      'Tùy thuộc vào chất lượng'
    ])
    .setRequired(true);

  // Đánh giá giao diện web (nếu đã trải nghiệm)
  form.addMultipleChoiceItem()
    .setTitle('6.7. Bạn đã trải nghiệm giao diện web / ứng dụng demo của hệ thống chưa?')
    .setChoiceValues([
      'Đã trải nghiệm',
      'Chưa trải nghiệm'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('6.8. [Nếu đã trải nghiệm] Đánh giá giao diện web / ứng dụng demo')
    .setHelpText('Bỏ qua nếu chưa trải nghiệm. 1 = Rất khó dùng | 5 = Rất dễ dùng, đẹp')
    .setBounds(1, 5)
    .setLabels('Rất khó dùng', 'Rất dễ dùng')
    .setRequired(false);

  form.addScaleItem()
    .setTitle('6.9. [Nếu đã trải nghiệm] Tốc độ xử lý ảnh có chấp nhận được không?')
    .setHelpText('Bỏ qua nếu chưa trải nghiệm. 1 = Quá chậm | 5 = Rất nhanh')
    .setBounds(1, 5)
    .setLabels('Quá chậm', 'Rất nhanh')
    .setRequired(false);

  // =====================================================
  // PHẦN 7: Ý KIẾN MỞ VÀ GÓP Ý
  // =====================================================

  form.addPageBreakItem()
    .setTitle('PHẦN 7: Ý KIẾN MỞ VÀ GÓP Ý')
    .setHelpText(
      'Cảm ơn bạn đã kiên nhẫn trả lời đến đây! 🙏\n\n' +
      'Phần cuối cùng này dành cho những ý kiến tự do của bạn. ' +
      'Mọi góp ý đều rất có giá trị cho việc cải thiện hệ thống.'
    );

  form.addParagraphTextItem()
    .setTitle('7.1. Theo bạn, ưu điểm NỔI BẬT NHẤT của hệ thống AnimeGANv3 là gì?')
    .setHelpText('Có thể viết ngắn gọn hoặc chi tiết tùy ý')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('7.2. Theo bạn, nhược điểm hoặc điểm cần CẢI THIỆN nhất là gì?')
    .setHelpText('Ví dụ: chất lượng mắt, đường nét, màu sắc, tốc độ, giao diện...')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('7.3. Bạn mong muốn tính năng gì thêm cho hệ thống?')
    .setHelpText('Ví dụ: nhiều phong cách anime, xử lý video, tùy chỉnh mức độ chuyển đổi...')
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('7.4. Bạn muốn hệ thống hỗ trợ phong cách anime của đạo diễn/studio nào? (Chọn tất cả)')
    .setChoiceValues([
      'Hayao Miyazaki (Studio Ghibli) — Spirited Away, Totoro',
      'Makoto Shinkai — Your Name, Weathering With You',
      'Satoshi Kon — Perfect Blue, Paprika',
      'Mamoru Hosoda — Wolf Children, The Boy and the Beast',
      'Kyoto Animation (KyoAni) — Violet Evergarden, K-On!',
      'Ufotable — Demon Slayer (Kimetsu no Yaiba)',
      'MAPPA — Jujutsu Kaisen, Attack on Titan',
      'A-1 Pictures — Sword Art Online, Kaguya-sama',
      'Phong cách manga (trắng đen)',
      'Phong cách chibi / dễ thương',
      'Không có ý kiến'
    ])
    .showOtherOption(true)
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('7.5. Góp ý tự do / Bất kỳ ý kiến nào khác')
    .setHelpText('Cảm ơn bạn! Mọi ý kiến đều được trân trọng.')
    .setRequired(false);

  form.addScaleItem()
    .setTitle('7.6. Đánh giá tổng thể: Bạn hài lòng bao nhiêu với kết quả chuyển đổi ảnh anime của AnimeGANv3?')
    .setHelpText('Đây là đánh giá tổng hợp cuối cùng của bạn')
    .setBounds(1, 10)
    .setLabels('Rất không hài lòng', 'Cực kỳ hài lòng')
    .setRequired(true);

  // =====================================================
  // HOÀN TẤT
  // =====================================================
  
  Logger.log('✅ Form đã được tạo thành công!');
  Logger.log('📋 URL Form: ' + form.getPublishedUrl());
  Logger.log('✏️ URL Chỉnh sửa: ' + form.getEditUrl());
  Logger.log('');
  Logger.log('📌 BƯỚC TIẾP THEO:');
  Logger.log('1. Mở URL chỉnh sửa ở trên');
  Logger.log('2. Thêm ảnh vào các vị trí đã đánh dấu [THÊM ẢNH TẠI ĐÂY]');
  Logger.log('3. Upload ảnh từ thư mục figChap3/style_results/ của repo');
  Logger.log('4. Tùy chỉnh theme/màu sắc form theo ý muốn');
  Logger.log('5. Gửi form cho người tham gia khảo sát');
  
  // Hiển thị hộp thoại với URL (nếu chạy từ container-bound script, nếu không sẽ bỏ qua)
  try {
    var ui = FormApp.getUi();
    ui.alert(
      '✅ Tạo Form Thành Công!',
      'Form đã được tạo trong Google Drive của bạn.\n\n' +
      '📋 URL công khai:\n' + form.getPublishedUrl() + '\n\n' +
      '✏️ URL chỉnh sửa:\n' + form.getEditUrl() + '\n\n' +
      '📌 Đừng quên thêm ảnh mẫu vào form!\n' +
      '(Xem hướng dẫn trong tab Logs: View → Logs)',
      ui.ButtonSet.OK
    );
  } catch (e) {
    Logger.log('💡 Lưu ý: Chạy ở chế độ Standalone. Kết quả và link chỉnh sửa đã được in ở trên trong Logs (Nhấn Ctrl + Enter hoặc chọn View -> Execution log).');
  }
  
  return form;
}

/**
 * Hàm phụ: Tạo thư mục ảnh trên Google Drive để upload
 * Chạy hàm này nếu muốn upload ảnh lên Drive trước
 */
function createImageFolder() {
  var folder = DriveApp.createFolder('AnimeGANv3_Survey_Images');
  Logger.log('📁 Thư mục ảnh đã tạo: ' + folder.getUrl());
  Logger.log('');
  Logger.log('Hãy upload các ảnh sau vào thư mục này:');
  Logger.log('');
  Logger.log('Ảnh gốc:');
  Logger.log('  • a1.png — Ảnh chân dung đơn (cô gái bãi biển)');
  Logger.log('  • a2.png — Ảnh nhóm (2 người)');
  Logger.log('  • a3.png — Ảnh góc nghiêng');
  Logger.log('');
  Logger.log('Kết quả Hybrid Mode:');
  Logger.log('  • e1.jpg, e2.jpg, e3.jpg');
  Logger.log('');
  Logger.log('Kết quả Landscape Mode:');
  Logger.log('  • b1.jpg, b2.jpg, b3.jpg');
  Logger.log('');
  Logger.log('Cắt mặt từ Landscape:');
  Logger.log('  • c1.png, c2.png, c3.png');
  Logger.log('');
  Logger.log('Kết quả Face Mode:');
  Logger.log('  • d1.jpg, d2.jpg, d3.jpg');
  
  return folder;
}

/**
 * Hàm phụ: Xóa form đã tạo (dùng khi cần tạo lại)
 * Thay FORM_ID bằng ID thực tế của form
 */
function deleteForm(formId) {
  if (!formId) {
    Logger.log('⚠️ Cần truyền FORM_ID. Ví dụ: deleteForm("abc123xyz")');
    return;
  }
  try {
    DriveApp.getFileById(formId).setTrashed(true);
    Logger.log('🗑️ Form đã được chuyển vào thùng rác.');
  } catch (e) {
    Logger.log('❌ Lỗi: ' + e.message);
  }
}
