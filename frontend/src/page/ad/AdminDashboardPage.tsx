import AdminStatCards from "../../components/AdminDashboard/AdminStatCards";
import AdminActivityChart from "../../components/AdminDashboard/AdminActivityChart";
import AdminQuickActions from "../../components/AdminDashboard/AdminQuickActions";
import AdminRecentActivity from "../../components/AdminDashboard/AdminRecentActivity";

export default function AdminDashboardPage() {
    return (
        <section className="screen">
            <div className="heading">
                <div>
                    <p className="crumb">WAREFLOW / ADMIN</p>
                    <h1>Dashboard</h1>
                    <p className="sub">
                        Tổng quan hoạt động của toàn bộ hệ thống kho hàng.
                    </p>
                </div>
                <button className="primary" type="button">
                    ＋ Tạo báo cáo
                </button>
            </div>
            <AdminStatCards />
            <div className="two-col">
                <AdminActivityChart />
                <AdminQuickActions />
            </div>
            <AdminRecentActivity />
        </section>
    );
}
