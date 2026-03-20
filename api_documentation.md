# Tài Liệu Đặc Tả API (Chuẩn hóa theo Database Schema)
Dự án: **Toong Adventure Clone**

Tài liệu này xác định các điểm cuối (endpoints) API cần thiết, được chuẩn hóa theo cấu trúc dữ liệu (`database_queries.md`) để đảm bảo tính nhất quán giữa Backend và Frontend.

> **Quy ước chung:**
> - Base URL: `/api/v1`
> - Auth Header (Admin): `Authorization: Bearer <token>`
> - Response thành công: `{ "status": "success", "data": ... }`
> - Response lỗi: `{ "status": "error", "message": "..." }`
> - **[PUBLIC]** = Không cần Auth | **[ADMIN]** = Yêu cầu token Admin

---

## 1. Module Tours

### 1.1 Lấy danh sách Tour [PUBLIC] (`Tours.jsx`)
*   **Endpoint:** `GET /api/v1/tours`
*   **Query Parameters:**
    *   `region`: `nam` | `trung` | `taynguyen`
    *   `difficulty`: `Dễ` | `Vừa phải` | `Thử thách` | `Khó` | `Rất Dễ`
    *   `durationDays`: số nguyên
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "name": "Tà Năng - Phan Dũng",
          "slug": "ta-nang-phan-dung",
          "cardImage": "https://...",
          "badge": "Best Seller",
          "region": "taynguyen",
          "durationDays": 2,
          "durationNights": 1,
          "difficulty": "Vừa phải",
          "summary": "...",
          "basePrice": 2990000.00
        }
      ]
    }
    ```

### 1.2 Lấy chi tiết Tour [PUBLIC] (`TourDetail.jsx`)
*   **Endpoint:** `GET /api/v1/tours/:slug`
*   **Response:** (Gộp dữ liệu từ nhiều bảng: `tours`, `itineraries`, `itinerary_timelines`, `tour_cost_details`, `tour_luggages`, `tour_faqs`)
    ```json
    {
      "status": "success",
      "data": {
        "id": 1,
        "name": "Tà Năng - Phan Dũng",
        "slug": "ta-nang-phan-dung",
        "heroImage": "...",
        "summary": "...",
        "description": "...",
        "details": {
          "distanceKm": 30,
          "minAge": 12,
          "maxAge": 50
        },
        "itineraries": [
          {
            "dayNumber": 1,
            "title": "Chinh phục đồi cỏ",
            "timelines": [
              { "executionTime": "06:00:00", "activity": "Tập trung ăn sáng" }
            ]
          }
        ],
        "cost_details": [
          { "isIncluded": true, "content": "Xe khứ hồi..." }
        ],
        "luggages": [
          { "name": "GIÀY", "detail": "Bám tốt..." }
        ],
        "faqs": [
          { "question": "...", "answer": "..." }
        ]
      }
    }
    ```

### 1.3 [ADMIN] Tạo Tour mới
*   **Endpoint:** `POST /api/v1/admin/tours`
*   **Request Body:**
    ```json
    {
      "name": "Tà Năng - Phan Dũng",
      "slug": "ta-nang-phan-dung",
      "heroImage": "https://...",
      "cardImage": "https://...",
      "badge": "Best Seller",
      "region": "taynguyen",
      "durationDays": 2,
      "durationNights": 1,
      "difficulty": "Vừa phải",
      "distanceKm": 30,
      "minAge": 12,
      "maxAge": 50,
      "summary": "...",
      "description": "...",
      "basePrice": 2990000.00,
      "costDetails": [
        { "isIncluded": true,  "content": "Xe khứ hồi TP.HCM - điểm xuất phát", "sortOrder": 1 },
        { "isIncluded": false, "content": "Chi phí cá nhân phát sinh",           "sortOrder": 2 }
      ],
      "luggages": [
        { "name": "GIÀY", "detail": "Giày trekking đế bám, cổ thấp hoặc cổ cao.", "sortOrder": 1 },
        { "name": "BA LÔ", "detail": "Ba lô 30-40L có khung chống lưng.",         "sortOrder": 2 }
      ],
      "faqs": [
        { "question": "Tour này có cần kinh nghiệm trekking không?", "answer": "Không cần kinh nghiệm trước, chỉ cần sức khỏe tốt.", "sortOrder": 1 }
      ]
    }
    ```
*   **Lưu ý:** `costDetails`, `luggages` và `faqs` là optional. Nếu được truyền, backend tự động insert các bản ghi tương ứng vào bảng `tour_cost_details`, `tour_luggages` và `tour_faqs` sau khi tạo tour.
*   **Response:** `201 Created` + tour object vừa tạo.



### 1.4 [ADMIN] Cập nhật Tour
*   **Endpoint:** `PUT /api/v1/admin/tours/:id`
*   **Request Body:** (các trường cần cập nhật, tương tự 1.3)
*   **Response:** `200 OK` + tour object đã cập nhật.

### 1.5 [ADMIN] Xóa Tour
*   **Endpoint:** `DELETE /api/v1/admin/tours/:id`
*   **Response:** `200 OK` + `{ "status": "success", "message": "Tour đã được xóa." }`

### 1.6 [ADMIN] Lấy chi tiết Tour theo ID
*   **Endpoint:** `GET /api/v1/admin/tours/:id`
*   **Mục đích:** Dùng cho màn **Chỉnh sửa Tour** trong CMS — trả về đầy đủ thông tin tour kèm `costDetails`, `luggages`, `faqs` để pre-fill form.
*   **Response:**
    ```json
    {
      "status": "success",
      "data": {
        "id": 1,
        "name": "Tà Năng - Phan Dũng",
        "slug": "ta-nang-phan-dung",
        "cardImage": "https://...",
        "heroImage": "https://...",
        "badge": "Best Seller",
        "region": "taynguyen",
        "durationDays": 2,
        "durationNights": 1,
        "difficulty": "Vừa phải",
        "summary": "...",
        "basePrice": 2990000.00,
        "costDetails": [
          { "id": 1, "isIncluded": true,  "content": "Xe khứ hồi TP.HCM", "sortOrder": 1 },
          { "id": 2, "isIncluded": false, "content": "Chi phí cá nhân",    "sortOrder": 2 }
        ],
        "luggages": [
          { "id": 1, "name": "GIÀY", "detail": "Giày trekking đế bám.", "sortOrder": 1 }
        ],
        "faqs": [
          { "id": 1, "question": "Có cần kinh nghiệm không?", "answer": "Không cần.", "sortOrder": 1 }
        ]
      }
    }
    ```
*   **Lưu ý:** Khác với `GET /api/v1/tours/:slug` (public), endpoint này yêu cầu JWT admin và trả về key camelCase nhất quán (`costDetails` thay vì `cost_details`).

---

## 2. Module Booking & Departures

### 2.1 Lấy lịch khởi hành [PUBLIC] (`Departures`)
*   **Endpoint:** `GET /api/v1/tours/:id/departures`
*   **Query Parameters:**
    *   `status`: `active` | `full` | `completed` | `cancelled` (mặc định: `active`)
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 5,
          "startDate": "2026-04-05",
          "endDate": "2026-04-06",
          "depositDeadline": "2026-03-25",
          "paymentDeadline": "2026-03-30",
          "price": 2990000.00,
          "availableSlots": 15,
          "status": "active"
        }
      ]
    }
    ```

