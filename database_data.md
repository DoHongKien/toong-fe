# Dữ liệu Mẫu Cơ Sở Dữ Liệu (SQL Data)
Dự án: **Toong Adventure Clone**

Dưới đây là các câu lệnh `INSERT` để tạo dữ liệu giả lập dựa trên thông tin từ React components và pages.

```sql
USE toong_db;

-- ==========================================
-- 1. DỮ LIỆU BẢNG TOURS
-- ==========================================
INSERT INTO tours (id, name, slug, hero_image, card_image, badge, region, duration_days, duration_nights, difficulty, distance_km, min_age, max_age, summary, description, base_price) VALUES
(1, 'Tà Năng - Phan Dũng', 'ta-nang-phan-dung', 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'Best Seller', 'taynguyen', 2, 1, 'Vừa phải', 30, 12, 50, 'Cung đường trekking đẹp nhất Việt Nam, băng qua những đồi cỏ xanh ngút ngàn.', 'Tà Năng - Phan Dũng băng qua ba tỉnh Lâm Đồng, Ninh Thuận, Bình Thuận. Khởi đầu từ những đồi thông xanh ngát của xứ lạnh, đi qua những đồi cỏ trập trùng, trải nghiệm cảnh sắc thay đổi kỳ diệu từ rừng rậm đến những đồng cỏ cháy, kết thúc tại cái nắng gió của miền duyên hải.', 2990000.00),
(2, 'Vườn Quốc Gia Bù Gia Mập', 'bu-gia-map', 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 'New', 'nam', 2, 1, 'Dễ', 15, 6, 60, 'Khám phá hệ sinh thái đa dạng, tắm suối mát lạnh giữa rừng nguyên sinh.', 'Bù Gia Mập - Cung đường khám phá cánh rừng xanh đa dạng nằm trên sự phì nhiêu của mảnh đất phù sa cổ, cách Sài Gòn chỉ hơn 200km. Hành trình 2 ngày 1 đêm walking xuyên địa hình rừng nhiệt đới ẩm thường xanh...', 2500000.00),
(3, '8 Nàng Tiên - Ninh Thuận', '8-nang-tien', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'trung', 3, 2, 'Thử thách', 40, 15, 45, 'Chinh phục cung đường ven biển tuyệt đẹp, cắm trại lấp lánh dưới dải ngân hà.', 'Hành trình chinh phục những cung đường ven biển Phan Rang, Ninh Thuận với vẻ đẹp hoang sơ, hùng vĩ của những vách đá và biển xanh ngắt.', 3200000.00),
(4, 'Đỉnh Bidoup Núi Bà', 'bidoup', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'taynguyen', 2, 1, 'Khó', 28, 12, 55, 'Thử thách nóc nhà cao nguyên Lâm Viên, băng qua rừng già nguyên sinh.', 'Chinh phục đỉnh núi cao 2.287m, đi xuyên qua khu rừng rêu huyền ảo và hệ sinh thái đa dạng của Vườn Quốc Gia Bidoup - Núi Bà.', 2800000.00),
(5, 'Cắm Trại La Ngâu', 'la-ngau', 'https://images.unsplash.com/photo-1504280390467-3334237dc6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80', 'https://images.unsplash.com/photo-1504280390467-3334237dc6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', NULL, 'trung', 2, 1, 'Rất Dễ', 5, 5, 65, 'Trải nghiệm cắm trại glamping bên suối, thư giãn tuyệt đối dịp cuối tuần.', 'Địa điểm lý tưởng cho các gia đình và nhóm bạn muốn tận hưởng không khí thiên nhiên mà không cần trekking quá nhiều.', 1990000.00);


-- ==========================================
-- 2. DỮ LIỆU BẢNG DEPARTURES (Lịch cho tour ID=1)
-- ==========================================
INSERT INTO departures (tour_id, start_date, end_date, deposit_deadline, payment_deadline, price, total_slots, booked_slots, status) VALUES
(1, '2026-04-05', '2026-04-06', '2026-03-20', '2026-04-03', 2990000.00, 20, 5, 'active'),
(1, '2026-04-19', '2026-04-20', '2026-03-21', '2026-04-17', 2990000.00, 20, 0, 'active'),
(1, '2026-05-03', '2026-05-04', '2026-03-22', '2026-05-01', 2990000.00, 20, 2, 'active'),
(1, '2026-05-05', '2026-05-06', '2026-03-23', '2026-05-03', 2990000.00, 20, 15, 'active');


-- ==========================================
-- 3. DỮ LIỆU BẢNG ITINERARIES (Tour ID=1)
-- ==========================================
INSERT INTO itineraries (id, tour_id, day_number, title, description) VALUES
(1, 1, 1, 'Chinh phục đồi cỏ Tà Năng', 'Hành trình vượt qua những con dốc đầu tiên, ngắm nhìn đồi cỏ trập trùng xanh mướt.'),
(2, 1, 2, 'Rừng thường xanh Phan Dũng', 'Di chuyển xuống dốc hướng về Bình Thuận, thay đổi thảm thực vật từ cỏ sang rừng rậm.');


-- ==========================================
-- 4. DỮ LIỆU BẢNG ITINERARY_TIMELINES (Tour ID=1)
-- ==========================================
INSERT INTO itinerary_timelines (itinerary_id, execution_time, activity) VALUES
(1, '06:00:00', 'Tập trung ăn sáng tại Tà Năng.'),
(1, '08:30:00', 'Khởi động, bắt đầu hành trình trekking qua đồng cỏ và rừng thông.'),
(1, '12:00:00', 'Nghỉ trưa bên suối, thưởng thức món ngon do porter chuẩn bị.'),
(1, '15:00:00', 'Chinh phục con dốc cao nhất hành trình, ngắm toàn cảnh đồi cỏ hùng vĩ.'),
(1, '16:30:00', 'Đến điểm hạ trại. Ngắm hoàng hôn tuyệt đẹp trên đồi cỏ.'),
(1, '18:30:00', 'Tiệc nướng BBQ, giao lưu đốt lửa trại.'),
(2, '05:30:00', 'Đón bình minh, thưởng thức cà phê sáng giữa sương sớm.'),
(2, '08:00:00', 'Bắt đầu chặng đổ dốc về Phan Dũng. Cảnh sắc thay đổi từ đồi cỏ sang rừng thường xanh.'),
(2, '12:00:00', 'Nghỉ trưa, tắm suối mát lạnh.'),
(2, '15:00:00', 'Băng qua Suối Lớn, có xe ôm trải nghiệm đón ra khỏi rừng.'),
(2, '17:00:00', 'Về đến xã Phan Dũng. Lên xe di chuyển về TP.HCM. Kết thúc hành trình.');


-- ==========================================
-- 5. DỮ LIỆU BẢNG TOUR_COST_DETAILS (Tour ID=1)
-- ==========================================
INSERT INTO tour_cost_details (tour_id, is_included, content) VALUES
(1, TRUE, 'Xe giường nằm khứ hồi và xe trung chuyển đưa đón.'),
(1, TRUE, 'Y tế: Trang thiết bị kit y tế tiêu chuẩn.'),
(1, TRUE, 'Ăn uống: bao gồm 06 bữa ăn chính.'),
(1, TRUE, 'Bãi cắm trại có nhà tắm, nhà vệ sinh.'),
(1, TRUE, 'Lều, túi ngủ, gối ngủ, tấm lót cách nhiệt.'),
(1, TRUE, 'Hướng dẫn viên chuyên nghiệp, kinh nghiệm.'),
(1, TRUE, 'Phí tham quan và lưu trú tại Vườn Quốc Gia.'),
(1, FALSE, 'Các chi phí cá nhân ngoài chương trình (vé máy bay, tàu...).'),
(1, FALSE, 'Tiền tips cho hướng dẫn và khuân vác (porter).');


-- ==========================================
-- 6. DỮ LIỆU BẢNG TOUR_LUGGAGES (Tour ID=1)
-- ==========================================
INSERT INTO tour_luggages (tour_id, name, detail) VALUES
(1, 'QUẦN ÁO', 'Mỏng nhẹ, dễ vận động, thấm hút tốt, nhanh khô.'),
(1, 'BALO', 'Có đai trợ lực, gọn nhẹ.'),
(1, 'GIÀY', 'Chọn giày có độ bám tốt, có rãnh sâu để chống trơn trượt.'),
(1, 'ĐỒ CHỐNG NẮNG', 'Kem chống nắng, mũ rộng vành, găng tay, tất.'),
(1, 'THUỐC CÁ NHÂN', 'Viên bù nước, điện giải, xịt chống côn trùng.');


-- ==========================================
-- 7. DỮ LIỆU BẢNG TOUR_FAQS (Tour ID=1)
-- ==========================================
INSERT INTO tour_faqs (tour_id, question, answer) VALUES
(1, 'Tour có phù hợp với người chưa từng trekking không?', 'Tour phù hợp với người có sức khỏe bình thường và chưa có kinh nghiệm trekking. Chúng tôi có hướng dẫn viên đi kèm suốt hành trình.'),
(1, 'Tôi có thể mang theo trẻ em không?', 'Tour phù hợp với độ tuổi từ 12 – 50 tuổi. Trẻ em dưới 12 tuổi không được khuyến khích tham gia do địa hình khá khó.'),
(1, 'Chính sách hủy tour như thế nào?', 'Hủy trước 15 ngày hoàn 70% tiền cọc. Hủy trong vòng 7-14 ngày hoàn 50%. Hủy trong vòng 7 ngày không hoàn tiền.'),
(1, 'Thời tiết tại Tà Năng – Phan Dũng như thế nào?', 'Mùa khô (tháng 12 – 4) là lý tưởng nhất với đồi cỏ vàng. Mùa mưa (tháng 6 – 10) đường dốc trơn trượt có thể tạm ngưng tổ chức.');


-- ==========================================
-- 8. DỮ LIỆU BẢNG ADVENTURE_PASSES
-- ==========================================
INSERT INTO adventure_passes (id, title, subtitle, price, validity_date, is_signature, color_theme) VALUES
(1, 'TRIAL', 'pass', 8990000.00, '2025-12-31', FALSE, 'bg-dark-green'),
(2, 'SHARING', 'pass', 17990000.00, '2025-12-31', FALSE, 'bg-orange'),
(3, 'ADVENTURE', 'pass', 37900000.00, NULL, TRUE, 'bg-black');


-- ==========================================
-- 9. DỮ LIỆU BẢNG PASS_FEATURES
-- ==========================================
INSERT INTO pass_features (pass_id, content, is_bold) VALUES
(1, '3 cung đường', TRUE),
(1, '1 Chủ sở hữu', TRUE),
(2, '6 cung đường', TRUE),
(2, 'Tối đa 3 chủ sở hữu', TRUE),
(3, '10 cung đường', TRUE),
(3, '1 Chủ sở hữu', TRUE),
(3, 'Đặc quyền thẻ phụ: Mời bạn bè đi chung tour 2 lần miễn phí', FALSE),
(3, '5 bộ môn thể thao mạo hiểm (Hiking, Lặn biển, Đu dây, SUP, Zipline)', FALSE);
```
