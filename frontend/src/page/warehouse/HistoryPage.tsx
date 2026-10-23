import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    FileClock,
    ArrowDownLeft,
    ArrowUpRight,
    Eye,
    RefreshCw,
    Loader2,
    CheckCircle2,
    XCircle,
    Building2,
    User,
    AlertCircle,
} from "lucide-react";
import { Modal } from "antd";
import { receiptService } from "../../api/services/receiptService";
import { issueService } from "../../api/services/issueService";
import type { DocumentStatus, IssueResponse, ReceiptResponse } from "../../types";
import { getErrorMessage } from "../../api/client";
import { formatCurrency, formatDate } from "../../api/formatters";

export default function HistoryPage() {
    const [tab, setTab] = useState<"RECEIPTS" | "ISSUES">("RECEIPTS");
    const [receipts, setReceipts] = useState<ReceiptResponse[]>([]);
    const [issues, setIssues] = useState<IssueResponse[]>([]);
    const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("ALL");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loading, setLoading] = useState(false);

    // Modal detail
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<ReceiptResponse | null>(null);
    const [selectedIssue, setSelectedIssue] = useState<IssueResponse | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            if (tab === "RECEIPTS") {
                const res = await receiptService.getReceipts({
                    status: statusFilter === "ALL" ? undefined : statusFilter,
                    fromDate: fromDate || undefined,
                    toDate: toDate || undefined,
                    size: 50,
                });
                setReceipts(res.content);
            } else {
                const res = await issueService.getIssues({
                    status: statusFilter === "ALL" ? undefined : statusFilter,
                    fromDate: fromDate || undefined,
                    toDate: toDate || undefined,
                    size: 50,
                });
                setIssues(res.content);
            }
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải dữ liệu lịch sử"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [tab, statusFilter, fromDate, toDate]);

    const handleViewReceipt = async (id: number) => {
        try {
            const data = await receiptService.getReceipt(id);
            setSelectedReceipt(data);
            setSelectedIssue(null);
            setIsDetailOpen(true);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải chi tiết phiếu nhập"));
        }
    };

    const handleViewIssue = async (id: number) => {
        try {
            const data = await issueService.getIssue(id);
            setSelectedIssue(data);
            setSelectedReceipt(null);
            setIsDetailOpen(true);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải chi tiết phiếu xuất"));
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileClock className="text-amber-400" size={26} /> Lịch sử Giao dịch Kho
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Tra cứu toàn bộ lịch sử xuất - nhập kho, đối soát mặt hàng và hóa đơn điều phối.
                    </p>
                </div>
                <button
                    onClick={loadData}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition cursor-pointer"
                >
                    <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                    Làm mới
                </button>
            </div>

            {/* Tabs & Filters */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between shadow-lg">
                <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-xl border border-slate-700/80">
                    <button
                        onClick={() => setTab("RECEIPTS")}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            tab === "RECEIPTS"
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-950"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <ArrowDownLeft size={15} /> Lịch sử Nhập kho
                    </button>
                    <button
                        onClick={() => setTab("ISSUES")}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                            tab === "ISSUES"
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-950"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <ArrowUpRight size={15} /> Lịch sử Xuất kho
                    </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as DocumentStatus | "ALL")}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="CONFIRMED">Đã duyệt (CONFIRMED)</option>
                        <option value="DRAFT">Bản nháp (DRAFT)</option>
                        <option value="CANCELLED">Đã hủy (CANCELLED)</option>
                    </select>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <span>Từ:</span>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                        />
                        <span>Đến:</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="py-3.5 px-4 font-semibold">Mã chứng từ</th>
                                <th className="py-3.5 px-4 font-semibold">
                                    {tab === "RECEIPTS" ? "Nhà cung cấp" : "Người nhận hàng"}
                                </th>
                                <th className="py-3.5 px-4 font-semibold">Ngày thực hiện</th>
                                <th className="py-3.5 px-4 font-semibold">Số mặt hàng</th>
                                <th className="py-3.5 px-4 font-semibold">Trạng thái</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 size={24} className="animate-spin text-amber-400" />
                                            <span>Đang tải lịch sử giao dịch...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading && tab === "RECEIPTS" && receipts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-500" />
                                        <span>Không có phiếu nhập kho nào trong giai đoạn này.</span>
                                    </td>
                                </tr>
                            )}

                            {!loading && tab === "RECEIPTS" && receipts.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-700/30 transition">
                                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                                        {r.receiptNo}
                                    </td>
                                    <td className="py-3.5 px-4 text-white">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={14} className="text-slate-400" />
                                            <span>{r.supplierName || `NCC #${r.supplierId}`}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-xs text-slate-300">
                                        {formatDate(r.receiptDate)}
                                    </td>
                                    <td className="py-3.5 px-4 text-xs text-slate-300">
                                        <strong>{r.items?.length || 0}</strong> sản phẩm
                                    </td>
                                    <td className="py-3.5 px-4">
                                        {r.status === "CONFIRMED" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                <CheckCircle2 size={12} /> Đã nhập kho
                                            </span>
                                        ) : r.status === "DRAFT" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                Bản nháp
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-400 border border-slate-600">
                                                <XCircle size={12} /> Đã hủy
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            onClick={() => handleViewReceipt(r.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                                        >
                                            <Eye size={13} /> Xem phiếu
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {!loading && tab === "ISSUES" && issues.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <AlertCircle size={28} className="mx-auto mb-2 text-slate-500" />
                                        <span>Không có phiếu xuất kho nào trong giai đoạn này.</span>
                                    </td>
                                </tr>
                            )}

                            {!loading && tab === "ISSUES" && issues.map((iss) => (
                                <tr key={iss.id} className="hover:bg-slate-700/30 transition">
                                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                                        {iss.issueNo}
                                    </td>
                                    <td className="py-3.5 px-4 text-white">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-slate-400" />
                                            <span>{iss.receiverName}</span>
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-xs text-slate-300">
                                        {formatDate(iss.issueDate)}
                                    </td>
                                    <td className="py-3.5 px-4 text-xs text-slate-300">
                                        <strong>{iss.items?.length || 0}</strong> sản phẩm
                                    </td>
                                    <td className="py-3.5 px-4">
                                        {iss.status === "CONFIRMED" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                                                <CheckCircle2 size={12} /> Đã xuất kho
                                            </span>
                                        ) : iss.status === "DRAFT" ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                Bản nháp
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-400 border border-slate-600">
                                                <XCircle size={12} /> Đã hủy
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <button
                                            onClick={() => handleViewIssue(iss.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
                                        >
                                            <Eye size={13} /> Xem phiếu
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail */}
            <Modal
                title={<span className="text-white text-lg font-bold">Chi tiết Lịch sử Phiếu</span>}
                open={isDetailOpen}
                onCancel={() => setIsDetailOpen(false)}
                footer={null}
                width={680}
                className="custom-dark-modal"
            >
                {selectedReceipt && (
                    <div className="space-y-4 mt-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 text-xs">
                            <div>
                                <span className="text-slate-400 block">Mã phiếu nhập:</span>
                                <strong className="text-emerald-400 font-mono">{selectedReceipt.receiptNo}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Trạng thái:</span>
                                <strong className="text-white">{selectedReceipt.status}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Nhà cung cấp:</span>
                                <strong className="text-white">{selectedReceipt.supplierName}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Ngày nhập:</span>
                                <strong className="text-white">{formatDate(selectedReceipt.receiptDate)}</strong>
                            </div>
                        </div>

                        <div className="border border-slate-700/80 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 uppercase">
                                    <tr>
                                        <th className="py-2 px-3">Sản phẩm</th>
                                        <th className="py-2 px-3">Mã SKU</th>
                                        <th className="py-2 px-3 text-right">Số lượng</th>
                                        <th className="py-2 px-3 text-right">Đơn giá</th>
                                        <th className="py-2 px-3 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {selectedReceipt.items?.map((it, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/40">
                                            <td className="py-2 px-3 text-white font-medium">{it.productName}</td>
                                            <td className="py-2 px-3 font-mono text-emerald-400">{it.sku}</td>
                                            <td className="py-2 px-3 text-right font-bold text-white">{it.quantity}</td>
                                            <td className="py-2 px-3 text-right text-slate-300">{formatCurrency(it.unitPrice)}</td>
                                            <td className="py-2 px-3 text-right font-bold text-emerald-400">
                                                {formatCurrency(it.totalPrice || (it.unitPrice || 0) * it.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {selectedIssue && (
                    <div className="space-y-4 mt-3">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-700/80 text-xs">
                            <div>
                                <span className="text-slate-400 block">Mã phiếu xuất:</span>
                                <strong className="text-indigo-400 font-mono">{selectedIssue.issueNo}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Trạng thái:</span>
                                <strong className="text-white">{selectedIssue.status}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Người nhận:</span>
                                <strong className="text-white">{selectedIssue.receiverName}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 block">Ngày xuất:</span>
                                <strong className="text-white">{formatDate(selectedIssue.issueDate)}</strong>
                            </div>
                        </div>

                        <div className="border border-slate-700/80 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-900 border-b border-slate-700 text-slate-400 uppercase">
                                    <tr>
                                        <th className="py-2 px-3">Sản phẩm</th>
                                        <th className="py-2 px-3">Mã SKU</th>
                                        <th className="py-2 px-3 text-right">Số lượng</th>
                                        <th className="py-2 px-3 text-right">Đơn giá</th>
                                        <th className="py-2 px-3 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {selectedIssue.items?.map((it, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/40">
                                            <td className="py-2 px-3 text-white font-medium">{it.productName}</td>
                                            <td className="py-2 px-3 font-mono text-indigo-400">{it.sku}</td>
                                            <td className="py-2 px-3 text-right font-bold text-white">{it.quantity}</td>
                                            <td className="py-2 px-3 text-right text-slate-300">{formatCurrency(it.unitPrice)}</td>
                                            <td className="py-2 px-3 text-right font-bold text-indigo-400">
                                                {formatCurrency(it.totalPrice || (it.unitPrice || 0) * it.quantity)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}
