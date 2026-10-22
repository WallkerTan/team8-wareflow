import type { FormEvent } from "react";
import { Link } from "react-router-dom";

export default function LoginForm() {
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
                <p className="crumb">CHÀO MỪNG TRỞ LẠI</p>
                <h1>Đăng nhập tài khoản</h1>
                <p>Đăng nhập để tiếp tục sử dụng hệ thống Wareflow.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    Email hoặc tên đăng nhập
                    <input
                        type="text"
                        placeholder="admin@wareflow.vn"
                        required
                    />
                </label>
                <label>
                    Mật khẩu
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        required
                    />
                </label>
                <div className="auth-row">
                    <label className="check">
                        <input type="checkbox" /> Ghi nhớ đăng nhập
                    </label>
                    <Link to="/auth/forgot">Quên mật khẩu?</Link>
                </div>
                <button className="primary auth-submit" type="submit">
                    Đăng nhập →
                </button>
            </form>
            <p className="auth-foot">
                Chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay</Link>
            </p>
        </div>
    );
}
