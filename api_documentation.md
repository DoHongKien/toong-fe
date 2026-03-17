# Tài Liệu Đặc Tả API (Chuẩn hóa theo Database Schema)

Dự án: **Toong Adventure Clone**

Tài liệu này xác định các điểm cuối (endpoints) API cần thiết, được chuẩn hóa theo cấu trúc dữ liệu (`database_queries.md`) để đảm bảo tính nhất quán giữa Backend và Frontend.

> **Quy ước chung:**
>
> - Base URL: `/api/v1`
> - Auth Header (Admin): `Authorization: Bearer <token>`
> - Response thành công: `{ "status": "success", "data": ... }`
> - Response lỗi: `{ "status": "error", "message": "..." }`
> - **[PUBLIC]** = Không cần Auth | **[ADMIN]** = Yêu cầu token Admin

---

## 1. Module Tours

### 1.1 Lấy danh sách Tour [PUBLIC] (`Tours.jsx`)

- **Endpoint:** `GET /api/v1/tours`
- **Query Parameters:**
  - `region`: `nam` | `trung` | `taynguyen`
  - `difficulty`: `Dễ` | `Vừa phải` | `Thử thách` | `Khó` | `Rất Dễ`
  - `duration_days`: số nguyên
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "name": "Tà Năng - Phan Dũng",
        "slug": "ta-nang-phan-dung",
        "card_image": "https://...",
        "badge": "Best Seller",
        "region": "taynguyen",
        "duration_days": 2,
        "duration_nights": 1,
        "difficulty": "Vừa phải",
        "summary": "...",
        "base_price": 2990000.0
      }
    ]
  }
  ```

### 1.2 Lấy chi tiết Tour [PUBLIC] (`TourDetail.jsx`)

- **Endpoint:** `GET /api/v1/tours/:slug`
- **Response:** (Gộp dữ liệu từ nhiều bảng: `tours`, `itineraries`, `itinerary_timelines`, `tour_cost_details`, `tour_luggages`, `tour_faqs`)
  ```json
  {
    "status": "success",
    "data": {
      "id": 1,
      "name": "Tà Năng - Phan Dũng",
      "slug": "ta-nang-phan-dung",
      "hero_image": "...",
      "summary": "...",
      "description": "...",
      "details": {
        "distance_km": 30,
        "min_age": 12,
        "max_age": 50
      },
      "itineraries": [
        {
          "day_number": 1,
          "title": "Chinh phục đồi cỏ",
          "timelines": [
            { "execution_time": "06:00:00", "activity": "Tập trung ăn sáng" }
          ]
        }
      ],
      "cost_details": [{ "is_included": true, "content": "Xe khứ hồi..." }],
      "luggages": [{ "name": "GIÀY", "detail": "Bám tốt..." }],
      "faqs": [{ "question": "...", "answer": "..." }]
    }
  }
  ```

### 1.3 [ADMIN] Tạo Tour mới

- **Endpoint:** `POST /api/v1/admin/tours`
- **Request Body:**
  ```json
  {
    "name": "Tà Năng - Phan Dũng",
    "slug": "ta-nang-phan-dung",
    "hero_image": "https://...",
    "card_image": "https://...",
    "badge": "Best Seller",
    "region": "taynguyen",
    "duration_days": 2,
    "duration_nights": 1,
    "difficulty": "Vừa phải",
    "distance_km": 30,
    "min_age": 12,
    "max_age": 50,
    "summary": "...",
    "description": "...",
    "base_price": 2990000.0
  }
  ```
- **Response:** `201 Created` + tour object vừa tạo.

### 1.4 [ADMIN] Cập nhật Tour

- **Endpoint:** `PUT /api/v1/admin/tours/:id`
- **Request Body:** (các trường cần cập nhật, tương tự 1.3)
- **Response:** `200 OK` + tour object đã cập nhật.

### 1.5 [ADMIN] Xóa Tour

- **Endpoint:** `DELETE /api/v1/admin/tours/:id`
- **Response:** `200 OK` + `{ "status": "success", "message": "Tour đã được xóa." }`

---

## 2. Module Booking & Departures

### 2.1 Lấy lịch khởi hành [PUBLIC] (`Departures`)

- **Endpoint:** `GET /api/v1/tours/:id/departures`
- **Query Parameters:**
  - `status`: `active` | `full` | `completed` | `cancelled` (mặc định: `active`)
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 5,
        "start_date": "2026-04-05",
        "end_date": "2026-04-06",
        "deposit_deadline": "2026-03-25",
        "payment_deadline": "2026-03-30",
        "price": 2990000.0,
        "available_slots": 15,
        "status": "active"
      }
    ]
  }
  ```

