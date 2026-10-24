# ⚙️ BẢNG PHÂN CÔNG NHIỆM VỤ — ĐOÀN TRUNG NGUYÊN

- **Họ và tên**: Đoàn Trung Nguyên
- **Vai trò chính**: Backend Lead & DevOps Lead
- **Phạm vi trách nhiệm**:
  - Thiết kế kiến trúc tổng thể Backend với Spring Boot 3 (Java 17), Spring Security 6 + JWT, RESTful API.
  - Thiết kế sơ đồ quan hệ CSDL (ERD) trên MySQL 8.0, chuẩn hóa 3NF, đánh chỉ mục (Index) tối ưu truy vấn.
  - Triển khai logic nghiệp vụ cốt lõi: Quản lý Auth, Quản trị Admin, Nghiệp vụ Xuất/Nhập kho với cơ chế Pessimistic Locking & Database Transactions chống âm kho / race condition.
  - Đóng gói toàn bộ hệ thống bằng Docker, viết Dockerfile đa tầng (multi-stage build), cấu hình `docker-compose.yml` (MySQL + Backend + Frontend Nginx) và kịch bản test API tự động.

---

## 📌 CHI TIẾT CÁC TASK THEO SPRINT & JIRA/TRELLO

| Task ID | Phân hệ / Epic | Tên công việc (Task Name) | Loại task | Sprint | SP | Time (h) | Trạng thái |
|---|---|---|---|---|---|---|---|
| **wareflow-151** | Hạ tầng & DevOps | Thiết lập Docker, MySQL, môi trường DevOps & CI/CD | Epic | Sprint 1 | - | - | **Done** |
| **wareflow-152** | Hạ tầng & DevOps | [DevOps] Khởi tạo GitHub repo & cấu hình nhánh chuẩn | Task [DevOps] | Sprint 1 | 3 | 5.5 | **Done** |
| **wareflow-154** | Hạ tầng & DevOps | [DevOps] Cấu hình dự án Base (Spring Boot, Gradle, Config) | Task [DevOps] | Sprint 1 | 3 | 2.5 | **Done** |
| **wareflow-155** | Hạ tầng & DevOps | [DevOps] Viết Dockerfile cho Backend và Frontend | Task [DevOps] | Sprint 1 | 3 | 3.0 | **Done** |
| **wareflow-156** | Hạ tầng & DevOps | [DevOps] Xây dựng docker-compose.yml và container MySQL | Task [DevOps] | Sprint 1 | 3 | 4.5 | **Done** |
| **wareflow-103** | Xác thực & User | [BE] Thiết kế bảng users & mã hóa mật khẩu BCrypt | Task [BE] | Sprint 1 | 3 | 3.0 | **Done** |
| **wareflow-104** | Xác thực & User | [BE] Kiểm tra tài khoản, phân quyền Role (Spring Security) | Task [BE] | Sprint 1 | 3 | 2.5 | **Done** |
| **wareflow-105** | Xác thực & User | [BE] Tích hợp API đăng nhập, cấp phát JWT Access Token | Task [BE] | Sprint 1 | 3 | 2.0 | **Done** |
| **wareflow-108** | Danh mục & Hàng hóa | [BE] Thiết kế bảng categories & quan hệ với products | Task [BE] | Sprint 2 | 3 | 2.5 | **Done** |
| **wareflow-109** | Danh mục & Hàng hóa | [BE] Xây dựng API xem danh sách sản phẩm | Task [BE] | Sprint 2 | 3 | 2.0 | **Done** |
| **wareflow-110** | Danh mục & Hàng hóa | [BE] Chức năng tìm kiếm, phân trang và lọc theo danh mục | Task [BE] | Sprint 2 | 3 | 3.0 | **Done** |
| **wareflow-111** | Danh mục & Hàng hóa | Thêm/sửa/xóa sản phẩm (Nhiệm vụ mẹ) | Epic | Sprint 2 | - | - | **Done** |
| **wareflow-112** | Danh mục & Hàng hóa | [BE] Xây dựng logic nghiệp vụ CRUD, gán category | Task [BE] | Sprint 2 | 3 | 4.0 | **Done** |
| **wareflow-113** | Danh mục & Hàng hóa | [BE] Hoàn thiện endpoint API sản phẩm + filter lowStock | Task [BE] | Sprint 2 | 3 | 2.5 | **Done** |
| **wareflow-136** | Quản trị Admin | [BE] Thiết kế bảng suppliers, cấu trúc phân quyền Admin | Task [BE] | Sprint 2 | 3 | 2.5 | **Done** |
| **wareflow-137** | Quản trị Admin | [BE] Xây dựng API quản lý user (lấy ds, khóa/mở tài khoản) | Task [BE] | Sprint 2 | 3 | 2.0 | **Done** |
| **wareflow-141** | Quản trị Admin | [BE] Logic CRUD nhà cung cấp (Suppliers) | Task [BE] | Sprint 2 | 3 | 4.5 | **Done** |
| **wareflow-142** | Quản trị Admin | [BE] Xây dựng API thêm/sửa/xóa nhà cung cấp | Task [BE] | Sprint 2 | 3 | 3.0 | **Done** |
| **wareflow-145** | Quản trị Admin | [BE] Logic CRUD danh mục hàng hóa (Categories) | Task [BE] | Sprint 2 | 3 | 4.5 | **Done** |
| **wareflow-146** | Quản trị Admin | [BE] Xây dựng API thêm/sửa/xóa danh mục | Task [BE] | Sprint 2 | 3 | 3.0 | **Done** |
| **wareflow-116** | Nghiệp vụ Nhập kho | [BE] Thiết kế bảng receipts & receipt_items | Task [BE] | Sprint 3 | 3 | 2.5 | **Done** |
| **wareflow-117** | Nghiệp vụ Nhập kho | [BE] API tạo DRAFT, sửa/xóa & Confirm (Transaction cộng kho) | Task [BE] | Sprint 3 | 3 | 4.0 | **Done** |
| **wareflow-120** | Nghiệp vụ Xuất kho | [BE] Thiết kế bảng issues & issue_items | Task [BE] | Sprint 3 | 3 | 2.5 | **Done** |
| **wareflow-120b** | Nghiệp vụ Xuất kho | [BE] Logic kiểm tra tồn khả dụng & Pessimistic Locking | Task [BE] | Sprint 3 | 3 | 3.0 | **Done** |
| **wareflow-121** | Nghiệp vụ Xuất kho | [BE] API thêm/xác nhận phiếu xuất (Transaction trừ tồn kho) | Task [BE] | Sprint 3 | 3 | 2.0 | **Done** |
| **wareflow-124** | Giao hàng (Shipment) | [BE] Thiết kế bảng shipments & shipment_logs (quan hệ 1-1 issue) | Task [BE] | Sprint 3 | 3 | 2.5 | **Done** |
| **wareflow-125** | Giao hàng (Shipment) | [BE] Xây dựng API tạo đơn giao hàng và cập nhật trạng thái | Task [BE] | Sprint 3 | 3 | 2.0 | **Done** |
| **wareflow-128** | Lịch sử kho | [BE] Xây dựng API xem danh sách & chi tiết phiếu nhập/xuất | Task [BE] | Sprint 3 | 3 | 4.5 | **Done** |
| **wareflow-129** | Lịch sử kho | [BE] Xây dựng bộ lọc lịch sử theo thời gian, loại phiếu, status | Task [BE] | Sprint 3 | 3 | 3.0 | **Done** |
| **wareflow-133** | Hồ sơ & Profile | [BE] Bổ sung cấu trúc dữ liệu cập nhật thông tin cá nhân | Task [BE] | Sprint 4 | 3 | 2.5 | **Done** |
| **wareflow-134** | Hồ sơ & Profile | [BE] API `/api/me` (GET/PUT) và đổi mật khẩu `/api/me/password` | Task [BE] | Sprint 4 | 3 | 3.5 | **Done** |
| **wareflow-150** | Dashboard Admin | [BE] Xây dựng API thống kê số liệu tổng hợp `/api/admin/stats` | Task [BE] | Sprint 4 | 3 | 3.0 | **Done** |

