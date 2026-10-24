# 📋 BẢNG PHÂN CÔNG NHIỆM VỤ — PHẠM NHẬT TÂN

- **Họ và tên**: Phạm Nhật Tân (Leader)
- **Vai trò chính**: Project Leader & Frontend Lead (Admin & Auth Module)
- **Phạm vi trách nhiệm**: 
  - Điều phối tiến độ toàn bộ dự án, quản lý phân chia Sprint, phân công task và kiểm duyệt Pull Request (Code Review).
  - Khởi tạo kiến trúc Frontend (React + Vite + TypeScript / Tailwind CSS), cấu hình Routing và Middleware phân quyền theo JWT Role (`ADMIN` / `WAREHOUSE_OWNER`).
  - Trực tiếp phát triển giao diện & logic phân hệ Authentication (Đăng nhập) và toàn bộ phân hệ Quản trị hệ thống (`/admin`).

---

## 📌 CHI TIẾT CÁC TASK THEO SPRINT & JIRA/TRELLO

| Task ID | Phân hệ / Epic | Tên công việc (Task Name) | Loại task | Sprint | SP | Time (h) | Trạng thái |
|---|---|---|---|---|---|---|---|
| **wareflow-101** | Đăng ký & Đăng nhập | Quản lý xác thực Guest (Nhiệm vụ mẹ) | Epic | Sprint 1 | - | - | **Done** |
| **wareflow-102** | Đăng ký & Đăng nhập | [FE] Cắt giao diện & tích hợp Form đăng nhập | Task [FE] | Sprint 1 | 2 | 2.0 | **Done** |
| **wareflow-135** | Quản lý người dùng | Phân hệ quản trị User Admin (Nhiệm vụ mẹ) | Epic | Sprint 2 | - | - | **Done** |
| **wareflow-138** | Quản lý người dùng | [FE] Hiển thị và lọc danh sách tài khoản User | Task [FE] | Sprint 2 | 3 | 2.5 | **Done** |
| **wareflow-139** | Quản lý người dùng | [FE] Giao diện form thêm/sửa/khóa tài khoản | Task [FE] | Sprint 2 | 2 | 3.0 | **Done** |
| **wareflow-140** | Quản lý nhà cung cấp | Quản trị Nhà cung cấp (Nhiệm vụ mẹ) | Epic | Sprint 2 | - | - | **Done** |
| **wareflow-143** | Quản lý nhà cung cấp | [FE] Giao diện form CRUD Nhà cung cấp | Task [FE] | Sprint 2 | 2 | 2.5 | **Done** |
| **wareflow-144** | Quản lý danh mục | Quản trị Danh mục hàng hóa (Nhiệm vụ mẹ) | Epic | Sprint 2 | - | - | **Done** |
| **wareflow-147** | Quản lý danh mục | [FE] Giao diện quản lý Danh mục sản phẩm | Task [FE] | Sprint 2 | 2 | 3.5 | **Done** |
| **wareflow-148** | Dashboard | Bảng điều khiển thống kê Admin (Nhiệm vụ mẹ) | Epic | Sprint 4 | - | - | **Done** |
| **wareflow-149** | Dashboard | [FE] Giao diện Dashboard tổng quan hệ thống | Task [FE] | Sprint 4 | 2 | 2.5 | **Done** |

---

## 🛠️ CHI TIẾT NGHIỆP VỤ THỰC HIỆN

### 1. Kiến trúc Frontend & Phân quyền Routing
- Khởi tạo dự án Vite + React + Tailwind CSS.
- Cấu hình Axios Interceptors: Tự động đính kèm `Bearer <token>` vào header, xử lý refresh token và bắt lỗi 401/403.
- Xây dựng Private Route Middleware:
  - Role `ADMIN` được truy cập `/admin`, chặn không cho vào `/warehouse`.
  - Role `WAREHOUSE_OWNER` được truy cập `/warehouse`, chặn không cho vào `/admin`.

### 2. Giao diện Xác thực (Authentication)
- Trang `/login`:
  - Form đăng nhập đẹp mắt, hỗ trợ validation trường email/password.
  - Lưu Access Token vào bộ nhớ/cookie an toàn, giải mã payload JWT để điều hướng đúng trang theo role.

### 3. Phân hệ Admin — Page 1: `/admin`
- **Quản lý Users**:
  - Xem danh sách người dùng, tìm kiếm theo tên/email, lọc theo role (`ADMIN`, `WAREHOUSE_OWNER`) và status (`ACTIVE`, `LOCKED`).
  - Chức năng khóa/mở khóa tài khoản ngay trên bảng.
  - Form tạo tài khoản thủ kho mới (`POST /api/users`).
- **Quản lý Nhà cung cấp (Suppliers)**:
  - Bảng danh sách đối tác cung ứng hàng hóa.
  - Modal thêm mới / chỉnh sửa / xóa nhà cung cấp (`/api/suppliers`).
- **Quản lý Danh mục (Categories)**:
  - Quản lý cây phân loại sản phẩm kho.
  - Thao tác thêm/sửa/xóa danh mục (`/api/categories`).
- **Dashboard Tổng quan**:
  - Widget thống kê số lượng User, Tổng số Nhà cung cấp, Tổng số Danh mục và trạng thái hoạt động của hệ thống (`GET /api/admin/stats`).