### 2.2 Tạo đơn đặt chỗ [PUBLIC] (`Bookings`)
*   **Endpoint:** `POST /api/v1/bookings`
*   **Request Body:**
    ```json
    {
      "departureId": 5,
      "firstName": "Kien",
      "lastName": "Do",
      "phone": "0933227878",
      "email": "kien@domain.com",
      "quantity": 2,
      "paymentMethod": "bank_transfer"
    }
    ```
*   **Logic Backend:**
    1. Kiểm tra slot còn lại.
    2. Tạo `bookingCode` (unique).
    3. Tính toán `totalAmount`, `depositAmount`, `remainingAmount`.
    4. Cập nhật `bookedSlots` trong bảng `departures`.
*   **Response:** `201 Created` + booking object.

### 2.3 [ADMIN] Danh sách tất cả Bookings
*   **Endpoint:** `GET /api/v1/admin/bookings`
*   **Query Parameters:**
    *   `status`: `pending` | `deposited` | `fully_paid` | `cancelled`
    *   `departureId`: lọc theo lịch khởi hành
    *   `page`, `limit`: phân trang (mặc định: `page=1`, `limit=20`)
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "bookingCode": "TOONG_12345",
          "departureId": 5,
          "tourName": "Tà Năng - Phan Dũng",
          "startDate": "2026-04-05",
          "firstName": "Kien",
          "lastName": "Do",
          "phone": "0933227878",
          "email": "kien@domain.com",
          "quantity": 2,
          "totalAmount": 5980000.00,
          "depositAmount": 1000000.00,
          "remainingAmount": 4980000.00,
          "paymentMethod": "bank_transfer",
          "status": "pending",
          "createdAt": "2026-03-17T10:00:00Z"
        }
      ],
      "pagination": { "page": 1, "limit": 20, "total": 100 }
    }
    ```

### 2.4 [ADMIN] Cập nhật trạng thái Booking
*   **Endpoint:** `PATCH /api/v1/admin/bookings/:id/status`
*   **Request Body:**
    ```json
    { "status": "deposited" }
    ```
*   **Response:** `200 OK` + booking object đã cập nhật.

### 2.5 [ADMIN] Tạo Lịch khởi hành mới
*   **Endpoint:** `POST /api/v1/admin/departures`
*   **Request Body:**
    ```json
    {
      "tourId": 1,
      "startDate": "2026-04-05",
      "endDate": "2026-04-07",
      "depositDeadline": "2026-03-25",
      "paymentDeadline": "2026-03-30",
      "price": 2990000.00,
      "totalSlots": 20
    }
    ```
*   **Response:** `201 Created` + departure object.

### 2.6 [ADMIN] Cập nhật / Xóa Lịch khởi hành
*   **Cập nhật:** `PUT /api/v1/admin/departures/:id`
*   **Xóa:** `DELETE /api/v1/admin/departures/:id`

---

## 3. Module Adventure Pass

### 3.1 Danh sách Pass & Quyền lợi [PUBLIC]
*   **Endpoint:** `GET /api/v1/adventure-passes`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "title": "TRIAL",
          "subtitle": "...",
          "price": 8990000.00,
          "validityDate": "2026-12-31",
          "isSignature": false,
          "colorTheme": "#FF6B35",
          "features": [
            { "content": "3 cung đường", "isBold": true }
          ]
        }
      ]
    }
    ```

### 3.2 Đặt mua thẻ Pass [PUBLIC]
*   **Endpoint:** `POST /api/v1/adventure-passes/order`
*   **Request Body:**
    ```json
    {
      "passId": 1,
      "firstName": "Kien",
      "lastName": "Do",
      "phone": "0933227878",
      "email": "kien@domain.com",
      "paymentMethod": "vnpay"
    }
    ```
*   **Logic Backend:** Tạo `orderCode` unique → Insert vào `pass_orders`.
*   **Response:** `201 Created` + pass order object.

