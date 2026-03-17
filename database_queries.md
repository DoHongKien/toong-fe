# Truy Vấn Cơ Sở Dữ Liệu (SQL Queries)

Dự án: **Toong Adventure Clone**

Dưới đây là các câu truy vấn SQL mẫu dựa trên kiến trúc schema đã thiết kế để sử dụng cho dự án:

## 1. Lệnh tạo bảng (Data Definition Language - DDL)

Tham khảo sơ đồ ERD, ta có thể xây dựng các bảng qua file chuẩn `.sql`:

```sql
CREATE DATABASE toong_db;
USE toong_db;

-- 1. Bảng TOURS
CREATE TABLE tours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    hero_image VARCHAR(500),
    card_image VARCHAR(500),
    badge VARCHAR(50),
    region ENUM('nam', 'trung', 'taynguyen') NOT NULL,
    duration_days INT DEFAULT 0,
    duration_nights INT DEFAULT 0,
    difficulty VARCHAR(50),
    distance_km INT,
    min_age INT,
    max_age INT,
    summary TEXT,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng LỊCH KHỞI HÀNH (DEPARTURES)
CREATE TABLE departures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    deposit_deadline DATE,
    payment_deadline DATE,
    price DECIMAL(10,2) NOT NULL,
    total_slots INT NOT NULL,
    booked_slots INT DEFAULT 0,
    status ENUM('active', 'full', 'completed', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 3. Bảng BOOKINGS (Đặt chỗ)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    departure_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    quantity INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    remaining_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('vnpay', 'bank_transfer') NOT NULL,
    status ENUM('pending', 'deposited', 'fully_paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departure_id) REFERENCES departures(id)
);

-- 4. Bảng ITINERARIES (Lịch trình tổng quan theo ngày)
CREATE TABLE itineraries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    day_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 5. Bảng ITINERARY_TIMELINES (Hoạt động theo giờ)
CREATE TABLE itinerary_timelines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itinerary_id INT,
    execution_time TIME,
    activity TEXT NOT NULL,
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
);

-- 6. Bảng TOUR_COST_DETAILS (Gói bao gồm/Không bao gồm)
CREATE TABLE tour_cost_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    is_included BOOLEAN NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 7. Bảng TOUR_LUGGAGES (Hành lý chuẩn bị)
CREATE TABLE tour_luggages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    name VARCHAR(255) NOT NULL,
    detail TEXT,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 8. Bảng TOUR_FAQS (Câu hỏi thường gặp)
CREATE TABLE tour_faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tour_id INT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- 9. Bảng ADVENTURE_PASSES (Gói Pass)
CREATE TABLE adventure_passes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    validity_date DATE,
    is_signature BOOLEAN DEFAULT FALSE,
    color_theme VARCHAR(50)
);

-- 10. Bảng PASS_FEATURES (Quyền lợi thẻ Pass)
CREATE TABLE pass_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pass_id INT,
    content TEXT NOT NULL,
    is_bold BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (pass_id) REFERENCES adventure_passes(id) ON DELETE CASCADE
);

-- 11. Bảng PASS_ORDERS (Giao dịch mua Pass)
CREATE TABLE pass_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE NOT NULL,
    pass_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    payment_method ENUM('vnpay', 'bank_transfer') NOT NULL,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pass_id) REFERENCES adventure_passes(id)
);

-- =============================================
-- MỞ RỘNG: HỆ THỐNG QUẢN TRỊ (ADMIN & RBAC)
-- =============================================

-- 12. Bảng VAI TRÒ (ROLES)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL
);

-- 13. Bảng QUYỀN HẠN (PERMISSIONS)
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL
);

-- 14. Bảng TRUNG GIAN QUYỀN - VAI TRÒ (ROLE_PERMISSIONS)
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- 15. Bảng NHÂN VIÊN (EMPLOYEES)
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    status ENUM('active', 'locked') DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- =============================================
-- MỞ RỘNG: HỆ THỐNG CMS (NỘI DUNG ĐỘNG)
-- =============================================

-- 16. Bảng BANNERS
CREATE TABLE banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    image_url VARCHAR(500) NOT NULL,
    link_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- 17. Bảng BÀI VIẾT (BLOG_POSTS)
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_id INT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    thumbnail VARCHAR(500),
    status ENUM('draft', 'published') DEFAULT 'draft',
    published_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES employees(id)
);

-- 18. Bảng FAQ CHUNG (GENERAL_FAQS)
CREATE TABLE general_faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

-- 19. Bảng HỘP THƯ LIÊN HỆ (CONTACT_MESSAGES)
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    message TEXT NOT NULL,
    status ENUM('new', 'contacted', 'resolved') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. API Queries - Các câu truy vấn REST thường dùng

### 2.1 Lấy dữ liệu Trang chủ (`Home.jsx`)

**Truy vấn lấy 3 Tour nổi bật nhất / Best Seller:**

```sql
SELECT
    id, name, slug, card_image AS image, badge,
    CONCAT(duration_days, ' Ngày ', duration_nights, ' Đêm') AS duration,
    difficulty, summary AS descr
