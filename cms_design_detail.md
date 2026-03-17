# Tài Liệu Thiết Kế Chi Tiết CMS - Toong Adventure

Tài liệu này mô tả chi tiết các màn hình, chức năng và các thành phần giao diện đã được triển khai trong hệ thống CMS. Toàn bộ mã nguồn nằm tại thư mục `src/pages/cms`.

---

## 1. Hệ Thống & Bảo Mật

### 1.1 Trang Đăng Nhập (Login)
- **File**: `Login.jsx`
- **Mô tả**: Màn hình xác thực người dùng để truy cập vào hệ thống quản trị. Giao diện được thiết kế với hình nền nature mờ và lớp overlay xanh thương hiệu.
- **Tính năng**:
  - Form đăng nhập chuẩn Ant Design với validation.
  - Tích hợp `react-router-dom` để chuyển hướng sau khi đăng nhập thành công.
- **Thành phần UI**: `Card`, `Form.Item`, `Input.Password`.

### 1.2 Bố Cục Toàn Cục (CMS Layout)
- **File**: `CMSLayout.jsx`
- **Mô tả**: Khung giao diện chính bao gồm Sidebar điều hướng và Header.
- **Tính năng**:
  - **Sidebar**: Hiển thị menu phân cấp (Business, Content, System). Hỗ trợ đóng/mở (collapsed).
  - **Header**: Hiển thị thông tin Admin và nút Đăng xuất.
  - **Đa ngôn ngữ**: Thiết lập `ConfigProvider locale={vi_VN}` để Việt hóa toàn bộ các nút mặc định của Ant Design.
  - **Theme**: Sử dụng mã màu `#1F4529` làm màu chủ đạo cho các active states.

### 1.3 Quản Lý Nhân Viên (Staff Management)
- **File**: `StaffManagement.jsx`
- **Mô tả**: Quản lý tài khoản và phân quyền cho nhân viên vận hành.
- **Chi tiết chức năng**:
  - Hiển thị danh sách: Tên, Email, Vai trò (Admin/Manager/Staff), Trạng thái.
  - CRUD: Thêm mới nhân viên, Sửa thông tin, Khóa tài khoản.

---

## 2. Quản Lý Kinh Doanh

### 2.1 Quản Lý Tour (Tours Management)
- **File**: `ToursManagement.jsx`
- **Mô tả**: Màn hình quan trọng nhất dùng để quản lý các cung đường trekking.
- **Chi tiết chức năng**:
  - **Bảng dữ liệu (ProTable)**: Hỗ trợ tìm kiếm theo tên, lọc theo Khu vực (Nam/Trung/Tây Nguyên), Độ khó.
  - **Trường dữ liệu**: Name, Region, Duration (Days/Nights), Difficulty, Base Price, Badge.
  - **Thao tác**: Sửa thông tin tour, Xem chi tiết, Thêm mới.

### 2.2 Quản Lý Đơn Hàng (Bookings Management)
- **File**: `BookingsManagement.jsx`
- **Mô tả**: Theo dõi và xử lý các yêu cầu đặt tour từ khách hàng.
- **Chi tiết chức năng**:
  - **Trường dữ liệu**: Booking Code, Customer Info (Last/First Name, Phone), Quantity, Total/Deposit/Remaining Amount, Payment Method, Status, Created At.
  - **Xử lý trạng thái**: Chờ thanh toán -> Đã đặt cọc -> Đã tất toán -> Hủy.
  - **Tìm kiếm**: Tìm nhanh theo mã đơn hoặc số điện thoại.

### 2.3 Adventure Pass & Đơn Mua
- **File**: `PassManagement.jsx` & `PassOrders.jsx`
- **Mô tả**: Quản lý các gói thẻ thành viên năm và doanh thu từ thẻ.
- **Chi tiết chức năng**:
  - Định nghĩa các gói Pass: Trial, Sharing, Adventure với giá và màu sắc theme tương ứng.
  - Theo dõi đơn mua: Mã đơn pass, khách hàng, gói pass đã chọn, tổng tiền và ngày mua.

---

## 3. Quản Lý Nội Dung (CMS)

### 3.1 Banner & Blog
- **File**: `BannerManagement.jsx` & `BlogManagement.jsx`
- **Mô tả**: Cập nhật trực quan các nội dung hiển thị ngoài trang chủ.
- **Chi tiết chức năng**:
  - **Banner**: Quản lý hình ảnh Hero Slider, Tiêu đề và Link điều hướng. Hỗ trợ xem trước ảnh (Image Preview).
  - **Blog**: Soạn thảo bài viết, phân loại danh mục (Kinh nghiệm, Tin tức), quản lý tác giả và ngày đăng.

### 3.2 FAQ & Liên Hệ (Contacts)
- **File**: `FAQManagement.jsx` & `Contacts.jsx`
- **Mô tả**: Hỗ trợ khách hàng và tiếp nhận lead tư vấn.
- **Chi tiết chức năng**:
  - **FAQ**: Quản lý cặp Câu hỏi - Câu trả lời hiển thị ở trang chi tiết tour.
  - **Contacts**: Tiếp nhận thông tin từ form Liên hệ (Name, Phone, Message). Phân loại trạng thái "Mới" hoặc "Đã liên hệ".

---

## 4. Dashboard (Tổng quan)
- **File**: `Dashboard.jsx`
- **Mô tả**: Màn hình mặc định hiển thị các chỉ số kinh doanh chính.
- **Thành phần**:
  - **Statistic Cards**: Tổng số Tour, Booking mới trong ngày, Doanh thu tháng, Tổng lượng khách.
  - **Recent Activity**: Danh sách các hoạt động hoặc thông báo hệ thống mới nhất.

---
*Tài liệu này được đồng bộ với cấu trúc cơ sở dữ liệu và yêu cầu chức năng của Toong Adventure.*
