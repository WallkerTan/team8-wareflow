import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, Building2, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function AdminSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const isActive = (path: string) => {
        if (path === "/admin" || path === "/admin/dashboard") {
            return currentPath === "/admin" || currentPath === "/admin/" || currentPath === "/admin/dashboard";
        }
        return currentPath.startsWith(path);
    };

    const handleLogout = async () => {
        await logout();
        toast.success("Đã đăng xuất khỏi hệ thống");
        navigate("/login", { replace: true });
    };

    return (
        <aside className="sidebar">
            <Link className="logo" to="/admin" title="Wareflow Admin">
                <span>WF</span>
                <strong className="flex">
                    ware<div className="text-blue-500">flow</div>
                </strong>
                <small>ADMIN</small>
            </Link>

            <div className="admin-box">
                <span className="avatar">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "AD"}
                </span>
                <div className="overflow-hidden">
                    <b className="truncate block">{user?.fullName || "Admin Portal"}</b>
                    <small className="truncate block">{user?.email || "admin@wareflow.com"}</small>
                </div>
            </div>

            <p className="nav-title">TỔNG QUAN</p>
            <nav>
                <Link
                    className={`nav-link ${isActive("/admin") && !isActive("/admin/users") && !isActive("/admin/categories") && !isActive("/admin/suppliers") ? "active" : ""}`}
                    to="/admin/dashboard"
                >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                </Link>
                <Link
                    className={`nav-link ${isActive("/admin/users") ? "active" : ""}`}
                    to="/admin/users"
                >
                    <Users size={16} />
                    <span>Quản lý Users</span>
                </Link>
                <Link
                    className={`nav-link ${isActive("/admin/categories") ? "active" : ""}`}
                    to="/admin/categories"
                >
                    <FolderKanban size={16} />
                    <span>Danh mục</span>
                </Link>
                <Link
                    className={`nav-link ${isActive("/admin/suppliers") ? "active" : ""}`}
                    to="/admin/suppliers"
                >
                    <Building2 size={16} />
                    <span>Nhà cung cấp</span>
                </Link>
            </nav>

            <p className="nav-title">TÀI KHOẢN</p>
            <nav>
                <Link
                    className={`nav-link ${isActive("/admin/profile") ? "active" : ""}`}
                    to="/admin/profile"
                >
                    <User size={16} />
                    <span>Hồ sơ cá nhân</span>
                </Link>
            </nav>

            <div className="sidebar-bottom">
                <div className="support">
                    <b>Hệ thống WareFlow</b>
                    <p>Phiên bản 2.0 · Phân hệ Quản trị</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="logout flex items-center justify-center gap-2 w-full text-left cursor-pointer hover:bg-red-500/10 hover:text-red-400 transition"
                    type="button"
                >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}