### 2.2 Tạo đơn đặt chỗ [PUBLIC] (`Bookings`)

- **Endpoint:** `POST /api/v1/bookings`
- **Request Body:**
  ```json
  {
    "departure_id": 5,
    "first_name": "Kien",
    "last_name": "Do",
    "phone": "0933227878",
    "email": "kien@domain.com",
    "quantity": 2,
    "payment_method": "bank_transfer"
  }
  ```
- **Logic Backend:**
  1. Kiểm tra slot còn lại.
  2. Tạo `booking_code` (unique).
  3. Tính toán `total_amount`, `deposit_amount`, `remaining_amount`.
  4. Cập nhật `booked_slots` trong bảng `departures`.
- **Response:** `201 Created` + booking object.

### 2.3 [ADMIN] Danh sách tất cả Bookings

- **Endpoint:** `GET /api/v1/admin/bookings`
- **Query Parameters:**
  - `status`: `pending` | `deposited` | `fully_paid` | `cancelled`
  - `departure_id`: lọc theo lịch khởi hành
  - `page`, `limit`: phân trang (mặc định: `page=1`, `limit=20`)
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "booking_code": "TOONG_12345",
        "departure_id": 5,
        "tour_name": "Tà Năng - Phan Dũng",
        "start_date": "2026-04-05",
        "first_name": "Kien",
        "last_name": "Do",
        "phone": "0933227878",
        "email": "kien@domain.com",
        "quantity": 2,
        "total_amount": 5980000.0,
        "deposit_amount": 1000000.0,
        "remaining_amount": 4980000.0,
        "payment_method": "bank_transfer",
        "status": "pending",
        "created_at": "2026-03-17T10:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 100 }
  }
  ```

### 2.4 [ADMIN] Cập nhật trạng thái Booking

- **Endpoint:** `PATCH /api/v1/admin/bookings/:id/status`
- **Request Body:**
  ```json
  { "status": "deposited" }
  ```
- **Response:** `200 OK` + booking object đã cập nhật.

### 2.5 [ADMIN] Tạo Lịch khởi hành mới

- **Endpoint:** `POST /api/v1/admin/departures`
- **Request Body:**
  ```json
  {
    "tour_id": 1,
    "start_date": "2026-04-05",
    "end_date": "2026-04-07",
    "deposit_deadline": "2026-03-25",
    "payment_deadline": "2026-03-30",
    "price": 2990000.0,
    "total_slots": 20
  }
  ```
- **Response:** `201 Created` + departure object.

### 2.6 [ADMIN] Cập nhật / Xóa Lịch khởi hành

- **Cập nhật:** `PUT /api/v1/admin/departures/:id`
- **Xóa:** `DELETE /api/v1/admin/departures/:id`

---

## 3. Module Adventure Pass

### 3.1 Danh sách Pass & Quyền lợi [PUBLIC]

- **Endpoint:** `GET /api/v1/adventure-passes`
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "title": "TRIAL",
        "subtitle": "...",
        "price": 8990000.0,
        "validity_date": "2026-12-31",
        "is_signature": false,
        "color_theme": "#FF6B35",
        "features": [{ "content": "3 cung đường", "is_bold": true }]
      }
    ]
  }
  ```

### 3.2 Đặt mua thẻ Pass [PUBLIC]

- **Endpoint:** `POST /api/v1/adventure-passes/order`
- **Request Body:**
  ```json
  {
    "pass_id": 1,
    "first_name": "Kien",
    "last_name": "Do",
    "phone": "0933227878",
    "email": "kien@domain.com",
    "payment_method": "vnpay"
  }
  ```
- **Logic Backend:** Tạo `order_code` unique → Insert vào `pass_orders`.
- **Response:** `201 Created` + pass order object.

### 3.3 [ADMIN] Danh sách Pass Orders

