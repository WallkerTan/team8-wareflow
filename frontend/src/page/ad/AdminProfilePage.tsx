import AdminProfileCard from "../../components/AdminProfile/AdminProfileCard";
import AdminPersonalInfoForm from "../../components/AdminProfile/AdminPersonalInfoForm";
import AdminSecurityForm from "../../components/AdminProfile/AdminSecurityForm";

export default function AdminProfilePage() {
    return (
        <section className="screen">
            <div className="heading">
                <div>
                    <p className="crumb">WAREFLOW / QUẢN TRỊ</p>
                    <h1>Profile</h1>
                    <p className="sub">
                        Quản lý thông tin cá nhân và cài đặt bảo mật tài khoản quản trị.
                    </p>
                </div>
                <button className="primary" type="button">
                    Lưu thay đổi
                </button>
            </div>
            <div className="profile-layout">
                <AdminProfileCard />
                <AdminPersonalInfoForm />
                <AdminSecurityForm />
            </div>
        </section>
    );
}
