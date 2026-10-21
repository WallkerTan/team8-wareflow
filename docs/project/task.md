WareFlow-fe
├── 🔐 /login (chung)->tân
│
├── 🛠️ ADMIN-> tân
│ ├── Page 1: /admin (Quản trị hệ thống)
│ │ ├── Users
│ │ ├── Nhà cung cấp
│ │ ├── Danh mục hàng hóa
│ │ └── Dashboard (optional)
│ └── Page 2: /admin/profile (Hồ sơ cá nhân)
│ ├── Xem thông tin
│ ├── Cập nhật hồ sơ
│ └── Đổi mật khẩu
│
└── 📦 WAREHOUSE_OWNER
├── Page 1: /warehouse (Quản lí kho)-> linh
│ ├── Tab Hàng hóa
│ ├── Tab Nhập kho
│ ├── Tab Xuất kho
│ ├── Tab Giao hàng
│ └── Tab Lịch sử
│
│
└── Page 2: /warehouse/profile (Hồ sơ cá nhân)-> trang
├── Xem thông tin
├── Cập nhật hồ sơ
└── Đổi mật khẩu
│
│── be-nguyên




Middleware check `role` từ JWT:
- ADMIN ❌ vào `/warehouse`
- OWNER ❌ vào `/admin`


---



## ✅ CHECKLIST TRIỂN KHAI

### Frontend
- [ ] **Tân**: Setup route + middleware phân quyền + login + admin pages
- [ ] **Linh**: Warehouse page + 5 tab (Hàng hóa, Nhập, Xuất, Giao hàng, Lịch sử)
- [ ] **Trang**: Profile page (xem/sửa/đổi MK)

### Backend (be-nguyên)
- [ ] Auth service: login + `/api/me` + đổi MK + middleware role
- [ ] Admin APIs: users + suppliers + categories
- [ ] Inventory APIs: products + receipts (confirm transaction) + issues (confirm transaction)
- [ ] Shipment APIs: shipments + logs

### Test chung
- [ ] Test luồng: nhập → tồn tăng; xuất → tồn giảm; xuất → shipment → log
- [ ] Test cảnh báo tồn thấp
- [ ] Test phân quyền chéo role
- [ ] Test transaction rollback khi confirm lỗi

---

## 📊 TỔNG KẾT PHÂN CÔNG