### 3.3 [ADMIN] Danh sách Pass Orders
*   **Endpoint:** `GET /api/v1/admin/pass-orders`
*   **Query Parameters:**
    *   `status`: `pending` | `paid` | `cancelled`
    *   `page`, `limit`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "orderCode": "PASS_00123",
          "passId": 1,
          "passTitle": "TRIAL",
          "firstName": "Kien",
          "lastName": "Do",
          "phone": "0933227878",
          "email": "kien@domain.com",
          "paymentMethod": "vnpay",
          "status": "pending",
          "createdAt": "2026-03-17T10:00:00Z"
        }
      ],
      "pagination": { "page": 1, "limit": 20, "total": 50 }
    }
    ```

### 3.4 [ADMIN] Cập nhật trạng thái Pass Order
*   **Endpoint:** `PATCH /api/v1/admin/pass-orders/:id/status`
*   **Request Body:** `{ "status": "paid" }`

### 3.5 [ADMIN] Quản lý thẻ Pass (CRUD)
*   **Tạo:** `POST /api/v1/admin/adventure-passes`
*   **Cập nhật:** `PUT /api/v1/admin/adventure-passes/:id`
*   **Xóa:** `DELETE /api/v1/admin/adventure-passes/:id`

---

## 4. Module Admin Auth & Nhân viên

### 4.1 [PUBLIC] Đăng nhập Admin
*   **Endpoint:** `POST /api/v1/admin/auth/login`
*   **Request Body:**
    ```json
    {
      "username": "admin_user",
      "password": "secret123"
    }
    ```
*   **Logic Backend:** Kiểm tra `status = 'active'` → So khớp `passwordHash` (bcrypt) → Trả về JWT.
*   **Response:**
    ```json
    {
      "status": "success",
      "data": {
        "token": "eyJhbGci...",
        "employee": {
          "id": 1,
          "username": "admin_user",
          "fullName": "Nguyễn Văn A",
          "role": { "id": 1, "name": "Quản trị viên", "code": "ADMIN" }
        }
      }
    }
    ```

### 4.2 [ADMIN] Lấy danh sách nhân viên (phân trang)
*   **Endpoint:** `GET /api/v1/admin/employees`
*   **Query Parameters:**
    *   `status`: `active` | `locked`
    *   `roleId`: lọc theo vai trò
    *   `page`, `limit`: phân trang
*   **Response:**
    ```json
    {
      "status": "success",
      "data": {
        "data": [
          {
            "id": 1,
            "username": "admin_user",
            "fullName": "Nguyễn Văn A",
            "email": "a.nguyen@domain.com",
            "status": "active",
            "lastLogin": "2026-03-17T08:00:00Z",
            "role": { "id": 1, "name": "Quản trị viên", "code": "ADMIN" }
          }
        ],
        "pagination": { "page": 1, "limit": 20, "total": 4 }
      }
    }
    ```

### 4.2b [ADMIN] Lấy tất cả nhân viên (không phân trang — dùng cho dropdown)
*   **Endpoint:** `GET /api/v1/admin/employees/all`
*   **Mục đích:** Trả về toàn bộ nhân viên active dưới dạng flat array — dùng cho các dropdown Select trong UI (như màn cấu hình thông báo).
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "fullName": "Nguyễn Văn A",
          "role": { "id": 1, "name": "Quản trị viên", "code": "ADMIN" }
        }
      ]
    }
    ```

### 4.3 [ADMIN] Tạo nhân viên mới
*   **Endpoint:** `POST /api/v1/admin/employees`
*   **Request Body:**
    ```json
    {
      "roleId": 2,
      "username": "editor_01",
      "password": "strongPassw0rd!",
      "fullName": "Nguyễn Văn B",
      "email": "b.nguyen@domain.com"
    }
    ```
*   **Response:** `201 Created` + employee object (không có `passwordHash`).

### 4.4 [ADMIN] Cập nhật / Xóa nhân viên
*   **Cập nhật:** `PUT /api/v1/admin/employees/:id`
*   **Khóa tài khoản:** `PATCH /api/v1/admin/employees/:id/status` + body `{ "status": "locked" }`
*   **Xóa:** `DELETE /api/v1/admin/employees/:id`

### 4.5 [ADMIN] Quản lý Vai trò (Roles)
*   **Lấy danh sách:** `GET /api/v1/admin/roles`
*   **Tạo mới:** `POST /api/v1/admin/roles` + body `{ "name": "Biên tập viên", "code": "EDITOR" }`
*   **Cập nhật:** `PUT /api/v1/admin/roles/:id`
*   **Xóa:** `DELETE /api/v1/admin/roles/:id`

### 4.6 [ADMIN] Quản lý Quyền hạn (RBAC)
*   **Lấy danh sách permissions:** `GET /api/v1/admin/permissions`
*   **Lấy permissions của role:** `GET /api/v1/admin/roles/:id/permissions`
*   **Gán quyền cho role:** `PUT /api/v1/admin/roles/:id/permissions`
    *   **Request Body:**
        ```json
        { "permissionIds": [1, 2, 5, 7] }
        ```
    *   **Logic Backend:** Xóa toàn bộ quyền cũ của role → Insert lại theo `permissionIds` mới.

---

## 5. Module Banners [ADMIN]

### 5.1 Lấy danh sách Banner [PUBLIC]
*   **Endpoint:** `GET /api/v1/banners`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "title": "Banner Hè 2026",
          "imageUrl": "https://...",
          "linkUrl": "/tours",
          "sortOrder": 1
        }
      ]
    }
    ```

### 5.2 [ADMIN] Lấy toàn bộ Banner (kể cả vô hiệu)
*   **Endpoint:** `GET /api/v1/admin/banners`
*   **Response:** Tương tự 5.1 nhưng bổ sung trường `isActive`.

### 5.3 [ADMIN] Tạo Banner mới
*   **Endpoint:** `POST /api/v1/admin/banners`
*   **Request Body:**
    ```json
    {
      "title": "Banner Hè 2026",
      "imageUrl": "https://...",
      "linkUrl": "/tours",
      "sortOrder": 1,
      "isActive": true
    }
    ```
*   **Response:** `201 Created` + banner object.

### 5.4 [ADMIN] Cập nhật / Xóa Banner
*   **Cập nhật:** `PUT /api/v1/admin/banners/:id`
*   **Xóa:** `DELETE /api/v1/admin/banners/:id`
*   **Đổi thứ tự sắp xếp:** `PATCH /api/v1/admin/banners/:id` + body `{ "sortOrder": 2 }`

---

## 6. Module Blog Posts

### 6.1 Lấy danh sách bài viết [PUBLIC]
*   **Endpoint:** `GET /api/v1/blog-posts`
*   **Query Parameters:**
    *   `limit`: số bài cần lấy (mặc định: `6`)
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "title": "Kinh nghiệm trekking Tà Năng",
          "slug": "kinh-nghiem-trekking-ta-nang",
          "thumbnail": "https://...",
          "publishedAt": "2026-03-10T08:00:00Z",
          "author": "Nguyễn Văn A"
        }
      ]
    }
    ```

