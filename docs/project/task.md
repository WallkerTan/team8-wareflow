📊 PHÂN CÔNG CÔNG VIỆC FE — DỰ ÁN WAREFLOW (NHÓM 08)
│
├── 0. BỐI CẢNH
│   ├── Vai trò: Frontend Engineer
│   ├── Nhiệm vụ cốt lõi:
│   │   ├── Tái cấu trúc FE thành các component nhỏ, tái sử dụng
│   │   └── Gọi API từ Backend về FE (tích hợp, xử lý state, lỗi)
│   └── Stack: React + Vite + TypeScript + Tailwind CSS + Axios
│
├── 1. TÁI CẤU TRÚC FE (REFACTOR → COMPONENT NHỎ)
│   ├── 1.1. Tách cấu trúc thư mục chuẩn
│   │   ├── src/components/common/      → Button, Input, Modal, Table, Pagination, Badge, Spinner
│   │   ├── src/components/layout/      → Sidebar, Header, Layout wrapper
│   │   ├── src/features/<module>/      → components + hooks + api riêng từng phân hệ
│   │   │   ├── auth/
│   │   │   ├── admin/ (users, suppliers, categories, dashboard)
│   │   │   ├── warehouse/ (products, receipts, issues, shipments, history)
│   │   │   └── profile/
│   │   ├── src/hooks/                  → custom hooks dùng chung
│   │   ├── src/services/               → axios instance + API calls
│   │   └── src/types/                  → định nghĩa TypeScript interface
│   ├── 1.2. Tách component nhỏ (atomic)
│   │   ├── Common UI: Button, Input, Select, Modal, ConfirmDialog, Table, Pagination, Toast
│   │   ├── Form components: FormField, FormWrapper, validate helper
│   │   ├── Layout: Sidebar, Header, ProtectedRoute, RoleGuard
│   │   └── Feature components: tách từ page lớn thành list + form + detail
│   ├── 1.3. Tách logic khỏi UI
│   │   ├── Custom hooks: useAuth, usePagination, useDebounce, useFetch, useForm
│   │   ├── Tách API call ra services/ (không gọi axios trực tiếp trong component)
│   │   └── Tách type/interface ra src/types/
│   └── 1.4. Chuẩn hóa & kiểm tra sau refactor
│       ├── Đảm bảo không đổi hành vi (regression test)
│       ├── Xóa code trùng lặp, giảm file page quá dài
│       └── Review lại cấu trúc import, đặt tên nhất quán
│
├── 2. GỌI API VỀ FE (TÍCH HỢP)
│   ├── 2.1. Tầng services / axios
│   │   ├── Cấu hình axios instance (baseURL, timeout)
│   │   ├── Axios Interceptor: gắn JWT vào Header Authorization
│   │   ├── Interceptor xử lý lỗi tập trung (401 → logout/refresh, 403, 500)
│   │   └── Chuẩn hóa response/error trả về cho component
│   ├── 2.2. Tích hợp API theo phân hệ
│   │   ├── Auth: POST /api/auth/login, refresh token
│   │   ├── Admin:
│   │   │   ├── Users: GET/POST/PUT khóa-mở tài khoản
│   │   │   ├── Suppliers: CRUD + tìm kiếm
│   │   │   ├── Categories: CRUD
│   │   │   └── Dashboard: GET /api/admin/stats
│   │   ├── Warehouse:
│   │   │   ├── Products: list/filter/search + CRUD
│   │   │   ├── Receipts: tạo DRAFT, sửa/xóa, Confirm (cộng kho)
│   │   │   ├── Issues: tạo DRAFT, kiểm tra tồn khả dụng, Confirm (trừ kho)
│   │   │   ├── Shipments: tạo, cập nhật trạng thái, timeline log
│   │   │   └── History: list + lọc theo ngày/loại/trạng thái
│   │   └── Profile: GET/PUT /api/me, PATCH /api/me/password
│   ├── 2.3. Xử lý state & UX khi gọi API
│   │   ├── Loading state (spinner/skeleton)
│   │   ├── Error state (toast/message, retry)
│   │   ├── Empty state (không có dữ liệu)
│   │   ├── Optimistic update / refetch sau mutation
│   │   └── Validate form trước khi gửi (Spring Validation phía BE trả lỗi → map lên form)
│   └── 2.4. Kiểm thử tích hợp FE–BE
│       ├── Test luồng đăng nhập + phân quyền (ADMIN vs WAREHOUSE_OWNER)
│       ├── Test luồng Confirm nhập/xuất kho (kiểm tra tồn)
│       └── Test responsive + xử lý lỗi API
│
└── 3. MAPPING CÔNG VIỆC FE THEO SPRINT (gắn Task ID)
    ├── Sprint 1 — Auth + nền tảng
    │   ├── wareflow-102 [FE] Cắt giao diện & Form đăng nhập
    │   └── Tái cấu trúc base: axios instance, interceptor JWT, layout, ProtectedRoute/RoleGuard
    ├── Sprint 2 — Admin + Sản phẩm
    │   ├── wareflow-107 [FE] Danh sách hàng hóa & bộ lọc
    │   ├── wareflow-114 [FE] Modal & Form thêm/sửa/xóa sản phẩm
    │   ├── wareflow-138 [FE] Hiển thị & lọc danh sách tài khoản
    │   ├── wareflow-139 [FE] Form thêm/sửa/khóa tài khoản
    │   ├── wareflow-143 [FE] Form CRUD Nhà cung cấp
    │   └── wareflow-147 [FE] Giao diện quản lý danh mục sản phẩm
    ├── Sprint 3 — Nghiệp vụ kho
    │   ├── wareflow-118 [FE] Giao diện & Form tạo phiếu nhập
    │   ├── wareflow-122 [FE] Form xuất kho & kiểm tra tồn
    │   ├── wareflow-126 [FE] Quản lý shipment & cập nhật trạng thái
    │   └── wareflow-131 [FE] Tra cứu lịch sử & Modal chi tiết
    └── Sprint 4 — Profile + Dashboard
        ├── wareflow-134 [FE] Hồ sơ cá nhân & đổi mật khẩu
        └── wareflow-149 [FE] Giao diện Dashboard tổng quan