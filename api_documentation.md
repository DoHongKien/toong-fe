# Tài Liệu Đặc Tả API (Chuẩn hóa theo Database Schema)
Dự án: **Toong Adventure Clone**

Tài liệu này xác định các điểm cuối (endpoints) API cần thiết, được chuẩn hóa theo cấu trúc dữ liệu (`database_queries.md`) để đảm bảo tính nhất quán giữa Backend và Frontend.

---

## 1. Module Tours

### 1.1 Lấy danh sách Tour (`Tours.jsx`)
*   **Endpoint:** `/api/v1/tours`
*   **Method:** `GET`
*   **Query Parameters:**
    *   `region`: `nam`, `trung`, `taynguyen` (ENUM)
    *   `difficulty`: `Dễ`, `Vừa phải`, `Thử thách`, `Khó`, `Rất Dễ`
    *   `duration_days`: Số ngày trekking
*   **Response:**
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
          "base_price": 2990000.00
        }
      ]
    }
    ```

### 1.2 Lấy chi tiết Tour (`TourDetail.jsx`)
*   **Endpoint:** `/api/v1/tours/:slug`
*   **Method:** `GET`
*   **Response:** (Gộp dữ liệu từ nhiều bảng theo schema)
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
        "cost_details": [
          { "is_included": true, "content": "Xe khứ hồi..." }
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

---

## 2. Module Booking

### 2.1 Lấy lịch khởi hành (`Departures`)
*   **Endpoint:** `/api/v1/tours/:id/departures`
*   **Method:** `GET`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 5,
          "start_date": "2026-04-05",
          "end_date": "2026-04-06",
          "price": 2990000.00,
          "available_slots": 15,
          "status": "active"
        }
      ]
    }
    ```

### 2.2 Tạo đơn đặt chỗ (`Bookings`)
*   **Endpoint:** `/api/v1/bookings`
*   **Method:** `POST`
*   **Request Body:** (Khớp với các cột NOT NULL trong bảng `bookings`)
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
*   **Logic Backend:** 
    1. Kiểm tra slot còn lại.
    2. Tạo `booking_code` (unique).
    3. Tính toán `total_amount`, `deposit_amount`, `remaining_amount`.
    4. Cập nhật `booked_slots` trong bảng `departures`.

---

## 3. Module Adventure Pass

### 3.1 Danh sách Pass & Quyền lợi
*   **Endpoint:** `/api/v1/adventure-passes`
*   **Method:** `GET`
*   **Response:**
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "title": "TRIAL",
          "price": 8990000.00,
          "features": [
            { "content": "3 cung đường", "is_bold": true }
          ]
        }
      ]
    }
    ```

### 3.2 Đặt mua thẻ Pass (`Pass Orders`)
*   **Endpoint:** `/api/v1/adventure-passes/order`
*   **Method:** `POST`
*   **Request Body:**
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

---

## 4. Module Navigation Menu (Dynamic Menu)

### 4.1 Lấy toàn bộ cây Menu (`Navbar.jsx`)
*   **Endpoint:** `/api/v1/menus`
*   **Method:** `GET`
*   **Response:** (Dữ liệu phân cấp Cha-Con để render trực tiếp Navbar)
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "keyName": "natureWalking",
          "label": "Nature Walking",
          "href": "#",
          "type": "MEGA_PARENT",
          "megaAccentTitle": "Nature Walking",
          "megaMainTitle": "Nature Walking",
          "megaDescription": "Phù hợp với những người mới bắt đầu...",
          "megaImage": "https://...",
          "children": [
            {
              "id": 9,
              "label": "8 Nàng Tiên",
              "href": "/tours/8-nang-tien",
              "type": "ITEM",
              "megaMainTitle": "8 Nàng Tiên",
              "megaDescription": "...",
              "megaImage": "https://..."
            }
          ]
        },
        {
          "id": 4,
          "keyName": null,
          "label": "Cấp độ mạo hiểm",
          "href": "/level",
          "type": "SIMPLE",
          "children": []
        }
      ]
    }
    ```
*   **Logic Backend:**
    1. Truy vấn toàn bộ bản ghi từ bảng `menus` đang kích hoạt (`is_active = TRUE`).
    2. JOIN với bảng `tours` để lấy thêm `slug` và `card_image` cho các Menu có `tour_id`.
    3. Chuyển đổi danh sách phẳng (flat list) thành cấu trúc cây (tree structure) dựa trên `parent_id` trước khi trả về.
