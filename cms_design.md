# Thiết Kế CMS - Toong Adventure

**Phong cách**: Modern SaaS Admin Dashboard

Kiểu thiết kế phổ biến ở các sản phẩm như Ant Design Pro, Linear, Vercel Console — mang lại cảm giác chuyên nghiệp, rõ ràng và dễ dùng cho người vận hành.

---

## 1. Nguyên tắc thiết kế chủ đạo

| Nguyên tắc | Mô tả |
| :--- | :--- |
| **Clean & Spacious** | Nhiều khoảng trắng, không nhồi nhét — giúp người dùng tập trung vào dữ liệu |
| **Data-First** | Stat card ở đầu trang cho cái nhìn tổng quan ngay lập tức |
| **Consistent Hierarchy** | Page header → Summary cards → Data table/content |
| **Subtle Depth** | Dùng `box-shadow` nhẹ thay vì border cứng để tạo chiều sâu |
| **Contextual Color** | Màu sắc mang ý nghĩa: xanh lá = tốt, cam/đỏ = cảnh báo, xanh dương = thông tin |

---

## 2. Bảng màu (Color Palette)

| Thành phần | Mã màu | Ý nghĩa |
| :--- | :--- | :--- |
| **Primary** | `#1F4529` | Deep Forest Green — button chính, active states, accent |
| **Primary Light** | `#47663B` | Lighter Green — hover states |
| **Sidebar bg** | `#0D2E2A` | Dark Teal — đậm hơn primary để sidebar nổi bật |
| **Layout bg** | `#F0F2F5` | Off-white xám nhẹ — nền tổng thể tạo chiều sâu |
| **Card bg** | `#FFFFFF` | Trắng tinh — nền card/table |
| **Danger** | `#E65C4F` | Coral Red — nút xóa, cảnh báo |
| **Accent** | `#E8ECD7` | Earthy Accent — highlight nhẹ, text phụ trên nền tối |

---

## 3. Typography

- **Heading**: `'Outfit', sans-serif` — Hiện đại, mạnh mẽ
- **Body / UI**: `'Inter', -apple-system, sans-serif` — Tối ưu đọc dữ liệu bảng biểu
- **Font size**: Base `14px`, heading page `level 4 (20px)`, stat value `28px`

---

## 4. Layout Structure

```
┌─────────────────────────────────────────────────┐
│  SIDEBAR (#0D2E2A, 220px)  │     HEADER (56px)  │  ← sticky, box-shadow
│  ─ Logo + Brand text       ├────────────────────│
│  ─ Menu groups với icon    │  Breadcrumb | User  │
│    • Kinh doanh            ├────────────────────│
│    • Nội dung              │                    │
│    • Hệ thống              │  Page Header       │
│                            │  ─ Title + Subtitle│
│  [collapse button]  ↓      │                    │
│                            │  Stat Cards Row    │
│                            │  ─ 4 cards, icons  │
│                            │                    │
│                            │  Main Content      │
│                            │  ─ Table / Cards   │
└────────────────────────────┴────────────────────┘
```

### Mỗi trang quản lý gồm 2 lớp:
1. **Page Header** — Title (level 4) + subtitle mô tả ngắn
2. **Data Table** (ProTable) — có search, sort, pagination, action buttons

> **Lưu ý**: Stat Cards **chỉ xuất hiện trên Dashboard**. Các trang quản lý (Tours, Bookings, Staff, ...) không dùng stat cards — chỉ cần Page Header rõ ràng và bảng dữ liệu.

---

## 5. Component Patterns

### Stat Card _(chỉ dùng trên Dashboard)_
```jsx
// Cấu trúc: Icon tile bên phải, số liệu + trend bên trái
<Card boxShadow="0 2px 8px rgba(0,0,0,0.06)" border="none" borderRadius={10}>
  <Statistic title="..." value={...} />
  <div style={{ background: 'rgba(color, 0.1)', borderRadius: 10 }}>
    <Icon style={{ color }} />
  </div>
  <ArrowUpOutlined /> +X% so tháng trước
</Card>
```

### Action Buttons (trong bảng)
- Dùng `Button size="small"` với icon-only: `👁` Xem | `✏️` Sửa | `🗑` Xóa
- Không dùng `<a>` text link cho action — dùng Button có icon rõ ràng hơn

### Detail Modal
- `centered`, `width={680}`, `footer={null}`, `destroyOnClose`
- Có dải **gradient header** (`#0D2E2A → #1F4529`) chứa tên record + giá trị chính
- Bên dưới dùng `Descriptions` bordered, `column={2}` cho compact

### Table (ProTable)
```jsx
cardProps={{ style: { borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: 'none' } }}
```

---

## 6. Ant Design Theme Tokens

```javascript
token: {
  colorPrimary: '#1F4529',
  borderRadius: 6,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  colorBgLayout: '#F0F2F5',
  colorBgContainer: '#FFFFFF',
  fontSize: 14,
},
components: {
  Menu: {
    darkItemBg: 'transparent',
    darkSubMenuItemBg: 'rgba(0,0,0,0.2)',
    darkItemSelectedBg: '#1F4529',
  },
  Layout: {
    siderBg: '#0D2E2A',
    headerBg: '#ffffff',
  },
},
```

---

## 7. Thư viện sử dụng

| Thư viện | Phiên bản | Mục đích |
| :--- | :--- | :--- |
| `antd` | v5 | Component UI chính |
| `@ant-design/pro-components` | v2 | ProTable, ModalForm |
| `@ant-design/icons` | latest | Icon hệ thống |
| `react-router-dom` | v6 | Routing SPA |

---

*Tài liệu này được cập nhật theo thiết kế thực tế đã triển khai — phong cách Modern SaaS Admin Dashboard.*
