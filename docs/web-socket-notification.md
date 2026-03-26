# WebSocket Notification — Hướng dẫn tích hợp Frontend

## Tổng quan

Server hỗ trợ **hai cơ chế** nhận thông báo. Frontend tự quyết định dùng cái nào:

| Cơ chế | Endpoint | Ưu điểm | Nhược điểm |
|--------|----------|----------|------------|
| **REST Polling** | `GET /api/v1/admin/notifications` | Đơn giản, không cần thư viện | Độ trễ ~20s, tốn băng thông |
| **WebSocket (STOMP)** | `ws://<host>/ws` | Real-time, instant push | Cần maintain kết nối |

> Hai chế độ có thể chạy **song song** (ví dụ: dùng WebSocket nhưng fallback sang polling nếu kết nối thất bại).

---

## Kết nối WebSocket

### 1. Thư viện khuyến nghị

```bash
# SockJS + STOMP client
npm install sockjs-client @stomp/stompjs
```

### 2. Endpoint

```
ws://<host>:<port>/ws
```

SockJS sẽ tự thử WebSocket trước, fallback sang HTTP long-polling nếu WebSocket bị block.

### 3. Xác thực (JWT)

Gửi JWT trong STOMP `CONNECT` header `Authorization`. **Không** cần gửi trong URL query string.

---

## Code mẫu JavaScript/TypeScript

```ts
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const BASE_URL = 'http://localhost:8080';
const JWT_TOKEN = '/* your JWT token */';

const client = new Client({
  webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),

  // Gửi JWT trong STOMP CONNECT header
  connectHeaders: {
    Authorization: `Bearer ${JWT_TOKEN}`,
  },

  // Tự động reconnect sau 5s nếu mất kết nối
  reconnectDelay: 5000,

  onConnect: () => {
    console.log('[WS] Connected');

    // Lấy missed notifications từ REST trước (offline period)
    fetchMissedNotifications();

    // Subscribe để nhận notifications real-time
    client.subscribe('/user/queue/notifications', (message) => {
      const notification = JSON.parse(message.body);
      handleNewNotification(notification);
    });
  },

  onDisconnect: () => console.log('[WS] Disconnected'),
  onStompError: (frame) => console.error('[WS] STOMP error', frame),
});

client.activate();

// Cleanup khi user logout hoặc component unmount
function disconnect() {
  client.deactivate();
}
```

---

## Payload nhận được

Mỗi notification push có cấu trúc JSON sau (mapping với `NotificationResponseDto`):

```json
{
  "id": 42,
  "type": "ADVENTURE_PASS_CREATED",
  "title": "Adventure Pass mới được tạo",
  "description": "Adventure Pass #123 đã được tạo bởi admin.",
  "refId": 123,
  "refPath": "/adventure-passes/123",
  "isRead": false,
  "createdAt": "2026-03-26T14:30:00"
}
```

| Field | Type | Mô tả |
|-------|------|-------|
| `id` | `number` | ID của thông báo |
| `type` | `string` | Loại sự kiện (`NotifType` enum) |
| `title` | `string` | Tiêu đề ngắn |
| `description` | `string \| null` | Mô tả chi tiết |
| `refId` | `number \| null` | ID đối tượng liên quan |
| `refPath` | `string \| null` | Path điều hướng (ví dụ: `/adventure-passes/123`) |
| `isRead` | `boolean` | Luôn là `false` khi mới push |
| `createdAt` | `string` | ISO 8601 datetime |

---

## Xử lý khi reconnect / missed notifications

WebSocket push là **best-effort**: nếu user offline lúc có thông báo mới, push đó sẽ bị bỏ qua. Thông báo **vẫn được lưu vào DB** và có thể lấy qua REST.

**Recommended pattern:**

```ts
async function fetchMissedNotifications() {
  const res = await fetch('/api/v1/admin/notifications?limit=20', {
    headers: { Authorization: `Bearer ${JWT_TOKEN}` },
  });
  const data = await res.json();
  // Merge vào notification store, tránh duplicate bằng id
  mergeNotifications(data.data);
}
```

Gọi `fetchMissedNotifications()` tại:
1. Lúc **khởi động app** (lần đầu render)
2. Sau mỗi lần WebSocket **reconnect thành công** (trong `onConnect`)

---

## Switching: Polling → WebSocket

Nếu muốn giữ polling hiện tại làm fallback:

```ts
let wsActive = false;

// Khi WS kết nối thành công -> dừng polling
onConnect: () => {
  wsActive = true;
  clearInterval(pollingInterval);
}

// Khi WS mất kết nối -> khởi động lại polling
onDisconnect: () => {
  if (!wsActive) return;
  wsActive = false;
  pollingInterval = setInterval(fetchNotifications, 20_000);
}
```

---

## Lưu ý bảo mật

- JWT có thể hết hạn trong khi WebSocket vẫn đang kết nối. Nếu server trả `STOMP ERROR` sau khi refresh token, hãy reconnect lại với token mới.
- Không đưa JWT vào URL (ví dụ: `?token=...`) vì sẽ bị lưu trong server access log.