### 6.2 Lấy chi tiết bài viết [PUBLIC]
*   **Endpoint:** `GET /api/v1/blog-posts/:slug`
*   **Response:** Gộp đầy đủ `title`, `content`, `thumbnail`, `publishedAt`, `author`.

### 6.3 [ADMIN] Lấy toàn bộ bài viết (cả draft)
*   **Endpoint:** `GET /api/v1/admin/blog-posts`
*   **Query Parameters:**
    *   `status`: `draft` | `published`
    *   `page`, `limit`

### 6.4 [ADMIN] Tạo bài viết mới
*   **Endpoint:** `POST /api/v1/admin/blog-posts`
*   **Request Body:**
    ```json
    {
      "title": "Kinh nghiệm trekking Tà Năng",
      "slug": "kinh-nghiem-trekking-ta-nang",
      "content": "<p>Nội dung HTML...</p>",
      "thumbnail": "https://...",
      "status": "draft"
    }
    ```
*   **Logic Backend:** `author_id` lấy từ JWT token của employee đăng nhập.
*   **Response:** `201 Created` + blog post object.

### 6.5 [ADMIN] Cập nhật bài viết
*   **Endpoint:** `PUT /api/v1/admin/blog-posts/:id`
*   **Lưu ý:** Khi cập nhật `status` sang `published`, backend tự động set `publishedAt = NOW()`.

### 6.6 [ADMIN] Xóa bài viết
*   **Endpoint:** `DELETE /api/v1/admin/blog-posts/:id`

---

## 7. Module General FAQs [ADMIN]

### 7.1 Lấy danh sách FAQ chung [PUBLIC]
*   **Endpoint:** `GET /api/v1/faqs`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "question": "Trekking cần chuẩn bị gì?",
          "answer": "Bạn cần chuẩn bị...",
          "sortOrder": 1
        }
      ]
    }
    ```

### 7.2 [ADMIN] CRUD FAQ chung
*   **Tạo:** `POST /api/v1/admin/faqs` + body `{ "question": "...", "answer": "...", "sortOrder": 1 }`
*   **Cập nhật:** `PUT /api/v1/admin/faqs/:id`
*   **Xóa:** `DELETE /api/v1/admin/faqs/:id`
*   **Đổi thứ tự:** `PATCH /api/v1/admin/faqs/:id` + body `{ "sortOrder": 2 }`

---

## 8. Module Contact Messages [ADMIN]

### 8.1 Gửi tin nhắn liên hệ [PUBLIC]
*   **Endpoint:** `POST /api/v1/contact`
*   **Request Body:**
    ```json
    {
      "fullName": "Trần Thị B",
      "phone": "0901234567",
      "email": "b.tran@domain.com",
      "message": "Tôi muốn hỏi về tour Tà Năng..."
    }
    ```
*   **Response:** `201 Created` + `{ "status": "success", "message": "Tin nhắn đã được gửi." }`

### 8.2 [ADMIN] Danh sách hộp thư liên hệ
*   **Endpoint:** `GET /api/v1/admin/contact-messages`
*   **Query Parameters:**
    *   `status`: `new` | `contacted` | `resolved`
    *   `page`, `limit`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "fullName": "Trần Thị B",
          "phone": "0901234567",
          "email": "b.tran@domain.com",
          "message": "Tôi muốn hỏi về tour...",
          "status": "new",
          "createdAt": "2026-03-17T09:00:00Z"
        }
      ],
      "pagination": { "page": 1, "limit": 20, "total": 30 }
    }
    ```

### 8.3 [ADMIN] Cập nhật trạng thái tin nhắn
*   **Endpoint:** `PATCH /api/v1/admin/contact-messages/:id/status`
*   **Request Body:** `{ "status": "contacted" }`
*   **Response:** `200 OK` + message object đã cập nhật.

### 8.4 [ADMIN] Xóa tin nhắn
*   **Endpoint:** `DELETE /api/v1/admin/contact-messages/:id`

---

## 9. Module Dashboard Tổng quan [ADMIN]

