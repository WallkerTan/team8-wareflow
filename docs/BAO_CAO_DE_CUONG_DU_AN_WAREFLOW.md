BÁO CÁO ĐỀ CƯƠNG DỰ ÁN SƠ BỘ — WAREFLOW PLATFORM
│
├── 0. THÔNG TIN CHUNG
│   ├── Học phần: Phát triển Dự án Phần mềm / Đồ án Chuyên ngành
│   ├── Lớp: HN-KS24-CNTT4
│   ├── Nhóm: Nhóm 08 (04 thành viên)
│   ├── GVHD: ThS. Bùi Thanh Hải
│   └── Hạn nộp: 23/10/2026
│
├── 1. LIÊN KẾT DỰ ÁN
│   ├── GitHub Repository
│   │   └── https://github.com/WallkerTan/team8-wareflow.git
│   ├── Jira / Trello Work Board
│   │   └── "WareFlow Project Board" (Agile Scrum, 4 Sprints)
│   └── Tài liệu đặc tả (SRS / Docs)
│       └── docs/project/ & docs/work/
│           ├── Sơ đồ ERD
│           ├── Tài liệu kiến trúc kỹ thuật
│           ├── Hướng dẫn Docker Compose
│           └── Checklist task
│
├── 2. NHÂN SỰ & VAI TRÒ
│   ├── 1. Phạm Nhật Tân (Leader)
│   │   ├── Vai trò: Frontend Lead & Admin Module
│   │   ├── Điều phối tiến độ, quản lý task, Code Review PR
│   │   ├── Kiến trúc Frontend (React + Vite + Tailwind), Routing, Middleware JWT Role
│   │   └── Phát triển Auth (Login) & toàn bộ phân hệ /admin
│   │       └── Users, Suppliers, Categories, Dashboard
│   ├── 2. Đoàn Trung Nguyên
│   │   ├── Vai trò: Backend Lead & DevOps Lead
│   │   ├── Kiến trúc Backend: Spring Boot 3 (Java 17), Spring Security + JWT, RESTful API
│   │   ├── Thiết kế ERD trên MySQL 8.0, chuẩn hóa quan hệ, đánh Index
│   │   ├── Logic nghiệp vụ: Auth, Admin, Xuất/Nhập kho
│   │   │   └── Pessimistic Locking & DB Transactions (chống âm kho / race condition)
│   │   └── DevOps: Dockerfile multi-stage, docker-compose.yml (MySQL + Backend + Frontend Nginx), kịch bản test API tự động
│   ├── 3. Phạm Ngọc Linh
│   │   ├── Vai trò: Frontend Engineer (Warehouse Operations Lead)
│   │   ├── Phụ trách toàn bộ giao diện & luồng /warehouse (vai trò WAREHOUSE_OWNER)
│   │   └── 5 phân hệ giao diện:
│   │       ├── Quản lý Danh mục hàng hóa & Cảnh báo tồn thấp
│   │       ├── Quản lý Phiếu Nhập kho
│   │       ├── Quản lý Phiếu Xuất kho & kiểm tra tồn khả dụng
│   │       ├── Quản lý Giao hàng (Shipment tracking)
│   │       └── Xem & Tra cứu lịch sử xuất nhập kho
│   └── 4. Vũ Thu Trang
│       ├── Vai trò: QA Lead, Scrum Master & Profile Module
│       ├── Scrum Master: Quản trị Trello/Jira, theo dõi sprint, Daily Standup, gỡ blockers
│       ├── Phát triển Profile Module (/warehouse/profile & /admin/profile)
│       │   ├── Xem thông tin tài khoản
│       │   ├── Cập nhật thông tin
│       │   └── Đổi mật khẩu (BCrypt)
│       └── QA/QC: Kịch bản test UI/UX, responsive, test tích hợp FE-BE, biên soạn SRS
│
├── 3. TỔNG QUAN ĐỀ TÀI
│   ├── 3.1. Tên đề tài
│   │   └── Hệ thống Quản lý Kho hàng Thông minh (WareFlow Platform)
│   ├── 3.2. Bối cảnh & Lý do chọn đề tài
│   │   ├── Vấn đề thực tế:
│   │   │   ├── Lệch tồn kho & âm kho (Race Condition)
│   │   │   ├── Thiếu cảnh báo chủ động (đứt gãy cung ứng)
│   │   │   └── Quy trình rời rạc, thiếu Shipment tracking & Audit logs
│   │   └── Giải pháp WareFlow:
│   │       ├── Số hóa toàn trình: nhập → lưu kho → xuất → giao vận
│   │       ├── Pessimistic Locking đảm bảo toàn vẹn dữ liệu tồn kho
│   │       └── Giao diện trực quan, phân quyền chặt Admin / Warehouse Owner
│   └── 3.3. Đối tượng sử dụng
│       ├── Admin (Quản trị viên hệ thống)
│       │   ├── Quản lý người dùng, cấp tài khoản thủ kho
│       │   ├── Quản lý danh mục hàng hóa
│       │   ├── Quản lý nhà cung cấp
│       │   └── Giám sát Dashboard tổng quan
│       └── Warehouse Owner (Chủ kho / Thủ kho)
│           ├── Quản lý mặt hàng, cảnh báo hàng sắp hết
│           ├── Lập & duyệt phiếu nhập kho
│           ├── Lập & kiểm tra tồn khả dụng khi xuất kho
│           ├── Kích hoạt đơn giao hàng, theo dõi timeline
│           └── Tra cứu lịch sử xuất nhập
│
├── 4. PHẠM VI & TÍNH NĂNG CHÍNH
│   ├── 4.1. Phân hệ Admin (/admin)
│   │   ├── Quản lý Tài khoản & Phân quyền
│   │   │   ├── Xem danh sách, tìm kiếm, lọc theo role & status
│   │   │   ├── Khóa/Mở khóa tài khoản
│   │   │   └── Tạo mới tài khoản thủ kho
│   │   ├── Quản lý Nhà cung cấp (Suppliers) — CRUD + tìm kiếm
│   │   ├── Quản lý Danh mục hàng hóa (Categories) — CRUD
│   │   └── Dashboard Thống kê Hệ thống
│   │       └── Tổng users, suppliers, categories, trạng thái hệ thống
│   ├── 4.2. Phân hệ Quản lý Kho (/warehouse)
│   │   ├── Quản lý Hàng hóa & Cảnh báo tồn thấp
│   │   │   ├── Xem danh mục, tìm theo SKU/tên, lọc theo danh mục
│   │   │   ├── Thêm/sửa sản phẩm, thiết lập min_stock
│   │   │   └── Low Stock Alert: đánh dấu khi tồn ≤ min_stock
│   │   ├── Quy trình Nhập kho (Receipts)
│   │   │   ├── Tạo phiếu DRAFT (NCC, sản phẩm, số lượng, giá nhập)
│   │   │   ├── Sửa/xóa khi còn DRAFT
│   │   │   ├── Confirm: cộng tồn kho với @Transactional
│   │   │   └── Hỗ trợ hủy phiếu (CANCELLED)
│   │   ├── Quy trình Xuất kho (Issues)
│   │   │   ├── Tạo phiếu DRAFT (người nhận, địa chỉ, danh sách hàng)
│   │   │   ├── Kiểm tra tồn khả dụng trước Confirm (từ chối nếu không đủ)
│   │   │   └── Confirm: trừ tồn bằng Pessimistic Locking
│   │   ├── Quản lý Giao vận (Shipments)
│   │   │   ├── Tạo đơn vận chuyển 1-1 với phiếu xuất CONFIRMED
│   │   │   ├── Cập nhật trạng thái: PENDING → SHIPPING → COMPLETED/CANCELLED
│   │   │   └── Hiển thị timeline log (shipment_logs)
│   │   └── Lịch sử biến động Kho (History)
│   │       ├── Tra cứu tập trung phiếu nhập & xuất
│   │       ├── Lọc đa tiêu chí: ngày, loại phiếu, trạng thái
│   │       └── Xem chi tiết hàng hóa & người thực hiện
│   └── 4.3. Phân hệ Chung, Xác thực & Hồ sơ cá nhân
│       ├── Xác thực bảo mật
│       │   ├── JWT, BCrypt, lưu phiên an toàn
│       │   ├── Refresh Token
│       │   └── Tự động điều hướng theo quyền
│       ├── Middleware phân quyền độc lập
│       │   ├── ADMIN ✗ truy cập /warehouse
│       │   └── WAREHOUSE_OWNER ✗ truy cập /admin
│       └── Hồ sơ cá nhân (/profile) — dùng chung
│           ├── GET /api/me — xem thông tin
│           ├── PUT /api/me — cập nhật họ tên, liên hệ
│           └── PATCH /api/me/password — đổi mật khẩu
│
├── 5. KIẾN TRÚC KỸ THUẬT & CÔNG NGHỆ
│   ├── Frontend Client
│   │   ├── React.js (Vite), TypeScript, Tailwind CSS
│   │   ├── Axios Interceptor (Header Token, xử lý lỗi tập trung)
│   │   └── Lucide Icons
│   ├── Backend API Service
│   │   ├── Java 17, Spring Boot 3, Spring Security 6
│   │   ├── RESTful API đa tầng (Controller - Service - Repository)
│   │   ├── JWT Filter (Stateless Auth)
│   │   └── Spring Validation
│   ├── Database Management
│   │   ├── MySQL 8.0
│   │   ├── Spring Data JPA / Hibernate
│   │   └── Index tối ưu truy vấn tìm kiếm hàng hóa, lịch sử kho
│   ├── Concurrency & Data Integrity
│   │   ├── Pessimistic Locking (SELECT ... FOR UPDATE)
│   │   ├── Spring @Transactional
│   │   └── Sắp xếp ID tăng dần khi khóa → triệt tiêu Deadlock
│   ├── DevOps & Containerization
│   │   ├── Docker, Docker Compose
│   │   ├── 3 container: MySQL + Backend (OpenJDK Gradle) + Frontend Nginx
│   │   ├── Nginx Reverse Proxy
│   │   └── Khởi chạy: docker compose up -d --build
│   └── CI/CD & Source Control
│       ├── GitHub Repository, GitHub Actions
│       ├── Git Flow phân nhánh
│       └── PowerShell Script test API (_apitest.ps1 & _newtest.ps1)
│
├── 6. KẾ HOẠCH TRIỂN KHAI (ROADMAP 4 SPRINTS)
│   ├── Sprint 1: Phân tích, Môi trường & Auth (19–21/10/2026)
│   │   ├── Thiết lập GitHub, Git Flow
│   │   ├── Dockerfile, docker-compose.yml, container MySQL 8.0
│   │   ├── Base Spring Boot + React Vite Tailwind
│   │   ├── Khởi tạo Trello Agile Scrum
│   │   └── Module Đăng nhập: FE, JWT API, BCrypt
│   │   └── PIC: Nguyên, Tân, Trang
│   ├── Sprint 2: Danh mục, Hàng hóa & Quản trị (20–22/10/2026)
│   │   ├── API + UI quản lý User (xem, lọc, khóa/mở)
│   │   ├── API + UI CRUD Suppliers
│   │   ├── API + UI CRUD Categories
│   │   └── API + UI danh mục sản phẩm kho, tìm kiếm, lọc, CRUD
│   │   └── PIC: Tân, Nguyên, Linh
│   ├── Sprint 3: Nghiệp vụ Kho & Vận đơn (21–23/10/2026)
│   │   ├── Nhập kho: DRAFT, sửa/xóa, Confirm cộng tồn
│   │   ├── Xuất kho: kiểm tra tồn khả dụng, Confirm trừ tồn (Pessimistic Locking)
│   │   ├── Shipment 1-1 với phiếu xuất, trạng thái, timeline log
│   │   └── Tra cứu lịch sử xuất nhập
│   │   └── PIC: Linh, Nguyên
│   └── Sprint 4: Profile, QA Test & Nghiệm thu (22–23/10/2026)
│       ├── Hồ sơ cá nhân (xem/sửa, đổi mật khẩu)
│       ├── Dashboard thống kê Admin
│       ├── Test tự động API (Pass 100% 41 test cases)
│       ├── Test responsive & phân quyền chéo
│       └── Đóng gói Docker & hoàn thiện tài liệu
│       └── PIC: Trang, Tân, Nguyên, Linh
│
└── 7. QUY ƯỚC LÀM VIỆC & QUẢN TRỊ DỰ ÁN
    ├── 7.1. Git Flow & Source Control
    │   ├── Nhánh main: Production-ready, chỉ merge qua PR được Leader duyệt
    │   ├── Nhánh develop: Tích hợp phát triển & kiểm thử
    │   ├── Nhánh tính năng: feat/<mã-task>-<mô-tả-ngắn>
    │   │   └── Ví dụ: feat/wareflow-102-login-ui, feat/wareflow-120-issue-concurrency
    │   ├── Commit Message: Conventional Commits
    │   │   ├── feat: — tính năng mới
    │   │   ├── fix: — sửa lỗi
    │   │   ├── docs: — tài liệu
    │   │   ├── refactor: — tái cấu trúc
    │   │   └── chore: — cấu hình build/docker/thư viện
    │   └── Pull Request & Code Review
    │       ├── PR trỏ về develop
    │       ├── Bắt buộc ≥ 1 reviewer approve
    │       └── Kiểm tra conflict & build thành công trước merge
    └── 7.2. Quản trị Tiến độ & Họp nhóm (Scrum/Agile)
        ├── Trello Kanban Board
        │   └── Luồng: Product Backlog → To Do → In Progress → Code Review → Testing/QA → Done
        │   └── Mỗi thẻ: Task ID, Story Point, PIC, Due Date
        ├── Daily Standup
        │   ├── 20:30 hàng ngày qua Google Meet (15 phút)
        │   └── 3 câu hỏi: Đã làm gì? / Sẽ làm gì? / Có blockers?
        └── Sprint Review & Retrospective
            └── Cuối mỗi Sprint: đánh giá bàn giao, rút kinh nghiệm, phân task Sprint tiếp




