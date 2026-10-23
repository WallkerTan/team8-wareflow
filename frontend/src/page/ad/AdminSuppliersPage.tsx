import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2, Plus, Search, Edit2, Trash2, RefreshCw, Loader2, AlertCircle, Phone, Mail, MapPin } from "lucide-react";
import { Modal, Popconfirm } from "antd";
import { supplierService } from "../../api/services/supplierService";
import type { SupplierRequest, SupplierResponse } from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatDateTime } from "../../api/formatters";

export default function AdminSuppliersPage() {
    const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal Create / Edit
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<SupplierResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [active, setActive] = useState(true);

    const loadSuppliers = async () => {
        setLoading(true);
        try {
            const data = await supplierService.getSuppliers();
            setSuppliers(data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải danh sách nhà cung cấp"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);

    const filteredSuppliers = suppliers.filter((s) =>
        `${s.name} ${s.email || ""} ${s.phone || ""} ${s.address || ""}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Tên nhà cung cấp không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const payload: SupplierRequest = {
                name: name.trim(),
                email: email.trim() || undefined,
                phone: phone.trim() || undefined,
                address: address.trim() || undefined,
                active,
            };
            await supplierService.createSupplier(payload);
            toast.success("Thêm nhà cung cấp mới thành công!");
            setIsCreateOpen(false);
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            loadSuppliers();
        } catch (error) {
            toast.error(getErrorMessage(error, "Thêm nhà cung cấp thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (supplier: SupplierResponse) => {
        setSelectedSupplier(supplier);
        setName(supplier.name);
        setEmail(supplier.email || "");
        setPhone(supplier.phone || "");
        setAddress(supplier.address || "");
        setActive(supplier.active ?? true);
        setIsEditOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSupplier) return;
        if (!name.trim()) {
            toast.error("Tên nhà cung cấp không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const payload: SupplierRequest = {
                name: name.trim(),
                email: email.trim() || undefined,
                phone: phone.trim() || undefined,
                address: address.trim() || undefined,
                active,
            };
            await supplierService.updateSupplier(selectedSupplier.id, payload);
            toast.success("Cập nhật thông tin nhà cung cấp thành công!");
            setIsEditOpen(false);
            loadSuppliers();
        } catch (error) {
            toast.error(getErrorMessage(error, "Cập nhật nhà cung cấp thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await supplierService.deleteSupplier(id);
            toast.success("Đã xóa nhà cung cấp!");
            loadSuppliers();
        } catch (error) {
            toast.error(getErrorMessage(error, "Xóa nhà cung cấp thất bại"));
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Building2 className="text-emerald-400" size={26} /> Quản lý Nhà cung cấp
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Quản lý danh sách đối tác cung ứng, liên hệ phục vụ nhập hàng vào kho.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadSuppliers}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                        Làm mới
                    </button>
                    <button
                        onClick={() => {
                            setName("");
                            setEmail("");
                            setPhone("");
                            setAddress("");
                            setActive(true);
                            setIsCreateOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition shadow-lg shadow-emerald-950 cursor-pointer"
                    >
                        <Plus size={16} /> Thêm nhà cung cấp
                    </button>
                </div>
            </div>

            {/* Filter Search */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between shadow-lg">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, điện thoại, địa chỉ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition"
                    />
                </div>
                <span className="text-xs text-slate-400">
                    Tổng cộng: <strong className="text-white">{filteredSuppliers.length}</strong> nhà cung cấp
                </span>
            </div>

            {/* Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="py-3.5 px-4 font-semibold w-16">ID</th>
                                <th className="py-3.5 px-4 font-semibold">Nhà cung cấp</th>
                                <th className="py-3.5 px-4 font-semibold">Liên hệ</th>
                                <th className="py-3.5 px-4 font-semibold">Địa chỉ</th>
                                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                                <th className="py-3.5 px-4 font-semibold">Ngày tạo</th>
                                <th className="py-3.5 px-4 font-semibold text-right w-28">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-emerald-400" />
                                            <span>Đang tải nhà cung cấp...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-500" />
                                        <span>Chưa có nhà cung cấp nào phù hợp.</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredSuppliers.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-700/30 transition">
                                        <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">#{s.id}</td>
                                        <td className="py-3.5 px-4 font-semibold text-white">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold border border-cyan-500/20">
                                                    {s.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div>{s.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-300">
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                <Mail size={12} className="text-slate-500" /> {s.email || "-"}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                                                <Phone size={12} className="text-slate-500" /> {s.phone || "-"}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-300 text-xs max-w-xs truncate">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={12} className="text-slate-500 shrink-0" />
                                                <span className="truncate">{s.address || <span className="text-slate-500 italic">Chưa có</span>}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    s.active ?? true
                                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                                        : "bg-slate-700 text-slate-400 border border-slate-600"
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${s.active ?? true ? "bg-emerald-400" : "bg-slate-400"}`} />
                                                {s.active ?? true ? "Hoạt động" : "Ngừng hợp tác"}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-400 text-xs">
                                            {formatDateTime(s.createdAt)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(s)}
                                                    className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                                                    title="Sửa thông tin"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <Popconfirm
                                                    title="Xác nhận xóa nhà cung cấp?"
                                                    description={`Bạn có chắc muốn xóa "${s.name}"?`}
                                                    okText="Xóa"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ danger: true }}
                                                    onConfirm={() => handleDelete(s.id)}
                                                >
                                                    <button
                                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition cursor-pointer"
                                                        title="Xóa nhà cung cấp"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </Popconfirm>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Create Supplier */}
            <Modal
                title={<span className="text-white text-lg font-bold">Thêm nhà cung cấp mới</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleCreate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Tên nhà cung cấp *</label>
                        <input
                            type="text"
                            placeholder="vd: Công ty TNHH Phân Phối Á Châu"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Email liên hệ</label>
                            <input
                                type="email"
                                placeholder="contact@supplier.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                placeholder="0901234567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Địa chỉ trụ sở / kho</label>
                        <input
                            type="text"
                            placeholder="Số 10 Đường ABC, Quận 1, TP. HCM"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="create-active"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="rounded border-slate-700"
                        />
                        <label htmlFor="create-active" className="text-xs text-slate-300">
                            Đang hoạt động hợp tác
                        </label>
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
                            Tạo nhà cung cấp
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit Supplier */}
            <Modal
                title={<span className="text-white text-lg font-bold">Chỉnh sửa nhà cung cấp</span>}
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Tên nhà cung cấp *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Email liên hệ</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Địa chỉ trụ sở / kho</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit-active"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="rounded border-slate-700"
                        />
                        <label htmlFor="edit-active" className="text-xs text-slate-300">
                            Đang hoạt động hợp tác
                        </label>
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
