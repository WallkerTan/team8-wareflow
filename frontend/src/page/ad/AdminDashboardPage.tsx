import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Users,
    Truck,
    Package,
    FolderKanban,
    AlertTriangle,
    ArrowDownLeft,
    ArrowUpRight,
    Building2,
    ShieldCheck,
    Lock,
    RefreshCw,
    TrendingUp,
} from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import { adminService } from "../../api/services/adminService";
import type { AdminStatsResponse } from "../../types";
import { getErrorMessage } from "../../api/client";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<AdminStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await adminService.getStats();
            setStats(data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể tải số liệu thống kê hệ thống"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const barData = stats
        ? [
              { name: "Phiếu nhập DRAFT", count: stats.draftReceipts, color: "#f59e0b" },
              { name: "Phiếu nhập CONFIRMED", count: stats.confirmedReceipts, color: "#10b981" },
              { name: "Phiếu xuất DRAFT", count: stats.draftIssues, color: "#f97316" },
              { name: "Phiếu xuất CONFIRMED", count: stats.confirmedIssues, color: "#6366f1" },
              { name: "Vận đơn PENDING", count: stats.pendingShipments, color: "#06b6d4" },
          ]
        : [];

    const pieData = stats
        ? [
              { name: "Tồn kho bình thường", value: Math.max(0, stats.totalProducts - stats.lowStockProducts), color: "#10b981" },
              { name: "Cảnh báo Low Stock", value: stats.lowStockProducts, color: "#ef4444" },
          ]
        : [];

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                <div>
                    <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                        HỆ THỐNG QUẢN TRỊ TỔNG THỂ
                    </p>
                    <h1 className="text-2xl font-bold text-white mt-1">Bảng điều khiển Admin</h1>
                    <p className="text-slate-400 text-sm">
                        Theo dõi tổng quan tài nguyên hệ thống, tồn kho và tiến trình giao dịch.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadStats}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium border border-slate-700 transition cursor-pointer"
                    >
                        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                        Làm mới
                    </button>
                    <Link
                        to="/admin/users"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition shadow-lg shadow-emerald-950"
                    >
                        <Users size={16} /> Quản lý Users
                    </Link>
                </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Users */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Người dùng</span>
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                            <Users size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-extrabold text-white">
                            {loading ? "..." : stats?.totalUsers ?? 0}
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs">
                            <span className="text-emerald-400 flex items-center gap-1 font-medium">
                                <ShieldCheck size={13} /> {stats?.activeUsers ?? 0} hoạt động
                            </span>
                            <span className="text-slate-500">·</span>
                            <span className="text-red-400 flex items-center gap-1 font-medium">
                                <Lock size={13} /> {stats?.lockedUsers ?? 0} khóa
                            </span>
                        </div>
                    </div>
                </div>

                {/* Suppliers */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Nhà cung cấp</span>
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                            <Building2 size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-extrabold text-white">
                            {loading ? "..." : stats?.totalSuppliers ?? 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Đối tác cung ứng hàng hóa</p>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Danh mục</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <FolderKanban size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-extrabold text-white">
                            {loading ? "..." : stats?.totalCategories ?? 0}
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Phân loại hàng hóa trong kho</p>
                    </div>
                </div>

                {/* Products & Low Stock */}
                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Tổng sản phẩm</span>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                            <Package size={20} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-3xl font-extrabold text-white">
                            {loading ? "..." : stats?.totalProducts ?? 0}
                        </div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-400">
                            <AlertTriangle size={13} /> {stats?.lowStockProducts ?? 0} sắp hết hàng
                        </div>
                    </div>
                </div>
            </div>

            {/* Warehouse Flow Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                        <ArrowDownLeft size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-medium">Phiếu Nhập kho</div>
                        <div className="text-lg font-bold text-white mt-0.5">
                            {stats?.confirmedReceipts ?? 0} <span className="text-xs font-normal text-slate-400">đã duyệt</span> / {stats?.draftReceipts ?? 0} <span className="text-xs font-normal text-amber-400">nháp</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                        <ArrowUpRight size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-medium">Phiếu Xuất kho</div>
                        <div className="text-lg font-bold text-white mt-0.5">
                            {stats?.confirmedIssues ?? 0} <span className="text-xs font-normal text-slate-400">đã duyệt</span> / {stats?.draftIssues ?? 0} <span className="text-xs font-normal text-amber-400">nháp</span>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                        <Truck size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-medium">Vận chuyển chờ xử lý</div>
                        <div className="text-lg font-bold text-white mt-0.5">
                            {stats?.pendingShipments ?? 0} <span className="text-xs font-normal text-cyan-400">đơn PENDING</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <TrendingUp size={18} className="text-emerald-400" />
                            Tiến trình phiếu kho & Vận đơn
                        </h2>
                        <span className="text-xs text-slate-400">Thống kê thời gian thực</span>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} interval={0} angle={-10} textAnchor="end" />
                                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderColor: "#334155",
                                        borderRadius: "0.75rem",
                                        color: "#f8fafc",
                                    }}
                                />
                                <Bar dataKey="count" name="Số lượng" radius={[6, 6, 0, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                            <AlertTriangle size={18} className="text-amber-400" />
                            Tỷ lệ cảnh báo tồn kho
                        </h2>
                    </div>
                    <div className="h-64 flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`slice-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#0f172a",
                                        borderColor: "#334155",
                                        borderRadius: "0.75rem",
                                        color: "#f8fafc",
                                    }}
                                />
                                <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
}