### 9.1 Thống kê tổng quan
*   **Endpoint:** `GET /api/v1/admin/dashboard/stats`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": {
        "totalBookings": 150,
        "bookingsThisMonth": 23,
        "totalRevenue": 450000000.00,
        "revenueThisMonth": 68000000.00,
        "pendingBookings": 12,
        "newContactMessages": 5,
        "totalTours": 8,
        "totalEmployees": 4
      }
    }
    ```

---

## 10. Module Media (MinIO Storage)

> Ảnh của tours và các entities khác được lưu trữ trên **MinIO**.
> Sau khi migration, `heroImage` / `cardImage` trong DB là object path (e.g. `tours/taynguyen/ta-nang-phan-dung/hero.jpg`).
> Các GET endpoint tự động convert sang **presigned URL** có hiệu lực 7 ngày trước khi trả về client.

### 10.1 Upload ảnh lên MinIO [ADMIN]
*   **Endpoint:** `POST /api/v1/media/upload-image`
*   **Auth:** Yêu cầu JWT
*   **Content-Type:** `multipart/form-data`
*   **Form field:** `file` — file ảnh cần upload
*   **Response:** `201 Created`
    ```json
    {
      "status": "success",
      "data": {
        "objectName": "3f2ca1b0-uuid-...-hero.jpg"
      }
    }
    ```
*   **Lưu ý:** `objectName` trả về là MinIO object key — dùng làm giá trị `heroImage` / `cardImage` khi tạo/cập nhật tour qua API.

### 10.2 Preview / Stream ảnh từ MinIO [PUBLIC]
*   **Endpoint:** `GET /api/v1/media/preview?object={objectName}`
*   **Auth:** Không cần
*   **Query Parameter:**
    *   `object` — MinIO object key, e.g. `tours/taynguyen/ta-nang-phan-dung/hero.jpg`
*   **Response:** Stream binary ảnh với đúng `Content-Type` (image/jpeg, image/png...)
*   **Dùng khi:** Nhúng ảnh trực tiếp qua Spring Boot proxy thay vì presigned URL.

### 10.3 Cấu trúc folder MinIO

Ánh xạ folder được thiết kế theo: `tours/{region}/{slug}/`

```
toong-images/          ← MinIO bucket
└── tours/
    ├── taynguyen/
    │   ├── ta-nang-phan-dung/
    │   │   ├── hero.jpg    ← heroImage
    │   │   └── card.jpg    ← cardImage
    │   └── bidoup/
    │       ├── hero.jpg
    │       └── card.jpg
    ├── nam/
    │   └── bu-gia-map/
    │       ├── hero.jpg
    │       └── card.jpg
    └── trung/
        ├── 8-nang-tien/
        └── la-ngau/
```

### 10.4 Cách ảnh được phục vụ trong GET Tour

Khi gọi `GET /api/v1/tours` hoặc `GET /api/v1/tours/:slug`, backend tự động:
1. Đọc `cardImage` / `heroImage` từ DB (object path MinIO)
2. Gọi `MinioService.getPresignedUrl(objectPath)` → sinh URL có hiệu lực **7 ngày**
3. Trả về presigned URL trong response — frontend có thể dùng trực tiếp trong `<img src="...">`

> **Backward compatible:** Nếu field vẫn là URL ngoài (`https://images.unsplash.com/...`), sẽ được pass-through không đổi.

---

## 11. Module Data Migration [PUBLIC — Internal Use Only]

> Endpoint phục vụ việc seed dữ liệu nội bộ (không yêu cầu JWT).
> **Không expose ra production** hoặc xoá sau khi hoàn tất migration.

### 11.1 Migrate ảnh Tour lên MinIO
*   **Endpoint:** `POST /api/v1/migrate/tour-images`
*   **Auth:** Không cần JWT
*   **Query Parameters:**
    *   `dryRun=true` — Preview, không thực sự upload hay update DB
    *   `dryRun=false` — Chạy thật (mặc định)
*   **Flow xử lý:**
    1. Lấy toàn bộ tours từ DB
    2. Với mỗi tour, kiểm tra `heroImage` và `cardImage`:
       - Nếu là URL ngoài (`http://...`) → download bytes → upload lên MinIO
       - Nếu đã là MinIO object path → bỏ qua (skip)
    3. Lưu vào MinIO theo path: `tours/{region}/{slug}/hero.jpg` và `card.jpg`
    4. Cập nhật `heroImage` / `cardImage` trong DB với MinIO object path
*   **Response:** `200 OK`
    ```json
    {
      "status": "success",
      "data": {
        "totalTours": 5,
        "success": 10,
        "skipped": 0,
        "failed": 0,
        "dryRun": false,
        "details": [
          {
            "id": 1,
            "slug": "ta-nang-phan-dung",
            "region": "taynguyen",
            "hero": "OK:tours/taynguyen/ta-nang-phan-dung/hero.jpg",
            "card": "OK:tours/taynguyen/ta-nang-phan-dung/card.jpg",
            "dbUpdated": true
          }
        ]
      }
    }
    ```
*   **Giá trị của trường `hero` / `card` trong details:**
    *   `OK:{path}` — Upload + update DB thành công
    *   `SKIP:already_minio:{path}` — Đã là MinIO path, bỏ qua
    *   `SKIP:empty` — Field đang null/rỗng
    *   `FAIL:{message}` — Lỗi download hoặc upload

---

## 12. Module Tour FAQs

> Quản lý câu hỏi thường gặp (FAQ) theo từng tour cụ thể.
> Khác với Module 7 (General FAQs) là FAQ chung của website, Tour FAQs gắn với từng tour và hiển thị trong màn **Tour Detail**.

