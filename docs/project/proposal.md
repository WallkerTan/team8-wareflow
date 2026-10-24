# BÁO CÁO ĐỀ CƯƠNG DỰ ÁN SƠ BỘ
## PROJECT PROPOSAL & WORKFLOW INITIALIZATION

- **Học phần**: Phát triển Dự án Phần mềm / Đồ án Chuyên ngành
- **Lớp học phần**: HN-KS24-CNTT4
- **Nhóm thực hiện**: Nhóm 08 (Quy mô: 04 thành viên)
- **Giảng viên hướng dẫn**: ThS. Giảng viên Bùi Thanh Hải
- **Hạn nộp & Ngày nộp**: 23/10/2026

---

## 1. THÔNG TIN CHUNG & TỔNG HỢP LIÊN KẾT DỰ ÁN

| Hạng mục bàn giao | Đường dẫn liên kết (URL) / Ghi chú |
|---|---|
| **GitHub Repository** | [https://github.com/WallkerTan/team8-wareflow.git](https://github.com/WallkerTan/team8-wareflow.git)<br>*(Đã cấu hình quyền Cộng tác viên cho Giảng viên hướng dẫn và các thành viên)* |
| **Jira / Trello Work Board** | Bảng quản trị Agile Scrum: `WareFlow Project Board`<br>*(Phân chia cột chuẩn: Backlog ➔ To Do ➔ In Progress ➔ Review/QA ➔ Done; phân bổ theo 4 Sprints)* |
| **Tài liệu đặc tả (SRS / Docs)** | Thư mục mã nguồn `docs/project/` & `docs/work/`<br>*(Bao gồm sơ đồ ERD, tài liệu kiến trúc kỹ thuật, hướng dẫn Docker Compose và checklist task)* |

---

## 2. PHÂN CHIA NHÂN SỰ & VAI TRÒ TRÁCH NHIỆM

Nhóm 08 gồm **04 thành viên**, phân định rõ ràng vai trò và trách nhiệm kỹ thuật theo thế mạnh:

| STT | Họ và Tên | Vai trò chính | Phạm vi trách nhiệm chi tiết |
|:---:|---|---|---|
| **1** | **Phạm Nhật Tân** *(Leader)* | **Frontend Lead & Admin Module** | • Điều phối tiến độ tổng thể, quản lý phân công task và kiểm duyệt Pull Request (Code Review).<br>• Thiết lập kiến trúc Frontend (React + Vite + Tailwind CSS), cấu hình Routing và Middleware phân quyền theo JWT Role (`ADMIN` / `WAREHOUSE_OWNER`).<br>• Trực tiếp phát triển giao diện & logic phân hệ Xác thực (Login) và toàn bộ phân hệ Quản trị hệ thống (`/admin`: Users, Suppliers, Categories, Dashboard). |
| **2** | **Đoàn Trung Nguyên** | **Backend Lead & DevOps Lead** | • Thiết kế kiến trúc tổng thể Backend với Spring Boot 3 (Java 17), Spring Security + JWT, RESTful API.<br>• Thiết kế sơ đồ quan hệ CSDL (ERD) trên MySQL 8.0, chuẩn hóa quan hệ và đánh chỉ mục Index tối ưu truy vấn.<br>• Triển khai logic nghiệp vụ cốt lõi: Auth, Admin, Nghiệp vụ Xuất/Nhập kho với cơ chế Pessimistic Locking & Database Transactions chống âm kho / race condition.<br>• Đóng gói toàn bộ hệ thống bằng Docker, viết Dockerfile đa tầng (multi-stage build), cấu hình `docker-compose.yml` (MySQL + Backend + Frontend Nginx) và kịch bản test API tự động. |
| **3** | **Phạm Ngọc Linh** | **Frontend Engineer (Warehouse Operations Lead)** | • Chịu trách nhiệm toàn bộ giao diện và luồng tương tác người dùng của phân hệ Quản lý Kho (`/warehouse`) dành cho vai trò `WAREHOUSE_OWNER`.<br>• Phát triển 5 phân hệ giao diện: Quản lý Danh mục hàng hóa & Cảnh báo tồn thấp, Quản lý Phiếu Nhập kho, Quản lý Phiếu Xuất kho & kiểm tra tồn khả dụng, Quản lý Giao hàng (Shipment tracking), Xem & Tra cứu lịch sử xuất nhập kho.<br>• Tích hợp API Backend, xử lý form, validate dữ liệu đầu vào và trạng thái tương tác. |
| **4** | **Vũ Thu Trang** | **QA Lead, Scrum Master & Profile Module** | • Đóng vai trò Scrum Master: Khởi tạo và quản trị bảng Trello/Jira theo chuẩn Agile/Scrum, theo dõi tiến độ sprint, tổ chức Daily Standup và hỗ trợ tháo gỡ vướng mắc phát sinh (blockers).<br>• Phụ trách phát triển phân hệ Hồ sơ cá nhân (`Profile Module`: `/warehouse/profile` & `/admin/profile`): Xem thông tin tài khoản, Cập nhật thông tin, Đổi mật khẩu mã hóa BCrypt.<br>• Quản trị chất lượng (QA/QC): Thiết kế kịch bản kiểm thử giao diện (UI/UX), kiểm tra responsive, kiểm thử luồng tích hợp FE-BE và biên soạn tài liệu đặc tả SRS. |

---

## 3. TỔNG QUAN ĐỀ TÀI DỰ ÁN

### 3.1. Tên đề tài
**Hệ thống Quản lý Kho hàng Thông minh (WareFlow Platform)**

### 3.2. Bối cảnh & Lý do chọn đề tài
Trong chuỗi cung ứng hiện đại, việc quản trị kho bãi thủ công (qua sổ sách, Excel rời rạc hoặc tin nhắn) thường xuyên dẫn đến các sai sót nghiêm trọng:
- **Lệch tồn kho và âm kho (Race Condition)**: Khi có nhiều giao dịch xuất nhập phát sinh đồng thời mà không có cơ chế khoá bản ghi dữ liệu tức thời.
- **Thiếu cảnh báo chủ động**: Khó theo dõi các mặt hàng chạm ngưỡng tồn tối thiểu để bổ sung kịp thời, dẫn tới đứt gãy cung ứng.
- **Quy trình rời rạc**: Xuất hàng nhưng không theo dõi được đơn vận chuyển (Shipment) và thiếu nhật ký lịch sử truy vết (Audit logs) khi xảy ra thất thoát.

Dự án **WareFlow Platform** được Nhóm 08 xây dựng nhằm cung cấp giải pháp chuyển đổi số toàn diện cho doanh nghiệp và các chủ cơ sở kho bãi:
1. Số hóa toàn trình quy trình từ nhập hàng, lưu kho, xuất hàng cho tới giao vận.
2. Ứng dụng công nghệ xử lý giao dịch đồng thời và khoá bi quan (Pessimistic Locking) trong cơ sở dữ liệu để đảm bảo **tính toàn vẹn tuyệt đối** của dữ liệu tồn kho.
3. Cung cấp giao diện trực quan, tách biệt phân quyền chặt chẽ giữa Quản trị viên (Admin) và Thủ kho (Warehouse Owner).

### 3.3. Đối tượng sử dụng hệ thống
- **Quản trị viên hệ thống (Admin)**: Quản lý người dùng và cấp phát tài khoản thủ kho; quản lý danh mục phân loại hàng hóa; quản lý mạng lưới nhà cung cấp; giám sát các chỉ số thống kê vận hành trên Dashboard tổng quan.
- **Chủ kho / Thủ kho (Warehouse Owner)**: Quản lý trực tiếp danh sách mặt hàng, theo dõi cảnh báo hàng sắp hết; lập và duyệt phiếu nhập kho; lập và kiểm tra tồn khả dụng khi xuất kho; kích hoạt đơn giao hàng và theo dõi timeline giao vận; tra cứu lịch sử xuất nhập toàn hệ thống.

---

## 4. PHẠM VI & TÍNH NĂNG CHÍNH (FEATURE SCOPE)

### 4.1. Phân hệ Quản trị viên (Admin Module - `/admin`)
- **Quản lý Tài khoản & Phân quyền**: Xem danh sách nhân sự, tìm kiếm, lọc theo vai trò (`ADMIN`, `WAREHOUSE_OWNER`) và trạng thái (`ACTIVE`, `LOCKED`); thực hiện khóa/mở khóa tài khoản hoặc tạo mới tài khoản thủ kho.
- **Quản lý Nhà cung cấp (Suppliers)**: CRUD (Thêm, sửa, xóa, tìm kiếm) thông tin đối tác cung ứng vật tư, hàng hóa.
- **Quản lý Danh mục hàng hóa (Categories)**: CRUD hệ thống danh mục phân loại sản phẩm, chuẩn hóa phân nhóm kho bãi.
- **Dashboard Thống kê Hệ thống**: Bảng số liệu tổng hợp (Tổng số người dùng, tổng số nhà cung cấp, tổng danh mục hàng hóa, trạng thái hệ thống).

### 4.2. Phân hệ Quản lý Kho (Warehouse Operations Module - `/warehouse`)
- **Quản lý Hàng hóa & Cảnh báo tồn thấp**: 
  - Xem danh mục sản phẩm, tìm kiếm theo SKU / tên sản phẩm, lọc theo danh mục.
  - Thêm mới, chỉnh sửa thông tin sản phẩm và thiết lập ngưỡng tồn an toàn (`min_stock`).
  - **Hệ thống cảnh báo tồn thấp (Low Stock Alert)**: Tự động đánh dấu trực quan các mặt hàng có tồn kho $\le$ ngưỡng tối thiểu để thủ kho kịp thời nhập bổ sung.
- **Quy trình Nhập kho (Receipts)**:
  - Tạo phiếu nhập trạng thái `DRAFT` (chọn Nhà cung cấp, chọn sản phẩm, số lượng và giá nhập).
  - Cho phép sửa/xóa phiếu khi còn ở trạng thái nháp.
  - **Xác nhận phiếu nhập (Confirm)**: Kích hoạt giao dịch cộng dồn vào tồn kho (`stock_quantity`) với `@Transactional` an toàn.
  - Hỗ trợ hủy phiếu (`CANCELLED`).
- **Quy trình Xuất kho (Issues)**:
  - Tạo phiếu xuất trạng thái `DRAFT` (thông tin người nhận, địa chỉ giao nhận, danh sách hàng xuất).
  - **Kiểm tra tồn khả dụng trước khi xác nhận**: Xác thực nghiêm ngặt điều kiện số lượng xuất $\le$ số lượng tồn hiện có; từ chối và báo lỗi nếu không đủ hàng.
  - **Xác nhận phiếu xuất (Confirm)**: Kích hoạt trừ tồn kho bằng cơ chế khoá dòng dữ liệu (Pessimistic Locking).
- **Quản lý Giao vận (Shipments)**:
  - Khởi tạo đơn vận chuyển tự động gắn kết quan hệ 1-1 với phiếu xuất kho đã `CONFIRMED`.
  - Cập nhật dòng trạng thái vận đơn: `PENDING` ➔ `SHIPPING` ➔ `COMPLETED` / `CANCELLED`.
  - Ghi nhận và hiển thị lịch sử timeline chi tiết của đơn vận chuyển (`shipment_logs`).
- **Lịch sử biến động Kho (History)**:
  - Tra cứu tập trung toàn bộ danh sách phiếu nhập và phiếu xuất.
  - Bộ lọc đa tiêu chí: Lọc theo khoảng ngày phát sinh, lọc theo loại phiếu, lọc theo trạng thái duyệt.
  - Xem chi tiết danh sách hàng hóa và người thực hiện tương ứng.

### 4.3. Phân hệ Chung, Xác thực & Hồ sơ cá nhân (Auth & Profile)
- **Xác thực bảo mật**: Đăng nhập hệ thống sử dụng chuẩn JWT (JSON Web Token), mã hóa mật khẩu một chiều BCrypt, lưu trữ phiên an toàn, cơ chế Refresh Token và tự động điều hướng theo quyền.
- **Middleware phân quyền độc lập**:
  - `ADMIN` không được can thiệp vào trang `/warehouse`.
  - `WAREHOUSE_OWNER` không được truy cập vào trang quản trị `/admin`.
- **Hồ sơ cá nhân (`/profile`)**: Áp dụng chung cho cả Admin và Thủ kho:
  - Xem thông tin tài khoản hiện tại (`GET /api/me`).
  - Cập nhật họ tên và thông tin liên hệ cá nhân (`PUT /api/me`).
  - Đổi mật khẩu an toàn (`PATCH /api/me/password`).

---

## 5. KIẾN TRÚC KỸ THUẬT & CÔNG NGHỆ ÁP DỤNG

| Tầng kiến trúc (Layer) | Công nghệ & Thư viện lựa chọn | Vai trò & Giải pháp triển khai |
|---|---|---|
| **Frontend Client** | **React.js (Vite), TypeScript, Tailwind CSS** | • Giao diện Single Page Application (SPA) tốc độ cao, responsive đa thiết bị.<br>• Axios Interceptor quản lý Header Token và xử lý lỗi tập trung.<br>• Lucide Icons & Tailwind CSS xây dựng hệ thống UI hiện đại, chuẩn thẩm mỹ. |
| **Backend API Service** | **Java 17, Spring Boot 3, Spring Security 6** | • Kiến trúc RESTful API đa tầng (Controller - Service - Repository).<br>• Spring Security 6 kết hợp JWT Filter xác thực phi trạng thái (Stateless Auth).<br>• Spring Validation kiểm tra tính hợp lệ của dữ liệu đầu vào. |
| **Database Management** | **MySQL 8.0, Spring Data JPA / Hibernate** | • Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ, lưu trữ toàn bộ thực thể.<br>• Đánh chỉ mục Index tối ưu các truy vấn tìm kiếm hàng hóa, lịch sử kho. |
| **Concurrency & Data Integrity** | **Database Pessimistic Locking & Spring `@Transactional`** | • Ứng dụng `SELECT ... FOR UPDATE` khi xác nhận phiếu nhập/xuất để chống race condition và chống âm kho.<br>• Sắp xếp ID sản phẩm tăng dần khi thực hiện khóa nhằm triệt tiêu nguy cơ Deadlock. |
| **DevOps & Containerization** | **Docker, Docker Compose, Nginx Reverse Proxy** | • Đóng gói 3 container độc lập: MySQL Database, Backend Spring Boot (OpenJDK Gradle), Frontend Nginx Multi-stage build.<br>• Khởi chạy toàn bộ hệ thống chỉ với một lệnh duy nhất: `docker compose up -d --build`. |
| **CI/CD & Source Control** | **GitHub Repository, GitHub Actions** | • Quản lý mã nguồn theo mô hình Git Flow phân nhánh nghiêm ngặt.<br>• Kịch bản kiểm thử API tự động qua PowerShell Script (`_apitest.ps1` & `_newtest.ps1`). |

---

## 6. KẾ HOẠCH TRIỂN KHAI THEO SPRINT (ROADMAP)

| Giai đoạn Sprint | Thời gian | Mục tiêu & Deliverables chính | Người phụ trách chính |
|---|---|---|---|
| **Sprint 1:<br>Phân tích, Môi trường & Auth** | 19/10/2026 – 21/10/2026 | • Thiết lập GitHub repository, cấu hình nhánh Git Flow.<br>• Viết Dockerfile, `docker-compose.yml`, tạo container MySQL 8.0.<br>• Dựng base Spring Boot + Base React Vite Tailwind CSS.<br>• Khởi tạo bảng Trello Agile Scrum.<br>• Hoàn thiện module Đăng nhập: Cắt giao diện FE, API xác thực JWT, mã hóa BCrypt. | **Đoàn Trung Nguyên**<br>**Phạm Nhật Tân**<br>**Vũ Thu Trang** |
| **Sprint 2:<br>Danh mục, Hàng hóa & Quản trị** | 20/10/2026 – 22/10/2026 | • Xây dựng API và giao diện quản lý User (xem, lọc, khóa/mở tài khoản).<br>• Xây dựng API và giao diện CRUD Nhà cung cấp (Suppliers).<br>• Xây dựng API và giao diện CRUD Danh mục hàng hóa (Categories).<br>• Phát triển API và giao diện hiển thị danh mục sản phẩm kho, tìm kiếm, lọc và CRUD sản phẩm. | **Phạm Nhật Tân**<br>**Đoàn Trung Nguyên**<br>**Phạm Ngọc Linh** |
| **Sprint 3:<br>Nghiệp vụ Kho & Vận đơn** | 21/10/2026 – 23/10/2026 | • Thiết kế cơ chế Quản lý Nhập kho: Tạo DRAFT, sửa/xóa, Confirm cộng tồn kho.<br>• Thiết kế cơ chế Quản lý Xuất kho: Kiểm tra số lượng tồn khả dụng, Confirm trừ tồn với khóa bi quan chống race condition.<br>• Xây dựng module Giao hàng (Shipment) liên kết 1-1 với phiếu xuất, cập nhật trạng thái vận đơn và xem timeline log.<br>• Tra cứu và hiển thị chi tiết lịch sử xuất nhập kho. | **Phạm Ngọc Linh**<br>**Đoàn Trung Nguyên** |
| **Sprint 4:<br>Profile, QA Test & Nghiệm thu** | 22/10/2026 – 23/10/2026 | • Hoàn thiện phân hệ Hồ sơ cá nhân (xem/sửa profile, đổi mật khẩu).<br>• Xây dựng Dashboard thống kê số liệu tổng quan hệ thống Admin.<br>• Chạy toàn bộ kịch bản kiểm thử tự động API (Pass 100% 41 test cases).<br>• Kiểm thử giao diện Responsive, kiểm thử phân quyền chéo giữa Admin và Thủ kho.<br>• Đóng gói Docker hoàn chỉnh và hoàn thiện bộ tài liệu đề cương báo cáo. | **Vũ Thu Trang**<br>**Phạm Nhật Tân**<br>**Đoàn Trung Nguyên**<br>**Phạm Ngọc Linh** |

---

## 7. QUY ƯỚC LÀM VIỆC & QUẢN TRỊ DỰ ÁN

### 7.1. Quy ước Git Flow & Source Control
- **Phân nhánh tiêu chuẩn**:
  - Nhánh `main`: Mã nguồn phiên bản ổn định (Production-ready), chỉ cập nhật qua Pull Request được Leader nghiệm thu.
  - Nhánh `develop`: Mã nguồn tích hợp dùng cho giai đoạn phát triển và kiểm thử.
  - Nhánh tính năng: Đặt tên theo chuẩn `feat/<mã-task>-<mô-tả-ngắn>` (Ví dụ: `feat/wareflow-102-login-ui`, `feat/wareflow-120-issue-concurrency`).
- **Quy chuẩn Commit Message**: Áp dụng triệt để **Conventional Commits**:
  - `feat:` Khi phát triển tính năng mới.
  - `fix:` Khi sửa lỗi phát sinh.
  - `docs:` Khi bổ sung, cập nhật tài liệu dự án.
  - `refactor:` Khi tái cấu trúc mã nguồn nhưng không đổi logic nghiệp vụ.
  - `chore:` Khi cấu hình build tool, docker, thư viện.
- **Quy trình Pull Request & Code Review**:
  - Mọi nhánh tính năng khi hoàn thành đều phải tạo Pull Request (PR) trỏ về `develop`.
  - Bắt buộc có ít nhất **01 thành viên khác (Leader hoặc Backend/Frontend Lead)** review và chấp thuận (Approve) mới được merge.
  - Kiểm tra xung đột (conflict) và đảm bảo build thành công trên môi trường cục bộ trước khi merge.

### 7.2. Quản trị Tiến độ & Họp nhóm (Scrum / Agile)
- **Bảng công việc Trello (Kanban / Sprint Board)**:
  - Cập nhật thẻ nhiệm vụ liên tục theo luồng: `Product Backlog` ➔ `To Do` ➔ `In Progress` ➔ `Code Review` ➔ `Testing / QA` ➔ `Done`.
  - Mỗi thẻ nhiệm vụ đều có đầy đủ mã Task ID, ước lượng Story Point, người thực hiện (PIC) và hạn hoàn thành (Due Date).
- **Cơ chế Họp định kỳ**:
  - **Daily Standup**: Họp trực tuyến ngắn gọn 15 phút vào **20:30 mỗi tối hàng ngày** qua Google Meet nhằm trả lời 3 câu hỏi:
    1. *Hôm nay đã hoàn thành những công việc gì?*
    2. *Ngày mai dự kiến làm những việc gì?*
    3. *Có gặp trở ngại kỹ thuật hay vướng mắc nào cần hỗ trợ không (Blockers)?*
  - **Sprint Review & Retrospective**: Đánh giá kết quả bàn giao vào cuối mỗi Sprint, rút kinh nghiệm và phân bổ task cho Sprint tiếp theo.
