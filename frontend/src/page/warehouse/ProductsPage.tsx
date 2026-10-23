import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Package,
    Plus,
    Search,
    AlertTriangle,
    Edit2,
    Trash2,
    RefreshCw,
    Loader2,
    AlertCircle,
    Tag,
} from "lucide-react";
import { Modal, Popconfirm } from "antd";
import { productService } from "../../api/services/productService";
import type { ProductFilterParams } from "../../api/services/productService";
import { categoryService } from "../../api/services/categoryService";
import type { CategoryResponse, ProductRequest, ProductResponse } from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatCurrency } from "../../api/formatters";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [lowStockOnly, setLowStockOnly] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modal Create / Edit
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form fields
    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [unit, setUnit] = useState("Cái");
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [stockQuantity, setStockQuantity] = useState<number>(0);
    const [minStock, setMinStock] = useState<number>(5);

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch {
            // ignore
        }
    };

    const loadProducts = async (targetPage = page) => {
        setLoading(true);
        try {
            const params: ProductFilterParams = {
                page: targetPage,
                size,
                keyword: keyword.trim() || undefined,
                categoryId: selectedCategoryId,
                lowStock: lowStockOnly,
            };
            const res = await productService.getProducts(params);
            setProducts(res.content);
            setTotalElements(res.totalElements);
            setTotalPages(res.totalPages);
            setPage(res.page);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải danh sách sản phẩm"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadProducts(0);
    }, [selectedCategoryId, lowStockOnly, size]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadProducts(0);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sku.trim() || !name.trim()) {
            toast.error("Mã SKU và Tên sản phẩm không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const payload: ProductRequest = {
                sku: sku.trim().toUpperCase(),
                name: name.trim(),
                description: description.trim() || undefined,
                categoryId: categoryId || undefined,
                unit: unit.trim() || undefined,
                price: price !== undefined ? Number(price) : undefined,
                stockQuantity: Number(stockQuantity) || 0,
                minStock: Number(minStock) || 0,
                active: true,
            };
            await productService.createProduct(payload);
            toast.success("Thêm sản phẩm mới thành công!");
            setIsCreateOpen(false);
            // Reset
            setSku("");
            setName("");
            setDescription("");
            setPrice(undefined);
            setStockQuantity(0);
            setMinStock(5);
            loadProducts(0);
        } catch (error) {
            toast.error(getErrorMessage(error, "Thêm sản phẩm thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (p: ProductResponse) => {
        setSelectedProduct(p);
        setSku(p.sku);
        setName(p.name);
        setDescription(p.description || "");
        setCategoryId(p.categoryId);
        setUnit(p.unit || "Cái");
        setPrice(p.price);
        setMinStock(p.minStock);
        setIsEditOpen(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;
        if (!sku.trim() || !name.trim()) {
            toast.error("Mã SKU và Tên sản phẩm không được để trống");
            return;
        }

        setSubmitting(true);
        try {
            const payload: ProductRequest = {
                sku: sku.trim().toUpperCase(),
                name: name.trim(),
                description: description.trim() || undefined,
                categoryId: categoryId || undefined,
                unit: unit.trim() || undefined,
                price: price !== undefined ? Number(price) : undefined,
                minStock: Number(minStock) || 0,
                active: selectedProduct.active,
            };
            await productService.updateProduct(selectedProduct.id, payload);
            toast.success("Cập nhật thông tin sản phẩm thành công!");
            setIsEditOpen(false);
            loadProducts();
        } catch (error) {
            toast.error(getErrorMessage(error, "Cập nhật sản phẩm thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await productService.deleteProduct(id);
            toast.success("Đã xóa sản phẩm khỏi kho!");
            loadProducts();
        } catch (error) {
            toast.error(getErrorMessage(error, "Xóa sản phẩm thất bại"));
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Package className="text-blue-600" size={26} /> Quản lý Sản phẩm & Tồn kho
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Theo dõi định mức tồn kho, phát hiện cảnh báo thiếu hụt và phân loại mặt hàng.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => loadProducts()}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 shadow-sm transition cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : "text-slate-500"} />
                        Làm mới
                    </button>
                    <button
                        onClick={() => {
                            setSku("");
                            setName("");
                            setDescription("");
                            setCategoryId(categories[0]?.id);
                            setUnit("Cái");
                            setPrice(undefined);
                            setStockQuantity(0);
                            setMinStock(5);
                            setIsCreateOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm shadow-blue-500/20 cursor-pointer"
                    >
                        <Plus size={16} /> Thêm sản phẩm
                    </button>
                </div>
            </div>

            {/* Filter Tools */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
                <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo mã SKU hoặc tên sản phẩm..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-sm font-medium transition cursor-pointer"
                    >
                        Tìm
                    </button>
                </form>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Category Filter */}
                    <div className="flex items-center gap-1.5">
                        <select
                            value={selectedCategoryId ?? ""}
                            onChange={(e) =>
                                setSelectedCategoryId(e.target.value ? Number(e.target.value) : undefined)
                            }
                            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                        >
                            <option value="">Tất cả danh mục</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Low Stock Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setLowStockOnly(!lowStockOnly)}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            lowStockOnly
                                ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                        <AlertTriangle size={14} className={lowStockOnly ? "text-red-500" : "text-slate-400"} />
                        <span>Sản phẩm sắp hết hàng</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="py-3.5 px-4 font-semibold">Mặt hàng</th>
                                <th className="py-3.5 px-4 font-semibold">Danh mục</th>
                                <th className="py-3.5 px-4 font-semibold">Tồn kho hiện tại</th>
                                <th className="py-3.5 px-4 font-semibold">Ngưỡng tối thiểu</th>
                                <th className="py-3.5 px-4 font-semibold">Giá tham khảo</th>
                                <th className="py-3.5 px-4 font-semibold">Tình trạng</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-blue-600" />
                                            <span>Đang tải dữ liệu hàng hóa...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-400" />
                                        <span>Không tìm thấy sản phẩm nào trong kho.</span>
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => {
                                    const isLow = p.lowStock || p.stockQuantity <= p.minStock;
                                    return (
                                        <tr key={p.id} className="hover:bg-slate-50 transition">
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs border border-blue-100">
                                                        {p.unit ? p.unit.substring(0, 2).toUpperCase() : "SP"}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900">{p.name}</div>
                                                        <div className="text-xs font-mono text-blue-600 font-medium">{p.sku}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200">
                                                    <Tag size={11} className="text-slate-500" />
                                                    {p.categoryName || "Chưa gán"}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-baseline gap-1.5">
                                                    <span className={`text-base font-extrabold ${isLow ? "text-red-600" : "text-slate-900"}`}>
                                                        {p.stockQuantity.toLocaleString("vi-VN")}
                                                    </span>
                                                    <span className="text-xs text-slate-500">{p.unit || "Cái"}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs text-slate-500">
                                                <span>{p.minStock.toLocaleString("vi-VN")} {p.unit || "Cái"}</span>
                                            </td>
                                            <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                                                {formatCurrency(p.price)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {isLow ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                                        <AlertTriangle size={12} /> Sắp hết hàng
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đủ hàng
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => openEditModal(p)}
                                                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition cursor-pointer"
                                                        title="Sửa thông tin"
                                                    >
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <Popconfirm
                                                        title="Xác nhận xóa sản phẩm?"
                                                        description={`Bạn có chắc muốn xóa "${p.name}"?`}
                                                        okText="Xóa"
                                                        cancelText="Hủy"
                                                        okButtonProps={{ danger: true }}
                                                        onConfirm={() => handleDelete(p.id)}
                                                    >
                                                        <button
                                                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                                                            title="Xóa sản phẩm"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                    </Popconfirm>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                    <div>
                        Hiển thị <strong className="text-slate-900">{products.length}</strong> / <strong className="text-slate-900">{totalElements}</strong> sản phẩm (Trang {page + 1}/{Math.max(1, totalPages)})
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => loadProducts(page - 1)}
                            disabled={page <= 0 || loading}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-700 transition cursor-pointer shadow-xs"
                        >
                            ← Trước
                        </button>
                        <span className="px-2 text-slate-900 font-bold">{page + 1}</span>
                        <button
                            onClick={() => loadProducts(page + 1)}
                            disabled={page >= totalPages - 1 || loading}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-700 transition cursor-pointer shadow-xs"
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Create Product */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Thêm sản phẩm mới vào kho</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleCreate} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Mã SKU *</label>
                            <input
                                type="text"
                                placeholder="vd: SP-IPHONE15"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục</label>
                            <select
                                value={categoryId ?? ""}
                                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên sản phẩm *</label>
                        <input
                            type="text"
                            placeholder="vd: Điện thoại iPhone 15 Pro 128GB"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả sản phẩm</label>
                        <textarea
                            rows={2}
                            placeholder="Thông số kỹ thuật hoặc ghi chú bảo quản..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn vị tính</label>
                            <input
                                type="text"
                                placeholder="Cái, Thùng, Hộp..."
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Giá tham khảo (VNĐ)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={price ?? ""}
                                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Số lượng tồn ban đầu</label>
                            <input
                                type="number"
                                min={0}
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(Number(e.target.value))}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Ngưỡng cảnh báo tồn thấp *</label>
                            <input
                                type="number"
                                min={0}
                                value={minStock}
                                onChange={(e) => setMinStock(Number(e.target.value))}
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
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
                            Thêm sản phẩm
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit Product */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Chỉnh sửa thông tin sản phẩm</span>}
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                        Lưu ý: Tồn kho chỉ thay đổi thông qua Phiếu Nhập kho hoặc Phiếu Xuất kho hợp lệ.
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Mã SKU *</label>
                            <input
                                type="text"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục</label>
                            <select
                                value={categoryId ?? ""}
                                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên sản phẩm *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả sản phẩm</label>
                        <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn vị tính</label>
                            <input
                                type="text"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Giá tham khảo (VNĐ)</label>
                            <input
                                type="number"
                                value={price ?? ""}
                                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Ngưỡng cảnh báo tồn thấp *</label>
                        <input
                            type="number"
                            min={0}
                            value={minStock}
                            onChange={(e) => setMinStock(Number(e.target.value))}
                            required
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
