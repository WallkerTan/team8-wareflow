import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    Truck,
    Plus,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    RefreshCw,
    Loader2,
    AlertCircle,
    History,
    Edit3,
} from "lucide-react";
import { Modal } from "antd";
import { shipmentService } from "../../api/services/shipmentService";
import type { ShipmentFilterParams } from "../../api/services/shipmentService";
import { issueService } from "../../api/services/issueService";
import type {
    CreateShipmentRequest,
    IssueResponse,
    ShipmentLogResponse,
    ShipmentResponse,
    ShipmentStatus,
    UpdateShipmentStatusRequest,
} from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatDate, formatDateTime } from "../../api/formatters";

export default function ShippingPage() {
    const [shipments, setShipments] = useState<ShipmentResponse[]>([]);
    const [confirmedIssues, setConfirmedIssues] = useState<IssueResponse[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const size = 10;
    const [statusFilter, setStatusFilter] = useState<ShipmentStatus | "ALL">("ALL");
    const [issueIdFilter, setIssueIdFilter] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // Modal Create Shipment
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedIssueId, setSelectedIssueId] = useState<number | undefined>(undefined);
    const [carrierName, setCarrierName] = useState("Giao Hàng Nhanh");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [shipmentDate, setShipmentDate] = useState(new Date().toISOString().split("T")[0]);
    const [submitting, setSubmitting] = useState(false);

    // Modal Update Status
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [updatingShipment, setUpdatingShipment] = useState<ShipmentResponse | null>(null);
    const [nextStatus, setNextStatus] = useState<ShipmentStatus>("SHIPPING");
    const [statusNote, setStatusNote] = useState("");
    const [updateCarrier, setUpdateCarrier] = useState("");
    const [updateTracking, setUpdateTracking] = useState("");

    // Modal Timeline Logs
    const [isTimelineOpen, setIsTimelineOpen] = useState(false);
    const [timelineLogs, setTimelineLogs] = useState<ShipmentLogResponse[]>([]);
    const [selectedShipmentForLogs, setSelectedShipmentForLogs] = useState<ShipmentResponse | null>(null);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const loadConfirmedIssues = async () => {
        try {
            // Lấy các phiếu xuất CONFIRMED để sẵn sàng tạo vận đơn
            const res = await issueService.getIssues({ status: "CONFIRMED", size: 50 });
            setConfirmedIssues(res.content);
        } catch {
            // ignore
        }
    };

    const loadShipments = async (targetPage = page) => {
        setLoading(true);
        try {
            const params: ShipmentFilterParams = {
                page: targetPage,
                size,
                status: statusFilter === "ALL" ? undefined : statusFilter,
                issueId: issueIdFilter ? Number(issueIdFilter) : undefined,
            };
            const res = await shipmentService.getShipments(params);
            setShipments(res.content);
            setTotalElements(res.totalElements);
            setTotalPages(res.totalPages);
            setPage(res.page);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải danh sách vận đơn"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadConfirmedIssues();
    }, []);

    useEffect(() => {
        loadShipments(0);
    }, [statusFilter, size]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadShipments(0);
    };

    const handleOpenCreate = async () => {
        await loadConfirmedIssues();
        setSelectedIssueId(confirmedIssues[0]?.id);
        setCarrierName("Giao Hàng Nhanh");
        setTrackingNumber("GHN-" + Math.floor(100000 + Math.random() * 900000));
        setShipmentDate(new Date().toISOString().split("T")[0]);
        setIsCreateOpen(true);
    };

    const handleCreateShipment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedIssueId) {
            toast.error("Vui lòng chọn một phiếu xuất đã duyệt (CONFIRMED)");
            return;
        }

        setSubmitting(true);
        try {
            const payload: CreateShipmentRequest = {
                issueId: selectedIssueId,
                carrierName: carrierName.trim() || undefined,
                trackingNumber: trackingNumber.trim() || undefined,
                shipmentDate: shipmentDate || undefined,
            };
            await shipmentService.createShipment(payload);
            toast.success("Tạo vận đơn giao hàng thành công!");
            setIsCreateOpen(false);
            loadShipments(0);
        } catch (error) {
            // Backend chặn nếu phiếu xuất đã có shipment
            toast.error(getErrorMessage(error, "Không thể tạo vận đơn"));
        } finally {
            setSubmitting(false);
        }
    };

    const openStatusModal = (s: ShipmentResponse) => {
        setUpdatingShipment(s);
        // Gợi ý bước trạng thái tiếp theo
        if (s.status === "PENDING") {
            setNextStatus("SHIPPING");
        } else if (s.status === "SHIPPING") {
            setNextStatus("COMPLETED");
        } else {
            setNextStatus(s.status);
        }
        setStatusNote("");
        setUpdateCarrier(s.carrierName || "");
        setUpdateTracking(s.trackingNumber || "");
        setIsStatusModalOpen(true);
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!updatingShipment) return;

        setSubmitting(true);
        try {
            const payload: UpdateShipmentStatusRequest = {
                status: nextStatus,
                note: statusNote.trim() || undefined,
                carrierName: updateCarrier.trim() || undefined,
                trackingNumber: updateTracking.trim() || undefined,
            };
            await shipmentService.updateShipmentStatus(updatingShipment.id, payload);
            toast.success(`Đã cập nhật trạng thái vận đơn thành ${nextStatus}!`);
            setIsStatusModalOpen(false);
            loadShipments();
        } catch (error) {
            // Backend chặn nếu chuyển trạng thái không hợp lệ (ví dụ COMPLETED -> SHIPPING)
            toast.error(getErrorMessage(error, "Không thể cập nhật trạng thái"));
        } finally {
            setSubmitting(false);
        }
    };

    const openTimelineLogs = async (s: ShipmentResponse) => {
        setSelectedShipmentForLogs(s);
        setIsTimelineOpen(true);
        setLoadingLogs(true);
        try {
            const logs = await shipmentService.getShipmentLogs(s.id);
            setTimelineLogs(logs);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải lịch sử vận chuyển"));
        } finally {
            setLoadingLogs(false);
        }
    };

    const renderStatusBadge = (status: ShipmentStatus) => {
        switch (status) {
            case "PENDING":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock size={12} /> Chờ giao (PENDING)
                    </span>
                );
            case "SHIPPING":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <Truck size={12} /> Đang giao (SHIPPING)
                    </span>
                );
            case "COMPLETED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} /> Đã hoàn tất (COMPLETED)
                    </span>
                );
            case "CANCELLED":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        <XCircle size={12} /> Đã hủy (CANCELLED)
                    </span>
                );
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Truck className="text-blue-600" size={26} /> Quản lý Giao hàng & Vận đơn
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Khởi tạo vận đơn từ phiếu xuất đã duyệt, giám sát lộ trình và ghi nhận lịch sử trạng thái.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => loadShipments()}
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
                        <Plus size={16} /> Tạo vận đơn mới
                    </button>
                </div>
            </div>

            {/* Filter Tools */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
                <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-sm">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="number"
                            placeholder="Lọc theo ID phiếu xuất (Issue ID)..."
                            value={issueIdFilter}
                            onChange={(e) => setIssueIdFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-blue-500 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition cursor-pointer shadow-sm"
                    >
                        Lọc
                    </button>
                </form>

                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | "ALL")}
                        className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                    >
                        <option value="ALL">Tất cả trạng thái vận chuyển</option>
                        <option value="PENDING">PENDING (Chờ lấy hàng)</option>
                        <option value="SHIPPING">SHIPPING (Đang vận chuyển)</option>
                        <option value="COMPLETED">COMPLETED (Giao thành công)</option>
                        <option value="CANCELLED">CANCELLED (Đã hủy)</option>
                    </select>

                    <div className="text-xs text-slate-500">
                        Tổng: <strong className="text-slate-900 font-bold">{totalElements}</strong> vận đơn
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 text-xs uppercase tracking-wider font-semibold">
                                <th className="py-3.5 px-4 font-semibold">Mã vận đơn</th>
                                <th className="py-3.5 px-4 font-semibold">Phiếu xuất</th>
                                <th className="py-3.5 px-4 font-semibold">Đơn vị / Tracking</th>
                                <th className="py-3.5 px-4 font-semibold">Người nhận & Địa chỉ</th>
                                <th className="py-3.5 px-4 font-semibold">Ngày giao</th>
                                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-blue-600" />
                                            <span>Đang tải danh sách vận đơn...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : shipments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-500">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-400" />
                                        <span>Chưa có vận đơn nào được tạo.</span>
                                    </td>
                                </tr>
                            ) : (
                                shipments.map((s) => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition">
                                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                                            {s.shipmentNo}
                                        </td>
                                        <td className="py-3.5 px-4 text-xs">
                                            <div className="font-semibold text-slate-900">{s.issueNo || `Phiếu #${s.issueId}`}</div>
                                            <div className="text-slate-500">ID: {s.issueId}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs">
                                            <div className="font-semibold text-slate-800">{s.carrierName || "Tự vận chuyển"}</div>
                                            <div className="text-slate-500 font-mono">{s.trackingNumber || "Chưa có mã"}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-700">
                                            <div className="font-semibold text-slate-900">{s.receiverName || "-"}</div>
                                            <div className="text-slate-500 truncate max-w-[180px]">{s.receiverAddress || "-"}</div>
                                        </td>
                                        <td className="py-3.5 px-4 text-xs text-slate-500">
                                            {formatDate(s.shipmentDate)}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            {renderStatusBadge(s.status)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => openTimelineLogs(s)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition cursor-pointer"
                                                    title="Xem Timeline Lịch sử"
                                                >
                                                    <History size={13} /> Lịch sử
                                                </button>

                                                <button
                                                    onClick={() => openStatusModal(s)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                                                    title="Cập nhật trạng thái"
                                                >
                                                    <Edit3 size={13} /> Cập nhật
                                                </button>
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
                        Hiển thị <strong className="text-slate-900">{shipments.length}</strong> / <strong className="text-slate-900">{totalElements}</strong> vận đơn (Trang {page + 1}/{Math.max(1, totalPages)})
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => loadShipments(page - 1)}
                            disabled={page <= 0 || loading}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-700 transition cursor-pointer shadow-xs"
                        >
                            ← Trước
                        </button>
                        <span className="px-2 text-slate-900 font-bold">{page + 1}</span>
                        <button
                            onClick={() => loadShipments(page + 1)}
                            disabled={page >= totalPages - 1 || loading}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 disabled:opacity-40 text-slate-700 transition cursor-pointer shadow-xs"
                        >
                            Sau →
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Create Shipment */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Tạo vận đơn giao hàng mới</span>}
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                <form onSubmit={handleCreateShipment} className="space-y-4 mt-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                        Chỉ các phiếu xuất ở trạng thái <strong>CONFIRMED (Đã xuất kho)</strong> mới có thể tạo vận đơn (quan hệ 1-1).
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Chọn phiếu xuất hàng *
                        </label>
                        {confirmedIssues.length === 0 ? (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                                Hiện tại không có phiếu xuất nào đã CONFIRMED. Hãy tạo và duyệt phiếu xuất trước.
                            </div>
                        ) : (
                            <select
                                value={selectedIssueId ?? ""}
                                onChange={(e) => setSelectedIssueId(Number(e.target.value))}
                                required
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="">-- Chọn phiếu xuất --</option>
                                {confirmedIssues.map((iss) => (
                                    <option key={iss.id} value={iss.id}>
                                        {iss.issueNo} - Người nhận: {iss.receiverName} ({formatDate(iss.issueDate)})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Đơn vị vận chuyển
                            </label>
                            <input
                                type="text"
                                placeholder="Giao Hàng Nhanh / Viettel Post..."
                                value={carrierName}
                                onChange={(e) => setCarrierName(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Mã tracking / Vận đơn
                            </label>
                            <input
                                type="text"
                                placeholder="GHN-987654"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Ngày giao hàng dự kiến
                        </label>
                        <input
                            type="date"
                            value={shipmentDate}
                            onChange={(e) => setShipmentDate(e.target.value)}
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
                            disabled={submitting || confirmedIssues.length === 0}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer shadow-sm shadow-blue-500/20"
                        >
                            {submitting && <Loader2 size={16} className="animate-spin text-white" />}
                            Tạo vận đơn
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal Update Status */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Cập nhật trạng thái vận đơn</span>}
                open={isStatusModalOpen}
                onCancel={() => setIsStatusModalOpen(false)}
                footer={null}
                className="custom-dark-modal"
                destroyOnClose
            >
                {updatingShipment && (
                    <form onSubmit={handleUpdateStatus} className="space-y-4 mt-4">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                            <div>
                                <span className="text-slate-500">Vận đơn:</span>{" "}
                                <strong className="text-blue-600 font-mono">{updatingShipment.shipmentNo}</strong>
                            </div>
                            <div>
                                <span className="text-slate-500">Hiện tại:</span>{" "}
                                <strong className="text-slate-900">{updatingShipment.status}</strong>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Trạng thái mới *
                            </label>
                            <select
                                value={nextStatus}
                                onChange={(e) => setNextStatus(e.target.value as ShipmentStatus)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            >
                                <option value="PENDING">PENDING (Chờ lấy hàng)</option>
                                <option value="SHIPPING">SHIPPING (Đang vận chuyển)</option>
                                <option value="COMPLETED">COMPLETED (Đã giao thành công)</option>
                                <option value="CANCELLED">CANCELLED (Hủy giao hàng)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Ghi chú cập nhật lộ trình (sẽ được ghi vào log)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="vd: Hàng đã rời kho trung chuyển số 3..."
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Đơn vị vận chuyển
                                </label>
                                <input
                                    type="text"
                                    value={updateCarrier}
                                    onChange={(e) => setUpdateCarrier(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Mã tracking
                                </label>
                                <input
                                    type="text"
                                    value={updateTracking}
                                    onChange={(e) => setUpdateTracking(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => setIsStatusModalOpen(false)}
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
                                Cập nhật trạng thái
                            </button>
                        </div>
                    </form>
                )}
            </Modal>

            {/* Modal Timeline Logs */}
            <Modal
                title={<span className="text-slate-900 text-lg font-bold">Lịch sử Lộ trình Vận chuyển (Timeline Logs)</span>}
                open={isTimelineOpen}
                onCancel={() => setIsTimelineOpen(false)}
                footer={null}
                width={650}
                className="custom-dark-modal"
            >
                {selectedShipmentForLogs && (
                    <div className="space-y-4 mt-3">
                        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Vận đơn:</span>
                                <strong className="text-blue-600 font-mono">{selectedShipmentForLogs.shipmentNo}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Người nhận:</span>
                                <strong className="text-slate-900">{selectedShipmentForLogs.receiverName}</strong>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Địa chỉ:</span>
                                <span className="text-slate-700">{selectedShipmentForLogs.receiverAddress || "-"}</span>
                            </div>
                        </div>

                        {loadingLogs ? (
                            <div className="py-8 text-center text-slate-500">
                                <Loader2 size={24} className="animate-spin mx-auto text-blue-600 mb-2" />
                                <span>Đang tải lịch sử lộ trình...</span>
                            </div>
                        ) : timelineLogs.length === 0 ? (
                            <div className="py-8 text-center text-slate-500 text-xs">
                                Chưa có sự kiện thay đổi trạng thái nào được ghi lại.
                            </div>
                        ) : (
                            <div className="space-y-3 pl-2">
                                {timelineLogs.map((log, idx) => (
                                    <div key={log.id || idx} className="relative pl-6 pb-4 border-l-2 border-slate-200 last:border-l-0 last:pb-0">
                                        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white" />
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                    <span>{log.fromStatus || "TẠO MỚI"}</span>
                                                    <ArrowRight size={13} className="text-blue-600" />
                                                    <span className="text-blue-600">{log.toStatus}</span>
                                                </div>
                                                <span className="text-[11px] text-slate-500">
                                                    {formatDateTime(log.createdAt)}
                                                </span>
                                            </div>
                                            {log.note && (
                                                <p className="text-slate-700 mt-1 italic bg-white p-2 rounded-lg border border-slate-200">
                                                    "{log.note}"
                                                </p>
                                            )}
                                            {log.changedBy && (
                                                <div className="text-[10px] text-slate-500">
                                                    Thực hiện bởi User ID: #{log.changedBy}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setIsTimelineOpen(false)}
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