- **Endpoint:** `GET /api/v1/admin/pass-orders`
- **Query Parameters:**
  - `status`: `pending` | `paid` | `cancelled`
  - `page`, `limit`
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "order_code": "PASS_00123",
        "pass_id": 1,
        "pass_title": "TRIAL",
        "first_name": "Kien",
        "last_name": "Do",
        "phone": "0933227878",
        "email": "kien@domain.com",
        "payment_method": "vnpay",
        "status": "pending",
        "created_at": "2026-03-17T10:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 50 }
  }
  ```

### 3.4 [ADMIN] Cập nhật trạng thái Pass Order

- **Endpoint:** `PATCH /api/v1/admin/pass-orders/:id/status`
- **Request Body:** `{ "status": "paid" }`

### 3.5 [ADMIN] Quản lý thẻ Pass (CRUD)

- **Tạo:** `POST /api/v1/admin/adventure-passes`
- **Cập nhật:** `PUT /api/v1/admin/adventure-passes/:id`
- **Xóa:** `DELETE /api/v1/admin/adventure-passes/:id`

---

## 4. Module Admin Auth & Nhân viên

### 4.1 [PUBLIC] Đăng nhập Admin

- **Endpoint:** `POST /api/v1/admin/auth/login`
- **Request Body:**
  ```json
  {
    "username": "admin_user",
    "password": "secret123"
  }
  ```
- **Logic Backend:** Kiểm tra `status = 'active'` → So khớp `password_hash` (bcrypt) → Trả về JWT.
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "token": "eyJhbGci...",
      "employee": {
        "id": 1,
        "username": "admin_user",
        "full_name": "Nguyễn Văn A",
        "role": { "id": 1, "name": "Quản trị viên", "code": "ADMIN" }
      }
    }
  }
  ```

### 4.2 [ADMIN] Lấy danh sách nhân viên

- **Endpoint:** `GET /api/v1/admin/employees`
- **Query Parameters:**
  - `status`: `active` | `locked`
  - `role_id`: lọc theo vai trò
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "username": "admin_user",
        "full_name": "Nguyễn Văn A",
        "email": "a.nguyen@domain.com",
        "status": "active",
        "last_login": "2026-03-17T08:00:00Z",
        "role": { "id": 1, "name": "Quản trị viên", "code": "ADMIN" }
      }
    ]
  }
  ```

### 4.3 [ADMIN] Tạo nhân viên mới

- **Endpoint:** `POST /api/v1/admin/employees`
- **Request Body:**
  ```json
  {
    "role_id": 2,
    "username": "editor_01",
    "password": "strongPassw0rd!",
    "full_name": "Nguyễn Văn B",
    "email": "b.nguyen@domain.com"
  }
  ```
- **Response:** `201 Created` + employee object (không có `password_hash`).

### 4.4 [ADMIN] Cập nhật / Xóa nhân viên

- **Cập nhật:** `PUT /api/v1/admin/employees/:id`
- **Khóa tài khoản:** `PATCH /api/v1/admin/employees/:id/status` + body `{ "status": "locked" }`
- **Xóa:** `DELETE /api/v1/admin/employees/:id`

### 4.5 [ADMIN] Quản lý Vai trò (Roles)

- **Lấy danh sách:** `GET /api/v1/admin/roles`
- **Tạo mới:** `POST /api/v1/admin/roles` + body `{ "name": "Biên tập viên", "code": "EDITOR" }`
- **Cập nhật:** `PUT /api/v1/admin/roles/:id`
- **Xóa:** `DELETE /api/v1/admin/roles/:id`

### 4.6 [ADMIN] Quản lý Quyền hạn (RBAC)

- **Lấy danh sách permissions:** `GET /api/v1/admin/permissions`
- **Lấy permissions của role:** `GET /api/v1/admin/roles/:id/permissions`
- **Gán quyền cho role:** `PUT /api/v1/admin/roles/:id/permissions`
  - **Request Body:**
    ```json
    { "permission_ids": [1, 2, 5, 7] }
    ```
  - **Logic Backend:** Xóa toàn bộ quyền cũ của role → Insert lại theo `permission_ids` mới.

---

## 5. Module Banners [ADMIN]

### 5.1 Lấy danh sách Banner [PUBLIC]

- **Endpoint:** `GET /api/v1/banners`
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "title": "Banner Hè 2026",
        "image_url": "https://...",
        "link_url": "/tours",
        "sort_order": 1
      }
    ]
  }
  ```

### 5.2 [ADMIN] Lấy toàn bộ Banner (kể cả vô hiệu)

- **Endpoint:** `GET /api/v1/admin/banners`
- **Response:** Tương tự 5.1 nhưng bổ sung trường `is_active`.

### 5.3 [ADMIN] Tạo Banner mới

- **Endpoint:** `POST /api/v1/admin/banners`
- **Request Body:**
  ```json
  {
    "title": "Banner Hè 2026",
    "image_url": "https://...",
    "link_url": "/tours",
    "sort_order": 1,
    "is_active": true
  }
  ```
- **Response:** `201 Created` + banner object.

