import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar/AdminTopbar";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminUsersPage from "./AdminUsersPage";
import AdminCategoriesPage from "./AdminCategoriesPage";
import AdminProfilePage from "./AdminProfilePage";
import "./admin.css";

const AdminPage = () => {
    return (
        <div className="app">
            <AdminSidebar />
            <main className="main">
                <AdminTopbar />
                <AdminDashboardPage />
                <AdminUsersPage />
                <AdminCategoriesPage />
                <AdminProfilePage />
            </main>
        </div>
    );
};

export default AdminPage;
