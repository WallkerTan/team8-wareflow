import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2, Plus, Search, Edit2, Trash2, RefreshCw, Loader2, AlertCircle, Phone, Mail, MapPin, Boxes, Package } from "lucide-react";
import { Modal, Popconfirm } from "antd";
import { supplierService } from "../../api/services/supplierService";
import { productService } from "../../api/services/productService";
import { categoryService } from "../../api/services/categoryService";
import type { CategoryResponse, ProductRequest, ProductResponse, SupplierRequest, SupplierResponse } from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatCurrency, formatDateTime } from "../../api/formatters";

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

    // Product modal states
    const [isProductsModalOpen, setIsProductsModalOpen] = useState(false);
    const [supplierForProducts, setSupplierForProducts] = useState<SupplierResponse | null>(null);
    const [supplierProducts, setSupplierProducts] = useState<ProductResponse[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    // Product create/edit modal
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
    const [prodSku, setProdSku] = useState("");
    const [prodName, setProdName] = useState("");
    const [prodDescription, setProdDescription] = useState("");
    const [prodCategoryId, setProdCategoryId] = useState<number | undefined>(undefined);
    const [prodUnit, setProdUnit] = useState("Cái");
    const [prodPrice, setProdPrice] = useState<number | undefined>(undefined);
    const [prodStock, setProdStock] = useState<number>(0);
    const [prodMinStock, setProdMinStock] = useState<number>(5);
    const [submittingProduct, setSubmittingProduct] = useState(false);

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

    const loadCategories = async () => {
        try {
            const data = await categoryService.getCategories();
            setCategories(data);
        } catch {
            // ignore
        }
    };

    const loadProductsForSupplier = async (supplierId: number) => {
        setLoadingProducts(true);
        try {
            const data = await productService.getProductsBySupplier(supplierId);
            setSupplierProducts(data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải danh sách sản phẩm của nhà cung cấp"));
        } finally {
            setLoadingProducts(false);
        }
    };

    const openProductsModal = (supplier: SupplierResponse) => {
        setSupplierForProducts(supplier);
        setIsProductsModalOpen(true);
        loadProductsForSupplier(supplier.id);
        if (categories.length === 0) {
            loadCategories();
        }
    };

    const openCreateProductModal = () => {
        setEditingProduct(null);
        setProdSku("");
        setProdName("");
        setProdDescription("");
        setProdCategoryId(categories[0]?.id);
        setProdUnit("Cái");
        setProdPrice(undefined);
        setProdStock(0);
        setProdMinStock(5);
        setIsProductFormOpen(true);
    };

    const openEditProductModal = (p: ProductResponse) => {
        setEditingProduct(p);
        setProdSku(p.sku);
        setProdName(p.name);
        setProdDescription(p.description || "");
        setProdCategoryId(p.categoryId);
        setProdUnit(p.unit || "Cái");
        setProdPrice(p.price);
        setProdStock(p.stockQuantity);
        setProdMinStock(p.minStock);
        setIsProductFormOpen(true);
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierForProducts) return;
        if (!prodSku.trim() || !prodName.trim()) {
            toast.error("Mã SKU và Tên sản phẩm không được để trống");
            return;
        }

        setSubmittingProduct(true);
        try {
            const payload: ProductRequest = {
                supplierId: supplierForProducts.id,
                sku: prodSku.trim().toUpperCase(),
                name: prodName.trim(),
                description: prodDescription.trim() || undefined,
                categoryId: prodCategoryId || undefined,
                unit: prodUnit.trim() || undefined,
                price: prodPrice !== undefined ? Number(prodPrice) : undefined,
                stockQuantity: Number(prodStock) || 0,
                minStock: Number(prodMinStock) || 0,
                active: true,
            };

            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, payload);
                toast.success("Cập nhật sản phẩm thành công!");
            } else {
                await productService.createProduct(payload);
                toast.success("Thêm sản phẩm cho nhà cung cấp thành công!");
            }
            setIsProductFormOpen(false);
            loadProductsForSupplier(supplierForProducts.id);
        } catch (error) {
            toast.error(getErrorMessage(error, editingProduct ? "Cập nhật sản phẩm thất bại" : "Thêm sản phẩm thất bại"));
        } finally {
            setSubmittingProduct(false);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!supplierForProducts) return;
        try {
            await productService.deleteProduct(id);
            toast.success("Đã xóa sản phẩm khỏi nhà cung cấp!");
            loadProductsForSupplier(supplierForProducts.id);
        } catch (error) {
            toast.error(getErrorMessage(error, "Xóa sản phẩm thất bại"));
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Building2 className="text-blue-600" size={26} /> Quản lý Nhà cung cấp
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Quản lý danh sách đối tác cung ứng, liên hệ phục vụ nhập hàng vào kho.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadSuppliers}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 shadow-sm transition cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : "text-slate-500"} />
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
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm shadow-blue-500/20 cursor-pointer"
                    >
                        <Plus size={16} /> Thêm nhà cung cấp
                    </button>
                </div>
            </div>

            {/* Filter Search */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, điện thoại, địa chỉ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition"
                    />
                </div>
                <span className="text-xs text-slate-500">
                    Tổng cộng: <strong className="text-slate-900 font-bold">{filteredSuppliers.length}</strong> nhà cung cấp
                </span>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="py-3.5 px-4 font-semibold w-16">ID</th>
                                <th className="py-3.5 px-4 font-semibold">Nhà cung cấp</th>
                                <th className="py-3.5 px-4 font-semibold">Liên hệ</th>
                                <th className="py-3.5 px-4 font-semibold">Địa chỉ</th>
                                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                                <th className="py-3.5 px-4 font-semibold">Ngày tạo</th>
                                <th className="py-3.5 px-4 font-semibold text-right w-28">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-blue-600" />
                                            <span>Đang tải nhà cung cấp...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredSuppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-400" />
                                        <span>Chưa có nhà cung cấp nào phù hợp.</span>
                                    </td>
                                </tr>
                            ) : (
                                filteredSuppliers.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">#{s.id}</td>
                                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold border border-blue-200">
                                                    {s.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div>{s.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-600">
                                            <div className="flex items-center gap-1.5 text-slate-700">
                                                <Mail size={12} className="text-slate-400" /> {s.email || "-"}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                                                <Phone size={12} className="text-slate-400" /> {s.phone || "-"}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={12} className="text-slate-400 shrink-0" />
                                                <span className="truncate">{s.address || <span className="text-slate-400 italic">Chưa có</span>}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    s.active ?? true
                                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : "bg-slate-100 text-slate-600 border border-slate-200"
                                                }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full ${s.active ?? true ? "bg-emerald-500" : "bg-slate-400"}`} />
                                                {s.active ?? true ? "Hoạt động" : "Ngừng hợp tác"}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-500 text-xs">
                                            {formatDateTime(s.createdAt)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openProductsModal(s)}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition cursor-pointer"
                                                    title="Quản lý danh sách sản phẩm"
                                                >
                                                    <Boxes size={14} /> Sản phẩm
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(s)}
                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition cursor-pointer"
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
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
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
                title={<span className="text-slate-900 text-lg font-bold">Thêm nhà cung cấp mới</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleCreate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên nhà cung cấp *</label>
                        <input
                            type="text"
                            placeholder="vd: Công ty TNHH Phân Phối Á Châu"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Email liên hệ</label>
                            <input
                                type="email"
                                placeholder="contact@supplier.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                placeholder="0901234567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ trụ sở / kho</label>
                        <input
                            type="text"
                            placeholder="Số 10 Đường ABC, Quận 1, TP. HCM"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="create-active"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="create-active" className="text-xs text-slate-700 font-medium">
                            Đang hoạt động hợp tác
                        </label>
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
                            Tạo nhà cung cấp
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit Supplier */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Chỉnh sửa nhà cung cấp</span>}
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Tên nhà cung cấp *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Email liên hệ</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ trụ sở / kho</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit-active"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="edit-active" className="text-xs text-slate-700 font-medium">
                            Đang hoạt động hợp tác
                        </label>
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

            {/* Modal Quản lý danh sách sản phẩm của Nhà cung cấp */}
            <Modal
                title={
                    <div className="flex items-center justify-between pr-8">
                        <span className="text-slate-900 text-lg font-bold flex items-center gap-2">
                            <Boxes className="text-blue-600" size={22} />
                            Sản phẩm của: {supplierForProducts?.name}
                        </span>
                        <button
                            onClick={openCreateProductModal}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-sm shadow-blue-500/20"
                        >
                            <Plus size={14} /> Thêm sản phẩm
                        </button>
                    </div>
                }
                open={isProductsModalOpen}
                onCancel={() => setIsProductsModalOpen(false)}
                footer={null}
                width={860}
                className="custom-dark-modal"
                destroyOnClose
            >
                <div className="space-y-4 mt-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                        <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                        <span>
                            Chỉ Admin mới có thể thiết lập danh mục sản phẩm cho Nhà cung cấp. Người dùng khi tạo phiếu nhập kho chỉ được chọn từ danh mục sản phẩm này.
                        </span>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold">
                                    <th className="py-2.5 px-3">Mã SKU</th>
                                    <th className="py-2.5 px-3">Tên sản phẩm</th>
                                    <th className="py-2.5 px-3">Danh mục</th>
                                    <th className="py-2.5 px-3">ĐVT</th>
                                    <th className="py-2.5 px-3">Đơn giá</th>
                                    <th className="py-2.5 px-3">Tồn kho</th>
                                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loadingProducts ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-500">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 size={18} className="animate-spin text-blue-600" />
                                                <span>Đang tải danh sách sản phẩm...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : supplierProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-500">
                                            <Package size={24} className="mx-auto mb-1 text-slate-400" />
                                            <span>Nhà cung cấp này chưa có sản phẩm nào. Hãy bấm "Thêm sản phẩm" ở trên.</span>
                                        </td>
                                    </tr>
                                ) : (
                                    supplierProducts.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50">
                                            <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{p.sku}</td>
                                            <td className="py-2.5 px-3 font-semibold text-slate-900">{p.name}</td>
                                            <td className="py-2.5 px-3 text-slate-600">
                                                {categories.find((c) => c.id === p.categoryId)?.name || "-"}
                                            </td>
                                            <td className="py-2.5 px-3 text-slate-600">{p.unit || "Cái"}</td>
                                            <td className="py-2.5 px-3 text-emerald-600 font-semibold">
                                                {p.price ? formatCurrency(p.price) : "-"}
                                            </td>
                                            <td className="py-2.5 px-3 font-bold text-blue-600">{p.stockQuantity}</td>
                                            <td className="py-2.5 px-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openEditProductModal(p)}
                                                        className="p-1 rounded hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition cursor-pointer"
                                                        title="Sửa sản phẩm"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <Popconfirm
                                                        title="Xác nhận xóa sản phẩm?"
                                                        description={`Bạn có chắc muốn xóa "${p.name}" khỏi nhà cung cấp này?`}
                                                        okText="Xóa"
                                                        cancelText="Hủy"
                                                        okButtonProps={{ danger: true }}
                                                        onConfirm={() => handleDeleteProduct(p.id)}
                                                    >
                                                        <button
                                                            className="p-1 rounded hover:bg-red-50 text-red-600 transition cursor-pointer"
                                                            title="Xóa sản phẩm"
                                                        >
                                                            <Trash2 size={14} />
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

                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => setIsProductsModalOpen(false)}
                            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Thêm / Chỉnh sửa sản phẩm cho Nhà cung cấp */}
            <Modal
                title={
                    <span className="text-slate-900 text-lg font-bold">
                        {editingProduct ? "Chỉnh sửa sản phẩm của NCC" : "Thêm sản phẩm mới cho NCC"}
                    </span>
                }
                open={isProductFormOpen}
                onCancel={() => setIsProductFormOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleSaveProduct} className="space-y-4 mt-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Mã SKU *</label>
                            <input
                                type="text"
                                placeholder="vd: SP-001"
                                value={prodSku}
                                onChange={(e) => setProdSku(e.target.value)}
                                required
                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Danh mục</label>
                            <select
                                value={prodCategoryId ?? ""}
                                onChange={(e) => setProdCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
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
                            placeholder="vd: Tủ lạnh 250L Inverter"
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả sản phẩm</label>
                        <textarea
                            rows={2}
                            placeholder="Mô tả kỹ thuật hoặc quy cách đóng gói..."
                            value={prodDescription}
                            onChange={(e) => setProdDescription(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn vị tính</label>
                            <input
                                type="text"
                                placeholder="Cái, Thùng, Hộp..."
                                value={prodUnit}
                                onChange={(e) => setProdUnit(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn giá tham khảo (VNĐ)</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={prodPrice ?? ""}
                                onChange={(e) => setProdPrice(e.target.value ? Number(e.target.value) : undefined)}
                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Số lượng tồn ban đầu</label>
                            <input
                                type="number"
                                min={0}
                                value={prodStock}
                                onChange={(e) => setProdStock(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Ngưỡng cảnh báo tồn thấp *</label>
                            <input
                                type="number"
                                min={0}
                                value={prodMinStock}
                                onChange={(e) => setProdMinStock(Number(e.target.value))}
                                required
                                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={() => setIsProductFormOpen(false)}
                            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-medium cursor-pointer"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submittingProduct}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer shadow-sm shadow-blue-500/20"
                        >
                            {submittingProduct && <Loader2 size={14} className="animate-spin text-white" />}
                            {editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
