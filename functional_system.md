# Tài Liệu Chức Năng Hệ Thống (Functional System Document)
Dự án: **Toong Adventure Clone** (React SPA)

Dự án là một ứng dụng web (Single Page Application) được xây dựng bằng React và React Router, chuyên về dịch vụ đặt tour trekking/leo núi và các hoạt động mạo hiểm. Dưới đây là các chức năng chính hiện có trong ứng dụng:

## 1. Module Trang Chủ (Home Page)
- **Hero Banner:** Giới thiệu thông điệp chính "Đánh Thức Bản Năng Mạo Hiểm" với hình ảnh thu hút và nút kêu gọi hành động (Call To Action - CTA).
- **Danh sách Cung Nổi Bật:** Hiển thị danh sách các tour phổ biến nhất (Best Seller, New) dưới dạng lưới thẻ (card) với hiệu ứng animation cuộn (FadeIn). Mỗi thẻ bao gồm hình ảnh, tên tour, thời lượng, độ khó và mô tả ngắn.
- **Lý do chọn Tổ Kiến:** Trình bày các giá trị cốt lõi của dịch vụ (An toàn tuyệt đối, Đội ngũ tận tâm, Du lịch bền vững, Đa dạng lộ trình).

## 2. Module Danh Sách Tour (Tours Page)
- **Bộ Lọc Tour (Filter):** Cung cấp chức năng lọc danh sách các tour theo 3 tiêu chí chính:
  - Khám phá theo khu vực (Miền Nam, Miền Trung, Tây Nguyên).
  - Lọc theo thời lượng (2N1Đ, 3N2Đ, 4N3Đ...).
  - Lọc theo độ khó (Dễ, Vừa phải, Thử thách).
- **Danh Sách & Phân Trang:** Hiển thị danh sách đầy đủ tất cả các tour với đầy đủ mức giá và thông tin chi tiết. Có tích hợp thanh điều hướng phân trang (Pagination) ở cuối danh sách.

## 3. Module Chi Tiết Tour (Tour Detail Page)
Đây là màn hình cung cấp đầy đủ thông tin nhất để khách hàng ra quyết định đặt tour.
- **Thông tin tóm tắt:** Thời gian, độ khó, quãng đường, độ tuổi phù hợp.
- **Lịch trình chi tiết (Itinerary):** Hiển thị dạng Accordion (có thể đóng/mở) mô tả chi tiết lịch trình của từng ngày.
- **Chi tiết chi phí & Hành lý:** Cấu trúc chi phí (đã bao gồm những gì và chưa bao gồm những gì), danh sách các hành lý cần chuẩn bị, và thông tin lưu ý quan trọng.
- **Lịch Khởi Hành (Departure Schedule):** Một Carousel dạng vuốt (hoặc tự động chạy) hiển thị các ngày khởi hành sắp tới cùng với mức giá, có nút bấm "Đăng ký ngay" chuyển thẳng đến form đặt chỗ cho ngày đó.
- **FAQ:** Các câu hỏi thường gặp dưới dạng Accordion.
- **Sidebar Sticky:** Cột bên phải (trên bản desktop) neo cố định dọc màn hình với thông tin mức giá, danh sách ưu đãi, nút Đăng ký, nút Xin Tư vấn.
- **Tour Tương Tự (Similar Tours):** Gợi ý các tour khác dưới dạng Carousel trượt ngang.

## 4. Hệ Thống Đặt Chỗ (Booking System / Modal)
Một modal nhiều bước (Multi-step form) mô phỏng luồng (flow) đăng ký tour:
- **Bước 1 - Đăng ký thông tin:**
  - Chọn ngày khởi hành từ bộ lịch (DatePicker).
  - Chọn số lượng khách tham gia.
  - Điền thông tin cá nhân bắt buộc (Họ, Tên, Số điện thoại) và tuỳ chọn (Email).
- **Bước 2 - Xác nhận đơn hàng hiển thị:**
  - Tóm tắt đơn hàng: số lượng, tổng tiền.
  - Số tiền đặt cọc cần thanh toán (Deposit) và số tiền còn lại sau dịch vụ.
  - Lựa chọn phương thức thanh toán: VNPAY hoặc Chuyển khoản ngân hàng.
- **Bước 3 - Thanh toán thành công (Success):**
  - Trong trường hợp chọn chuyển khoản, hiển thị mã QR Code dùng để thanh toán, chi tiết số tài khoản, ngân hàng, và cú pháp nội dung chuyển khoản. Cùng với thông điệp bộ phận CSKH sẽ liên hệ sau.

## 5. Module Cấp Độ Mạo Hiểm (Level Page)
- **Radar Chart:** Trực quan hóa 5 tiêu chí xếp hạng của hệ thống tour (Tiếp cận y tế, Độ cao đỉnh, Tăng độ cao tích lũy, Thời gian, Độ dài) qua biểu đồ đa giác mạng nhện (Radar Chart).
- **Phân Loại Cấp Độ:** Đi sâu vào 3 cấp độ chính (Nature Walking, Mountain Hiking, Trekking) với thông số định lượng cụ thể (độ cao, độ dài, điểm số). Có nút bấm chuyển hướng để khám phá tour dựa trên cấp độ tương ứng.

## 6. Module Thẻ Thành Viên (Adventure Pass Page)
- **Giới thiệu "Adventure Year":** Quảng bá gói mua theo năm nhằm khuyến khích khách hàng thân thiết.
- **Danh sách gói Pass:** Các lựa chọn thẻ cung cấp (TRIAL, SHARING, ADVENTURE) hiển thị các đặc quyền và quyền lợi khác nhau (nhân bản lên bao nhiêu cấp thẻ, bao nhiêu cung đường/năm).

## 7. Giao Diện & Điều Hướng Toàn Cục (Global Layout)
- **Navbar (Menu Điều Hướng):**
  - **Trạng thái cuộn:** Background trong suốt trên đầu trang và có nền tối khi người dùng cuộn (scroll) trang xuống.
  - **Mega Menu (Desktop):** Nhấp chuột hoặc dạo qua (hover) vào menu sẽ mở lớn bảng Mega Menu. Image Preview (hình ảnh đặc trưng) và phần mô tả (Description) sẽ tự động thay đổi dựa trên nội dung link đang trỏ vào.
  - **Mobile Menu Overlay:** Tích hợp React Portal để hiển thị Drawer Navigation cho trải nghiệm trên các thiết bị màn hình nhỏ.
- **Footer:** Chân trang cung cấp các thông tin liên hệ và truy cập nhanh.
- **Hiệu Ứng (Animations):** Sử dụng các Component điều khiển FadeIn khi scroll để tăng tính mượt mà và tương tác.

---
**Tổng kết:** Dự án là một trang web front-end cung cấp trải nghiệm khám phá và đặt chỗ toàn trình các sản phẩm về phiêu lưu/leo núi. Kiến trúc mã nguồn lấy người dùng (UX) làm trung tâm với đồ họa trực quan (mega menu, radar chart, slider) và luồng booking dạng modal nhiều bước.