---

## 🛡️ ĐẶC TẢ KỸ THUẬT & GIẢI PHÁP CHỐNG LỆCH KHO

1. **Transaction & Pessimistic Locking**:
   - Khi thực hiện xác nhận phiếu nhập (`POST /api/receipts/{id}/confirm`) hoặc xác nhận phiếu xuất (`POST /api/issues/{id}/confirm`):
   - Sử dụng khóa bi quan `SELECT ... FOR UPDATE` (Pessimistic Write Lock) trên các bản ghi `products`.
   - Các mã sản phẩm trong phiếu được sắp xếp theo thứ tự ID tăng dần trước khi khóa nhằm triệt tiêu hoàn toàn nguy cơ **Deadlock**.
   - Toàn bộ thao tác cộng/trừ số lượng tồn và cập nhật trạng thái phiếu được bao gói trong một `@Transactional` duy nhất. Nếu xảy ra bất kỳ lỗi nào, hệ thống tự động Rollback hoàn toàn.
2. **Nguyên tắc bất biến tồn kho**:
   - Endpoint `PUT /api/products/{id}` bị loại bỏ khả năng can thiệp trực tiếp vào `stock_quantity`. Số lượng hàng trong kho chỉ biến thiên thông qua phiếu nhập/xuất đã được kiểm duyệt.
3. **Kiểm thử tự động (Automation Test)**:
   - Viết kịch bản kiểm thử API `_apitest.ps1` (30 test case) và `_newtest.ps1` (11 test case) kiểm tra toàn bộ luồng Auth, phân quyền chéo, kiểm tra âm kho và luồng vòng đời đơn hàng. Kết quả: **100% PASS**.
