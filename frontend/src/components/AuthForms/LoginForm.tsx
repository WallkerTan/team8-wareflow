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
                <span>W</span>
                <strong>
                    ware<span>flow</span>
                </strong>
            </Link>
            <div className="auth-copy">
                <p className="crumb">CHÀO MỪNG TRỞ LẠI</p>
                <h1>Đăng nhập hệ thống</h1>
                <p>Đăng nhập để quản lý kho và điều phối vận hành.</p>
            </div>

            {/* Quick Login Test Accounts */}
            <div className="mb-4 p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs space-y-2">
                <div className="text-slate-400 font-medium">Tài khoản test nhanh:</div>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => handleQuickFill("admin@wareflow.com", "Admin@123")}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition text-left cursor-pointer"
                    >
                        <ShieldCheck size={14} className="shrink-0 text-indigo-400" />
                        <div>
                            <div className="font-semibold">Admin</div>
                            <div className="text-[10px] text-slate-400">admin@wareflow.com</div>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleQuickFill("owner@wareflow.com", "Owner@123")}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition text-left cursor-pointer"
                    >
                        <UserCheck size={14} className="shrink-0 text-emerald-400" />
                        <div>
                            <div className="font-semibold">Chủ kho</div>
                            <div className="text-[10px] text-slate-400">owner@wareflow.com</div>
                        </div>
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
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
                    <Link to="/auth/forgot" className="text-slate-400 hover:text-slate-200">
                        Quên mật khẩu?
                    </Link>
                </div>

                <button
                    className="primary auth-submit flex items-center justify-center gap-2"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Đang xác thực...</span>
                        </>
                    ) : (
                        <span>Đăng nhập →</span>
                    )}
                </button>
            </form>

            <p className="auth-foot">
                Chưa có tài khoản? <span className="text-slate-400">Liên hệ Quản trị viên để được cấp quyền.</span>
            </p>
        </div>
    );
}
