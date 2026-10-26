import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Package,
    Search,
    AlertTriangle,
    Eye,
    RefreshCw,
    Loader2,
    AlertCircle,
    Tag,
    Building2,
} from "lucide-react";
import { Modal } from "antd";
import { productService } from "../../api/services/productService";
import type { ProductFilterParams } from "../../api/services/productService";
import { categoryService } from "../../api/services/categoryService";
import { supplierService } from "../../api/services/supplierService";
import type { CategoryResponse, ProductResponse, SupplierResponse } from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatCurrency } from "../../api/formatters";

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);
    const [selectedSupplierId, setSelectedSupplierId] = useState<number | undefined>(undefined);
    const [lowStockOnly, setLowStockOnly] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modal Detail
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

    const loadReferenceData = async () => {
        try {
            const [cats, sups] = await Promise.all([
                categoryService.getCategories(),
                supplierService.getSuppliers(),
            ]);
            setCategories(cats);
            setSuppliers(sups);
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
                supplierId: selectedSupplierId,
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
        loadReferenceData();
    }, []);

    useEffect(() => {
        loadProducts(0);
    }, [selectedCategoryId, selectedSupplierId, lowStockOnly, size]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadProducts(0);
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
                    <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium border border-slate-200 cursor-not-allowed select-none" title="Chỉ Admin mới có thể thêm/sửa/xóa sản phẩm">
                        <AlertCircle size={16} className="text-amber-500" /> Liên hệ Admin để thêm SP
                    </span>
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
                    {/* Supplier Filter */}
                    <select
                        value={selectedSupplierId ?? ""}
                        onChange={(e) =>
                            setSelectedSupplierId(e.target.value ? Number(e.target.value) : undefined)
                        }
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                    >
                        <option value="">Tất cả nhà cung cấp</option>
                        {suppliers.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>

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
                                <th className="py-3.5 px-4 font-semibold">Nhà cung cấp</th>
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
                                    <td colSpan={8} className="py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-blue-600" />
                                            <span>Đang tải dữ liệu hàng hóa...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-500">
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
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-violet-50 text-violet-700 text-xs border border-violet-200">
                                                    <Building2 size={11} className="text-violet-400" />
                                                    {p.supplierName || "Chưa gán"}
                                                </span>
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
                                                        onClick={() => {
                                                            setSelectedProduct(p);
                                                            setIsDetailOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 text-xs font-semibold transition cursor-pointer"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye size={13} /> Chi tiết
                                                    </button>
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

            {/* Modal Detail Product */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold flex items-center gap-2"><Package className="text-blue-600" size={20} /> Chi tiết sản phẩm</span>}
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                {selectedProduct && (
                    <div className="space-y-4 mt-4 text-sm">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500 text-xs font-medium">Mã SKU:</span>
                                <span className="font-mono font-bold text-slate-900">{selectedProduct.sku}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500 text-xs font-medium">Tên sản phẩm:</span>
                                <span className="font-semibold text-slate-900">{selectedProduct.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500 text-xs font-medium">Nhà cung cấp:</span>
                                <span className="font-medium text-blue-600">
                                    {suppliers.find((s) => s.id === selectedProduct.supplierId)?.name || `#${selectedProduct.supplierId}`}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500 text-xs font-medium">Danh mục:</span>
                                <span className="font-medium text-slate-700">
                                    {categories.find((c) => c.id === selectedProduct.categoryId)?.name || "Chưa phân loại"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500 text-xs font-medium">Đơn vị tính:</span>
                                <span className="text-slate-800">{selectedProduct.unit || "Cái"}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500 text-xs font-medium">Đơn giá tham khảo:</span>
                                <span className="font-semibold text-emerald-600">
                                    {selectedProduct.price ? formatCurrency(selectedProduct.price) : "Chưa có"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="text-slate-500 text-xs font-medium">Tồn kho hiện tại:</span>
                                <span className="font-bold text-blue-600 text-base">{selectedProduct.stockQuantity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-xs font-medium">Mức cảnh báo tồn thấp:</span>
                                <span className="font-medium text-slate-700">{selectedProduct.minStock}</span>
                            </div>
                        </div>

                        {selectedProduct.description && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                                <strong className="text-slate-700 block mb-1">Mô tả:</strong>
                                {selectedProduct.description}
                            </div>
                        )}

                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                            <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <span>
                                Sản phẩm này do Quản trị viên (Admin) quản lý theo từng Nhà cung cấp. Số lượng tồn kho được tự động cập nhật khi bạn xác nhận Phiếu Nhập hoặc Phiếu Xuất kho.
                            </span>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}
