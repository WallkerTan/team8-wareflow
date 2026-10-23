import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminTopbar() {
    const { user } = useAuth();

    return (
        <header className="topbar w-full flex items-center justify-between gap-4">
            {/* Bên trái: logo + badge quyền admin */}
            <div className="flex items-center gap-3 min-w-0">
                <Link to="/admin" className="mobile-logo logo">
                    <strong className="flex">
                        ware<div className="text-blue-500">flow</div>
                    </strong>
                </Link>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 whitespace-nowrap">
                    <Shield size={13} className="text-indigo-400" />
                    <span>Quyền Quản trị viên (ADMIN)</span>
                </div>
            </div>
            
            {/* Bên phải: tên người dùng, rồi avatar nằm ngoài cùng bên phải */}
            <Link
                to="/admin/profile"
                className="flex items-center gap-3 min-w-0"
                style={{ textDecoration: "none" }}
            >
                <span className="flex flex-col text-right min-w-0">
                    <b className="truncate">{user?.fullName || "Admin"}</b>
                    <small className="truncate">
                        {user?.email || "admin@wareflow.com"}
                    </small>
                </span>
                <span className="avatar shrink-0">
                    {user?.fullName
                        ? user.fullName.charAt(0).toUpperCase()
                        : "AD"}
                </span>
            </Link>
        </header>
    );
}