### 12.1 Lấy FAQ theo Tour [PUBLIC] (`TourDetail.jsx`)
*   **Endpoint:** `GET /api/v1/tours/:tourId/faqs`
*   **path Variable:** `tourId` — ID của tour
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "tourId": 3,
          "tourName": "Tà Năng - Phan Dũng",
          "question": "Tour này có cần kinh nghiệm trekking không?",
          "answer": "Không cần kinh nghiệm trước, chỉ cần sức khỏe tốt.",
          "sortOrder": 1
        }
      ]
    }
    ```
*   **Lưu ý:** Dữ liệu trả về đã được sắp xếp theo `sortOrder` tăng dần.
*   FAQs theo tour cũng được **nhúng sẵn** trong response của `GET /api/v1/tours/:slug` (field `faqs`).

### 12.2 [ADMIN] Lấy toàn bộ Tour FAQs
*   **Endpoint:** `GET /api/v1/admin/tour-faqs`
*   **Query Parameters:**
    *   `tourId` *(optional)*: lọc FAQ theo tour cụ thể
*   **Response:** Danh sách tất cả FAQ theo `tourId`.

### 12.3 [ADMIN] Tạo Tour FAQ mới
*   **Endpoint:** `POST /api/v1/admin/tour-faqs`
*   **Request Body:**
    ```json
    {
      "tourId": 3,
      "question": "Tour này có cần kinh nghiệm trekking không?",
      "answer": "Không cần kinh nghiệm trước, chỉ cần sức khỏe tốt.",
      "sortOrder": 1
    }
    ```
*   **Response:** `201 Created` + tour FAQ object vừa tạo.

### 12.4 [ADMIN] Cập nhật Tour FAQ
*   **Endpoint:** `PUT /api/v1/admin/tour-faqs/:id`
*   **Request Body:** (các trường cần cập nhật)
    ```json
    {
      "question": "Câu hỏi đã chỉnh sửa?",
      "answer": "Câu trả lời mới.",
      "sortOrder": 2
    }
    ```
*   **Response:** `200 OK` + tour FAQ object đã cập nhật.
*   **Lưu ý:** Dùng `PATCH /api/v1/admin/tour-faqs/:id` để cập nhật một phần (partial update).

### 12.5 [ADMIN] Xóa Tour FAQ
*   **Endpoint:** `DELETE /api/v1/admin/tour-faqs/:id`
*   **Response:** `200 OK` + `{ "status": "success", "message": "TourFAQ đã được xóa." }`

---

## 13. Module Profile (Tài khoản cá nhân) [ADMIN]

> Cho phép nhân viên đang đăng nhập xem và cập nhật thông tin cá nhân của chính mình (không cần quyền SUPER_ADMIN).
> Token JWT trong header được dùng để xác định danh tính — không cần truyền `id` lên URL.

### 13.1 [ADMIN] Lấy thông tin profile bản thân
*   **Endpoint:** `GET /api/v1/admin/profile`
*   **Auth:** `Authorization: Bearer <token>`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": {
        "id": 1,
        "username": "kien.admin",
        "fullName": "Kiên Đỗ",
        "email": "kien@toong.vn",
        "status": "active",
        "lastLogin": "2026-03-20T03:00:00Z",
        "createdAt": "2025-01-01T00:00:00Z",
        "role": {
          "id": 1,
          "name": "Quản trị viên",
          "code": "ADMIN"
        }
      }
    }
    ```
*   **Logic Backend:** Lấy `employeeId` từ JWT claims → trả về employee + role.

### 13.2 [ADMIN] Cập nhật thông tin cá nhân
*   **Endpoint:** `PUT /api/v1/admin/profile`
*   **Auth:** `Authorization: Bearer <token>`
*   **Request Body:**
    ```json
    {
      "fullName": "Kiên Đỗ",
      "email": "kien.new@toong.vn"
    }
    ```
*   **Lưu ý:**
    - Chỉ được cập nhật `fullName` và `email` — các trường như `username`, `role`, `status` **không được phép chỉnh sửa** qua endpoint này.
    - Backend phải kiểm tra email mới chưa bị trùng với nhân viên khác.
*   **Response:** `200 OK`
    ```json
    {
      "status": "success",
      "data": {
        "id": 1,
        "fullName": "Kiên Đỗ",
        "email": "kien.new@toong.vn"
      }
    }
    ```

### 13.3 [ADMIN] Đổi mật khẩu
*   **Endpoint:** `POST /api/v1/admin/profile/change-password`
*   **Auth:** `Authorization: Bearer <token>`
*   **Request Body:**
    ```json
    {
      "currentPassword": "oldSecret123",
      "newPassword": "newSecret456"
    }
    ```
*   **Logic Backend:**
    1. Lấy `employeeId` từ JWT.
    2. Load `passwordHash` của employee từ DB.
    3. Dùng `bcrypt.compare(currentPassword, passwordHash)` — nếu sai → trả `400` kèm message.
    4. Hash `newPassword` mới → cập nhật DB.
*   **Response thành công:** `200 OK`
    ```json
    { "status": "success", "message": "Đổi mật khẩu thành công." }
    ```
*   **Response lỗi (sai mật khẩu hiện tại):** `400 Bad Request`
    ```json
    { "status": "error", "message": "Mật khẩu hiện tại không đúng." }
    ```

---

## 14. Module Notifications [ADMIN]

> Hệ thống thông báo nội bộ CMS. Backend push vào bảng `notifications` mỗi khi có sự kiện (booking, pass order, contact mới). Routing được cấu hình qua bảng `notification_configs` — xác định loại thông báo nào gửi cho role nào / user cụ thể / tất cả.

### Database Schema (3 bảng)

```sql
CREATE TABLE notifications (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  type        ENUM('booking', 'contact', 'pass') NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  refId      BIGINT,        -- ID booking / contact / pass order
  refPath    VARCHAR(100),  -- route CMS, e.g. /cms/bookings
  createdAt  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notification_recipients (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  notificationId BIGINT  NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  employeeId     BIGINT  NOT NULL REFERENCES employees(id)    ON DELETE CASCADE,
  isRead         BOOLEAN DEFAULT FALSE,
  readAt         TIMESTAMP NULL,
  UNIQUE KEY uq_notif_emp (notificationId, employeeId)
);

CREATE TABLE notification_configs (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  notifType  ENUM('booking', 'contact', 'pass') NOT NULL,
  targetType ENUM('all', 'role', 'employee')    NOT NULL,
  targetId   BIGINT  NULL,   -- roleId hoặc employeeId; NULL nếu targetType='all'
  isActive   BOOLEAN DEFAULT TRUE,
  createdAt  TIMESTAMP DEFAULT NOW(),
  UNIQUE KEY uq_config (notifType, targetType, targetId)
);
```

### 14.1 [ADMIN] Lấy danh sách thông báo của user hiện tại
*   **Endpoint:** `GET /api/v1/admin/notifications`
*   **Query Parameters:**
    *   `limit`: số thông báo cần lấy (mặc định: `20`)
    *   `unreadOnly`: `true` | `false`
