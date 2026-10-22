import type { FormEvent } from "react";
import { Link } from "react-router-dom";

export default function RegisterForm() {
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
                <p className="crumb">BẮT ĐẦU CÙNG WAREFLOW</p>
                <h1>Tạo tài khoản</h1>
                <p>
                    Đăng ký tài khoản để quản lý kho hàng hiệu quả hơn.
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <label>
                    Họ và tên
                    <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        required
                    />
                </label>
                <label>
                    Email công việc
                    <input
                        type="email"
                        placeholder="you@company.vn"
                        required
                    />
                </label>
                <label>
                    Mật khẩu
                    <input
                        type="password"
                        placeholder="Tối thiểu 8 ký tự"
                        required
                    />
                </label>
                <label>
                    Xác nhận mật khẩu
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        required
                    />
                </label>
                <label className="check">
                    <input type="checkbox" required /> Tôi đồng ý với
                    điều khoản sử dụng
                </label>
                <button className="primary auth-submit" type="submit">
                    Tạo tài khoản →
                </button>
            </form>
            <p className="auth-foot">
                Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
            </p>
        </div>
    );
}
