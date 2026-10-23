import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ForbiddenPage() {
    const { user, role } = useAuth();

    const homeUrl = role === "ADMIN" ? "/admin/dashboard" : "/warehouse/products";

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-400">
                    <ShieldAlert size={36} />
                </div>
                <span className="text-xs font-bold tracking-widest text-red-400 uppercase bg-red-500/10 px-3 py-1 rounded-full">
                    Lỗi 403 · Truy cập bị từ chối
                </span>
                <h1 className="text-2xl font-bold text-white mt-4 mb-2">
                    Không có quyền truy cập
                </h1>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Tài khoản của bạn ({user?.email} - <strong className="text-slate-200">{role}</strong>) không được phép truy cập vào khu vực này theo chính sách phân quyền hệ thống.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700/50 text-sm font-medium transition cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Quay lại
                    </button>
                    <Link
                        to={homeUrl}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition shadow-lg shadow-emerald-900/30"
                    >
                        <Home size={16} /> Về trang của bạn
                    </Link>
                </div>
            </div>
        </div>
    );
}