*   **Logic Backend:** Lấy `employeeId` từ JWT → query `notification_recipients` JOIN `notifications`.
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 12,
          "type": "booking",
          "title": "Booking mới BK-10296",
          "description": "Nguyễn Văn A đặt tour Tà Năng - 2 người",
          "refId": 101,
          "refPath": "/cms/bookings",
          "isRead": false,
          "createdAt": "2026-03-20T06:30:00Z"
        }
      ],
      "unreadCount": 3
    }
    ```

### 14.2 [ADMIN] Đánh dấu 1 thông báo đã đọc
*   **Endpoint:** `PATCH /api/v1/admin/notifications/:id/read`
*   **Logic Backend:** Update `notification_recipients.isRead = true`, `readAt = NOW()` cho đúng cặp `(notificationId, employeeId)`.
*   **Response:** `200 OK` + `{ "status": "success" }`

### 14.3 [ADMIN] Đánh dấu tất cả thông báo đã đọc
*   **Endpoint:** `PATCH /api/v1/admin/notifications/read-all`
*   **Logic Backend:** Update toàn bộ `notification_recipients` của `employeeId` hiện tại.
*   **Response:** `200 OK` + `{ "status": "success" }`

### 14.4 [ADMIN] Lấy danh sách cấu hình routing thông báo
*   **Endpoint:** `GET /api/v1/admin/notification-configs`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "notifType": "booking",
          "targetType": "role",
          "targetId": 1,
          "targetLabel": "Quản trị viên",
          "isActive": true,
          "createdAt": "2026-03-20T00:00:00Z"
        }
      ]
    }
    ```
*   **Lưu ý:** `targetLabel` là tên role hoặc tên nhân viên được backend resolve tự động; `targetId` = null nếu `targetType = 'all'`.

### 14.5 [ADMIN] Tạo cấu hình routing mới
*   **Endpoint:** `POST /api/v1/admin/notification-configs`
*   **Request Body:**
    ```json
    {
      "notifType": "booking",
      "targetType": "role",
      "targetId": 1
    }
    ```
*   **Validation:**
    - `targetType = 'all'` → `targetId` phải là `null`
    - `targetType = 'role'` → `targetId` phải là ID hợp lệ trong bảng `roles`
    - `targetType = 'employee'` → `targetId` phải là ID hợp lệ trong bảng `employees`
    - Không được tạo bản ghi trùng (UNIQUE constraint)
*   **Response:** `201 Created` + config object vừa tạo.

### 14.6 [ADMIN] Cập nhật cấu hình routing
*   **Endpoint:** `PUT /api/v1/admin/notification-configs/:id`
*   **Request Body:** (các trường cần cập nhật)
    ```json
    {
      "notifType": "contact",
      "targetType": "all",
      "targetId": null
    }
    ```
*   **Response:** `200 OK` + config object đã cập nhật.

### 14.7 [ADMIN] Bật / Tắt cấu hình routing
*   **Endpoint:** `PATCH /api/v1/admin/notification-configs/:id/status`
*   **Request Body:**
    ```json
    { "isActive": false }
    ```
*   **Response:** `200 OK` + config object với `isActive` mới.

### 14.8 [ADMIN] Xóa cấu hình routing
*   **Endpoint:** `DELETE /api/v1/admin/notification-configs/:id`
*   **Response:** `200 OK` + `{ "status": "success", "message": "Cấu hình đã được xóa." }`

---

## Tóm tắt Endpoints

| Module | Endpoint | Method | Auth |
|---|---|---|---|
| Tours | `/api/v1/tours` | GET | PUBLIC |
| Tours | `/api/v1/tours/:slug` | GET | PUBLIC |
| Tours | `/api/v1/admin/tours` | POST | ADMIN |
| Tours | `/api/v1/admin/tours/:id` | GET | ADMIN |
| Tours | `/api/v1/admin/tours/:id` | PUT / DELETE | ADMIN |
| Departures | `/api/v1/tours/:id/departures` | GET | PUBLIC |
| Departures | `/api/v1/admin/departures` | POST | ADMIN |
| Departures | `/api/v1/admin/departures/:id` | PUT / DELETE | ADMIN |
| Bookings | `/api/v1/bookings` | POST | PUBLIC |
| Bookings | `/api/v1/admin/bookings` | GET | ADMIN |
| Bookings | `/api/v1/admin/bookings/:id/status` | PATCH | ADMIN |
| Pass | `/api/v1/adventure-passes` | GET | PUBLIC |
| Pass | `/api/v1/adventure-passes/order` | POST | PUBLIC |
| Pass | `/api/v1/admin/adventure-passes` | POST / PUT / DELETE | ADMIN |
| Pass Orders | `/api/v1/admin/pass-orders` | GET | ADMIN |
| Pass Orders | `/api/v1/admin/pass-orders/:id/status` | PATCH | ADMIN |
| Auth | `/api/v1/admin/auth/login` | POST | PUBLIC |
| Employees | `/api/v1/admin/employees` | GET / POST | ADMIN |
| Employees | `/api/v1/admin/employees/:id` | PUT / DELETE | ADMIN |
| Roles | `/api/v1/admin/roles` | GET / POST / PUT / DELETE | ADMIN |
| Permissions | `/api/v1/admin/permissions` | GET | ADMIN |
| Permissions | `/api/v1/admin/roles/:id/permissions` | GET / PUT | ADMIN |
| Banners | `/api/v1/banners` | GET | PUBLIC |
| Banners | `/api/v1/admin/banners` | GET / POST / PUT / DELETE | ADMIN |
| Blog | `/api/v1/blog-posts` | GET | PUBLIC |
| Blog | `/api/v1/blog-posts/:slug` | GET | PUBLIC |
| Blog | `/api/v1/admin/blog-posts` | GET / POST / PUT / DELETE | ADMIN |
| FAQs | `/api/v1/faqs` | GET | PUBLIC |
| FAQs | `/api/v1/admin/faqs` | POST / PUT / DELETE | ADMIN |
| Contact | `/api/v1/contact` | POST | PUBLIC |
| Contact | `/api/v1/admin/contact-messages` | GET | ADMIN |
| Contact | `/api/v1/admin/contact-messages/:id/status` | PATCH | ADMIN |
| Dashboard | `/api/v1/admin/dashboard/stats` | GET | ADMIN |
| Media | `/api/v1/media/upload-image` | POST | ADMIN |
| Media | `/api/v1/media/preview` | GET | PUBLIC |
| Migration | `/api/v1/migrate/tour-images` | POST | PUBLIC (internal) |
| Tour FAQs | `/api/v1/tours/:tourId/faqs` | GET | PUBLIC |
| Tour FAQs | `/api/v1/admin/tour-faqs` | GET / POST | ADMIN |
| Tour FAQs | `/api/v1/admin/tour-faqs/:id` | PUT / PATCH / DELETE | ADMIN |
| Profile | `/api/v1/admin/profile` | GET | ADMIN |
| Profile | `/api/v1/admin/profile` | PUT | ADMIN |
| Profile | `/api/v1/admin/profile/change-password` | POST | ADMIN |
| Notifications | `/api/v1/admin/notifications` | GET | ADMIN |
| Notifications | `/api/v1/admin/notifications/:id/read` | PATCH | ADMIN |
| Notifications | `/api/v1/admin/notifications/read-all` | PATCH | ADMIN |
| Notification Configs | `/api/v1/admin/notification-configs` | GET / POST | ADMIN |
| Notification Configs | `/api/v1/admin/notification-configs/:id` | PUT / DELETE | ADMIN |
| Notification Configs | `/api/v1/admin/notification-configs/:id/status` | PATCH | ADMIN |
| Tour Cost Details | `/api/v1/admin/tour-cost-details` | GET / POST | ADMIN |
| Tour Cost Details | `/api/v1/admin/tour-cost-details/:id` | PUT / DELETE | ADMIN |
| Tour Luggages | `/api/v1/admin/tour-luggages` | GET / POST | ADMIN |
| Tour Luggages | `/api/v1/admin/tour-luggages/:id` | PUT / DELETE | ADMIN |

