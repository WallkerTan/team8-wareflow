import type { FormEvent } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordForm() {
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="auth-card">
            <Link className="auth-logo logo" to="/">
                <span>W</span>
                <strong>
                    ware<span>flow</span>
                </strong>
            </Link>
            <div className="auth-copy">
                <p className="crumb">KHÔI PHỤC TÀI KHOẢN</p>
                <h1>Quên mật khẩu?</h1>
                <p>
                    Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    Email tài khoản
                    <input
                        type="email"
                        placeholder="admin@wareflow.vn"
                        required
                    />
                </label>
                <button className="primary auth-submit" type="submit">
                    Gửi liên kết đặt lại →
                </button>
            </form>
            <p className="auth-foot">
                <Link to="/auth/login">← Quay lại đăng nhập</Link>
            </p>
        </div>
    );
}
