import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FolderKanban, Plus, Search, Edit2, Trash2, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import { Modal, Popconfirm } from "antd";
import { categoryService } from "../../api/services/categoryService";
import type { CategoryRequest, CategoryResponse } from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatDateTime } from "../../api/formatters";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Modal Create / Edit
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải danh sách danh mục"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const filteredCategories = categories.filter((c) =>
        `${c.name} ${c.description || ""}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const payload: CategoryRequest = {
                name: name.trim(),
                description: description.trim() || undefined,
            };
            await categoryService.createCategory(payload);
            toast.success("Thêm danh mục mới thành công!");
            setIsCreateOpen(false);
            setName("");
            setDescription("");
            loadCategories();
        } catch (error) {
            toast.error(getErrorMessage(error, "Thêm danh mục thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (cat: CategoryResponse) => {
        setSelectedCategory(cat);
        setName(cat.name);
        setDescription(cat.description || "");
        setIsEditOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategory) return;
        if (!name.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const payload: CategoryRequest = {
                name: name.trim(),
                description: description.trim() || undefined,
            };
            await categoryService.updateCategory(selectedCategory.id, payload);
            toast.success("Cập nhật danh mục thành công!");
            setIsEditOpen(false);
            loadCategories();
        } catch (error) {
            toast.error(getErrorMessage(error, "Cập nhật danh mục thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await categoryService.deleteCategory(id);
            toast.success("Đã xóa danh mục!");
            loadCategories();
        } catch (error) {
            toast.error(getErrorMessage(error, "Xóa danh mục thất bại"));
        }
    };

    return (
        <section className="space-y-6">
            <div className="m-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <FolderKanban className="text-blue-600" size={26} /> Quản lý Danh mục hàng hóa
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Tạo và phân loại các nhóm hàng hóa lưu trữ trong toàn bộ hệ thống kho.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadCategories}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 shadow-sm transition cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : "text-slate-500"} />
                        Làm mới
                    </button>
                    <button
                        onClick={() => {
                            setName("");
                            setDescription("");
                            setIsCreateOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm shadow-blue-500/20 cursor-pointer"
                    >
                        <Plus size={16} /> Thêm danh mục
                    </button>
                </div>
            </div>

            {/* Filter Search */}
            <div className="m-4 bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition"
                    />
                </div>
                <span className="text-xs text-slate-500">
                    Tổng cộng: <strong className="text-slate-900 font-bold">{filteredCategories.length}</strong> danh mục
                </span>
            </div>

            {/* Table */}
            <div className="m-4 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="py-3.5 px-4 font-semibold w-16">ID</th>
                                <th className="py-3.5 px-4 font-semibold">Tên danh mục</th>
                                <th className="py-3.5 px-4 font-semibold">Mô tả chi tiết</th>
                                <th className="py-3.5 px-4 font-semibold">Ngày tạo</th>
                                <th className="py-3.5 px-4 font-semibold text-right w-28">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-blue-600" />
                                            <span>Đang tải danh mục...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-400" />
                                        <span>Chưa có danh mục nào phù hợp.</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">#{cat.id}</td>
                                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">
                                                    {cat.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span>{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs truncate">
                                            {cat.description || <span className="text-slate-400 italic">Không có mô tả</span>}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                                            {formatDateTime(cat.createdAt)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openEditModal(cat)}
                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition cursor-pointer"
                                                    title="Sửa danh mục"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                <Popconfirm
                                                    title="Xác nhận xóa danh mục?"
                                                    description={`Bạn có chắc muốn xóa "${cat.name}"?`}
                                                    okText="Xóa"
                                                    cancelText="Hủy"
                                                    okButtonProps={{ danger: true }}
                                                    onConfirm={() => handleDelete(cat.id)}
                                                >
                                                    <button
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                                                        title="Xóa danh mục"
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

            {/* Modal Create Category */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Thêm danh mục mới</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleCreate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên danh mục *</label>
                        <input
                            type="text"
                            placeholder="vd: Thiết bị gia dụng"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả</label>
                        <textarea
                            rows={3}
                            placeholder="Mô tả về nhóm sản phẩm này..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(false)}
                            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer shadow-sm shadow-blue-500/20"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin text-white" />}
                            Tạo danh mục
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit Category */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Chỉnh sửa danh mục</span>}
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên danh mục *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setIsEditOpen(false)}
                            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-sm font-medium cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer shadow-sm shadow-blue-500/20"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin text-white" />}
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
