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


-- ==========================================
-- 10. DỮ LIỆU BẢNG MENUS (Toàn bộ Menu từ Navbar)
-- ==========================================

-- A. Menu Gốc (Level 0 - Cấu trúc Header)
INSERT INTO menus (id, parent_id, key_name, label, type, mega_accent_title, mega_main_title, mega_description, mega_image, order_index) VALUES
(1, NULL, 'natureWalking', 'Nature Walking', 'MEGA_PARENT', 'Nature Walking', 'Nature Walking', 'Phù hợp với những người mới bắt đầu, muốn khám phá và hòa mình vào thiên nhiên bằng các hoạt động đi bộ nhẹ nhàng trên đường mòn.', 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80', 1),
(2, NULL, 'mountainHiking', 'Mountain Hiking', 'MEGA_PARENT', 'Mountain Hiking', 'Mountain Hiking', 'Phù hợp với những người đã có kinh nghiệm và thể lực tốt. Địa hình phức tạp, độ dốc cao và nhiều thử thách.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80', 2),
(3, NULL, 'trekking', 'Trekking', 'MEGA_PARENT', 'Trekking', 'Trekking', 'Cấp độ thử thách cao nhất, dành cho những nhà sinh tồn và vận động viên chuyên nghiệp. Hành trình dài ngày xuyên qua rừng rậm.', 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=400&q=80', 3),
(4, NULL, NULL, 'Cấp độ mạo hiểm', 'SIMPLE', NULL, NULL, NULL, NULL, 4),
(5, NULL, NULL, 'Adventure pass', 'SIMPLE', NULL, NULL, NULL, NULL, 5),
(6, NULL, NULL, 'Thẻ chinh phục', 'SIMPLE', NULL, NULL, NULL, NULL, 6),
(7, NULL, NULL, 'About', 'SIMPLE', NULL, NULL, NULL, NULL, 7),
(8, NULL, NULL, 'Teambuilding', 'SIMPLE', NULL, NULL, NULL, NULL, 8);

-- B. Mega Menu Items (Level 1 - Con của Nature Walking)
INSERT INTO menus (parent_id, tour_id, label, type, mega_main_title, mega_description, mega_image, order_index) VALUES
(1, 3, '8 Nàng Tiên', 'ITEM', '8 Nàng Tiên', 'Khám phá vẻ đẹp hoang sơ của 8 Nàng Tiên với bãi biển xanh ngắt và cát trắng trải dài.', 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80', 1),
(1, 6, 'Walking Hòn Bà', 'ITEM', 'Walking Hòn Bà', 'Trải nghiệm đi bộ dưới tán rừng nguyên sinh mát mẻ, khám phá hệ sinh thái đa dạng.', 'https://images.unsplash.com/photo-1444459092499-555e1bfde960?auto=format&fit=crop&w=400&q=80', 2),
(1, 7, 'Tà Đùng-Chư Bluk', 'ITEM', 'Tà Đùng-Chư Bluk', 'Hành trình khám phá hồ Tà Đùng - Vịnh Hạ Long trên cao nguyên.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80', 3),
(1, 8, 'Walk in Tà Lài', 'ITEM', 'Walk in Tà Lài', 'Hòa mình vào thiên nhiên và tìm hiểu văn hóa bản địa độc đáo tại Tà Lài.', 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400&q=80', 4),
(1, 2, 'Bù Gia Mập', 'ITEM', 'Bù Gia Mập', 'Thử thách bản thân với Vườn Quốc gia Bù Gia Mập, nơi bảo tồn những cánh rừng lồ ô.', 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=400&q=80', 5),
(1, 9, 'Đà Bắc', 'ITEM', 'Đà Bắc', 'Chiêm ngưỡng khung cảnh thơ mộng của hồ Hòa Bình và khám phá bản làng yên bình.', 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=400&q=80', 6);

-- C. Mega Menu Items (Level 1 - Con của Mountain Hiking)
INSERT INTO menus (parent_id, tour_id, label, type, mega_main_title, mega_description, mega_image, order_index) VALUES
(2, 10, 'Tà Giang', 'ITEM', 'Tà Giang', 'Chinh phục Tà Giang với những thảo nguyên cỏ tranh bạt ngàn.', 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=400&q=80', 1),
(2, 11, 'Hiking Đá Bia Phú Yên', 'ITEM', 'Hiking Đá Bia Phú Yên', 'Leo núi Đá Bia, thả tầm mắt bao quát vịnh Vũng Rô.', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=400&q=80', 2),
(2, 12, 'Nặm Me', 'ITEM', 'Nặm Me', 'Khám phá dòng thác Nặm Me hoang sơ đổ xuống từ rừng già.', 'https://images.unsplash.com/photo-1438786657495-640937046d18?auto=format&fit=crop&w=400&q=80', 3),
(2, 13, 'Cực Đông', 'ITEM', 'Cực Đông', 'Đón ánh bình minh đầu tiên của Việt Nam tại Mũi Đôi.', 'https://images.unsplash.com/photo-1506744626753-1fa44df14d28?auto=format&fit=crop&w=400&q=80', 4),
(2, 4, 'Bidoup Núi Bà', 'ITEM', 'Bidoup Núi Bà', 'Chinh phục nóc nhà Lâm Đồng, băng qua rừng thông bạt ngàn.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', 5),
(2, 14, 'Ngũ Long Công Chúa', 'ITEM', 'Ngũ Long Công Chúa', 'Hành trình khám phá hệ thống thác nước kỳ vĩ ẩn mình sâu trong rừng.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80', 6),
(2, 15, 'Bidoup - Tà Giang', 'ITEM', 'Bidoup - Tà Giang', 'Cung đường kết nối hai điểm đến tuyệt đẹp, thử thách sự bền bỉ.', 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400&q=80', 7),
(2, 16, 'Thác K50', 'ITEM', 'Thác K50', 'Chiêm ngưỡng kiệt tác thiên nhiên Thác K50 hùng vĩ.', 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=400&q=80', 8),
(2, 1, 'Tà Năng Phan Dũng', 'ITEM', 'Tà Năng Phan Dũng', 'Cung đường trekking đẹp nhất Việt Nam, băng qua những đồi cỏ xanh ngút ngàn.', 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=400&q=80', 9);

-- D. Mega Menu Items (Level 1 - Con của Trekking)
INSERT INTO menus (parent_id, tour_id, label, type, mega_main_title, mega_description, mega_image, order_index) VALUES
(3, 17, 'Lùng Cúng', 'ITEM', 'Lùng Cúng', 'Chinh phục đỉnh Lùng Cúng quanh năm mây mù bao phủ.', 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=400&q=80', 1),
(3, 18, 'Samu U Bò', 'ITEM', 'Samu U Bò', 'Băng qua khu rừng nguyên sinh ngập tràn rêu phong.', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=400&q=80', 2),
(3, 19, 'Núi Chúa', 'ITEM', 'Núi Chúa', 'Vượt qua địa hình khắc nghiệt của thảo nguyên khô hạn.', 'https://images.unsplash.com/photo-1438786657495-640937046d18?auto=format&fit=crop&w=400&q=80', 3),
(3, 20, 'Tà Chì Nhù Nậm Nghiệp', 'ITEM', 'Tà Chì Nhù Nậm Nghiệp', 'Săn mây Tà Chì Nhù kết hợp ngắm hoa sơn tra nở rộ.', 'https://images.unsplash.com/photo-1506744626753-1fa44df14d28?auto=format&fit=crop&w=400&q=80', 4),
(3, 21, 'Ngũ Chỉ Sơn', 'ITEM', 'Ngũ Chỉ Sơn', 'Thử thách kỹ năng leo núi với địa hình dốc đứng sừng sững.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', 5),
(3, 22, 'Tà Chì Nhù', 'ITEM', 'Tà Chì Nhù', 'Biển mây Tà Chì Nhù mênh mông, đẹp ngỡ ngàng.', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80', 6),
(3, 23, 'Putaleng', 'ITEM', 'Putaleng', 'Băng qua những thung lũng hoa đỗ quyên rực rỡ.', 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&w=400&q=80', 7),
(3, 24, 'Nhìu Cồ San', 'ITEM', 'Nhìu Cồ San', 'Hành trình khám phá vương quốc của băng giá và sương mù.', 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=400&q=80', 8),
(3, 25, 'Tả Liên Sơn', 'ITEM', 'Tả Liên Sơn', 'Lạc vào khu rừng cổ tích với những gốc trà cổ thụ.', 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=400&q=80', 9),
(3, 26, 'Ky Quan San', 'ITEM', 'Ky Quan San', 'Chinh phục Bạch Mộc Lương Tử - Thiên đường săn mây.', 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=400&q=80', 10),
(3, 27, 'Phu Sa Ph\u00ecn(T\u00e0 X\u00f9a)', 'ITEM', 'Phu Sa Ph\u00ecn(T\u00e0 X\u00f9a)', 'Kh\u00e1m ph\u00e1 s\u1ed1ng l\u01b0ng kh\u1ee7ng long T\u00e0 X\u00f9a v\u00e0 bi\u1ec3n m\u00e2y.', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=400&q=80', 11),
(3, 28, 'L\u1ea3o Th\u1ea9n', 'ITEM', 'L\u1ea3o Th\u1ea9n', 'Cung trekking nh\u1eb9 nh\u00e0ng, l\u00fd t\u01b0\u1edfng \u0111\u1ec3 s\u0103n m\u00e2y.', 'https://images.unsplash.com/photo-1438786657495-640937046d18?auto=format&fit=crop&w=400&q=80', 12);
```


---

## 11. DỮ LIỆU BẢNG MENUS — CMS SIDEBAR (context = 'CMS')

> Dựa trên cấu trúc menu hiện tại trong `CMSLayout.jsx`.
> **Yêu cầu bảng phải có 2 cột bổ sung trước khi chạy:**
> ```sql
> ALTER TABLE menus ADD COLUMN context ENUM('CLIENT','CMS') NOT NULL DEFAULT 'CLIENT';
> ALTER TABLE menus ADD COLUMN icon VARCHAR(100) NULL;
> ```

### Cấu trúc cây

```
Dashboard                  (root, ITEM, href=/cms)
Kinh doanh                 (root, SIMPLE, group)
  ├─ Quản lý Tour          (/cms/tours)
  ├─ Quản lý Booking       (/cms/bookings)
  ├─ Adventure Pass        (/cms/passes)
  └─ Đơn mua Pass          (/cms/pass-orders)
Nội dung                   (root, SIMPLE, group)
  ├─ Banner / Hero         (/cms/banners)
  ├─ Blog / Tin tức        (/cms/blogs)
  ├─ Quản lý FAQ           (/cms/faqs)
  └─ Hộp thư liên hệ      (/cms/contacts)
Hệ thống                   (root, SIMPLE, group)
  ├─ Nhân viên             (/cms/staff)
  ├─ Cấu hình thông báo   (/cms/notification-configs)
  ├─ Phân quyền            (/cms/roles)
  └─ Quản lý Menu          (/cms/menus)
```

### Phương án A — JOIN tự động (MySQL 8.0+ / MariaDB)

```sql
-- Level 0: Root groups
INSERT INTO menus (key_name, label, href, type, icon, order_index, is_active, context, parent_id, tour_id, mega_accent_title, mega_main_title, mega_description, mega_image) VALUES
('cms-dashboard', 'Dashboard',  '/cms', 'ITEM',   'DashboardOutlined', 1, TRUE, 'CMS', NULL, NULL, NULL, NULL, NULL, NULL),
('cms-business',  'Kinh doanh', NULL,   'SIMPLE', 'ShoppingOutlined',  2, TRUE, 'CMS', NULL, NULL, NULL, NULL, NULL, NULL),
('cms-content',   'Nội dung',   NULL,   'SIMPLE', 'FileTextOutlined',  3, TRUE, 'CMS', NULL, NULL, NULL, NULL, NULL, NULL),
('cms-system',    'Hệ thống',   NULL,   'SIMPLE', 'TeamOutlined',      4, TRUE, 'CMS', NULL, NULL, NULL, NULL, NULL, NULL);

-- Level 1: Con của "Kinh doanh"
INSERT INTO menus (key_name, label, href, type, icon, order_index, is_active, context, parent_id, tour_id, mega_accent_title, mega_main_title, mega_description, mega_image)
SELECT t.k, t.l, t.h, 'ITEM', t.i, t.o, TRUE, 'CMS', m.id, NULL, NULL, NULL, NULL, NULL
FROM (
  SELECT 'cms-tours'        k, 'Quản lý Tour'    l, '/cms/tours'        h, 'EnvironmentOutlined' i, 1 o UNION ALL
  SELECT 'cms-bookings',       'Quản lý Booking', '/cms/bookings',    'CalendarOutlined',    2 UNION ALL
  SELECT 'cms-passes',         'Adventure Pass',  '/cms/passes',      'CrownOutlined',       3 UNION ALL
  SELECT 'cms-pass-orders',    'Đơn mua Pass',    '/cms/pass-orders', 'IdcardOutlined',      4
) t JOIN menus m ON m.key_name = 'cms-business' AND m.context = 'CMS';

-- Level 1: Con của "Nội dung"
INSERT INTO menus (key_name, label, href, type, icon, order_index, is_active, context, parent_id, tour_id, mega_accent_title, mega_main_title, mega_description, mega_image)
SELECT t.k, t.l, t.h, 'ITEM', t.i, t.o, TRUE, 'CMS', m.id, NULL, NULL, NULL, NULL, NULL
FROM (
  SELECT 'cms-banners'  k, 'Banner / Hero'    l, '/cms/banners'  h, 'PictureOutlined'        i, 1 o UNION ALL
  SELECT 'cms-blogs',      'Blog / Tin tức',   '/cms/blogs',    'CommentOutlined',         2 UNION ALL
  SELECT 'cms-faqs',       'Quản lý FAQ',      '/cms/faqs',     'QuestionCircleOutlined',  3 UNION ALL
  SELECT 'cms-contacts',   'Hộp thư liên hệ', '/cms/contacts', 'MailOutlined',            4
) t JOIN menus m ON m.key_name = 'cms-content' AND m.context = 'CMS';

-- Level 1: Con của "Hệ thống"
INSERT INTO menus (key_name, label, href, type, icon, order_index, is_active, context, parent_id, tour_id, mega_accent_title, mega_main_title, mega_description, mega_image)
SELECT t.k, t.l, t.h, 'ITEM', t.i, t.o, TRUE, 'CMS', m.id, NULL, NULL, NULL, NULL, NULL
FROM (
  SELECT 'cms-staff'               k, 'Nhân viên'           l, '/cms/staff'                h, 'UserOutlined'              i, 1 o UNION ALL
  SELECT 'cms-notification-configs', 'Cấu hình thông báo',  '/cms/notification-configs',  'SettingOutlined',           2 UNION ALL
  SELECT 'cms-roles',                'Phân quyền',           '/cms/roles',                 'SafetyCertificateOutlined', 3 UNION ALL
  SELECT 'cms-menus',                'Quản lý Menu',         '/cms/menus',                 'AppstoreOutlined',          4
) t JOIN menus m ON m.key_name = 'cms-system' AND m.context = 'CMS';
```

### Phương án B — Hardcode ID (tương thích MySQL < 8.0.19)

> Điều chỉnh `id` bắt đầu phù hợp với trạng thái `AUTO_INCREMENT` thực tế.

```sql
SET @biz = 201;
SET @ctn = 202;
SET @sys = 203;

INSERT INTO menus (id, key_name, label, href, type, icon, order_index, is_active, context, parent_id, tour_id, mega_accent_title, mega_main_title, mega_description, mega_image) VALUES
-- Root
(200, 'cms-dashboard', 'Dashboard',  '/cms', 'ITEM',   'DashboardOutlined', 1, TRUE, 'CMS', NULL, NULL, NULL, NULL, NULL, NULL),
(201, 'cms-business',  'Kinh doanh', NULL,   'SIMPLE', 'ShoppingOutlined',  2, TRUE, 'CMS', NULL, NULL, NULL, NULL, NULL, NULL),
(202, 'cms-content',   'Nội dung',   NULL,   'SIMPLE', 'FileTextOutlined',  3, TRUE, 'CMS', NULL, NULL, NULL, NULL, NULL, NULL),
(203, 'cms-system',    'Hệ thống',   NULL,   'SIMPLE', 'TeamOutlined',      4, TRUE, 'CMS', NULL, NULL, NULL, NULL, NULL, NULL),
-- Con của Kinh doanh
(204, 'cms-tours',        'Quản lý Tour',    '/cms/tours',        'ITEM', 'EnvironmentOutlined', 1, TRUE, 'CMS', @biz, NULL, NULL, NULL, NULL, NULL),
(205, 'cms-bookings',     'Quản lý Booking', '/cms/bookings',     'ITEM', 'CalendarOutlined',    2, TRUE, 'CMS', @biz, NULL, NULL, NULL, NULL, NULL),
(206, 'cms-passes',       'Adventure Pass',  '/cms/passes',       'ITEM', 'CrownOutlined',       3, TRUE, 'CMS', @biz, NULL, NULL, NULL, NULL, NULL),
(207, 'cms-pass-orders',  'Đơn mua Pass',    '/cms/pass-orders',  'ITEM', 'IdcardOutlined',      4, TRUE, 'CMS', @biz, NULL, NULL, NULL, NULL, NULL),
-- Con của Nội dung
(208, 'cms-banners',  'Banner / Hero',    '/cms/banners',  'ITEM', 'PictureOutlined',        1, TRUE, 'CMS', @ctn, NULL, NULL, NULL, NULL, NULL),
(209, 'cms-blogs',    'Blog / Tin tức',   '/cms/blogs',    'ITEM', 'CommentOutlined',         2, TRUE, 'CMS', @ctn, NULL, NULL, NULL, NULL, NULL),
(210, 'cms-faqs',     'Quản lý FAQ',      '/cms/faqs',     'ITEM', 'QuestionCircleOutlined',  3, TRUE, 'CMS', @ctn, NULL, NULL, NULL, NULL, NULL),
(211, 'cms-contacts', 'Hộp thư liên hệ', '/cms/contacts', 'ITEM', 'MailOutlined',            4, TRUE, 'CMS', @ctn, NULL, NULL, NULL, NULL, NULL),
-- Con của Hệ thống
(212, 'cms-staff',                'Nhân viên',           '/cms/staff',                'ITEM', 'UserOutlined',              1, TRUE, 'CMS', @sys, NULL, NULL, NULL, NULL, NULL),
(213, 'cms-notification-configs', 'Cấu hình thông báo', '/cms/notification-configs', 'ITEM', 'SettingOutlined',            2, TRUE, 'CMS', @sys, NULL, NULL, NULL, NULL, NULL),
(214, 'cms-roles',                'Phân quyền',          '/cms/roles',               'ITEM', 'SafetyCertificateOutlined',  3, TRUE, 'CMS', @sys, NULL, NULL, NULL, NULL, NULL),
(215, 'cms-menus',                'Quản lý Menu',        '/cms/menus',               'ITEM', 'AppstoreOutlined',           4, TRUE, 'CMS', @sys, NULL, NULL, NULL, NULL, NULL);
```


---

## 12. DỮ LIỆU BẢNG PERMISSIONS — Bổ sung còn thiếu

### Phân tích gap so với DB hiện tại

| Module | Có sẵn | Còn thiếu |
|---|---|---|
| Tour | tour:view, tour:create, tour:edit, tour:delete | — |
| Booking | booking:view, booking:edit, booking:delete | booking:create |
| Banner | banner:view, banner:manage | — |
| Blog | blog:view, blog:manage | — |
| Staff | staff:view, staff:manage | — |
| **Pass** | ❌ | pass:view, pass:create, pass:edit, pass:delete |
| **FAQ (chung)** | ❌ | faq:view, faq:manage |
| **Contact** | ❌ | contact:view, contact:manage |
| **Notification** | ❌ | notification:view, notification:manage |
| **Role / Quyền** | ❌ | role:view, role:manage |
| **Menu** | ❌ | menu:view, menu:manage |

> **Lưu ý format code:** Tất cả dùng dạng `module:action` snake_case để nhất quán với DB hiện tại.

### Mapping `required_permission` cho menu CMS (cập nhật theo format thực tế)

| Menu `key_name` | `required_permission` |
|---|---|
| `cms-dashboard` | `NULL` |
| `cms-tours` | `tour:view` |
| `cms-bookings` | `booking:view` |
| `cms-passes` | `pass:view` |
| `cms-pass-orders` | `pass:view` |
| `cms-banners` | `banner:manage` |
| `cms-blogs` | `blog:manage` |
| `cms-faqs` | `faq:manage` |
| `cms-contacts` | `contact:view` |
| `cms-staff` | `staff:manage` |
| `cms-notification-configs` | `notification:manage` |
| `cms-roles` | `role:manage` |
| `cms-menus` | `menu:manage` |

### INSERT — Permissions còn thiếu (id bắt đầu từ 14)

```sql
INSERT INTO permissions (id, code, module, name) VALUES
-- ── Pass (Adventure Pass + Đơn mua Pass) ─────────────────────────
(14, 'pass:view',   'Pass', 'Xem danh sách Pass & đơn mua'),
(15, 'pass:create', 'Pass', 'Thêm Adventure Pass mới'),
(16, 'pass:edit',   'Pass', 'Sửa thông tin Adventure Pass'),
(17, 'pass:delete', 'Pass', 'Xoá Adventure Pass'),

-- ── FAQ chung (General FAQs — /cms/faqs) ──────────────────────────
(18, 'faq:view',   'FAQ', 'Xem danh sách FAQ chung'),
(19, 'faq:manage', 'FAQ', 'Quản lý FAQ chung (thêm, sửa, xoá)'),

-- ── Contact (Hộp thư liên hệ) ─────────────────────────────────────
(20, 'contact:view',   'Contact', 'Xem hộp thư liên hệ'),
(21, 'contact:manage', 'Contact', 'Xử lý & cập nhật trạng thái liên hệ'),

-- ── Notification (Cấu hình thông báo) ────────────────────────────
(22, 'notification:view',   'System', 'Xem cấu hình thông báo'),
(23, 'notification:manage', 'System', 'Quản lý cấu hình thông báo'),

-- ── Role & Permission ─────────────────────────────────────────────
(24, 'role:view',   'System', 'Xem danh sách vai trò & quyền hạn'),
(25, 'role:manage', 'System', 'Quản lý vai trò & phân quyền (thêm, sửa, xoá, gán)'),

-- ── Menu ──────────────────────────────────────────────────────────
(26, 'menu:view',   'System', 'Xem cấu hình menu điều hướng'),
(27, 'menu:manage', 'System', 'Quản lý menu (thêm, sửa, xoá, reorder, toggle)'),

-- ── Booking bổ sung ───────────────────────────────────────────────
(28, 'booking:create', 'Booking', 'Tạo đơn đặt chỗ thủ công');
```

### Danh sách đầy đủ sau khi bổ sung (28 permissions)

```sql
-- Kiểm tra nhanh sau khi insert
SELECT id, code, module, name FROM permissions ORDER BY module, id;
```

| id | code | module | name |
|---|---|---|---|
| 8 | banner:view | CMS | Xem banner |
| 9 | banner:manage | CMS | Quản lý banner |
| 10 | blog:view | CMS | Xem bài viết |
| 11 | blog:manage | CMS | Quản lý bài viết |
| 5 | booking:view | Booking | Xem đơn đặt chỗ |
| 28 | booking:create | Booking | Tạo đơn đặt chỗ thủ công |
| 6 | booking:edit | Booking | Cập nhật trạng thái đơn |
| 7 | booking:delete | Booking | Xoá đơn đặt chỗ |
| 20 | contact:view | Contact | Xem hộp thư liên hệ |
| 21 | contact:manage | Contact | Xử lý & cập nhật trạng thái liên hệ |
| 18 | faq:view | FAQ | Xem danh sách FAQ chung |
| 19 | faq:manage | FAQ | Quản lý FAQ chung (thêm, sửa, xoá) |
| 26 | menu:view | System | Xem cấu hình menu điều hướng |
| 27 | menu:manage | System | Quản lý menu (thêm, sửa, xoá, reorder, toggle) |
| 22 | notification:view | System | Xem cấu hình thông báo |
| 23 | notification:manage | System | Quản lý cấu hình thông báo |
| 14 | pass:view | Pass | Xem danh sách Pass & đơn mua |
| 15 | pass:create | Pass | Thêm Adventure Pass mới |
| 16 | pass:edit | Pass | Sửa thông tin Adventure Pass |
| 17 | pass:delete | Pass | Xoá Adventure Pass |
| 24 | role:view | System | Xem danh sách vai trò & quyền hạn |
| 25 | role:manage | System | Quản lý vai trò & phân quyền |
| 12 | staff:view | Staff | Xem danh sách nhân viên |
| 13 | staff:manage | Staff | Quản lý nhân viên |
| 1 | tour:view | Tour | Xem danh sách tour |
| 2 | tour:create | Tour | Thêm tour mới |
| 3 | tour:edit | Tour | Sửa thông tin tour |
| 4 | tour:delete | Tour | Xoá tour |
