import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminTopbar() {
    const { user } = useAuth();

    return (
        <header className="topbar">
            <Link to="/admin" className="mobile-logo logo">
                <span>W</span>
                <strong>
                    ware<span>flow</span>
                </strong>
            </Link>
            <div className="top-right">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
                    <Shield size={13} className="text-indigo-400" />
                    <span>Quyền Quản trị viên (ADMIN)</span>
                </div>
                <Link to="/admin/profile" className="user" style={{ textDecoration: "none" }}>
                    <span className="avatar">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "AD"}
                    </span>
                    <span>
                        <b>{user?.fullName || "Admin"}</b>
                        <small>{user?.email || "admin@wareflow.com"}</small>
                    </span>
                </Link>
            </div>
        </header>
    );
}
