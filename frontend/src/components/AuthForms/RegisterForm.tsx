import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";

export default function RegisterForm() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!fullName.trim()) {
            setErrorMessage("Vui lòng nhập họ và tên");
            return;
        }

        if (!email.trim()) {
            setErrorMessage("Vui lòng nhập email");
            return;
        }

        if (!password) {
            setErrorMessage("Vui lòng nhập mật khẩu");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Mật khẩu phải có tối thiểu 6 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Mật khẩu xác nhận không trùng khớp");
            return;
        }

        if (!agreeTerms) {
            setErrorMessage("Bạn cần đồng ý với điều khoản sử dụng để tiếp tục");
            return;
        }

        setLoading(true);
        try {
            const user = await register({
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                password,
                phone: phone.trim() ? phone.trim() : undefined,
            });

            toast.success(`Đăng ký thành công! Chào mừng ${user.fullName}`);
            navigate("/warehouse/products", { replace: true });
        } catch (error) {
            const msg = getErrorMessage(error, "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin");
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <Link className="auth-logo logo" to="/">
                <div className="text-white bg-blue-500 rounded-[10px] p-2">
                    W
                </div>
                <strong>
                    ware
                    <div className="text-blue-500">flow</div>
                </strong>
            </Link>

            <div className="auth-copy">
                <p className="crumb">BẮT ĐẦU CÙNG WAREFLOW</p>
                <h1>Tạo tài khoản mới</h1>
                <p>
                    Đăng ký tài khoản để bắt đầu quản lý kho và điều phối hàng
                    hoá.
                </p>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                    <span className="font-bold shrink-0">Lỗi:</span>
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Họ và tên
                    <input
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="name"
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        placeholder="you@company.vn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="email"
                    />
                </label>

                <label>
                    Số điện thoại (tuỳ chọn)
                    <input
                        type="tel"
                        placeholder="0912 345 678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        autoComplete="tel"
                    />
                </label>

                <label>
                    Mật khẩu
                    <input
                        type="password"
                        placeholder="Tối thiểu 6 ký tự"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                    />
                </label>

                <label>
                    Xác nhận mật khẩu
                    <input
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                    />
                </label>

                <label className="check">
                    <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        required
                        disabled={loading}
                    />
                    <span>
                        Tôi đồng ý với điều khoản sử dụng và chính sách dịch vụ
                    </span>
                </label>

                <button
                    className="primary auth-submit flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2
                                size={16}
                                className="animate-spin text-slate-800"
                            />
                            <span>Đang đăng ký...</span>
                        </>
                    ) : (
                        <>
                            <span>Tạo tài khoản</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </form>

            <p className="auth-foot">
                Đã có tài khoản? <Link to="/auth/login">Đăng nhập ngay</Link>
            </p>
        </div>
    );
}
