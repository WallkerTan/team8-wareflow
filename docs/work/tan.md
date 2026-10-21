
## 🛠️ ADMIN — Page 1: `/admin` (Quản trị hệ thống) → Tân

### 📌 Nhóm 1: Quản lý Users
- **A1** — Xem danh sách người dùng
  - List + filter theo role/status
  - DB: `users` — API: `GET /api/users`
- **A2** — Khóa / mở khóa tài khoản
  - Đổi status ACTIVE ↔ LOCKED
  - DB: `users` — API: `PATCH /api/users/{id}/status`
- **A3** — Tạo tài khoản mới
  - Tạo user role WAREHOUSE_OWNER
  - DB: `users` — API: `POST /api/users`
- **A4** — Sửa thông tin user
  - full_name, email, role
  - DB: `users` — API: `PUT /api/users/{id}`

### 📌 Nhóm 2: Quản lý Nhà cung cấp
- **A5** — CRUD nhà cung cấp
  - Thêm / sửa / xóa NCC
  - DB: `suppliers` — API: `GET/POST/PUT/DELETE /api/suppliers`

### 📌 Nhóm 3: Quản lý Danh mục
- **A6** — CRUD danh mục hàng hóa
  - Thêm / sửa / xóa category
  - DB: `categories` — API: `GET/POST/PUT/DELETE /api/categories`

### 📌 Nhóm 4: Dashboard (optional)
- **A7** — Dashboard tổng quan
  - Đếm user, NCC, danh mục
  - DB: `users`, `suppliers`, `categories` — API: `GET /api/admin/stats`

---

## 👤 ADMIN — Page 2: `/admin/profile` (Hồ sơ cá nhân) → Tân

- **A8** — Xem thông tin cá nhân
  - full_name, email, role, status
  - DB: `users` — API: `GET /api/me`
- **A9** — Cập nhật hồ sơ
  - Sửa full_name, email
  - DB: `users` — API: `PUT /api/me`
- **A10** — Đổi mật khẩu
  - Nhập mật khẩu cũ → mới (BCrypt)
  - DB: `users` — API: `PATCH /api/me/password`
