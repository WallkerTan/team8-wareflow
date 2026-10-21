

## 📦 OWNER — Page 1: `/warehouse` (Quản lí kho) → Linh

> Page này chia **5 tab nội bộ**

### 📑 Tab 1: Hàng hóa
- **W1** — Xem danh sách sản phẩm
  - List + search + filter category
  - DB: `products`, `categories` — API: `GET /api/products`
- **W2** — Thêm / sửa / xóa sản phẩm
  - CRUD, gán category
  - DB: `products` — API: `POST/PUT/DELETE /api/products`
- **W3** — Cảnh báo tồn thấp
  - Filter `stock_quantity ≤ min_stock`
  - DB: `products` — API: `GET /api/products?lowStock=true`

### 📑 Tab 2: Nhập kho
- **W4** — Tạo phiếu nhập DRAFT
  - Chọn NCC, thêm items
  - DB: `receipts`, `receipt_items` — API: `POST /api/receipts`
- **W5** — Sửa / xóa phiếu DRAFT
  - Chỉ khi status = DRAFT
  - DB: `receipts`, `receipt_items` — API: `PUT/DELETE /api/receipts/{id}`
- **W6** — Xác nhận phiếu nhập ⚠️
  - DRAFT → CONFIRMED, **cộng stock** (transaction)
  - DB: `receipts`, `products` — API: `POST /api/receipts/{id}/confirm`
- **W7** — Hủy phiếu
  - DRAFT → CANCELLED
  - DB: `receipts` — API: `POST /api/receipts/{id}/cancel`

### 📑 Tab 3: Xuất kho
- **W8** — Tạo phiếu xuất DRAFT
  - Nhập người nhận, địa chỉ, thêm items
  - DB: `issues`, `issue_items` — API: `POST /api/issues`
- **W9** — Kiểm tra tồn trước xác nhận ⚠️
  - Validate `quantity ≤ stock_quantity`
  - DB: `products`, `issue_items` — (logic trong confirm)
- **W10** — Xác nhận phiếu xuất ⚠️
  - DRAFT → CONFIRMED, **trừ stock** (transaction)
  - DB: `issues`, `products` — API: `POST /api/issues/{id}/confirm`
- **W11** — Hủy phiếu xuất
  - DRAFT → CANCELLED
  - DB: `issues` — API: `POST /api/issues/{id}/cancel`

### 📑 Tab 4: Giao hàng
- **W12** — Tạo shipment từ phiếu xuất CONFIRMED
  - 1-1 với issue
  - DB: `shipments` — API: `POST /api/shipments`
- **W13** — Cập nhật trạng thái giao
  - PENDING → SHIPPING → COMPLETED/CANCELLED, ghi log
  - DB: `shipments`, `shipment_logs` — API: `PATCH /api/shipments/{id}/status`
- **W14** — Xem lịch sử trạng thái
  - Timeline logs của shipment
  - DB: `shipment_logs` — API: `GET /api/shipments/{id}/logs`

### 📑 Tab 5: Lịch sử
- **W15** — Xem phiếu nhập/xuất
  - List + filter theo ngày/status
  - DB: `receipts`, `issues` — API: `GET /api/receipts`, `GET /api/issues`
- **W16** — Xem chi tiết phiếu
  - Items + trạng thái
  - DB: `receipt_items`, `issue_items` — API: `GET /api/receipts/{id}`, `GET /api/issues/{id}`
