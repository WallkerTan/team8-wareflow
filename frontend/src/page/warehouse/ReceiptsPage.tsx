import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    ArrowDownLeft,
    Plus,
    CheckCircle2,
    XCircle,
    Eye,
    Edit2,
    Trash2,
    RefreshCw,
    Loader2,
    Building2,
    AlertCircle,
} from "lucide-react";
import { Modal, Popconfirm } from "antd";
import { receiptService } from "../../api/services/receiptService";
import type { ReceiptFilterParams } from "../../api/services/receiptService";
import { supplierService } from "../../api/services/supplierService";
import { productService } from "../../api/services/productService";
import type {
    DocumentStatus,
    ProductResponse,
    ReceiptItemRequest,
    ReceiptRequest,
    ReceiptResponse,
    SupplierResponse,
} from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatCurrency, formatDate } from "../../api/formatters";

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<ReceiptResponse[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);
    const [availableProducts, setAvailableProducts] = useState<ProductResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("ALL");
    const [supplierFilter, setSupplierFilter] = useState<number | undefined>(undefined);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loading, setLoading] = useState(false);

    // Modal Create / Edit
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingReceiptId, setEditingReceiptId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [supplierId, setSupplierId] = useState<number | undefined>(undefined);
    const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split("T")[0]);
    const [note, setNote] = useState("");
    const [items, setItems] = useState<ReceiptItemRequest[]>([
        { productId: 0, quantity: 1, unitPrice: 0 },
    ]);

    // Modal Detail
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptResponse | null>(null);

    const loadSuppliersAndProducts = async () => {
        try {
            const [supRes, prodRes] = await Promise.all([
                supplierService.getSuppliers(),
                productService.getProducts({ size: 500 }),
            ]);
            setSuppliers(supRes);
            setAvailableProducts(prodRes.content);
        } catch {
            // ignore
        }
    };

    const loadReceipts = async (targetPage = page) => {
        setLoading(true);
        try {
            const params: ReceiptFilterParams = {
                page: targetPage,
                size,
                status: statusFilter === "ALL" ? undefined : statusFilter,
                supplierId: supplierFilter,
                fromDate: fromDate || undefined,
                toDate: toDate || undefined,
            };
            const res = await receiptService.getReceipts(params);
            setReceipts(res.content);
            setTotalElements(res.totalElements);
            setTotalPages(res.totalPages);
            setPage(res.page);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải danh sách phiếu nhập"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSuppliersAndProducts();
    }, []);

    useEffect(() => {
        loadReceipts(0);
    }, [statusFilter, supplierFilter, fromDate, toDate, size]);

    // When supplier changes in the form, reset items to avoid cross-supplier product mixes
    const handleFormSupplierChange = (newSupplierId: number) => {
        setSupplierId(newSupplierId);
        const firstProduct = availableProducts.find((p) => p.supplierId === newSupplierId);
        setItems([{ productId: firstProduct?.id || 0, quantity: 1, unitPrice: firstProduct?.price || 0 }]);
    };

    const addItemRow = () => {
        const firstProduct = availableProducts.find((p) => p.supplierId === supplierId);
        setItems([...items, { productId: firstProduct?.id || 0, quantity: 1, unitPrice: 0 }]);
    };

    const removeItemRow = (index: number) => {
        if (items.length <= 1) {
            toast.error("Phiếu nhập phải có ít nhất 1 mặt hàng");
            return;
        }
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof ReceiptItemRequest, value: unknown) => {
        const next = [...items];
        next[index] = { ...next[index], [field]: value };
        if (field === "productId") {
            const p = availableProducts.find((prod) => prod.id === Number(value));
            if (p && p.price) {
                next[index].unitPrice = p.price;
            }
        }
        setItems(next);
    };

    const resetForm = () => {
        const firstSupplier = suppliers[0];
        const firstProduct = firstSupplier
            ? availableProducts.find((p) => p.supplierId === firstSupplier.id)
            : undefined;
        setSupplierId(firstSupplier?.id);
        setReceiptDate(new Date().toISOString().split("T")[0]);
        setNote("");
        setItems([
            {
                productId: firstProduct?.id || 0,
                quantity: 1,
                unitPrice: firstProduct?.price || 0,
            },
        ]);
    };

    const handleOpenCreate = () => {
        resetForm();
        setIsCreateOpen(true);
    };

    const handleCreateReceipt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierId) {
            toast.error("Vui lòng chọn nhà cung cấp");
            return;
        }
        const validItems = items.filter((it) => it.productId > 0 && it.quantity > 0);
        if (validItems.length === 0) {
            toast.error("Vui lòng nhập hợp lệ ít nhất 1 sản phẩm có số lượng > 0");
            return;
        }

        setSubmitting(true);
        try {
            const payload: ReceiptRequest = {
                supplierId,
                receiptDate: receiptDate || undefined,
                note: note.trim() || undefined,
                items: validItems.map((it) => ({
                    productId: it.productId,
                    quantity: Number(it.quantity),
                    unitPrice: it.unitPrice ? Number(it.unitPrice) : undefined,
                })),
            };
            await receiptService.createReceipt(payload);
            toast.success("Tạo phiếu nhập nháp (DRAFT) thành công!");
            setIsCreateOpen(false);
            loadReceipts(0);
        } catch (error) {
            toast.error(getErrorMessage(error, "Tạo phiếu nhập thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const openEditModal = (r: ReceiptResponse) => {
        setEditingReceiptId(r.id);
        setSupplierId(r.supplierId);
        setReceiptDate(r.receiptDate || new Date().toISOString().split("T")[0]);
        setNote(r.note || "");
        setItems(
            r.items.map((it) => ({
                productId: it.productId,
                quantity: it.quantity,
                unitPrice: it.unitPrice,
            }))
        );
        setIsEditOpen(true);
    };

    const handleUpdateReceipt = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReceiptId || !supplierId) return;
        const validItems = items.filter((it) => it.productId > 0 && it.quantity > 0);
        if (validItems.length === 0) {
            toast.error("Vui lòng nhập hợp lệ ít nhất 1 sản phẩm");
            return;
        }

        setSubmitting(true);
        try {
            const payload: ReceiptRequest = {
                supplierId,
                receiptDate: receiptDate || undefined,
                note: note.trim() || undefined,
                items: validItems.map((it) => ({
                    productId: it.productId,
                    quantity: Number(it.quantity),
                    unitPrice: it.unitPrice ? Number(it.unitPrice) : undefined,
                })),
            };
            await receiptService.updateReceipt(editingReceiptId, payload);
            toast.success("Cập nhật phiếu nhập thành công!");
            setIsEditOpen(false);
            loadReceipts();
        } catch (error) {
            toast.error(getErrorMessage(error, "Cập nhật phiếu nhập thất bại"));
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReceipt = async (id: number) => {
        try {
            await receiptService.deleteReceipt(id);
            toast.success("Đã xóa phiếu nhập DRAFT!");
            loadReceipts();
        } catch (error) {
            toast.error(getErrorMessage(error, "Xóa phiếu nhập thất bại"));
        }
    };

    const handleConfirmReceipt = async (id: number) => {
        try {
            await receiptService.confirmReceipt(id);
            toast.success("Xác nhận nhập kho thành công! Tồn kho đã được tự động cộng thêm.");
            loadReceipts();
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể xác nhận phiếu nhập"));
        }
    };

    const handleCancelReceipt = async (id: number) => {
        try {
            await receiptService.cancelReceipt(id);
            toast.success("Đã hủy phiếu nhập!");
            loadReceipts();
        } catch (error) {
            toast.error(getErrorMessage(error, "Hủy phiếu nhập thất bại"));
        }
    };

    const openDetailModal = async (id: number) => {
        try {
            const data = await receiptService.getReceipt(id);
            setSelectedReceipt(data);
            setIsDetailOpen(true);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải chi tiết phiếu nhập"));
        }
    };

      return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ArrowDownLeft className="text-blue-600" size={26} /> Quản lý Phiếu Nhập Kho
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Tạo phiếu nhập hàng, quản lý đơn vị cung ứng và duyệt nhập kho tăng tồn.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => loadReceipts()}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200 shadow-sm transition cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin text-blue-600" : "text-slate-500"} />
                        Làm mới
                    </button>
                    <button
                        onClick={handleOpenCreate}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm shadow-blue-500/20 cursor-pointer"
                    >
                        <Plus size={16} /> Tạo phiếu nhập
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | "ALL")}
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="DRAFT">DRAFT (Bản nháp)</option>
                        <option value="CONFIRMED">CONFIRMED (Đã nhập kho)</option>
                        <option value="CANCELLED">CANCELLED (Đã hủy)</option>
                    </select>

                    <select
                        value={supplierFilter ?? ""}
                        onChange={(e) =>
                            setSupplierFilter(e.target.value ? Number(e.target.value) : undefined)
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

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span>Từ:</span>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
                        />
                        <span>Đến:</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="text-xs text-slate-500">
                    Tổng: <strong className="text-slate-900 font-bold">{totalElements}</strong> phiếu nhập
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="py-3.5 px-4 font-semibold">Mã phiếu</th>
                                <th className="py-3.5 px-4 font-semibold">Nhà cung cấp</th>
                                <th className="py-3.5 px-4 font-semibold">Ngày nhập</th>
                                <th className="py-3.5 px-4 font-semibold">Số mặt hàng</th>
                                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                                <th className="py-3.5 px-4 font-semibold">Ghi chú</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-blue-600" />
                                            <span>Đang tải danh sách phiếu nhập...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : receipts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-400" />
                                        <span>Không tìm thấy phiếu nhập nào.</span>
                                    </td>
                                </tr>
                            ) : (
                                receipts.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                                            {r.receiptNo}
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <Building2 size={14} className="text-slate-400" />
                                                <span>{r.supplierName || `NCC #${r.supplierId}`}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-600">
                                            {formatDate(r.receiptDate)}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-600">
                                            <span className="font-semibold text-slate-900">{r.items?.length || 0}</span> loại hàng
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {r.status === "CONFIRMED" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 size={12} /> Đã nhập kho
                                                </span>
                                            )}
                                            {r.status === "DRAFT" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Bản nháp
                                                </span>
                                            )}
                                            {r.status === "CANCELLED" && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                                    <XCircle size={12} /> Đã hủy
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-500 max-w-xs truncate">
                                            {r.note || "-"}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openDetailModal(r.id)}
                                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition cursor-pointer"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye size={15} />
                                                </button>

                                                {r.status === "DRAFT" && (
                                                    <>
                                                        <Popconfirm
                                                            title="Xác nhận duyệt nhập kho?"
                                                            description="Hệ thống sẽ tự động cộng số lượng vào tồn kho."
                                                            okText="Duyệt ngay"
                                                            cancelText="Đóng"
                                                            onConfirm={() => handleConfirmReceipt(r.id)}
                                                        >
                                                            <button
                                                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1 shadow-sm"
                                                                title="Duyệt nhập kho (cộng tồn)"
                                                            >
                                                                <CheckCircle2 size={13} /> Duyệt
                                                            </button>
                                                        </Popconfirm>

                                                        <button
                                                            onClick={() => openEditModal(r)}
                                                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition cursor-pointer"
                                                            title="Sửa phiếu"
                                                        >
                                                            <Edit2 size={15} />
                                                        </button>

                                                        <Popconfirm
                                                            title="Xác nhận hủy phiếu?"
                                                            description="Phiếu này sẽ chuyển sang trạng thái CANCELLED."
                                                            okText="Hủy phiếu"
                                                            cancelText="Đóng"
                                                            okButtonProps={{ danger: true }}
                                                            onConfirm={() => handleCancelReceipt(r.id)}
                                                        >
                                                            <button
                                                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition cursor-pointer"
                                                                title="Hủy phiếu"
                                                            >
                                                                <XCircle size={15} />
                                                            </button>
                                                        </Popconfirm>

                                                        <Popconfirm
                                                            title="Xác nhận xóa phiếu DRAFT?"
                                                            description="Phiếu sẽ bị xóa vĩnh viễn khỏi hệ thống."
                                                            okText="Xóa"
                                                            cancelText="Hủy"
                                                            okButtonProps={{ danger: true }}
                                                            onConfirm={() => handleDeleteReceipt(r.id)}
                                                        >
                                                            <button
                                                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition cursor-pointer"
                                                                title="Xóa phiếu"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        </Popconfirm>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                    <div>
                        Hiển thị <strong className="text-slate-900">{receipts.length}</strong> / <strong className="text-slate-900">{totalElements}</strong> phiếu nhập (Trang {page + 1}/{Math.max(1, totalPages)})
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => loadReceipts(page - 1)}
                            disabled={page <= 0 || loading}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-700 transition cursor-pointer shadow-xs"
                        >
                            ← Trước
                        </button>
                        <span className="px-2 text-slate-900 font-bold">{page + 1}</span>
                        <button
                            onClick={() => loadReceipts(page + 1)}
                            disabled={page >= totalPages - 1 || loading}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-700 transition cursor-pointer shadow-xs"
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Create Receipt */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Tạo phiếu nhập kho mới (DRAFT)</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                width={720}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleCreateReceipt} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nhà cung cấp *</label>
                            <select
                                value={supplierId ?? ""}
                                onChange={(e) => handleFormSupplierChange(Number(e.target.value))}
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">-- Chọn nhà cung cấp --</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày lập phiếu</label>
                            <input
                                type="date"
                                value={receiptDate}
                                onChange={(e) => setReceiptDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú</label>
                        <input
                            type="text"
                            placeholder="Ghi chú về lô hàng nhập..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Dynamic Items list */}
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Danh sách sản phẩm nhập ({items.length})
                            </span>
                            <button
                                type="button"
                                onClick={addItemRow}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition cursor-pointer"
                            >
                                <Plus size={13} /> Thêm dòng
                            </button>
                        </div>

                        {items.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-slate-200">
                                <div className="col-span-5">
                                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Sản phẩm *</label>
                                    <select
                                        value={row.productId}
                                        onChange={(e) => updateItem(idx, "productId", Number(e.target.value))}
                                        required
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                                    >
                                        <option value={0}>-- Chọn sản phẩm --</option>
                                        {availableProducts
                                            .filter((p) => !supplierId || p.supplierId === supplierId)
                                            .map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.sku})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Số lượng *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={row.quantity}
                                        onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                                        required
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Đơn giá nhập (VNĐ)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={row.unitPrice || 0}
                                        onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="col-span-1 pt-5 text-right">
                                    <button
                                        type="button"
                                        onClick={() => removeItemRow(idx)}
                                        className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                                        title="Xóa dòng"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
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
                            Lưu phiếu DRAFT
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Edit Receipt */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Chỉnh sửa phiếu nhập (DRAFT)</span>}
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
                width={720}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleUpdateReceipt} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nhà cung cấp *</label>
                            <select
                                value={supplierId ?? ""}
                                onChange={(e) => handleFormSupplierChange(Number(e.target.value))}
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">-- Chọn nhà cung cấp --</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày lập phiếu</label>
                            <input
                                type="date"
                                value={receiptDate}
                                onChange={(e) => setReceiptDate(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú</label>
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Dynamic Items list */}
                    <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Danh sách sản phẩm ({items.length})
                            </span>
                            <button
                                type="button"
                                onClick={addItemRow}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition cursor-pointer"
                            >
                                <Plus size={13} /> Thêm dòng
                            </button>
                        </div>

                        {items.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white p-2.5 rounded-lg border border-slate-200">
                                <div className="col-span-5">
                                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Sản phẩm *</label>
                                    <select
                                        value={row.productId}
                                        onChange={(e) => updateItem(idx, "productId", Number(e.target.value))}
                                        required
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                                    >
                                        <option value={0}>-- Chọn sản phẩm --</option>
                                        {availableProducts
                                            .filter((p) => !supplierId || p.supplierId === supplierId)
                                            .map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.sku})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Số lượng *</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={row.quantity}
                                        onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                                        required
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Đơn giá nhập (VNĐ)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={row.unitPrice || 0}
                                        onChange={(e) => updateItem(idx, "unitPrice", Number(e.target.value))}
                                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div className="col-span-1 pt-5 text-right">
                                    <button
                                        type="button"
                                        onClick={() => removeItemRow(idx)}
                                        className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                                        title="Xóa dòng"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        ))}
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
                            Cập nhật phiếu
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Detail Receipt */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Chi tiết Phiếu Nhập Kho</span>}
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                footer={null}
                width={700}
                className="custom-dark-modal"
            >
                {selectedReceipt && (
                    <div className="space-y-4 mt-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                            <div>
                                <span className="text-slate-500 block">Mã phiếu:</span>
                                <strong className="text-blue-600 font-mono text-sm">{selectedReceipt.receiptNo}</strong>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Trạng thái:</span>
                                <strong className="text-slate-900">{selectedReceipt.status}</strong>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Nhà cung cấp:</span>
                                <strong className="text-slate-900">{selectedReceipt.supplierName}</strong>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Ngày nhập:</span>
                                <strong className="text-slate-900">{formatDate(selectedReceipt.receiptDate)}</strong>
                            </div>
                        </div>

                        {selectedReceipt.note && (
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                                <span className="text-slate-500 font-semibold">Ghi chú:</span> {selectedReceipt.note}
                            </div>
                        )}

                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                                    <tr>
                                        <th className="py-2.5 px-3">STT</th>
                                        <th className="py-2.5 px-3">Sản phẩm</th>
                                        <th className="py-2.5 px-3">Mã SKU</th>
                                        <th className="py-2.5 px-3 text-right">Số lượng</th>
                                        <th className="py-2.5 px-3 text-right">Đơn giá</th>
                                        <th className="py-2.5 px-3 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {selectedReceipt.items?.map((it, idx) => (
                                        <tr key={it.id || idx} className="hover:bg-slate-50">
                                            <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                                            <td className="py-2.5 px-3 font-semibold text-slate-900">{it.productName}</td>
                                            <td className="py-2.5 px-3 font-mono text-blue-600 font-medium">{it.sku}</td>
                                            <td className="py-2.5 px-3 text-right font-bold text-slate-900">{it.quantity}</td>
                                            <td className="py-2.5 px-3 text-right text-slate-700">{formatCurrency(it.unitPrice)}</td>
                                            <td className="py-2.5 px-3 text-right font-bold text-blue-600">
                                                {formatCurrency(it.totalPrice || (it.unitPrice || 0) * it.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50/80 border-t border-slate-200 font-semibold text-slate-800">
                                    <tr>
                                        <td colSpan={5} className="py-2.5 px-3 text-right">
                                            TỔNG CỘNG:
                                        </td>
                                        <td className="py-2.5 px-3 text-right text-blue-600 font-extrabold text-sm">
                                            {formatCurrency(
                                                selectedReceipt.items?.reduce(
                                                    (sum, it) => sum + (it.totalPrice || (it.unitPrice || 0) * it.quantity),
                                                    0
                                                ) || 0
                                            )}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setIsDetailOpen(false)}
                                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs cursor-pointer font-medium"
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
