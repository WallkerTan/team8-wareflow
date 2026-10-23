import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Users,
    UserPlus,
    Search,
    Shield,
    Lock,
    Unlock,
    Edit2,
    RefreshCw,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { Modal, Popconfirm } from "antd";
import { adminService } from "../../api/services/adminService";
import type { UserFilterParams } from "../../api/services/adminService";
import type { CreateUserRequest, Role, UpdateUserRequest, UserResponse, UserStatus } from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatDateTime } from "../../api/formatters";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
    const [statusFilter, setStatusFilter] = useState<UserStatus | "ALL">("ALL");
    const [loading, setLoading] = useState(false);

    // Modal Create / Edit
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Create form fields
    const [newEmail, setNewEmail] = useState("");
    const [newFullName, setNewFullName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState<Role>("WAREHOUSE_OWNER");
    const [newPhone, setNewPhone] = useState("");
    const [newAddress, setNewAddress] = useState("");

    // Edit form fields
    const [editFullName, setEditFullName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState<Role>("WAREHOUSE_OWNER");
    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");

    const loadUsers = async (targetPage = page) => {
        setLoading(true);
        try {
            const params: UserFilterParams = {
                page: targetPage,
                size,
                keyword: keyword.trim() || undefined,
                role: roleFilter === "ALL" ? undefined : roleFilter,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            };
            const response = await adminService.getUsers(params);
            setUsers(response.content);
            setTotalElements(response.totalElements);
            setTotalPages(response.totalPages);
            setPage(response.page);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải danh sách người dùng"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(0);
    }, [roleFilter, statusFilter, size]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadUsers(0);
    };

    const handleToggleStatus = async (user: UserResponse) => {
        const nextStatus: UserStatus = user.status === "ACTIVE" ? "LOCKED" : "ACTIVE";
        try {
            await adminService.updateUserStatus(user.id, nextStatus);
            toast.success(
                nextStatus === "ACTIVE"
                    ? `Đã mở khóa tài khoản ${user.email}`
                    : `Đã khóa tài khoản ${user.email}`
            );
            loadUsers();
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể cập nhật trạng thái người dùng"));
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim() || !newFullName.trim() || !newPassword) {
            toast.error("Vui lòng điền đầy đủ email, họ tên và mật khẩu");
            return;
        }

        setSubmitting(true);
        try {
            const payload: CreateUserRequest = {
                email: newEmail.trim(),
                fullName: newFullName.trim(),
                password: newPassword,
                role: newRole,
                status: "ACTIVE",
                phone: newPhone.trim() || undefined,
                address: newAddress.trim() || undefined,
            };
            await adminService.createUser(payload);
            toast.success("Tạo tài khoản người dùng mới thành công!");
            setIsCreateOpen(false);
            // Reset form
            setNewEmail("");
            setNewFullName("");
            setNewPassword("");
            setNewPhone("");
            setNewAddress("");
            loadUsers(0);
        } catch (error) {
            toast.error(getErrorMessage(error, "Tạo người dùng thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (user: UserResponse) => {
        setSelectedUser(user);
        setEditFullName(user.fullName);
        setEditEmail(user.email);
        setEditRole(user.role);
        setEditPhone(user.phone || "");
        setEditAddress(user.address || "");
        setIsEditOpen(true);
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        if (!editFullName.trim()) {
            toast.error("Họ và tên không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const payload: UpdateUserRequest = {
                fullName: editFullName.trim(),
                email: editEmail.trim() || undefined,
                role: editRole,
                phone: editPhone.trim() || undefined,
                address: editAddress.trim() || undefined,
            };
            await adminService.updateUser(selectedUser.id, payload);
            toast.success("Cập nhật thông tin người dùng thành công!");
            setIsEditOpen(false);
            loadUsers();
        } catch (error) {
            toast.error(getErrorMessage(error, "Cập nhật người dùng thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="text-emerald-400" size={26} /> Quản lý Người dùng
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Quản trị danh sách tài khoản, phân vai trò và điều phối trạng thái hoạt động.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => loadUsers()}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                        Làm mới
                    </button>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition shadow-lg shadow-emerald-950 cursor-pointer"
                    >
                        <UserPlus size={16} /> Thêm người dùng
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-lg">
                <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo họ tên hoặc email..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition cursor-pointer"
                    >
                        Tìm
                    </button>
                </form>

                <div className="flex items-center gap-2 flex-wrap">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as Role | "ALL")}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                        <option value="ALL">Tất cả vai trò</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="WAREHOUSE_OWNER">WAREHOUSE_OWNER</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as UserStatus | "ALL")}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                        <option value="LOCKED">Bị khóa (LOCKED)</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="py-3.5 px-4 font-semibold">Người dùng</th>
                                <th className="py-3.5 px-4 font-semibold">Vai trò</th>
                                <th className="py-3.5 px-4 font-semibold">Liên hệ</th>
                                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                                <th className="py-3.5 px-4 font-semibold">Ngày tạo</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-emerald-400" />
                                            <span>Đang tải danh sách người dùng...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-500" />
                                        <span>Không có người dùng nào phù hợp với bộ lọc.</span>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-700/30 transition">
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-700 text-emerald-400 font-bold flex items-center justify-center text-sm border border-slate-600">
                                                    {u.fullName ? u.fullName.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">{u.fullName}</div>
                                                    <div className="text-xs text-slate-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    u.role === "ADMIN"
                                                        ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                                                        : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                                                }`}
                                            >
                                                <Shield size={12} />
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-300">
                                            <div>{u.phone || "-"}</div>
                                            <div className="text-slate-400 truncate max-w-[150px]">{u.address || "-"}</div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2">
                                                <Popconfirm
                                                    title={`Xác nhận ${u.status === "ACTIVE" ? "khóa" : "mở khóa"} tài khoản?`}
                                                    description={`Bạn có chắc muốn đổi trạng thái cho ${u.email}?`}
                                                    okText="Đồng ý"
                                                    cancelText="Hủy"
                                                    onConfirm={() => handleToggleStatus(u)}
                                                >
                                                    <button
                                                        type="button"
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                                                            u.status === "ACTIVE"
                                                                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
                                                                : "bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30"
                                                        }`}
                                                    >
                                                        {u.status === "ACTIVE" ? <Unlock size={12} /> : <Lock size={12} />}
                                                        {u.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                                                    </button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-400">
                                            {formatDateTime(u.createdAt)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                onClick={() => openEditModal(u)}
                                                className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                                                title="Sửa thông tin"
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <div>
                        Hiển thị <strong>{users.length}</strong> / <strong>{totalElements}</strong> người dùng (Trang {page + 1}/{Math.max(1, totalPages)})
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => loadUsers(page - 1)}
                            disabled={page <= 0 || loading}
                            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 transition cursor-pointer"
                        >
                            ← Trước
                        </button>
                        <span className="px-2 text-slate-300 font-semibold">{page + 1}</span>
                        <button
                            onClick={() => loadUsers(page + 1)}
                            disabled={page >= totalPages - 1 || loading}
                            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-slate-200 transition cursor-pointer"
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Create User */}
            <Modal
                title={<span className="text-white text-lg font-bold">Thêm người dùng mới</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Email đăng nhập *</label>
                        <input
                            type="email"
                            placeholder="user@wareflow.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Họ và tên *</label>
                        <input
                            type="text"
                            placeholder="Nguyễn Văn B"
                            value={newFullName}
                            onChange={(e) => setNewFullName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Mật khẩu khởi tạo * (tối thiểu 6 ký tự)</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Vai trò người dùng *</label>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as Role)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        >
                            <option value="WAREHOUSE_OWNER">WAREHOUSE_OWNER (Chủ kho)</option>
                            <option value="ADMIN">ADMIN (Quản trị viên)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                placeholder="0912..."
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                placeholder="Hà Nội"
                                value={newAddress}
                                onChange={(e) => setNewAddress(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(false)}
                            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer shadow-lg shadow-emerald-950"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            Tạo người dùng
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit User */}
            <Modal
                title={<span className="text-white text-lg font-bold">Chỉnh sửa thông tin người dùng</span>}
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleUpdateUser} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Họ và tên *</label>
                        <input
                            type="text"
                            value={editFullName}
                            onChange={(e) => setEditFullName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Vai trò</label>
                        <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as Role)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        >
                            <option value="WAREHOUSE_OWNER">WAREHOUSE_OWNER (Chủ kho)</option>
                            <option value="ADMIN">ADMIN (Quản trị viên)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Địa chỉ</label>
                            <input
                                type="text"
                                value={editAddress}
                                onChange={(e) => setEditAddress(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/60">
                        <button
                            type="button"
                            onClick={() => setIsEditOpen(false)}
                            className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer shadow-lg shadow-emerald-950"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin" />}
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
