import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowDownToLine,
    ArrowUpRight,
    Boxes,
    FileClock,
    LogOut,
    Package,
    Truck,
    User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
    mobileNav: boolean;
    setMobileNav: (open: boolean) => void;
}

export default function Sidebar({ mobileNav, setMobileNav }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { user, logout } = useAuth();

    const isActive = (path: string) => {
        if (path === "/warehouse/products") {
            return currentPath === "/warehouse/products" || currentPath === "/warehouse/inventory";
        }
        if (path === "/warehouse/shipments") {
            return currentPath === "/warehouse/shipments" || currentPath === "/warehouse/shipping";
        }
        if (path === "/warehouse") {
            return currentPath === "/warehouse" || currentPath === "/warehouse/";
        }
        return currentPath.startsWith(path);
    };

    const handleLogout = async () => {
        await logout();
        toast.success("Đã đăng xuất khỏi hệ thống");
        navigate("/login", { replace: true });
    };

    const navItems = [
        { label: "Sản phẩm & Tồn kho", icon: Package, path: "/warehouse/products" },
        { label: "Phiếu nhập kho", icon: ArrowDownToLine, path: "/warehouse/receipts" },
        { label: "Phiếu xuất kho", icon: ArrowUpRight, path: "/warehouse/issues" },
        { label: "Giao hàng & Vận đơn", icon: Truck, path: "/warehouse/shipments" },
        { label: "Lịch sử kho", icon: FileClock, path: "/warehouse/history" },
    ];

    return (
        <aside className={`wh-sidebar ${mobileNav ? "is-open" : ""}`}>
            <a className="wh-brand" href="/warehouse/products">
                <span className="brand-symbol">
                    <Boxes size={19} strokeWidth={2.4} />
                </span>
                <span>
                    wareflow<small>WAREHOUSE OWNER</small>
                </span>
            </a>

            <div className="workspace-label">KHÔNG GIAN LÀM VIỆC</div>
            <div className="workspace-switch">
                <span className="workspace-avatar">
                    {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "K"}
                </span>
                <span className="overflow-hidden">
                    <b className="truncate block">{user?.fullName || "Chủ kho WareFlow"}</b>
                    <small className="truncate block">{user?.email || "owner@wareflow.com"}</small>
                </span>
            </div>

            <div className="side-caption">VẬN HÀNH KHO</div>
            <nav className="side-nav">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={isActive(item.path) ? "active" : ""}
                        onClick={() => {
                            navigate(item.path);
                            setMobileNav(false);
                        }}
                    >
                        <item.icon size={17} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="side-caption tools-caption">TÀI KHOẢN</div>
            <nav className="side-nav">
                <button
                    onClick={() => {
                        navigate("/warehouse/profile");
                        setMobileNav(false);
                    }}
                    className={isActive("/warehouse/profile") ? "active" : ""}
                >
                    <User size={17} />
                    <span>Hồ sơ cá nhân</span>
                </button>
            </nav>

            <div className="sidebar-bottom">
                <button
                    className="profile-button w-full cursor-pointer hover:bg-red-500/10 transition"
                    onClick={handleLogout}
                >
                    <span className="profile-avatar bg-red-500/20 text-red-400">
                        <LogOut size={16} />
                    </span>
                    <span className="text-left">
                        <b className="text-red-400">Đăng xuất</b>
                        <small>Thoát phiên làm việc</small>
                    </span>
                </button>
            </div>
        </aside>
    );
}