### 5.4 [ADMIN] Cập nhật / Xóa Banner

- **Cập nhật:** `PUT /api/v1/admin/banners/:id`
- **Xóa:** `DELETE /api/v1/admin/banners/:id`
- **Đổi thứ tự sắp xếp:** `PATCH /api/v1/admin/banners/:id` + body `{ "sort_order": 2 }`

---

## 6. Module Blog Posts

### 6.1 Lấy danh sách bài viết [PUBLIC]

- **Endpoint:** `GET /api/v1/blog-posts`
- **Query Parameters:**
  - `limit`: số bài cần lấy (mặc định: `6`)
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "title": "Kinh nghiệm trekking Tà Năng",
        "slug": "kinh-nghiem-trekking-ta-nang",
        "thumbnail": "https://...",
        "published_at": "2026-03-10T08:00:00Z",
        "author": "Nguyễn Văn A"
      }
    ]
  }
  ```

### 6.2 Lấy chi tiết bài viết [PUBLIC]

- **Endpoint:** `GET /api/v1/blog-posts/:slug`
- **Response:** Gộp đầy đủ `title`, `content`, `thumbnail`, `published_at`, `author`.

### 6.3 [ADMIN] Lấy toàn bộ bài viết (cả draft)

- **Endpoint:** `GET /api/v1/admin/blog-posts`
- **Query Parameters:**
  - `status`: `draft` | `published`
  - `page`, `limit`

### 6.4 [ADMIN] Tạo bài viết mới

- **Endpoint:** `POST /api/v1/admin/blog-posts`
- **Request Body:**
  ```json
  {
    "title": "Kinh nghiệm trekking Tà Năng",
    "slug": "kinh-nghiem-trekking-ta-nang",
    "content": "<p>Nội dung HTML...</p>",
    "thumbnail": "https://...",
    "status": "draft"
  }
  ```
- **Logic Backend:** `author_id` lấy từ JWT token của employee đăng nhập.
- **Response:** `201 Created` + blog post object.

### 6.5 [ADMIN] Cập nhật bài viết

- **Endpoint:** `PUT /api/v1/admin/blog-posts/:id`
- **Lưu ý:** Khi cập nhật `status` sang `published`, backend tự động set `published_at = NOW()`.

### 6.6 [ADMIN] Xóa bài viết

- **Endpoint:** `DELETE /api/v1/admin/blog-posts/:id`

---

## 7. Module General FAQs [ADMIN]

### 7.1 Lấy danh sách FAQ chung [PUBLIC]

- **Endpoint:** `GET /api/v1/faqs`
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "question": "Trekking cần chuẩn bị gì?",
        "answer": "Bạn cần chuẩn bị...",
        "sort_order": 1
      }
    ]
  }
  ```

### 7.2 [ADMIN] CRUD FAQ chung

- **Tạo:** `POST /api/v1/admin/faqs` + body `{ "question": "...", "answer": "...", "sort_order": 1 }`
- **Cập nhật:** `PUT /api/v1/admin/faqs/:id`
- **Xóa:** `DELETE /api/v1/admin/faqs/:id`
- **Đổi thứ tự:** `PATCH /api/v1/admin/faqs/:id` + body `{ "sort_order": 2 }`

---

## 8. Module Contact Messages [ADMIN]

### 8.1 Gửi tin nhắn liên hệ [PUBLIC]

- **Endpoint:** `POST /api/v1/contact`
- **Request Body:**
  ```json
  {
    "full_name": "Trần Thị B",
    "phone": "0901234567",
    "email": "b.tran@domain.com",
    "message": "Tôi muốn hỏi về tour Tà Năng..."
  }
  ```
- **Response:** `201 Created` + `{ "status": "success", "message": "Tin nhắn đã được gửi." }`

### 8.2 [ADMIN] Danh sách hộp thư liên hệ

- **Endpoint:** `GET /api/v1/admin/contact-messages`
- **Query Parameters:**
  - `status`: `new` | `contacted` | `resolved`
  - `page`, `limit`