FROM tours
ORDER BY id ASC
LIMIT 3;
```

### 2.2 Trang Danh sách Tour (`Tours.jsx`)

**Lọc các tour theo Khu vực và Độ khó**

```sql
SELECT
    id, name, slug, card_image AS image, badge,
    CONCAT(duration_days, 'N', duration_nights, 'Đ') AS duration,
    difficulty, region AS location, summary, base_price AS price
FROM tours
WHERE
    region = 'nam' AND
    difficulty = 'Dễ'
ORDER BY id DESC;
```

### 2.3 Trang Chi tiết Tour (`TourDetail.jsx`)

Dưới đây là tổ hợp các truy vấn lấy toàn bộ nội dung của trang thông tin khi truy cập /tour-detail/:slug.

**a. Lấy thông tin Header và Body cơ bản:**

```sql
SELECT * FROM tours WHERE slug = 'ta-nang-phan-dung' LIMIT 1;
```

**b. Lấy Lịch khởi hành (Departures) liên kết để render Slider đăng ký:**

```sql
SELECT
    id, start_date, end_date, deposit_deadline, payment_deadline, price
FROM departures
WHERE
    tour_id = 1 AND
    start_date > CURRENT_DATE() AND
    status = 'active'
ORDER BY start_date ASC;
```

**c. Lấy Lịch trình chi tiết (Itinerary) - Dùng JOIN:**

```sql
SELECT
    i.day_number,
    i.title,
    t.execution_time AS time,
    t.activity AS description
FROM itineraries i
LEFT JOIN itinerary_timelines t ON i.id = t.itinerary_id
WHERE i.tour_id = 1
ORDER BY i.day_number ASC, t.execution_time ASC;
```

**d. Lấy Danh sách Chi phí Bao Gồm / Không Bao Gồm:**

```sql
SELECT content
FROM tour_cost_details
WHERE tour_id = 1 AND is_included = TRUE;
```

### 2.4 Chức năng Đặt chỗ Booking Modal (`BookingModal.jsx`)

**Tạo đơn hàng đặt chuyến (Ví dụ code bằng Node/PHP sẽ gói vào Transaction):**

```sql
-- Bước 1: Kiểm tra slot (Ví dụ khách đặt 2 chỗ)
SELECT booked_slots, total_slots
FROM departures
WHERE id = 5 AND (total_slots - booked_slots) >= 2;

-- Bước 2: Insert 1 bản ghi vào bookings
INSERT INTO bookings (
    booking_code, departure_id, first_name, last_name, phone, email,
    quantity, total_amount, deposit_amount, remaining_amount, payment_method, status
) VALUES (
    'TOONG_12345', 5, 'Kien', 'Do', '0933227878', 'kien@domain.com',
    2, 5980000, 1000000, 4980000, 'bank_transfer', 'pending'
);

-- Bước 3: Cập nhật lại số slot tại departures (Nếu bước 2 lấy ID thành công)
UPDATE departures
SET booked_slots = booked_slots + 2
WHERE id = 5;
```

### 2.5 Bảng Adventure Pass

**Lấy danh sách các loại Pass hiển thị ở `AdventurePass.jsx`:**

```sql
SELECT
    p.id, p.title, p.subtitle, p.price, p.validity_date, p.is_signature, p.color_theme,
    f.content, f.is_bold
FROM adventure_passes p
LEFT JOIN pass_features f ON p.id = f.pass_id
ORDER BY p.price ASC;
```

### 2.6 Hệ thống Quản trị (Admin Dashboard)

**Lấy danh sách quyền hạn của một nhân viên (Dùng cho RBAC check):**

```sql
SELECT p.code
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permission_id
JOIN employees e ON e.role_id = rp.role_id
WHERE e.username = 'admin_user' AND e.status = 'active';
```

**Thêm nhân viên mới và gán vai trò:**

```sql
-- Thêm vai trò Editor nếu chưa có
INSERT INTO roles (name, code) VALUES ('Biên tập viên', 'EDITOR');

-- Thêm nhân viên
INSERT INTO employees (role_id, username, password_hash, full_name, email)
VALUES (2, 'editor_01', '$2b$12$hashedpassword...', 'Nguyễn Văn A', 'a.nguyen@domain.com');
```

### 2.7 Trang chủ & CMS nội dung động

**Lấy danh sách Banner đang hoạt động:**

```sql
SELECT title, image_url, link_url
FROM banners
WHERE is_active = TRUE
ORDER BY sort_order ASC;
```

**Lấy danh sách bài viết mới nhất (Blog):**

```sql
SELECT b.title, b.slug, b.thumbnail, b.published_at, e.full_name AS author
FROM blog_posts b
JOIN employees e ON b.author_id = e.id
WHERE b.status = 'published'
ORDER BY b.published_at DESC
LIMIT 6;
```

---

**Gợi ý lập trình:** Trong một REST API chuẩn (hoặc GraphQL, tRPC), nếu một UI như `TourDetail.jsx` cần tải tới 5 Object List (`itinerary`, `costs`, `faqs`, `timelines`, `luggages`), việc mở 5 Queries song song (Ví dụ dùng `Promise.all` hoặc SQL Joins với JSON_AGG) sẽ cho Performance tốt nhất.
