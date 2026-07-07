/**
 * =============================================================================
 * KHẢO SÁT ĐÁNH GIÁ HỆ THỐNG CHUYỂN ĐỔI ẢNH ANIME - AnimeGANv3 (DTGAN)
 * =============================================================================
 * 
 * Google Apps Script tạo Google Form tự động cho luận văn thạc sĩ.
 * 
 * PHIÊN BẢN ĐÃ CHỈNH SỬA THEO CHECKLIST REVIEW:
 *   - Gộp Phần 2 + 3: so sánh Input → Lens mode → Hybrid mode (5 bộ ảnh)
 *   - Phần 4: tách riêng cho nhóm chuyên môn, bỏ câu trùng, bổ sung ảnh
 *   - Phần 5: bộ ảnh dài so sánh TikTok/Snapchat, tiêu chí đồng bộ
 *   - Phần 6: bỏ câu "sẵn sàng chờ bao lâu"
 *   - Phần 7: rút gọn còn 2 câu hỏi mở + điểm tổng thể
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
 * - Bố trí ảnh: phóng to khuôn mặt nhét vào góc trên bên phải của ảnh chính
 * - Mỗi bộ ảnh gồm 3 ảnh: Input, Lens mode, Hybrid mode
 * 
 * Tác giả: Nguyễn Trọng Nhân - MSSV: 24025149
 * Luận văn: Mạng đối nghịch tạo sinh trong chuyển đổi ảnh chân dung sang phong cách Anime
 * =============================================================================
 */