- **Response:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 1,
        "full_name": "Trần Thị B",
        "phone": "0901234567",
        "email": "b.tran@domain.com",
        "message": "Tôi muốn hỏi về tour...",
        "status": "new",
        "created_at": "2026-03-17T09:00:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 30 }
  }
  ```

### 8.3 [ADMIN] Cập nhật trạng thái tin nhắn

- **Endpoint:** `PATCH /api/v1/admin/contact-messages/:id/status`
- **Request Body:** `{ "status": "contacted" }`
- **Response:** `200 OK` + message object đã cập nhật.

### 8.4 [ADMIN] Xóa tin nhắn

- **Endpoint:** `DELETE /api/v1/admin/contact-messages/:id`

---

## 9. Module Dashboard Tổng quan [ADMIN]

### 9.1 Thống kê tổng quan

- **Endpoint:** `GET /api/v1/admin/dashboard/stats`
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "total_bookings": 150,
      "bookings_this_month": 23,
      "total_revenue": 450000000.0,
      "revenue_this_month": 68000000.0,
      "pending_bookings": 12,
      "new_contact_messages": 5,
      "total_tours": 8,
      "total_employees": 4
    }
  }
  ```

---

## Tóm tắt Endpoints

| Module      | Endpoint                                    | Method                    | Auth   |
| ----------- | ------------------------------------------- | ------------------------- | ------ |
| Tours       | `/api/v1/tours`                             | GET                       | PUBLIC |
| Tours       | `/api/v1/tours/:slug`                       | GET                       | PUBLIC |
| Tours       | `/api/v1/admin/tours`                       | POST                      | ADMIN  |
| Tours       | `/api/v1/admin/tours/:id`                   | PUT / DELETE              | ADMIN  |
| Departures  | `/api/v1/tours/:id/departures`              | GET                       | PUBLIC |
| Departures  | `/api/v1/admin/departures`                  | POST                      | ADMIN  |
| Departures  | `/api/v1/admin/departures/:id`              | PUT / DELETE              | ADMIN  |
| Bookings    | `/api/v1/bookings`                          | POST                      | PUBLIC |
| Bookings    | `/api/v1/admin/bookings`                    | GET                       | ADMIN  |
| Bookings    | `/api/v1/admin/bookings/:id/status`         | PATCH                     | ADMIN  |
| Pass        | `/api/v1/adventure-passes`                  | GET                       | PUBLIC |
| Pass        | `/api/v1/adventure-passes/order`            | POST                      | PUBLIC |
| Pass        | `/api/v1/admin/adventure-passes`            | POST / PUT / DELETE       | ADMIN  |
| Pass Orders | `/api/v1/admin/pass-orders`                 | GET                       | ADMIN  |
| Pass Orders | `/api/v1/admin/pass-orders/:id/status`      | PATCH                     | ADMIN  |
| Auth        | `/api/v1/admin/auth/login`                  | POST                      | PUBLIC |
| Employees   | `/api/v1/admin/employees`                   | GET / POST                | ADMIN  |
| Employees   | `/api/v1/admin/employees/:id`               | PUT / DELETE              | ADMIN  |
| Roles       | `/api/v1/admin/roles`                       | GET / POST / PUT / DELETE | ADMIN  |
| Permissions | `/api/v1/admin/permissions`                 | GET                       | ADMIN  |
| Permissions | `/api/v1/admin/roles/:id/permissions`       | GET / PUT                 | ADMIN  |
| Banners     | `/api/v1/banners`                           | GET                       | PUBLIC |
| Banners     | `/api/v1/admin/banners`                     | GET / POST / PUT / DELETE | ADMIN  |
| Blog        | `/api/v1/blog-posts`                        | GET                       | PUBLIC |
| Blog        | `/api/v1/blog-posts/:slug`                  | GET                       | PUBLIC |
| Blog        | `/api/v1/admin/blog-posts`                  | GET / POST / PUT / DELETE | ADMIN  |
| FAQs        | `/api/v1/faqs`                              | GET                       | PUBLIC |
| FAQs        | `/api/v1/admin/faqs`                        | POST / PUT / DELETE       | ADMIN  |
| Contact     | `/api/v1/contact`                           | POST                      | PUBLIC |
| Contact     | `/api/v1/admin/contact-messages`            | GET                       | ADMIN  |
| Contact     | `/api/v1/admin/contact-messages/:id/status` | PATCH                     | ADMIN  |
| Dashboard   | `/api/v1/admin/dashboard/stats`             | GET                       | ADMIN  |

---

**Gợi ý lập trình:**

- Dùng **JWT middleware** để bảo vệ tất cả route `/api/v1/admin/**`.
- Dùng **RBAC middleware** sau JWT để kiểm tra `permission.code` (từ bảng `permissions`) cho từng action cụ thể.
- Với các route trả về danh sách lớn, luôn implement **pagination** (`page` + `limit`).
- Dùng **`Promise.all`** ở backend khi `TourDetail` cần join nhiều bảng con để tối ưu hiệu năng.
