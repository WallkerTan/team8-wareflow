import React, { useState } from "react";

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

export default ChangePasswordCard;
