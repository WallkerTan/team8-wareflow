import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, UserCheck, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../api/client";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!email.trim() || !password) {
            setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu");
            return;
        }

        setLoading(true);
        try {
            const user = await login(email.trim(), password);
            toast.success(`Đăng nhập thành công! Xin chào ${user.fullName}`);
            if (user.role === "ADMIN") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/warehouse/products", { replace: true });
            }
        } catch (error) {
            const msg = getErrorMessage(error, "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin");
            setErrorMessage(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickFill = (testEmail: string, testPass: string) => {
        setEmail(testEmail);
        setPassword(testPass);
        setErrorMessage(null);
    };

    return (
        <div className="auth-card">
            <Link className="auth-logo logo" to="/">
                <div className="text-white bg-blue-500 rounded-[10px] p-2">W</div>
                <strong>
                    ware
                    <div className="text-blue-500">flow</div>
                </strong>
            </Link>
            <div className="auth-copy">
                <p className="crumb">CHÀO MỪNG TRỞ LẠI</p>
                <h1>Đăng nhập hệ thống</h1>
                <p>Đăng nhập để quản lý kho và điều phối vận hành.</p>
            </div>

            {/* Quick Login Test Accounts */}
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                <div className="text-slate-700 font-semibold">
                    Tài khoản test nhanh:
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            handleQuickFill("admin@wareflow.com", "Admin@123")
                        }
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 hover:border-slate-400 transition text-left cursor-pointer shadow-sm"
                    >
                        <ShieldCheck
                            size={16}
                            className="shrink-0 text-slate-800"
                        />
                        <div>
                            <div className="font-semibold text-slate-900">
                                Admin
                            </div>
                            <div className="text-[10px] text-slate-500">
                                admin@wareflow.com
                            </div>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            handleQuickFill("owner@wareflow.com", "Owner@123")
                        }
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 hover:border-slate-400 transition text-left cursor-pointer shadow-sm"
                    >
                        <UserCheck
                            size={16}
                            className="shrink-0 text-slate-800"
                        />
                        <div>
                            <div className="font-semibold text-slate-900">
                                Chủ kho
                            </div>
                            <div className="text-[10px] text-slate-500">
                                owner@wareflow.com
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                    <span className="font-bold shrink-0">Lỗi:</span>
                    <span>{errorMessage}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <label>
                    Email đăng nhập
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="vd: admin@wareflow.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="email"
                        />
                    </div>
                </label>

                <label>
                    Mật khẩu
                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>
                </label>

                <div className="auth-row">
                    <label className="check">
                        <input type="checkbox" defaultChecked /> Ghi nhớ phiên
                    </label>
                    <Link to="/auth/forgot">Quên mật khẩu?</Link>
                </div>

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
                            <span>Đang xác thực...</span>
                        </>
                    ) : (
                        <span>Đăng nhập →</span>
                    )}
                </button>
            </form>

            <p className="auth-foot">
                Chưa có tài khoản?{" "}
                <Link to="/auth/register">Đăng ký tài khoản mới</Link>
            </p>
        </div>
    );
}
