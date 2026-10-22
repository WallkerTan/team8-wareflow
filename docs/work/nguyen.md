## ⚙️ BACKEND — be-nguyên

> Phụ trách toàn bộ API + business logic + transaction
> Trạng thái: **hoàn tất**, đã verify bằng `_apitest.ps1` (30 bước) + `_newtest.ps1` (11 bước) — tất cả PASS.

### 🔐 Auth Service
- [x] Login (JWT) + phân quyền role
- [x] Middleware check role: ADMIN ❌ `/warehouse`, OWNER ❌ `/admin`
- [x] `GET /api/me` — thông tin cá nhân
- [x] `PUT /api/me` — cập nhật hồ sơ
- [x] `PATCH /api/me/password` — đổi mật khẩu (BCrypt)

### 🛠️ Admin APIs
- [x] `GET /api/users` — list + filter
- [x] `POST /api/users` — tạo user
- [x] `PUT /api/users/{id}` — sửa user
- [x] `PATCH /api/users/{id}/status` — khóa/mở khóa
- [x] CRUD `/api/suppliers`
- [x] CRUD `/api/categories`
- [x] `GET /api/admin/stats` (optional)

### 📦 Inventory Service
- [x] CRUD `/api/products` + filter `lowStock`
- [x] `POST /api/receipts` — tạo phiếu nhập DRAFT
- [x] `PUT/DELETE /api/receipts/{id}` — sửa/xóa DRAFT
- [x] `POST /api/receipts/{id}/confirm` — **transaction cộng stock** ⚠️
- [x] `POST /api/receipts/{id}/cancel`
- [x] `POST /api/issues` — tạo phiếu xuất DRAFT
- [x] `PUT/DELETE /api/issues/{id}` — sửa/xóa DRAFT
- [x] `POST /api/issues/{id}/confirm` — **transaction trừ stock** + validate `quantity ≤ stock_quantity` ⚠️
- [x] `POST /api/issues/{id}/cancel`
- [x] `GET /api/receipts`, `GET /api/receipts/{id}`
- [x] `GET /api/issues`, `GET /api/issues/{id}`

### 🚚 Shipment Service
- [x] `POST /api/shipments` — tạo từ issue CONFIRMED (1-1)
- [x] `PATCH /api/shipments/{id}/status` — cập nhật + ghi log
- [x] `GET /api/shipments/{id}/logs` — timeline

### 🔧 Bổ sung (ngoài checklist, đã triển khai)
- [x] `POST /api/auth/logout` — endpoint logout (trước đó config có rule nhưng thiếu handler)
- [x] `POST /api/auth/refresh` — làm mới token, **kiểm tra `type=refresh`** (trước đó access token cũng gọi được)
- [x] Khoá pessimistic (`SELECT ... FOR UPDATE`) khi confirm phiếu nhập/xuất — chống âm kho do race condition
- [x] OWNER được **đọc** `/api/suppliers`, `/api/categories` (cần ID hợp lệ để tạo phiếu nhập / sản phẩm); ghi/xoá vẫn chỉ ADMIN
- [x] `PUT /api/products/{id}` **không còn sửa trực tiếp `stockQuantity`** — tồn kho chỉ đổi qua phiếu nhập/xuất
- [x] `@PreAuthorize` trên tất cả controller (defense-in-depth ngoài rule theo URL)
- [x] JWT secret / DB password / CORS đọc từ **biến môi trường** (có default cho dev)

---

## ⚠️ GHI CHÚ QUAN TRỌNG

### Transaction bắt buộc
- **W6** (cộng tồn) & **W10** (trừ tồn) → chạy trong 1 transaction của `inventory-service`
- Mục đích: tránh lệch kho khi có lỗi giữa chừng
- **Bổ sung**: dùng `PESSIMISTIC_WRITE` + sắp xếp product ID tăng dần → tránh âm kho *và* deadlock

### Validate trước confirm
- **W9**: check `quantity ≤ stock_quantity` → reject nếu vượt

### Không FK chéo schema
- `created_by`, `changed_by`, `issue_id` → chỉ lưu ID, validate ở code

### Status flow
- **Receipt / Issue**: `DRAFT → CONFIRMED` hoặc `DRAFT → CANCELLED`
- **Shipment**: `PENDING → SHIPPING → COMPLETED / CANCELLED`

### Cảnh báo tồn
- Query: `WHERE stock_quantity <= min_stock`

### Chạy test
```powershell
cd backend
./gradlew bootRun                        # terminal 1
powershell -File ./_apitest.ps1          # terminal 2 — 30 bước
powershell -File ./_newtest.ps1          # terminal 3 — 11 bước (verify fix)
```
> Lưu ý: `_apitest.ps1` bước 29 đổi mật khẩu owner `Owner@123` → `Owner@456`.
> `_newtest.ps1` đăng nhập bằng `Owner@456`.

---
