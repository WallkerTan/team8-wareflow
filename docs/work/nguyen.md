
## ⚙️ BACKEND — be-nguyên

> Phụ trách toàn bộ API + business logic + transaction

### 🔐 Auth Service
- [ ] Login (JWT) + phân quyền role
- [ ] Middleware check role: ADMIN ❌ `/warehouse`, OWNER ❌ `/admin`
- [ ] `GET /api/me` — thông tin cá nhân
- [ ] `PUT /api/me` — cập nhật hồ sơ
- [ ] `PATCH /api/me/password` — đổi mật khẩu (BCrypt)

### 🛠️ Admin APIs
- [ ] `GET /api/users` — list + filter
- [ ] `POST /api/users` — tạo user
- [ ] `PUT /api/users/{id}` — sửa user
- [ ] `PATCH /api/users/{id}/status` — khóa/mở khóa
- [ ] CRUD `/api/suppliers`
- [ ] CRUD `/api/categories`
- [ ] `GET /api/admin/stats` (optional)

### 📦 Inventory Service
- [ ] CRUD `/api/products` + filter `lowStock`
- [ ] `POST /api/receipts` — tạo phiếu nhập DRAFT
- [ ] `PUT/DELETE /api/receipts/{id}` — sửa/xóa DRAFT
- [ ] `POST /api/receipts/{id}/confirm` — **transaction cộng stock** ⚠️
- [ ] `POST /api/receipts/{id}/cancel`
- [ ] `POST /api/issues` — tạo phiếu xuất DRAFT
- [ ] `PUT/DELETE /api/issues/{id}` — sửa/xóa DRAFT
- [ ] `POST /api/issues/{id}/confirm` — **transaction trừ stock** + validate `quantity ≤ stock_quantity` ⚠️
- [ ] `POST /api/issues/{id}/cancel`
- [ ] `GET /api/receipts`, `GET /api/receipts/{id}`
- [ ] `GET /api/issues`, `GET /api/issues/{id}`

### 🚚 Shipment Service
- [ ] `POST /api/shipments` — tạo từ issue CONFIRMED (1-1)
- [ ] `PATCH /api/shipments/{id}/status` — cập nhật + ghi log
- [ ] `GET /api/shipments/{id}/logs` — timeline

---

## ⚠️ GHI CHÚ QUAN TRỌNG

### Transaction bắt buộc
- **W6** (cộng tồn) & **W10** (trừ tồn) → chạy trong 1 transaction của `inventory-service`
- Mục đích: tránh lệch kho khi có lỗi giữa chừng

### Validate trước confirm
- **W9**: check `quantity ≤ stock_quantity` → reject nếu vượt

### Không FK chéo schema
- `created_by`, `changed_by`, `issue_id` → chỉ lưu ID, validate ở code

### Status flow
- **Receipt / Issue**: `DRAFT → CONFIRMED` hoặc `DRAFT → CANCELLED`
- **Shipment**: `PENDING → SHIPPING → COMPLETED / CANCELLED`

### Cảnh báo tồn
- Query: `WHERE stock_quantity <= min_stock`

---