function createAnimeGANSurvey() {
  // =====================================================
  // TẠO FORM
  // =====================================================
  var form = FormApp.create('Khảo sát đánh giá hệ thống chuyển đổi ảnh chân dung sang phong cách Anime');
  
  form.setDescription(
    '📋 KHẢO SÁT ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG CHUYỂN ĐỔI ẢNH ANIME\n\n' +
    'Xin chào! Cảm ơn bạn đã dành thời gian tham gia khảo sát.\n\n' +
    'Khảo sát này là một phần của luận văn thạc sĩ nghiên cứu về hệ thống chuyển đổi ảnh chân dung sang phong cách anime ' +
    'sử dụng mạng đối nghịch tạo sinh (GAN).\n\n' +
    'Hệ thống có 2 chế độ xử lý chính:\n' +
    '• Lens mode: Xử lý toàn bộ ảnh, giữ nguyên bố cục và nền\n' +
    '• Hybrid mode: Phát hiện khuôn mặt, xử lý riêng từng khuôn mặt ở độ phân giải cao rồi ghép lại với nền — đây là đóng góp chính của luận văn\n\n' +
    '⏱️ Thời gian ước tính: 7-10 phút\n' +
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
  // PHẦN 1: THÔNG TIN NGƯỜI THAM GIA (GIỮ NGUYÊN)
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
  // PHẦN 2: SO SÁNH CHẤT LƯỢNG CHUYỂN ĐỔI
  // (GỘP Phần 2 + 3 cũ theo checklist)
  // So sánh 3 ảnh: Input → Lens mode → Hybrid mode
  // 5 bộ ảnh đa dạng (đơn, nhóm, nghiêng)
  // =====================================================
  
  form.addPageBreakItem()
    .setTitle('PHẦN 2: SO SÁNH CHẤT LƯỢNG CHUYỂN ĐỔI')
    .setHelpText(
      'Phần này so sánh kết quả giữa 2 chế độ xử lý của hệ thống:\n\n' +
      '🔵 Lens mode: Xử lý toàn bộ ảnh gốc → giữ bố cục nhưng khuôn mặt có thể kém chi tiết\n' +
      '🟢 Hybrid mode: Phát hiện khuôn mặt → xử lý riêng từng khuôn mặt ở độ phân giải cao → ghép lại với nền\n\n' +
      'Với mỗi bộ ảnh, bạn sẽ thấy 3 ảnh:\n' +
      '• Ảnh Input (ảnh gốc)\n' +
      '• Ảnh Lens mode (chưa xử lý riêng khuôn mặt)\n' +
      '• Ảnh Hybrid mode (có tách và xử lý riêng khuôn mặt — đóng góp của nghiên cứu)\n\n' +
      '📌 LƯU Ý: Khuôn mặt đã được phóng to ở góc ảnh để bạn so sánh chi tiết dễ dàng hơn.\n' +
      'Hãy quan sát kỹ vùng KHUÔN MẶT (mắt, biểu cảm, tóc) trước khi trả lời.'
    );

  // --- Bộ ảnh 1: Ảnh chân dung đơn (thẳng mặt) ---
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ ảnh 1: Ảnh chân dung đơn (thẳng mặt)')
    .setHelpText(
      '[THÊM 3 ẢNH TẠI ĐÂY]\n' +
      '• Ảnh Input (gốc) — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Lens mode — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Hybrid mode — có phóng to khuôn mặt ở góc trên phải'
    );

  form.addMultipleChoiceItem()
    .setTitle('2.1. [Bộ 1 – Ảnh đơn thẳng mặt] Khuôn mặt ở ảnh nào sắc nét và tự nhiên hơn?')
    .setChoiceValues([
      'Lens mode — khuôn mặt đã đủ tốt',
      'Hybrid mode — khuôn mặt rõ ràng sắc nét hơn',
      'Cả hai như nhau, không thấy khác biệt'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.2. [Bộ 1] Đánh giá chi tiết MẮT trong ảnh Hybrid mode')
    .setHelpText('Mắt có to, sáng, long lanh kiểu anime không?')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.3. [Bộ 1] Đánh giá BIỂU CẢM khuôn mặt trong ảnh Hybrid mode')
    .setHelpText('Biểu cảm gốc (cười, nghiêm túc...) có được giữ lại không?')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn biểu cảm', 'Giữ nguyên biểu cảm')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.4. [Bộ 1] Đánh giá TÓC TAI trong ảnh Hybrid mode')
    .setHelpText('Kiểu tóc, đường nét tóc có đẹp và tự nhiên không?')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  // --- Bộ ảnh 2: Ảnh nhóm nhiều người ---
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ ảnh 2: Ảnh nhóm (nhiều người)')
    .setHelpText(
      '[THÊM 3 ẢNH TẠI ĐÂY]\n' +
      '• Ảnh Input (gốc) — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Lens mode — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Hybrid mode — có phóng to khuôn mặt ở góc trên phải'
    );

  form.addMultipleChoiceItem()
    .setTitle('2.5. [Bộ 2 – Ảnh nhóm] Khuôn mặt ở ảnh nào sắc nét và tự nhiên hơn?')
    .setChoiceValues([
      'Lens mode — khuôn mặt đã đủ tốt',
      'Hybrid mode — khuôn mặt rõ ràng sắc nét hơn',
      'Cả hai như nhau, không thấy khác biệt'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.6. [Bộ 2] Đánh giá chi tiết MẮT trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.7. [Bộ 2] Đánh giá BIỂU CẢM khuôn mặt trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn biểu cảm', 'Giữ nguyên biểu cảm')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.8. [Bộ 2] Đánh giá TÓC TAI trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  // --- Bộ ảnh 3: Ảnh chân dung góc nghiêng ---
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ ảnh 3: Ảnh chân dung góc nghiêng')
    .setHelpText(
      '[THÊM 3 ẢNH TẠI ĐÂY]\n' +
      '• Ảnh Input (gốc) — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Lens mode — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Hybrid mode — có phóng to khuôn mặt ở góc trên phải'
    );

  form.addMultipleChoiceItem()
    .setTitle('2.9. [Bộ 3 – Ảnh nghiêng] Khuôn mặt ở ảnh nào sắc nét và tự nhiên hơn?')
    .setChoiceValues([
      'Lens mode — khuôn mặt đã đủ tốt',
      'Hybrid mode — khuôn mặt rõ ràng sắc nét hơn',
      'Cả hai như nhau, không thấy khác biệt'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.10. [Bộ 3] Đánh giá chi tiết MẮT trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.11. [Bộ 3] Đánh giá BIỂU CẢM khuôn mặt trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn biểu cảm', 'Giữ nguyên biểu cảm')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.12. [Bộ 3] Đánh giá TÓC TAI trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  // --- Bộ ảnh 4: Ảnh chân dung đơn (khác) ---
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ ảnh 4: Ảnh chân dung đơn (khác)')
    .setHelpText(
      '[THÊM 3 ẢNH TẠI ĐÂY]\n' +
      '• Ảnh Input (gốc) — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Lens mode — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Hybrid mode — có phóng to khuôn mặt ở góc trên phải'
    );

  form.addMultipleChoiceItem()
    .setTitle('2.13. [Bộ 4] Khuôn mặt ở ảnh nào sắc nét và tự nhiên hơn?')
    .setChoiceValues([
      'Lens mode — khuôn mặt đã đủ tốt',
      'Hybrid mode — khuôn mặt rõ ràng sắc nét hơn',
      'Cả hai như nhau, không thấy khác biệt'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.14. [Bộ 4] Đánh giá chi tiết MẮT trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.15. [Bộ 4] Đánh giá BIỂU CẢM khuôn mặt trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn biểu cảm', 'Giữ nguyên biểu cảm')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.16. [Bộ 4] Đánh giá TÓC TAI trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  // --- Bộ ảnh 5: Ảnh nhóm / góc nghiêng / đa dạng ---
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ ảnh 5: Ảnh đa dạng')
    .setHelpText(
      '[THÊM 3 ẢNH TẠI ĐÂY]\n' +
      '• Ảnh Input (gốc) — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Lens mode — có phóng to khuôn mặt ở góc trên phải\n' +
      '• Ảnh Hybrid mode — có phóng to khuôn mặt ở góc trên phải'
    );

  form.addMultipleChoiceItem()
    .setTitle('2.17. [Bộ 5] Khuôn mặt ở ảnh nào sắc nét và tự nhiên hơn?')
    .setChoiceValues([
      'Lens mode — khuôn mặt đã đủ tốt',
      'Hybrid mode — khuôn mặt rõ ràng sắc nét hơn',
      'Cả hai như nhau, không thấy khác biệt'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.18. [Bộ 5] Đánh giá chi tiết MẮT trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.19. [Bộ 5] Đánh giá BIỂU CẢM khuôn mặt trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn biểu cảm', 'Giữ nguyên biểu cảm')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.20. [Bộ 5] Đánh giá TÓC TAI trong ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Rất kém', 'Rất tốt')
    .setRequired(true);

  // --- Đánh giá tổng hợp phần 2 ---
  form.addSectionHeaderItem()
    .setTitle('📊 Đánh giá tổng hợp sau khi xem tất cả 5 bộ ảnh')
    .setHelpText('Dựa trên tất cả các bộ ảnh bạn vừa xem, hãy trả lời các câu hỏi tổng hợp.');

  form.addScaleItem()
    .setTitle('2.21. Nhìn chung, Hybrid mode có cải thiện chất lượng khuôn mặt so với Lens mode không?')
    .setHelpText('1 = Không cải thiện / tệ hơn | 5 = Cải thiện rõ rệt')
    .setBounds(1, 5)
    .setLabels('Không cải thiện', 'Cải thiện rõ rệt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.22. Đường ghép giữa vùng khuôn mặt và nền trong Hybrid mode có tự nhiên không?')
    .setHelpText('Quan sát viền ghép giữa vùng mặt (xử lý riêng) và nền (xử lý chung)')
    .setBounds(1, 5)
    .setLabels('Rất lộ, rõ ràng', 'Hoàn toàn không thấy')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('2.23. Mức độ bảo toàn đặc điểm nhận dạng (nhận ra là cùng một người)')
    .setHelpText('So sánh ảnh gốc với ảnh Hybrid mode')
    .setBounds(1, 5)
    .setLabels('Không nhận ra', 'Nhận ra ngay')
    .setRequired(true);

  // =====================================================
  // PHẦN 3: ĐÁNH GIÁ MODULE TRÍCH XUẤT KHUÔN MẶT
  // (DÀNH CHO NGƯỜI CÓ CHUYÊN MÔN KỸ THUẬT)
  // =====================================================

  form.addPageBreakItem()
    .setTitle('PHẦN 3: ĐÁNH GIÁ MODULE TRÍCH XUẤT KHUÔN MẶT')
    .setHelpText(
      '⚙️ PHẦN NÀY DÀNH CHO NGƯỜI CÓ CHUYÊN MÔN KỸ THUẬT\n' +
      '(Kỹ sư CNTT, lập trình viên, nhà nghiên cứu, nhiếp ảnh gia, người sáng tạo nội dung)\n\n' +
      'Module Face Extraction sử dụng RetinaFace (mạng phát hiện khuôn mặt) để:\n' +
      '1. Tự động phát hiện khuôn mặt trong ảnh\n' +
      '2. Mở rộng vùng cắt (margin = 50%) để bao gồm tóc, tai, cổ\n' +
      '3. Cắt và resize về 512×512 trước khi chuyển đổi anime\n' +
      '4. Ghép khuôn mặt đã chuyển đổi lại vào nền bằng feathered blending\n\n' +
      'Nếu bạn không có chuyên môn kỹ thuật, có thể bỏ qua phần này.'
    );

  form.addScaleItem()
    .setTitle('3.1. Tầm quan trọng: Việc phát hiện và cắt riêng khuôn mặt trước khi chuyển đổi anime có quan trọng không?')
    .setHelpText('1 = Không quan trọng, xử lý toàn ảnh là đủ | 5 = Rất quan trọng, ảnh hưởng lớn đến chất lượng')
    .setBounds(1, 5)
    .setLabels('Không quan trọng', 'Rất quan trọng')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('3.2. Vùng cắt khuôn mặt (margin) có bao gồm đủ bối cảnh không? (tóc, tai, cổ, vai)')
    .setHelpText(
      '[THÊM ẢNH MINH HỌA TẠI ĐÂY]\n' +
      'Hình minh họa: ảnh Face Mode cho thấy vùng cắt bao gồm tóc, tai, cổ.\n' +
      'Quan sát ảnh và đánh giá vùng cắt có đủ rộng không.'
    )
    .setChoiceValues([
      'Quá ít — Cắt mất tóc, tai',
      'Vừa đủ — Bao gồm đủ tóc, tai, cổ',
      'Quá rộng — Thừa nhiều nền không cần thiết',
      'Không chắc chắn'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.3. Chất lượng kết cấu da (skin texture) trong ảnh Hybrid mode')
    .setHelpText('Ảnh anime nên có da mịn, đặc trưng phong cách hoạt hình')
    .setBounds(1, 5)
    .setLabels('Thô, giữ nguyên ảnh thật', 'Mịn, rất anime')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.4. Chất lượng MẮT trong ảnh Hybrid mode')
    .setHelpText('Mắt là đặc trưng quan trọng nhất trong anime — nên to, sáng, long lanh')
    .setBounds(1, 5)
    .setLabels('Không giống anime', 'Rất anime, long lanh')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.5. Bảo toàn BIỂU CẢM khuôn mặt (expression) sau chuyển đổi')
    .setHelpText('Biểu cảm gốc (cười, nghiêm túc...) có được giữ lại trong ảnh anime không?')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn biểu cảm', 'Giữ nguyên biểu cảm')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.6. Bảo toàn TÓC TAI (kiểu tóc, đường nét tóc)')
    .setHelpText('Kiểu tóc gốc có được giữ lại? Đường nét tóc anime có đẹp không?')
    .setBounds(1, 5)
    .setLabels('Mất hoàn toàn', 'Giữ rất tốt')
    .setRequired(true);

  form.addScaleItem()
    .setTitle('3.7. Bảo toàn đặc điểm nhận diện cá nhân (identity)')
    .setHelpText('Người xem có thể nhận ra đây là cùng một người với ảnh gốc không?')
    .setBounds(1, 5)
    .setLabels('Không nhận ra', 'Nhận ra ngay lập tức')
    .setRequired(true);

  // =====================================================
  // PHẦN 4: SO SÁNH VỚI CÁC PHƯƠNG PHÁP KHÁC
  // (Bộ ảnh dài, tiêu chí đồng bộ)
  // =====================================================

  form.addPageBreakItem()
    .setTitle('PHẦN 4: SO SÁNH VỚI CÁC PHƯƠNG PHÁP KHÁC')
    .setHelpText(
      'Phần này so sánh kết quả chuyển đổi anime của hệ thống với các ứng dụng phổ biến khác.\n\n' +
      'Dưới đây là bộ ảnh so sánh: mỗi cột là kết quả từ một phương pháp/ứng dụng khác nhau.\n' +
      'Hãy so sánh và đánh giá dựa trên các tiêu chí: MẮT, BIỂU CẢM, TÓC TAI.'
    );

  // Bộ ảnh so sánh dài
  form.addSectionHeaderItem()
    .setTitle('📸 Bộ ảnh so sánh: Phương pháp của chúng tôi vs TikTok, Snapchat và ứng dụng khác')
    .setHelpText(
      '[THÊM BỘ ẢNH SO SÁNH DÀI TẠI ĐÂY]\n' +
      'Bố trí: mỗi cột là output của một phương pháp:\n' +
      '• Cột 1: Ảnh Input (gốc)\n' +
      '• Cột 2: Kết quả TikTok Anime Filter\n' +
      '• Cột 3: Kết quả Snapchat Anime Lens\n' +
      '• Cột 4: Kết quả ứng dụng khác\n' +
      '• Cột 5: Kết quả Hybrid mode (hệ thống của chúng tôi)\n\n' +
      'Nhiều dòng ảnh khác nhau để so sánh toàn diện.'
    );

  form.addCheckboxItem()
    .setTitle('4.1. Bạn đã từng sử dụng ứng dụng/filter anime nào sau đây? (Chọn tất cả đã dùng)')
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

  form.addMultipleChoiceItem()
    .setTitle('4.2. Dựa trên bộ ảnh so sánh trên, bạn thích kết quả của phương pháp nào nhất?')
    .setChoiceValues([
      'TikTok Anime Filter',
      'Snapchat Anime Lens',
      'Ứng dụng khác',
      'Hybrid mode (hệ thống của chúng tôi)',
      'Không thấy khác biệt đáng kể'
    ])
    .setRequired(true);

  // Grid đánh giá theo tiêu chí đồng bộ: mắt, biểu cảm, tóc tai
  var gridItem4_3 = form.addGridItem();
  gridItem4_3.setTitle('4.3. Đánh giá Hybrid mode (hệ thống của chúng tôi) theo các tiêu chí so với ứng dụng khác');
  gridItem4_3.setHelpText('1 = Kém hơn nhiều | 2 = Kém hơn | 3 = Tương đương | 4 = Tốt hơn | 5 = Tốt hơn nhiều');
  gridItem4_3.setRows([
    'Chất lượng MẮT',
    'Bảo toàn BIỂU CẢM',
    'Chất lượng TÓC TAI',
    'Bảo toàn đặc điểm nhận dạng (identity)',
    'Tính thẩm mỹ / đẹp mắt tổng thể'
  ]);
  gridItem4_3.setColumns(['1 - Kém hơn nhiều', '2 - Kém hơn', '3 - Tương đương', '4 - Tốt hơn', '5 - Tốt hơn nhiều']);
  gridItem4_3.setRequired(true);

  // =====================================================
  // PHẦN 5: ĐÁNH GIÁ TÍNH ỨNG DỤNG THỰC TẾ
  // (Bỏ câu "sẵn sàng chờ bao lâu")
  // =====================================================

  form.addPageBreakItem()
    .setTitle('PHẦN 5: ĐÁNH GIÁ TÍNH ỨNG DỤNG THỰC TẾ')
    .setHelpText(
      'Đánh giá khả năng ứng dụng thực tế của hệ thống trong đời sống.'
    );

  form.addScaleItem()
    .setTitle('5.1. Bạn có sẵn sàng sử dụng hệ thống này để chuyển đổi ảnh cá nhân không?')
    .setHelpText('1 = Hoàn toàn không | 5 = Chắc chắn sẽ dùng')
    .setBounds(1, 5)
    .setLabels('Hoàn toàn không', 'Chắc chắn sẽ dùng')
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('5.2. Bạn sẽ sử dụng ảnh anime được tạo ra cho mục đích gì? (Chọn tất cả phù hợp)')
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
    .setTitle('5.3. Nếu hệ thống này là một ứng dụng web miễn phí, bạn có giới thiệu cho bạn bè không?')
    .setHelpText('1 = Chắc chắn không | 5 = Chắc chắn sẽ giới thiệu')
    .setBounds(1, 5)
    .setLabels('Chắc chắn không', 'Chắc chắn giới thiệu')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('5.4. Bạn mong muốn sử dụng hệ thống trên nền tảng nào?')
    .setChoiceValues([
      'Website (truy cập bằng trình duyệt)',
      'Ứng dụng điện thoại (iOS/Android)',
      'Phần mềm trên máy tính (Desktop app)',
      'Bot trên Telegram / Messenger / Zalo',
      'Không quan tâm nền tảng'
    ])
    .showOtherOption(true)
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('5.5. Bạn có sẵn sàng trả phí cho dịch vụ chuyển đổi ảnh anime chất lượng cao không?')
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
    .setTitle('5.6. Bạn đã trải nghiệm giao diện web / ứng dụng demo của hệ thống chưa?')
    .setChoiceValues([
      'Đã trải nghiệm',
      'Chưa trải nghiệm'
    ])
    .setRequired(true);

  form.addScaleItem()
    .setTitle('5.7. [Nếu đã trải nghiệm] Đánh giá giao diện web / ứng dụng demo')
    .setHelpText('Bỏ qua nếu chưa trải nghiệm. 1 = Rất khó dùng | 5 = Rất dễ dùng, đẹp')
    .setBounds(1, 5)
    .setLabels('Rất khó dùng', 'Rất dễ dùng')
    .setRequired(false);

  form.addScaleItem()
    .setTitle('5.8. [Nếu đã trải nghiệm] Tốc độ xử lý ảnh có chấp nhận được không?')
    .setHelpText('Bỏ qua nếu chưa trải nghiệm. 1 = Quá chậm | 5 = Rất nhanh')
    .setBounds(1, 5)
    .setLabels('Quá chậm', 'Rất nhanh')
    .setRequired(false);

  // =====================================================
  // PHẦN 6: Ý KIẾN MỞ VÀ GÓP Ý
  // (Rút gọn: 2 câu hỏi mở + điểm tổng thể)
  // =====================================================

  form.addPageBreakItem()
    .setTitle('PHẦN 6: Ý KIẾN MỞ VÀ GÓP Ý')
    .setHelpText(
      'Cảm ơn bạn đã kiên nhẫn trả lời đến đây! 🙏\n\n' +
      'Phần cuối cùng này dành cho những ý kiến tự do của bạn. ' +
      'Mọi góp ý đều rất có giá trị cho việc cải thiện hệ thống.'
    );

  form.addParagraphTextItem()
    .setTitle('6.1. Theo bạn, ưu điểm NỔI BẬT NHẤT của hệ thống là gì?')
    .setHelpText('Có thể viết ngắn gọn hoặc chi tiết tùy ý')
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('6.2. Theo bạn, nhược điểm hoặc điểm cần CẢI THIỆN nhất là gì?')
    .setHelpText('Ví dụ: chất lượng mắt, đường nét, tóc, tốc độ, giao diện...')
    .setRequired(false);

  form.addScaleItem()
    .setTitle('6.3. Đánh giá tổng thể: Bạn hài lòng bao nhiêu với kết quả chuyển đổi ảnh anime của hệ thống?')
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
  Logger.log('3. Bố trí ảnh: phóng to khuôn mặt nhét vào góc trên bên phải ảnh chính');
  Logger.log('4. Mỗi bộ ảnh gồm 3 ảnh: Input, Lens mode, Hybrid mode');
  Logger.log('5. Phần so sánh TikTok/Snapchat: tạo ảnh dạng grid (mỗi cột = 1 phương pháp)');
  Logger.log('6. Tùy chỉnh theme/màu sắc form theo ý muốn');
  Logger.log('7. Gửi form cho người tham gia khảo sát');
  
  // Hiển thị hộp thoại với URL (nếu chạy từ container-bound script)
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
  Logger.log('=== 5 BỘ ẢNH SO SÁNH (Input vs Lens vs Hybrid) ===');
  Logger.log('Mỗi bộ gồm 3 ảnh, khuôn mặt phóng to nhét góc trên phải:');
  Logger.log('  Bộ 1: Ảnh chân dung đơn (thẳng mặt)');
  Logger.log('  Bộ 2: Ảnh nhóm (nhiều người)');
  Logger.log('  Bộ 3: Ảnh chân dung góc nghiêng');
  Logger.log('  Bộ 4: Ảnh chân dung đơn (khác)');
  Logger.log('  Bộ 5: Ảnh đa dạng');
  Logger.log('');
  Logger.log('=== BỘ ẢNH SO SÁNH DÀI (vs TikTok/Snapchat) ===');
  Logger.log('  Grid: Input | TikTok | Snapchat | Ứng dụng khác | Hybrid mode');
  Logger.log('');
  Logger.log('=== ẢNH MINH HỌA MODULE FACE EXTRACTION ===');
  Logger.log('  Ảnh Face Mode cho thấy vùng cắt bao gồm tóc, tai, cổ');
  
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
