import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar/AdminTopbar";
import "../page/ad/admin.css";

const AdminLayout = () => {
    return (
        <div className="app">
            <AdminSidebar />
            <main className="main">
                <AdminTopbar />
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
