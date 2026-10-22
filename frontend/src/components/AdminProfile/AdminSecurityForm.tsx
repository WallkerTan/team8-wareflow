import { useState } from "react";

export default function AdminSecurityForm() {
    const [currentPassword, setCurrentPassword] = useState("password");
    const [newPassword, setNewPassword] = useState("");

    return (
        <article className="panel form-card">
            <div className="panel-head">
                <div>
                    <h2>Bảo mật tài khoản</h2>
                    <p>Đổi mật khẩu định kỳ để nâng cao tính an toàn.</p>
                </div>
                <span className="secure">✓ Bảo mật tốt</span>
            </div>
            <div className="form-grid">
                <label>
                    Mật khẩu hiện tại
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </label>
                <label>
                    Mật khẩu mới
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>
            </div>
        </article>
    );
}