📊 PHÂN CÔNG CÔNG VIỆC DỰ ÁN WAREFLOW — NHÓM 08 (4 THÀNH VIÊN)
│
├── 1️⃣ PHẠM NHẬT TÂN (Leader) — Frontend Lead & Admin Module
│   │
│   ├── 1. REFACTOR FE TOÀN HỆ THỐNG (tái cấu trúc thành component nhỏ)
│   │   ├── 1.1. Chuẩn hóa cấu trúc thư mục
│   │   │   ├── components/common/  → Button, Input, Select, Modal, ConfirmDialog, Table, Pagination, Toast, Badge, Spinner
│   │   │   ├── components/layout/  → Sidebar, Header, Layout wrapper
│   │   │   ├── features/<module>/  → auth, admin (users/suppliers/categories/dashboard), warehouse (products/receipts/issues/shipments/history), profile
│   │   │   ├── hooks/              → useAuth, useForm, usePagination, useDebounce, useFetch
│   │   │   ├── services/           → axios instance + API calls từng phân hệ
│   │   │   └── types/              → interface TypeScript dùng chung
│   │   ├── 1.2. Tách component nhỏ (atomic) cho toàn bộ page
│   │   ├── 1.3. Tách logic khỏi UI: hooks + services + types
│   │   └── 1.4. Kiểm tra regression sau refactor (không đổi hành vi)
│   │
│   ├── 2. GỌI API VỀ FE — TOÀN BỘ PHÂN HỆ
│   │   ├── 2.1. Tầng services/axios
│   │   │   ├── Axios instance (baseURL, timeout)
│   │   │   ├── Interceptor gắn JWT Authorization
│   │   │   ├── Interceptor xử lý lỗi tập trung (401 → logout/refresh, 403, 500)
│   │   │   └── Chuẩn hóa response/error cho component
│   │   ├── 2.2. Tích hợp API theo phân hệ
│   │   │   ├── Auth: POST /api/auth/login, refresh token
│   │   │   ├── Admin: Users (list/lọc/tạo/khóa-mở), Suppliers (CRUD), Categories (CRUD), Dashboard (/api/admin/stats)
│   │   │   ├── Warehouse: Products, Receipts, Issues, Shipments, History
│   │   │   └── Profile: GET/PUT /api/me, PATCH /api/me/password
│   │   └── 2.3. Xử lý state & UX: loading/error/empty, optimistic update, validate form, map lỗi BE lên form
│   │
│   └── 3. TASK FE THEO SPRINT (14 task)
│       ├── Sprint 1: wareflow-102 [FE] Login UI + base axios/interceptor/layout/ProtectedRoute
│       ├── Sprint 2:
│       │   ├── wareflow-138 [FE] Danh sách tài khoản + lọc
│       │   ├── wareflow-139 [FE] Form thêm/sửa/khóa tài khoản
│       │   ├── wareflow-143 [FE] Form CRUD Nhà cung cấp
│       │   └── wareflow-147 [FE] Giao diện quản lý danh mục
│       └── Sprint 4: wareflow-149 [FE] Dashboard tổng quan
│
├── 2️⃣ ĐOÀN TRUNG NGUYÊN — Backend Lead & DevOps Lead
│   │
│   ├── 1. KIẾN TRÚC BACKEND & CSDL
│   │   ├── Spring Boot 3 (Java 17), Spring Security 6 + JWT, RESTful API đa tầng
│   │   ├── Thiết kế ERD trên MySQL 8.0, chuẩn hóa quan hệ, đánh Index tối ưu
│   │   └── Spring Validation kiểm tra dữ liệu đầu vào
│   │
│   ├── 2. LOGIC NGHIỆP VỤ CỐT LÕI
│   │   ├── Auth: users + BCrypt, JWT, phân quyền Role
│   │   ├── Admin: Users (API quản lý), Suppliers (CRUD), Categories (CRUD), Dashboard (/api/admin/stats)
│   │   ├── Warehouse:
│   │   │   ├── Products: categories, CRUD, tìm kiếm/phân trang
│   │   │   ├── Receipts: bảng receipts & receipt_items, DRAFT/Confirm cộng kho
│   │   │   ├── Issues: bảng issues & issue_items, kiểm tra tồn khả dụng, Confirm trừ kho
│   │   │   ├── Shipments: bảng shipments & shipment_logs, API trạng thái
│   │   │   └── History: API danh sách phiếu + lọc theo ngày/status
│   │   └── Profile: API /api/me (GET/PUT) & /api/me/password
│   │
│   ├── 3. CONCURRENCY & DATA INTEGRITY
│   │   ├── Pessimistic Locking (SELECT ... FOR UPDATE) khi Confirm nhập/xuất
│   │   ├── Spring @Transactional đảm bảo toàn vẹn
│   │   └── Sắp xếp ID tăng dần khi khóa → triệt tiêu Deadlock
│   │
│   ├── 4. DEVOPS & CI/CD
│   │   ├── GitHub repository & Git Flow
│   │   ├── Cấu hình Base Spring Boot/Gradle/Config
│   │   ├── Dockerfile Backend & Frontend (multi-stage)
│   │   ├── docker-compose.yml (MySQL + Backend + Frontend Nginx)
│   │   └── Kịch bản test API tự động (_apitest.ps1 & _newtest.ps1)
│   │
│   └── 5. TASK THEO SPRINT (30 task)
│       ├── Sprint 1: wareflow-151→156 (DevOps), wareflow-103→105 (BE Auth)
│       ├── Sprint 2: wareflow-108→113 (Products), wareflow-136→137, 141→142, 145→146 (Admin BE)
│       ├── Sprint 3: wareflow-116→117, 120→121, 120b, 124→125, 128→129 (Warehouse BE)
│       └── Sprint 4: wareflow-133, 134b, 150 (Profile & Dashboard BE)
│
├── 3️⃣ PHẠM NGỌC LINH — Frontend Engineer (Warehouse Operations Lead)
│   │
│   ├── 1. GIAO DIỆN PHÂN HỆ QUẢN LÝ KHO (/warehouse) — vai trò WAREHOUSE_OWNER
│   │   ├── 1.1. Quản lý Hàng hóa & Cảnh báo tồn thấp
│   │   │   ├── Danh sách sản phẩm + bộ lọc (wareflow-107)
│   │   │   └── Modal & Form thêm/sửa/xóa sản phẩm (wareflow-114)
│   │   ├── 1.2. Quản lý Nhập kho
│   │   │   └── Giao diện & Form tạo phiếu nhập (wareflow-118)
│   │   ├── 1.3. Quản lý Xuất kho
│   │   │   └── Form xuất kho & kiểm tra tồn khả dụng (wareflow-122)
│   │   ├── 1.4. Quản lý Giao hàng (Shipments)
│   │   │   └── Giao diện quản lý shipment & cập nhật trạng thái (wareflow-126)
│   │   └── 1.5. Lịch sử kho
│   │       └── Giao diện tra cứu lịch sử & Modal chi tiết (wareflow-131)
│   │
│   ├── 2. PHỐI HỢP KỸ THUẬT
│   │   ├── Sử dụng component/common, hooks, services do Tân chuẩn hóa
│   │   ├── Tích hợp API qua services (không gọi axios trực tiếp)
│   │   └── Xử lý form, validate đầu vào, trạng thái tương tác
│   │
│   └── 3. TASK THEO SPRINT (12 task)
│       ├── Sprint 2: wareflow-106, 107, 114 (Products FE)
│       ├── Sprint 3: wareflow-115, 118 (Nhập), 119, 122 (Xuất), 123, 126 (Shipment), 127, 131 (Lịch sử)
│       └── (Epic: 5 — Products, Receipts, Issues, Shipments, History)
│
└── 4️⃣ VŨ THU TRANG — QA Lead, Scrum Master & Profile Module
    │
    ├── 1. SCRUM MASTER & QUẢN TRỊ DỰ ÁN
    │   ├── Khởi tạo & quản trị bảng Trello/Jira Agile Scrum (wareflow-153)
    │   ├── Theo dõi tiến độ sprint, tổ chức Daily Standup
    │   └── Hỗ trợ tháo gỡ blockers
    │
    ├── 2. PHÁT TRIỂN PROFILE MODULE
    │   ├── Epic wareflow-132: Hồ sơ cá nhân
    │   ├── wareflow-134 [FE] Giao diện hồ sơ cá nhân & đổi mật khẩu
    │   └── Phạm vi: /warehouse/profile & /admin/profile (xem, cập nhật, đổi mật khẩu BCrypt)
    │
    ├── 3. QA/QC & TÀI LIỆU
    │   ├── Kịch bản kiểm thử giao diện (UI/UX), kiểm tra responsive
    │   ├── Kiểm thử luồng tích hợp FE–BE, phân quyền chéo Admin/Thủ kho
    │   └── Biên soạn tài liệu đặc tả SRS
    │
    └── 4. TASK THEO SPRINT (3 task)
        ├── Sprint 1: wareflow-153 [DevOps/PM] Trello Board
        ├── Sprint 4: wareflow-132 [Epic] Profile, wareflow-134 [FE] Profile UI
        └── (QA/QC xuyên suốt + SRS Docs)
