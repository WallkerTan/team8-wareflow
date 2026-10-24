# 📑 BẢNG PHÂN CÔNG NHIỆM VỤ — VŨ THU TRANG

- **Họ và tên**: Vũ Thu Trang
- **Vai trò chính**: QA Lead, Scrum Master & Profile Module Lead
- **Phạm vi trách nhiệm**:
  - Đóng vai trò Scrum Master: Khởi tạo và quản trị bảng Trello/Jira của dự án theo quy trình Agile/Scrum; theo dõi tiến độ các Sprint, tổ chức cuộc họp Daily Standup và rà soát các vấn đề vướng mắc (blockers).
  - Phụ trách phát triển phân hệ Hồ sơ cá nhân (`Profile Module`) áp dụng chung cho cả hai phân quyền: Quản trị viên (`/admin/profile`) và Thủ kho (`/warehouse/profile`).
  - Quản trị chất lượng (QA/QC): Thiết kế kịch bản kiểm thử giao diện (UI/UX Testing), kiểm tra tính tương thích Responsive trên nhiều kích thước màn hình, kiểm thử luồng nghiệp vụ end-to-end kết hợp với Backend và hỗ trợ hoàn thiện tài liệu SRS, tài liệu báo cáo đề cương.

---

## 📌 CHI TIẾT CÁC TASK THEO SPRINT & JIRA/TRELLO

| Task ID | Phân hệ / Epic | Tên công việc (Task Name) | Loại task | Sprint | SP | Time (h) | Trạng thái |
|---|---|---|---|---|---|---|---|
| **wareflow-153** | Hạ tầng & Quản trị | [DevOps/PM] Thiết lập bảng Trello quản trị dự án theo Agile Scrum | Task [PM] | Sprint 1 | 3 | 4.0 | **Done** |
| **wareflow-132** | Hồ sơ cá nhân | Phân hệ Quản lý Hồ sơ cá nhân (Nhiệm vụ mẹ) | Epic | Sprint 4 | - | - | **Done** |
| **wareflow-134** | Hồ sơ cá nhân | [FE] Xây dựng giao diện Hồ sơ cá nhân & Đổi mật khẩu | Task [FE] | Sprint 4 | 2 | 3.0 | **Done** |
| **QA-01** | Kiểm thử & QA | Kiểm thử chức năng phân quyền Middleware (ADMIN vs OWNER) | Task [QA] | Sprint 1-2 | 2 | 2.5 | **Done** |
| **QA-02** | Kiểm thử & QA | Kiểm thử luồng nghiệp vụ Xuất/Nhập kho & Cảnh báo âm kho | Task [QA] | Sprint 3 | 3 | 3.5 | **Done** |
| **QA-03** | Tài liệu hóa | Hoàn thiện tài liệu SRS, tài liệu đề cương và nghiệm thu UI/UX | Task [Doc] | Sprint 4 | 2 | 3.0 | **Done** |

---

## 👤 CHI TIẾT NGHIỆP VỤ PHÂN HỆ HỒ SƠ CÁ NHÂN (PROFILE MODULE)

Áp dụng đồng bộ cho hai đường dẫn: `/admin/profile` và `/warehouse/profile`.

### 1. Xem thông tin cá nhân (Profile Overview)
- Hiển thị đầy đủ thông tin định danh của người dùng hiện tại lấy từ endpoint `GET /api/me`:
  - Họ và tên (`fullName`)
  - Email đăng ký (`email`)
  - Vai trò trong hệ thống (`role`: Quản trị viên / Thủ kho)
  - Trạng thái tài khoản (`status`: Đang hoạt động / Khóa)
  - Ngày khởi tạo tài khoản

### 2. Cập nhật thông tin tài khoản (Edit Profile)
- Form cho phép người dùng thay đổi họ tên hiển thị và cập nhật thông tin liên hệ.
- Tích hợp endpoint `PUT /api/me`.
- Validate dữ liệu đầu vào: Không được để trống họ tên, định dạng email chuẩn.

### 3. Đổi mật khẩu bảo mật (Change Password)
- Form đổi mật khẩu bảo mật tích hợp endpoint `PATCH /api/me/password`:
  - Nhập mật khẩu hiện tại (Old Password).
  - Nhập mật khẩu mới (New Password) có kiểm tra độ mạnh tối thiểu.
  - Xác nhận lại mật khẩu mới (Confirm Password).
- Mã hóa an toàn BCrypt tại Backend, tự động đăng xuất hoặc cập nhật token sau khi đổi thành công.

---

## 📋 CÔNG TÁC QUẢN TRỊ DỰ ÁN & ĐẢM BẢO CHẤT LƯỢNG (QA/QC)

1. **Quản trị Trello Board**:
   - Thiết lập cấu trúc cột chuẩn Agile: `Product Backlog` ➔ `Sprint Backlog` ➔ `In Progress` ➔ `Code Review` ➔ `Testing / QA` ➔ `Done`.
   - Gắn thẻ (Labels) phân loại rõ ràng: Frontend, Backend, DevOps, Bug, High Priority.
   - Theo dõi tiến độ Story Points của 4 thành viên theo từng Sprint.
2. **Kịch bản kiểm thử (Test Cases)**:
   - Kiểm thử bảo mật: Xác minh người dùng chưa đăng nhập không thể vào các route nội bộ; Admin không vào được `/warehouse` và ngược lại.
   - Kiểm thử nghiệp vụ kho: Đặt thử đơn xuất kho vượt quá số lượng tồn để kiểm tra thông báo lỗi validate; kiểm tra số lượng tồn kho tự động nhảy chính xác sau khi confirm phiếu.