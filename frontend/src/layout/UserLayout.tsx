import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Command } from "lucide-react";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar/Topbar";
import "./userLayout.css";
import "./workspaceScreens.css";
import "./statisticsDetail.css";
import "./workflowDetails.css";
import "./chartMotion.css";
import "./statsList.css";

export default function UserLayout() {
    const [mobileNav, setMobileNav] = useState(false);

    return (
        <div className="wh-app">
            <Sidebar mobileNav={mobileNav} setMobileNav={setMobileNav} />
            {mobileNav && (
                <button
                    aria-label="Đóng menu"
                    className="nav-scrim"
                    onClick={() => setMobileNav(false)}
                />
            )}
            <main className="wh-main">
                <Topbar setMobileNav={setMobileNav} />
                <div className="wh-content">
                    <Outlet />
                    <footer className="wh-footer">
                        <span>© 2026 Wareflow <i>·</i> Vận hành kho nhẹ nhàng hơn.</span>
                        <span><span className="footer-status" /> Tất cả hệ thống hoạt động tốt</span>
                        <button><Command size={13} /> Phím tắt</button>
                    </footer>
                </div>
            </main>
        </div>
    );
}
