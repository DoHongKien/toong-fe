## Module Quản Trị (Admin Dashboard)

Hệ thống quản trị dành cho vận hành và quản lý dữ liệu toàn diện.

- **Xác thực & Bảo mật (Authentication):**
  - Trang đăng nhập (Login) bảo mật dành cho quản trị viên và nhân viên.
  - Quản lý phiên (Session), đăng xuất và đổi mật khẩu định kỳ.
- **Quản lý Nhân viên & Phân quyền chi tiết (RBAC):**
  - **Quản lý tài khoản:** Admin có quyền tạo mới, cập nhật thông tin, hoặc khóa tài khoản nhân viên.
  - **Phân quyền chức năng (Granular Permissions):** Hệ thống cho phép phân quyền chi tiết đến từng hành động trong màn hình. Ví dụ: Nhân viên A có thể xem danh sách tour nhưng không có nút "Thêm mới" hoặc "Chỉnh sửa". Nhân viên B có thể duyệt đơn hàng nhưng không được xóa đơn hàng.
- **Quản lý Tour (Tour Management):**
  - CRUD (Thêm, Xem, Sửa, Xóa) thông tin tour, hình ảnh, lịch trình.
  - Thiết lập lịch khởi hành và trạng thái tour (Còn chỗ, Hết chỗ, Sắp mở).
- **Quản lý Đơn hàng (Booking Management):**
  - Danh sách đơn hàng từ khách hàng với bộ lọc trạng thái (Chờ xác nhận, Đã đặt cọc, Hoàn thành, Đã hủy).
  - Cập nhật trạng thái thanh toán và xuất file dữ liệu khách hàng.
- **Quản lý Thành viên (Member Management):** Theo dõi danh sách khách hàng đã mua Adventure Pass và lịch sử tham gia tour.
- **Quản lý Nội dung (CMS):** Cập nhật linh hoạt Hero Banner, FAQ, và các bài viết tin tức/blog trên trang chủ.
- **Báo cáo & Thống kê (Reports & Analytics):**
  - Biểu đồ doanh thu theo tháng/quý.
  - Thống kê các tour "Best Seller" và tỷ lệ lấp đầy lịch trình.

## 2. Danh sách màn hình Quản Trị (Admin Sitemap)
Hệ thống Admin được tổ chức thành các phân vùng logic sau:

### A. Nhóm Hệ thống & Bảo mật
1. **Trang Login:** Màn hình xác thực tài khoản nhân viên.
2. **Trang Dashboard:** Tổng quan các chỉ số quan trọng (Doanh thu ngày, đơn hàng mới, tour sắp khởi hành).
3. **Quản lý Nhân viên:** Danh sách nhân viên, thêm mới/khóa tài khoản.
4. **Phân quyền (RBAC):** Cấu hình các vai trò (Roles) và gán quyền cho từng vai trò.

### B. Nhóm Quản lý Kinh doanh
5. **Danh sách Tour:** Quản lý thông tin gốc của các cung đường.
6. **Chi tiết/Sửa Tour:** Form cập nhật lịch trình, hình ảnh, chi phí tour.
7. **Quản lý Lịch khởi hành:** Thiết lập các đợt đi (Departures) cho từng tour, quản lý giá và slot.
8. **Danh sách Đơn hàng:** Quản lý booking tour của khách hàng (Duyệt cọc, hủy đơn, hoàn tất).
9. **Danh sách Adventure Pass:** Quản lý các gói thẻ thành viên năm.
10. **Đơn mua Adventure Pass:** Theo dõi doanh thu và trạng thái các đơn mua thẻ Pass.

### C. Nhóm Quản lý Nội dung (CMS)
11. **Quản lý Banner:** Thay đổi ảnh Hero Slider ngoài trang chủ.
12. **Danh sách Blog:** Quản lý các bài viết tin tức, kinh nghiệm trekking.
13. **Soạn thảo bài viết:** Editor trực quan để viết nội dung bài mới.
14. **Quản lý FAQ:** Cập nhật các câu hỏi thường gặp hệ thống.
15. **Hộp thư Liên hệ:** Tiếp nhận và quản lý các yêu cầu tư vấn từ khách hàng (Form Liên hệ).

### D. Nhóm Báo cáo
16. **Báo cáo Doanh thu:** Xem chi tiết dòng tiền theo thời gian.
17. **Hiệu suất Tour:** Phân tích tour nào hiệu quả nhất về mặt lợi nhuận và lượt đặt.

---

**Tổng kết:** Dự án là một hệ thống web toàn trình bao gồm trang giới thiệu/đặt tour cho khách hàng và hệ thống quản trị chuyên sâu. Kiến trúc mã nguồn lấy người dùng (UX) làm trung tâm ở mặt front-end và tính bảo mật, phân quyền chặt chẽ ở mặt quản trị (Admin).
