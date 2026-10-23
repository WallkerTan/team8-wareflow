import { useLocation, Link } from "react-router-dom";
import { Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const routeLabels: Record<string, string> = {
    "/warehouse": "Hàng hóa & Tồn kho",
    "/warehouse/products": "Hàng hóa & Tồn kho",
    "/warehouse/inventory": "Hàng hóa & Tồn kho",
    "/warehouse/receipts": "Phiếu nhập kho",
    "/warehouse/issues": "Phiếu xuất kho",
    "/warehouse/shipments": "Giao hàng & Vận đơn",
    "/warehouse/shipping": "Giao hàng & Vận đơn",
    "/warehouse/history": "Lịch sử kho",
    "/warehouse/profile": "Hồ sơ cá nhân",
};

interface TopbarProps {
    setMobileNav: (open: boolean) => void;
}

export default function Topbar({ setMobileNav }: TopbarProps) {
    const location = useLocation();
    const { user } = useAuth();
    const activeLabel = routeLabels[location.pathname] || "Vận hành kho";

    return (
        <header className="wh-topbar">
            <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Mở menu">
                <Menu size={20} />
            </button>
            <div className="breadcrumbs">
                <span>WareFlow</span>
                <span className="crumb-slash">/</span>
                <b>{activeLabel}</b>
            </div>
            <div className="top-actions">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>Chủ kho (WAREHOUSE_OWNER)</span>
                </div>
                <Link
                    to="/warehouse/profile"
                    className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-white transition px-2 py-1 rounded-lg hover:bg-slate-800"
                >
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span className="hidden md:inline">{user?.fullName || "Chủ kho"}</span>
                </Link>
            </div>
        </header>
    );
}
