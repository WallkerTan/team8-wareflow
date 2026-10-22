import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/ProfileCards/InfoCard";
import UpdateProfileCard from "../../components/ProfileCards/UpdateProfileCard";
import ChangePasswordCard from "../../components/ProfileCards/ChangePasswordCard";
import type { UserProfile } from "../../components/ProfileCards/types";
import "./ProfilePage.css";

const MOCK_USER: UserProfile = {
    full_name: "Nguyễn Văn Minh",
    email: "minh.nguyen@wareflow.vn",
    role: "owner",
};

const ProfilePage: React.FC = () => {
    const [user, setUser] = useState<UserProfile>(MOCK_USER);
    const navigate = useNavigate();

    const handleProfileSave = (data: Pick<UserProfile, "full_name" | "email">) => {
        setUser((prev) => ({ ...prev, ...data }));
    };

    const handleLogout = () => {
        // TODO: clear auth token / session trước khi redirect
        navigate("/");
    };

    return (
        <div className="profile-page">
            <div className="blob blob-1" />
            <div className="blob blob-2" />

            {/* Header */}
            <div className="profile-header">
                <div className="profile-header-row">
                    <div>
                        <div className="breadcrumb">
                            <span>Kho hàng</span>
                            <span className="breadcrumb-sep">›</span>
                            <span className="breadcrumb-active">Hồ sơ cá nhân</span>
                        </div>
                        <h1 className="page-title">Hồ sơ cá nhân</h1>
                        <p className="page-subtitle">Quản lý thông tin tài khoản và bảo mật của bạn</p>
                    </div>

                    <button
                        id="logout-btn"
                        className="btn-logout"
                        onClick={handleLogout}
                        aria-label="Đăng xuất"
                    >
                        <span className="logout-icon">⎋</span>
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* 2-column grid */}
            <div className="profile-grid">
                <div className="profile-col">
                    <InfoCard user={user} />
                    <UpdateProfileCard user={user} onSave={handleProfileSave} />
                </div>

                <div className="profile-col">
                    <ChangePasswordCard />

                    {/* Mẹo bảo mật */}
                    <div className="profile-card tips-card">
                        <div className="card-header">
                            <div className="card-title-group">
                                <span className="card-icon tips-icon">💡</span>
                                <div>
                                    <h2 className="card-title">Mẹo bảo mật</h2>
                                    <p className="card-subtitle">Giữ tài khoản an toàn</p>
                                </div>
                            </div>
                        </div>
                        <ul className="tips-list">
                            <li><span className="tip-dot tip-blue" />Sử dụng mật khẩu ít nhất <b>12 ký tự</b></li>
                            <li><span className="tip-dot tip-green" />Kết hợp chữ hoa, số và ký tự đặc biệt</li>
                            <li><span className="tip-dot tip-orange" />Không dùng mật khẩu giống nhau trên nhiều trang</li>
                            <li><span className="tip-dot tip-blue" />Đổi mật khẩu định kỳ mỗi <b>3 tháng</b></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
