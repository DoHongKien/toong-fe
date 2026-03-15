# Thiết Kế Cơ Sở Dữ Liệu (Database Schema)
Dự án: **Toong Adventure Clone**

Dựa trên tài liệu chức năng (`functional_system.md`), dưới đây là thiết kế chi sở dữ liệu quan hệ (RDBMS) dự kiến (sử dụng MySQL/PostgreSQL) để đáp ứng các tính năng của trang web.

## 1. Sơ Đồ Thực Thể Liên Kết (ERD)

```mermaid
erDiagram
    TOURS ||--o{ DEPARTURES : "có nhiều"
    TOURS ||--o{ ITINERARIES : "bao gồm"
    ITINERARIES ||--o{ ITINERARY_TIMELINES : "gồm các mốc tgian"
    TOURS ||--o{ TOUR_COST_DETAILS : "chi phí bao gồm/không"
    TOURS ||--o{ TOUR_LUGGAGES : "yêu cầu hành lý"
    TOURS ||--o{ TOUR_FAQS : "câu hỏi thường gặp"
    DEPARTURES ||--o{ BOOKINGS : "nhận các"
    ADVENTURE_PASSES ||--o{ PASS_FEATURES : "có các quyền lợi"
    ADVENTURE_PASSES ||--o{ PASS_ORDERS : "nhận lượt mua"

    TOURS {
        int id PK
        string name "Tên tour (VD: Tà Năng - Phan Dũng)"
        string slug "URL thân thiện"
        string hero_image "Ảnh banner"
        string card_image "Ảnh thumbnail"
        string badge "Label (Best Seller, New)"
        string region "Khu vực (nam, trung, taynguyen)"
        int duration_days "Số ngày"
        int duration_nights "Số đêm"
        string difficulty "Dễ, Khó, Thử thách..."
        int distance_km "Khoảng cách (km)"
        int min_age "Tuổi tối thiểu"
        int max_age "Tuổi tối đa"
        text summary "Mô tả ngắn"
        text description "Chi tiết"
        decimal base_price "Giá gốc"
        datetime created_at
    }

    DEPARTURES {
        int id PK
        int tour_id FK
        date start_date "Ngày khởi hành"
        date end_date "Ngày kết thúc"
        date deposit_deadline "Hạn đặt cọc"
        date payment_deadline "Hạn thanh toán"
        decimal price "Giá cho đợt đi này"
        int total_slots "Số chỗ tối đa"
        int booked_slots "Số chỗ đã đặt"
        string status "active, full, completed, cancelled"
    }

    BOOKINGS {
        int id PK
        string booking_code "Mã đơn (VD: TOX123) - Unique"
        int departure_id FK
        string first_name "Tên khách"
        string last_name "Họ khách"
        string phone "Số điện thoại"
        string email "Email (optional)"
        int quantity "Số lượng vé"
        decimal total_amount "Tổng tiền"
        decimal deposit_amount "Tiền cọc"
        decimal remaining_amount "Tiền còn lại"
        string payment_method "vnpay, bank_transfer"
        string status "pending, deposited, fully_paid, cancelled"
        datetime created_at
    }

    ITINERARIES {
        int id PK
        int tour_id FK
        int day_number "Ngày thứ mấy"
        string title "Tiêu đề (VD: Ngày 1: Chinh phục...)"
        text description "Chi tiết (optional)"
    }

    ITINERARY_TIMELINES {
        int id PK
        int itinerary_id FK
        time execution_time "Giờ thực hiện (VD: 06:00)"
        text activity "Hành động (VD: Ăn sáng, leo dốc...)"
    }

    TOUR_COST_DETAILS {
        int id PK
        int tour_id FK
        boolean is_included "True: Bao gồm, False: Không bao gồm"
        text content "Nội dung chi phí"
    }

    TOUR_LUGGAGES {
        int id PK
        int tour_id FK
        string name "Tên đồ (QUẦN ÁO, BALO)"
        text detail "Chi tiết (Mỏng nhẹ...)"
    }

    TOUR_FAQS {
        int id PK
        int tour_id FK
        text question "Câu hỏi"
        text answer "Câu trả lời"
    }

    ADVENTURE_PASSES {
        int id PK
        string title "Tên thẻ (TRIAL, SHARING)"
        string subtitle "Pass"
        decimal price "Mức giá"
        date validity_date "Hạn sử dụng (nếu có)"
        boolean is_signature "Phiên bản giới hạn?"
        string color_theme "Màu hiển thị (bg-dark-green...)"
    }

    PASS_FEATURES {
        int id PK
        int pass_id FK
        string content "Nội dung quyền lợi"
        boolean is_bold "Hiển thị in đậm?"
    }

    PASS_ORDERS {
        int id PK
        string order_code "Mã đơn"
        int pass_id FK
        string first_name
        string last_name
        string phone
        string email
        string payment_method "vnpay, bank_transfer"
        string status "pending, paid, cancelled"
        datetime created_at
    }

    MENUS ||--o{ MENUS : "parent of"
    MENUS }o--o| TOURS : "links to"

    MENUS {
        int id PK
        int parent_id FK
        int tour_id FK
        string key_name "Logic key"
        string label "Display name"
        string href "Link"
        string type "MEGA_PARENT, SIMPLE, ITEM"
        string mega_accent_title
        string mega_main_title
        text mega_description
        string mega_image
        int order_index
        boolean is_active
    }
```

