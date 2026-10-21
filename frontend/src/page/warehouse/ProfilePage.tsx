import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

interface UserProfile {
    full_name: string;
    email: string;
    role: string;
}

const MOCK_USER: UserProfile = {
    full_name: "Nguyễn Văn Minh",
    email: "minh.nguyen@wareflow.vn",
    role: "owner",
};

const roleLabel: Record<string, string> = {
    owner: "Chủ kho",
    admin: "Quản trị viên",
    staff: "Nhân viên",
};

const getInitials = (name: string) =>
    name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();

// ─── W17: Thông tin cá nhân ───────────────────────────────────────────────────
const InfoCard: React.FC<{ user: UserProfile }> = ({ user }) => (
    <div className="profile-card info-card">
        <div className="card-header">
            <div className="card-title-group">
                <span className="card-icon">👤</span>
                <div>
                    <h2 className="card-title">Thông tin cá nhân</h2>
                    <p className="card-subtitle">Hồ sơ tài khoản của bạn</p>
                </div>
            </div>
        </div>

        <div className="avatar-section">
            <div className="avatar-ring">
                <div className="avatar-circle">{getInitials(user.full_name)}</div>
            </div>
            <div className="avatar-info">
                <h3 className="avatar-name">{user.full_name}</h3>
                <span className="role-badge">{roleLabel[user.role] ?? user.role}</span>
            </div>
        </div>

        <div className="info-grid">
            <div className="info-row">
                <span className="info-label">
                    <i className="icon-sm">◆</i>Họ và tên
                </span>
                <span className="info-value">{user.full_name}</span>
            </div>
            <div className="divider" />
            <div className="info-row">
                <span className="info-label">
                    <i className="icon-sm">✉</i>Email
                </span>
                <span className="info-value">{user.email}</span>
            </div>
            <div className="divider" />
            <div className="info-row">
                <span className="info-label">
                    <i className="icon-sm">◆</i>Vai trò
                </span>
                <span className="info-value">{roleLabel[user.role] ?? user.role}</span>
            </div>
        </div>
    </div>
);

