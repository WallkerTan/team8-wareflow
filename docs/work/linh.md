# 📦 BẢNG PHÂN CÔNG NHIỆM VỤ — PHẠM NGỌC LINH

- **Họ và tên**: Phạm Ngọc Linh
- **Vai trò chính**: Frontend Engineer (Warehouse Operations Lead)
- **Phạm vi trách nhiệm**:
  - Chịu trách nhiệm toàn bộ giao diện và luồng tương tác người dùng của phân hệ Quản lý Kho (`/warehouse`) dành cho vai trò `WAREHOUSE_OWNER`.
  - Xây dựng kiến trúc giao diện dạng Tab linh hoạt (5 tabs nghiệp vụ chính):
    1. **Tab Hàng hóa (Products)**: Quản lý danh mục hàng tồn, tìm kiếm, lọc và cảnh báo hàng sắp hết (low stock).
    2. **Tab Nhập kho (Receipts)**: Quy trình tạo phiếu nhập DRAFT, chỉnh sửa, gửi duyệt và xác nhận nhập hàng.
    3. **Tab Xuất kho (Issues)**: Quy trình tạo phiếu xuất DRAFT, kiểm tra số lượng tồn khả dụng, xác nhận xuất kho.
    4. **Tab Giao hàng (Shipments)**: Theo dõi tiến độ giao vận liên kết 1-1 với phiếu xuất đã xác nhận, cập nhật trạng thái vận đơn.
    5. **Tab Lịch sử (History)**: Tra cứu toàn bộ phiếu nhập/xuất theo thời gian thực và xem chi tiết phiếu.
  - Tích hợp toàn diện các endpoint API nghiệp vụ kho từ Backend, xử lý Validate Form và phản hồi trải nghiệm người dùng trực quan.

---

## 📌 CHI TIẾT CÁC TASK THEO SPRINT & JIRA/TRELLO

| Task ID | Phân hệ / Epic | Tên công việc (Task Name) | Loại task | Sprint | SP | Time (h) | Trạng thái |
|---|---|---|---|---|---|---|---|
| **wareflow-106** | Quản lý sản phẩm | Xem danh sách sản phẩm kho (Nhiệm vụ mẹ) | Epic | Sprint 2 | - | - | **Done** |
| **wareflow-107** | Quản lý sản phẩm | [FE] Cắt giao diện danh sách hàng hóa & bộ lọc | Task [FE] | Sprint 2 | 2 | 2.0 | **Done** |
| **wareflow-114** | Quản lý sản phẩm | [FE] Xây dựng Modal & Form thêm/sửa/xóa sản phẩm | Task [FE] | Sprint 2 | 2 | 2.0 | **Done** |
| **wareflow-115** | Quản lý nhập kho | Nghiệp vụ Nhập kho (Nhiệm vụ mẹ) | Epic | Sprint 3 | - | - | **Done** |
| **wareflow-118** | Quản lý nhập kho | [FE] Thiết kế giao diện & Form tạo phiếu nhập DRAFT / Confirm | Task [FE] | Sprint 3 | 2 | 2.0 | **Done** |
| **wareflow-119** | Quản lý xuất kho | Nghiệp vụ Xuất kho (Nhiệm vụ mẹ) | Epic | Sprint 3 | - | - | **Done** |
| **wareflow-122** | Quản lý xuất kho | [FE] Giao diện form xuất kho & kiểm tra tồn khả dụng | Task [FE] | Sprint 3 | 2 | 2.5 | **Done** |
| **wareflow-123** | Giao hàng (Shipment) | Theo dõi giao vận hàng hóa (Nhiệm vụ mẹ) | Epic | Sprint 3 | - | - | **Done** |
| **wareflow-126** | Giao hàng (Shipment) | [FE] Giao diện quản lý shipment & cập nhật trạng thái | Task [FE] | Sprint 3 | 2 | 3.0 | **Done** |
| **wareflow-127** | Lịch sử kho | Lịch sử biến động xuất nhập (Nhiệm vụ mẹ) | Epic | Sprint 3 | - | - | **Done** |
| **wareflow-131** | Lịch sử kho | [FE] Giao diện tra cứu lịch sử & Modal xem chi tiết phiếu | Task [FE] | Sprint 3 | 2 | 3.0 | **Done** |

---

## 📑 QUY TRÌNH NGHIỆP VỤ & TƯƠNG TÁC GIAO DIỆN

### 1. Tab Hàng hóa (`/warehouse?tab=products`)
- Hiển thị danh sách sản phẩm dạng bảng responsive với hình ảnh, mã SKU, tên hàng hóa, danh mục, số lượng tồn thực tế và định mức tồn tối thiểu (`min_stock`).
- **Cảnh báo tồn thấp (Low Stock Badge)**: Đánh dấu nổi bật màu đỏ/cam các mặt hàng có số lượng tồn $\le$ định mức tối thiểu.
- Modal tạo mới và chỉnh sửa sản phẩm: Chọn danh mục từ dropdown được nạp động từ Backend.

### 2. Tab Nhập kho (`/warehouse?tab=receipts`)
- **Tạo phiếu DRAFT**: Cho phép thủ kho chọn nhà cung cấp, thêm động nhiều dòng sản phẩm kèm số lượng nhập và đơn giá.
- **Thao tác DRAFT**: Sửa hoặc xóa phiếu khi phiếu vẫn ở trạng thái nháp.
- **Xác nhận (Confirm)**: Gửi lệnh xác nhận, kích hoạt giao dịch cộng tồn kho từ Backend và chuyển trạng thái phiếu sang `CONFIRMED`.
- **Hủy phiếu (Cancel)**: Hủy bỏ phiếu nhập nháp khi không còn nhu cầu.

### 3. Tab Xuất kho (`/warehouse?tab=issues`)
- **Tạo phiếu xuất DRAFT**: Điền thông tin người nhận hàng, địa chỉ giao và danh sách mặt hàng cần xuất.
- **Kiểm tra tồn khả dụng ngay tại Frontend**: Cảnh báo tức thì nếu số lượng xuất vượt quá số lượng hàng tồn hiện có trong kho.
- **Xác nhận xuất kho (Confirm)**: Gửi yêu cầu xác nhận, Backend trừ hàng tồn với cơ chế khóa bi quan bảo vệ dữ liệu.

### 4. Tab Giao hàng (`/warehouse?tab=shipments`)
- Tự động hiển thị vận đơn tạo từ các phiếu xuất đã ở trạng thái `CONFIRMED` (quan hệ 1-1).
- Cho phép thủ kho cập nhật tiến độ giao vận: `PENDING` ➔ `SHIPPING` ➔ `COMPLETED` / `CANCELLED`.
- Xem lịch sử timeline chi tiết của đơn vận chuyển (`shipment_logs`).

### 5. Tab Lịch sử (`/warehouse?tab=history`)
- Bảng tổng hợp toàn bộ lịch sử xuất và nhập kho.
- Lọc linh hoạt theo khoảng ngày, theo loại phiếu (Nhập / Xuất) và theo trạng thái phiếu.
- Xem chi tiết từng phiếu: Danh sách items, người tạo, ngày giờ xác nhận.