## 2. Diễn Giải Các Bảng Chính

### 2.1 Bảng `tours`
Lưu trữ toàn bộ thông tin gốc, thông tin tra cứu cơ bản của tất cả các cung đường.
- **Trường quan trọng:** `slug`, `region` (để bộ lọc tìm kiếm hoạt động), `difficulty` (có thể kết nối với bảng Level nếu cần mở rộng, ở đây tạm thời lưu dạng chuỗi), `base_price` (giá tham khảo hiển thị trên card khi chưa chọn ngày).
- **Mở rộng (Recommendation):** Việc kết nối các Tour tương tự (Similar Tours) có thể thêm một bảng trung gian `similar_tours (tour_id, similar_tour_id)` nếu không muốn hệ thống tự động lọc theo `region` hay `difficulty`.

### 2.2 Bảng `departures` (Lịch khởi hành)
Mỗi tour sẽ có nhiều ngày khởi hành khác nhau. Client khi chọn trên Booking form sẽ call từ bảng này.
- **Trường quan trọng:** `start_date`, `end_date`, `price` (giá có thể biến động tùy dịp Lễ/Tết - không nhất thiết giống `base_price` của `tours`), `booked_slots` vs `total_slots` để chặn khách đặt khi đã đầy chỗ.

### 2.3 Bảng `bookings` (Đơn đặt chỗ)
Quản lý trạng thái mua vé cho 1 kỳ khởi hành cụ thể (`departure_id`).
- Hệ thống hỗ trợ VNPAY và Chuyển khoản nên cần lưu `payment_method`. Các tiến trình nộp tiền cọc và tất toán phần còn lại sẽ được lưu vết thay đổi vào mục `status` (`pending` -> `deposited` -> `fully_paid`).

### 2.4 Bảng `itineraries` và `itinerary_timelines` (Lịch trình & Dòng thời gian)
Phục vụ chức năng Accordion ở Tour Detail. Tách làm 2 cấp: Cấp "Ngày thứ X" và Cấp "Timeline Giờ Y". Việc phân chia này giúp API trả về cấu trúc mảng lồng nhau chuẩn xác cho Frontend map ra UI.

### 2.5 Các bảng bổ trợ cấu hình Tour Detail
- `tour_cost_details`: Dùng chung cho "Bao gồm" và "Không bao gồm" dựa trên cờ `is_included`.
- `tour_luggages` và `tour_faqs`: Dữ liệu độc lập đi kèm với mỗi Tour, giúp trang chi tiết không bị hardcode cứng. Khách hàng có thể cấu hình từ Admin Dashboard.

### 2.6 Module Adventure Pass (`adventure_passes`, `pass_features`, `pass_orders`)
Trường hợp thẻ bán theo gói hằng năm tách biệt với Đặt Tour. Bảng này quản lý thông tin các loại thẻ Pass, quyền lợi `features` từng dòng, và danh sách đơn mua `pass_orders`.

## 3. Lời Thuyên Về Hệ Thống Người Dùng (Users / Auth)
Dựa theo functional_system.md, hiện tại giao diện **không có trang Đăng nhập / Đăng ký cá nhân** và việc đặt Tour (Booking) chỉ yêu cầu điền thông tin liên hệ ngay trên Modal.
Do đó:
- Database hiện tại có thể chưa cần quản lý bảng `users` dành cho Client end-user, mà mọi thông tin liên hệ sẽ bám theo `bookings`.
- Tuy nhiên, hãy cân nhắc thêm bảng `users` cho những cá nhân có vai trò **Admin**, **System Manager** để có thể phát triển Admin CMS truy cập và quản lý các Đơn hàng (Bookings), Thêm mới Tour.

Về cấu trúc này sẽ hỗ trợ 100% cho các dữ liệu đang render trên Frontend hiện nay.