// ─── W18: Cập nhật hồ sơ ─────────────────────────────────────────────────────
const UpdateProfileCard: React.FC<{
    user: UserProfile;
    onSave: (data: Pick<UserProfile, "full_name" | "email">) => void;
}> = ({ user, onSave }) => {
    const [fullName, setFullName] = useState(user.full_name);
    const [email, setEmail] = useState(user.email);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        if (!fullName.trim() || !email.trim()) {
            setError("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        setSaving(true);
        try {
            // TODO: PUT /api/me
            await new Promise((r) => setTimeout(r, 900));
            onSave({ full_name: fullName, email });
            setSuccess(true);
        } catch {
            setError("Cập nhật thất bại. Thử lại sau.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-card update-card">
            <div className="card-header">
                <div className="card-title-group">
                    <span className="card-icon edit-icon">✏️</span>
                    <div>
                        <h2 className="card-title">Cập nhật hồ sơ</h2>
                        <p className="card-subtitle">Chỉnh sửa thông tin cá nhân</p>
                    </div>
                </div>
            </div>

            <form id="update-profile-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                    <label htmlFor="full_name" className="form-label">Họ và tên</label>
                    <div className="input-wrap">
                        <span className="input-icon">◆</span>
                        <input
                            id="full_name"
                            type="text"
                            className="form-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="VD: Nguyễn Văn An"
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="profile_email" className="form-label">Email</label>
                    <div className="input-wrap">
                        <span className="input-icon">✉</span>
                        <input
                            id="profile_email"
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="VD: ten@congty.vn"
                            disabled={saving}
                        />
                    </div>
                </div>

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">✓ Cập nhật hồ sơ thành công!</p>}

                <button
                    id="save-profile-btn"
                    type="submit"
                    className={"btn-primary" + (saving ? " loading" : "")}
                    disabled={saving}
                >
                    {saving ? <><span className="spinner" /> Đang lưu…</> : "Lưu thay đổi →"}
                </button>
            </form>
        </div>
    );
};

// ─── W19: Đổi mật khẩu ───────────────────────────────────────────────────────
const ChangePasswordCard: React.FC = () => {
    const [oldPwd, setOldPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const getStrength = (pwd: string) => {
        if (!pwd.length) return 0;
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strengthLabels = ["", "Yếu", "Trung bình", "Tốt", "Mạnh"];
    const strengthClasses = ["", "weak", "medium", "good", "strong"];
    const newStrength = getStrength(newPwd);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        if (!oldPwd || !newPwd || !confirmPwd) {
            setError("Vui lòng điền đầy đủ các trường.");
            return;
        }
        if (newPwd.length < 8) {
            setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
            return;
        }
        if (newPwd !== confirmPwd) {
            setError("Xác nhận mật khẩu không khớp.");
            return;
        }
        setSaving(true);
        try {
            // TODO: PATCH /api/me/password
            await new Promise((r) => setTimeout(r, 900));
            setSuccess(true);
            setOldPwd(""); setNewPwd(""); setConfirmPwd("");
        } catch {
            setError("Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu cũ.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-card password-card">
            <div className="card-header">
                <div className="card-title-group">
                    <span className="card-icon lock-icon">🔒</span>
                    <div>
                        <h2 className="card-title">Đổi mật khẩu</h2>
                        <p className="card-subtitle">Bảo mật tài khoản của bạn</p>
                    </div>
                </div>
            </div>

            <form id="change-password-form" onSubmit={handleSubmit} noValidate>
                {/* Mật khẩu hiện tại */}
                <div className="form-group">
                    <label htmlFor="old_password" className="form-label">Mật khẩu hiện tại</label>
                    <div className="input-wrap">
                        <span className="input-icon">🔑</span>
                        <input
                            id="old_password"
                            type={showOld ? "text" : "password"}
                            className="form-input"
                            value={oldPwd}
                            onChange={(e) => setOldPwd(e.target.value)}
                            placeholder="Mật khẩu hiện tại"
                            disabled={saving}
                        />
                        <button type="button" className="eye-btn" onClick={() => setShowOld(v => !v)} aria-label="Hiện/ẩn mật khẩu cũ">
                            {showOld ? "Ẩn" : "Hiện"}
                        </button>
                    </div>
                </div>

                {/* Mật khẩu mới */}
                <div className="form-group">
                    <label htmlFor="new_password" className="form-label">Mật khẩu mới</label>
                    <div className="input-wrap">
                        <span className="input-icon">✦</span>
                        <input
                            id="new_password"
                            type={showNew ? "text" : "password"}
                            className="form-input"
                            value={newPwd}
                            onChange={(e) => setNewPwd(e.target.value)}
                            placeholder="Tối thiểu 8 ký tự"
                            disabled={saving}
                        />
                        <button type="button" className="eye-btn" onClick={() => setShowNew(v => !v)} aria-label="Hiện/ẩn mật khẩu mới">
                            {showNew ? "Ẩn" : "Hiện"}
                        </button>
                    </div>
                    {newPwd.length > 0 && (
                        <div className="strength-bar-wrap">
                            <div className="strength-bar-track">
                                <div
                                    className={"strength-bar " + strengthClasses[newStrength]}
                                    style={{ width: (newStrength / 4) * 100 + "%" }}
                                />
                            </div>
                            <span className={"strength-label " + strengthClasses[newStrength]}>
                                {strengthLabels[newStrength]}
                            </span>
                        </div>
                    )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div className="form-group">
                    <label htmlFor="confirm_password" className="form-label">Xác nhận mật khẩu mới</label>
                    <div className="input-wrap">
                        <span className="input-icon">✦</span>
                        <input
                            id="confirm_password"
                            type={showConfirm ? "text" : "password"}
                            className="form-input"
                            value={confirmPwd}
                            onChange={(e) => setConfirmPwd(e.target.value)}
                            placeholder="Nhập lại để xác nhận"
                            disabled={saving}
                        />
                        <button type="button" className="eye-btn" onClick={() => setShowConfirm(v => !v)} aria-label="Hiện/ẩn xác nhận">
                            {showConfirm ? "Ẩn" : "Hiện"}
                        </button>
                    </div>
                    {confirmPwd.length > 0 && newPwd !== confirmPwd && (
                        <p className="field-hint error-hint">Mật khẩu không khớp</p>
                    )}
                    {confirmPwd.length > 0 && newPwd === confirmPwd && (
                        <p className="field-hint success-hint">✓ Khớp</p>
                    )}
                </div>

                {error && <p className="form-error">{error}</p>}
                {success && <p className="form-success">✓ Đổi mật khẩu thành công!</p>}

                <button
                    id="change-password-btn"
                    type="submit"
                    className={"btn-primary" + (saving ? " loading" : "")}
                    disabled={saving}
                >
                    {saving ? <><span className="spinner" /> Đang cập nhật…</> : "Cập nhật mật khẩu →"}
                </button>
            </form>
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
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
