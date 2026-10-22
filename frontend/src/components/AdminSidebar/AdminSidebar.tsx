import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        if (path === "/admin") {
            return currentPath === "/admin" || currentPath === "/admin/" || currentPath === "/admin/dashboard";
        }
        return currentPath.startsWith(path);
    };

    return (
        <aside className="sidebar">
            <Link className="logo" to="/admin" title="Wareflow Admin">
                <span>W</span>
                <strong>
                    ware<span>flow</span>
                </strong>
                <small>ADMIN</small>
            </Link>
            <div className="admin-box">
                <span className="avatar">AD</span>
                <div>
                    <b>Admin Portal</b>
                    <small>Quản trị hệ thống</small>
                </div>
                <i>⌄</i>
            </div>
            <p className="nav-title">TỔNG QUAN</p>
            <nav>
                <Link
                    className={`nav-link ${isActive("/admin") && !isActive("/admin/users") && !isActive("/admin/categories") ? "active" : ""}`}
                    to="/admin"
                >
                    <b>▦</b>Dashboard
                </Link>
                <Link
                    className={`nav-link ${isActive("/admin/users") ? "active" : ""}`}
                    to="/admin/users"
                >
                    <b>♙</b>Quản lý Users <em>24</em>
                </Link>
                <Link
                    className={`nav-link ${isActive("/admin/categories") ? "active" : ""}`}
                    to="/admin/categories"
                >
                    <b>◇</b>Danh mục
                </Link>
            </nav>
            <p className="nav-title">HỆ THỐNG</p>
            <nav>
                <Link
                    className={`nav-link ${isActive("/admin/profile") ? "active" : ""}`}
                    to="/admin/profile"
                >
                    <b>◎</b>Profile
                </Link>
                <Link
                    className={`nav-link ${isActive("/admin/settings") ? "active" : ""}`}
                    to="/admin/profile"
                >
                    <b>⚙</b>Cài đặt
                </Link>
            </nav>
            <div className="sidebar-bottom">
                <div className="support">
                    <b>Cần hỗ trợ?</b>
                    <p>Liên hệ đội ngũ Wareflow khi cần giúp đỡ.</p>
                    <a href="mailto:support@wareflow.vn">Liên hệ ngay →</a>
                </div>
                <Link className="logout" to="/auth/login">
                    ↪ Đăng xuất
                </Link>
            </div>
        </aside>
    );
}
