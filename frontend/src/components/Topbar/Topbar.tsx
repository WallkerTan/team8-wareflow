import { useLocation } from "react-router-dom";
import { Bell, Clock3, Menu, Search } from "lucide-react";

const routeLabels: Record<string, string> = {
    "/warehouse": "Tổng quan",
    "/warehouse/inventory": "Hàng hóa",
    "/warehouse/receipts": "Phiếu nhập",
    "/warehouse/issues": "Phiếu xuất",
    "/warehouse/shipping": "Vận chuyển",
    "/warehouse/history": "Lịch sử",
    "/warehouse/reports": "Báo cáo",
    "/warehouse/settings": "Cài đặt",
    "/warehouse/statistics": "Thống kê",
    "/warehouse/profile": "Hồ sơ cá nhân",
};

interface TopbarProps {
    setMobileNav: (open: boolean) => void;
}

export default function Topbar({ setMobileNav }: TopbarProps) {
    const location = useLocation();
    const activeLabel = routeLabels[location.pathname] || "Tổng quan";

    return (
        <header className="wh-topbar">
            <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Mở menu"><Menu size={20}/></button>
            <div className="breadcrumbs"><span>Kho Minh Anh</span><span className="crumb-slash">/</span><b>{activeLabel}</b></div>
            <div className="top-actions">
                <button className="search-shortcut" onClick={() => document.getElementById("product-search")?.focus()}><Search size={15}/><span>Tìm nhanh</span><kbd>⌘ K</kbd></button>
                <button className="icon-action" aria-label="Thông báo"><Bell size={18}/><i/></button>
                <span className="top-divider"/>
                <button className="top-date"><Clock3 size={15}/> Thứ Ba, 21 Tháng 10, 2026</button>
            </div>
        </header>
    );
}
