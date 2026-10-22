import AdminUserStats from "../../components/AdminUsers/AdminUserStats";
import AdminUserTable from "../../components/AdminUsers/AdminUserTable";

export default function AdminUsersPage() {
    return (
        <section className="screen">
            <div className="heading">
                <div>
                    <p className="crumb">WAREFLOW / QUẢN TRỊ</p>
                    <h1>Quản lý Users</h1>
                    <p className="sub">
                        Quản lý tài khoản và phân quyền người dùng trong hệ thống.
                    </p>
                </div>
                <button className="primary" type="button">
                    ＋ Thêm user
                </button>
            </div>
            <AdminUserStats />
            <AdminUserTable />
        </section>
    );
}
