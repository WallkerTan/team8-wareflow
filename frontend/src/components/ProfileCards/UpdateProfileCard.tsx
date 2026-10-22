import React, { useState } from "react";
import type { UserProfile } from "./types";

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

export default UpdateProfileCard;