---

## 15. Module Tour Cost Details [ADMIN]

> Quản lý danh sách chi phí đã bao gồm / không bao gồm trong giá tour.

### 15.1 [ADMIN] Lấy danh sách chi phí theo Tour
*   **Endpoint:** `GET /api/v1/admin/tour-cost-details`
*   **Query Parameters:**
    *   `tourId` *(required)*: ID của tour
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "tourId": 3,
          "tourName": "Tà Năng - Phan Dũng",
          "isIncluded": true,
          "content": "Xe khứ hồi TP.HCM - điểm xuất phát",
          "sortOrder": 1
        }
      ]
    }
    ```

### 15.2 [ADMIN] Tạo mục chi phí mới
*   **Endpoint:** `POST /api/v1/admin/tour-cost-details`
*   **Request Body:**
    ```json
    {
      "tourId": 3,
      "isIncluded": true,
      "content": "Xe khứ hồi TP.HCM - điểm xuất phát",
      "sortOrder": 1
    }
    ```
*   **Response:** `201 Created` + cost detail object vừa tạo.

### 15.3 [ADMIN] Cập nhật mục chi phí
*   **Endpoint:** `PUT /api/v1/admin/tour-cost-details/:id`
*   **Request Body:** (các trường cần cập nhật)
*   **Response:** `200 OK` + cost detail object đã cập nhật.

### 15.4 [ADMIN] Xóa mục chi phí
*   **Endpoint:** `DELETE /api/v1/admin/tour-cost-details/:id`
*   **Response:** `200 OK` + `{ "status": "success", "message": "Đã xóa." }`

---

## 16. Module Tour Luggages [ADMIN]

> Quản lý danh sách hành lý và trang bị cần mang theo cho từng tour.

### 16.1 [ADMIN] Lấy danh sách hành lý theo Tour
*   **Endpoint:** `GET /api/v1/admin/tour-luggages`
*   **Query Parameters:**
    *   `tourId` *(required)*: ID của tour
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "tourId": 3,
          "tourName": "Tà Năng - Phan Dũng",
          "name": "GIÀY",
          "detail": "Giày trekking đế bám, cổ thấp hoặc cổ cao.",
          "sortOrder": 1
        }
      ]
    }
    ```

### 16.2 [ADMIN] Tạo mục hành lý mới
*   **Endpoint:** `POST /api/v1/admin/tour-luggages`
*   **Request Body:**
    ```json
    {
      "tourId": 3,
      "name": "GIÀY",
      "detail": "Giày trekking đế bám, cổ thấp hoặc cổ cao.",
      "sortOrder": 1
    }
    ```
*   **Response:** `201 Created` + luggage object vừa tạo.

### 16.3 [ADMIN] Cập nhật mục hành lý
*   **Endpoint:** `PUT /api/v1/admin/tour-luggages/:id`
*   **Request Body:** (các trường cần cập nhật)
*   **Response:** `200 OK` + luggage object đã cập nhật.

### 16.4 [ADMIN] Xóa mục hành lý
*   **Endpoint:** `DELETE /api/v1/admin/tour-luggages/:id`
*   **Response:** `200 OK` + `{ "status": "success", "message": "Đã xóa." }`

---

**Gợi ý lập trình:**
- Dùng **JWT middleware** để bảo vệ tất cả route `/api/v1/admin/**`.
- Dùng **RBAC middleware** sau JWT để kiểm tra `permission.code` (từ bảng `permissions`) cho từng action cụ thể.
- Với các route trả về danh sách lớn, luôn implement **pagination** (`page` + `limit`).
- Dùng **`Promise.all`** ở backend khi `TourDetail` cần join nhiều bảng con để tối ưu hiệu năng.

