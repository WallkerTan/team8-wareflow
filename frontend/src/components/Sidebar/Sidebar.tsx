import { useLocation, useNavigate } from "react-router-dom";
import {
    Activity, ArrowDownToLine, ArrowRight, ArrowUpRight,
    Boxes, ChevronDown, CircleHelp, FileClock,
    LayoutDashboard, MoreHorizontal, Package, Settings2, Truck,
} from "lucide-react";

const navItems = [
    { label: "Tổng quan", icon: LayoutDashboard, path: "/warehouse" },
    { label: "Hàng hóa", icon: Package, path: "/warehouse/inventory" },
    { label: "Phiếu nhập", icon: ArrowDownToLine, path: "/warehouse/receipts" },
    { label: "Phiếu xuất", icon: ArrowUpRight, path: "/warehouse/issues" },
    { label: "Vận chuyển", icon: Truck, path: "/warehouse/shipping" },
    { label: "Lịch sử", icon: FileClock, path: "/warehouse/history" },
];

interface SidebarProps {
    mobileNav: boolean;
    setMobileNav: (open: boolean) => void;
}

export default function Sidebar({ mobileNav, setMobileNav }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

    const isActive = (path: string) => {
        if (path === "/warehouse") {
            return currentPath === "/warehouse" || currentPath === "/warehouse/";
        }
        return currentPath.startsWith(path);
    };

    return (
        <aside className={`wh-sidebar ${mobileNav ? "is-open" : ""}`}>
            <a className="wh-brand" href="/"><span className="brand-symbol"><Boxes size={19} strokeWidth={2.4}/></span><span>wareflow<small>WAREHOUSE OS</small></span></a>
            <div className="workspace-label">KHÔNG GIAN LÀM VIỆC</div>
            <button className="workspace-switch"><span className="workspace-avatar">M</span><span><b>Kho Minh Anh</b><small>Kho chính · 1 địa điểm</small></span><ChevronDown size={15}/></button>
            <div className="side-caption">VẬN HÀNH</div>
            <nav className="side-nav">{navItems.map(item => <button key={item.label} className={isActive(item.path) ? "active" : ""} onClick={() => { navigate(item.path); setMobileNav(false); }}><item.icon size={17}/><span>{item.label}</span>{item.label === "Phiếu nhập" && <i className="nav-count">3</i>}</button>)}</nav>
            <div className="side-caption tools-caption">CÔNG CỤ</div>
            <nav className="side-nav">
                <button onClick={() => navigate("/warehouse/reports")} className={isActive("/warehouse/reports") ? "active" : ""}><Activity size={17}/><span>Báo cáo</span></button>
                <button onClick={() => navigate("/warehouse/settings")} className={isActive("/warehouse/settings") ? "active" : ""}><Settings2 size={17}/><span>Cài đặt</span></button>
            </nav>
            <div className="sidebar-bottom">
                <div className="help-card"><span className="help-icon"><CircleHelp size={17}/></span><b>Cần hỗ trợ?</b><small>Đội ngũ Wareflow luôn sẵn sàng.</small><button>Trung tâm trợ giúp <ArrowRight size={13}/></button></div>
                <button className="profile-button" onClick={() => navigate("/warehouse/profile")}><span className="profile-avatar">MA</span><span><b>Minh Anh</b><small>Chủ kho</small></span><MoreHorizontal size={18}/></button>
            </div>
        </aside>
    );
}
