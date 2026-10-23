import React, { useState } from "react";
import toast from "react-hot-toast";
import { User, Lock, Phone, MapPin, Shield, Calendar, CheckCircle2, Loader2, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../api/services/authService";
import { getErrorMessage } from "../../api/client";
import { formatDateTime } from "../../api/formatters";

export default function ProfileSharedPage() {
    const { user, refreshProfile, logout } = useAuth();

    // Profile form state
    const [fullName, setFullName] = useState(user?.fullName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [address, setAddress] = useState(user?.address || "");
    const [savingProfile, setSavingProfile] = useState(false);

    // Password form state
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) {
            toast.error("Họ và tên không được để trống");
            return;
        }

        setSavingProfile(true);
        try {
            await authService.updateProfile({
                fullName: fullName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
            });
            await refreshProfile();
            toast.success("Cập nhật thông tin cá nhân thành công!");
        } catch (error) {
            toast.error(getErrorMessage(error, "Không thể cập nhật hồ sơ"));
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!oldPassword) {
            toast.error("Vui lòng nhập mật khẩu hiện tại");
            return;
        }
        if (!newPassword || newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Xác nhận mật khẩu mới không khớp");
            return;
        }

        setChangingPassword(true);
        try {
            await authService.changePassword({
                oldPassword,
                newPassword,
            });
            toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setTimeout(() => {
                logout();
            }, 1500);
        } catch (error) {
            toast.error(getErrorMessage(error, "Đổi mật khẩu thất bại"));
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                        <User className="text-emerald-400" size={26} /> Hồ sơ tài khoản
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Quản lý thông tin định danh và bảo mật tài khoản cá nhân.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        user?.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border border-red-500/30"
                    }`}>
                        <span className={`w-2 h-2 rounded-full ${user?.status === "ACTIVE" ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                        {user?.status === "ACTIVE" ? "Đang hoạt động" : "Bị khóa"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        <Shield size={12} />
                        {user?.role === "ADMIN" ? "Quản trị viên (ADMIN)" : "Chủ kho (WAREHOUSE_OWNER)"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-emerald-950 mb-4 ring-4 ring-slate-700">
                        {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h2 className="text-lg font-bold text-white">{user?.fullName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>

                    <div className="w-full border-t border-slate-700/60 my-5 pt-4 text-left space-y-3 text-sm">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Calendar size={13} /> Ngày tạo
                            </span>
                            <span className="text-slate-200">{formatDateTime(user?.createdAt)}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <Phone size={13} /> Số điện thoại
                            </span>
                            <span className="text-slate-200">{user?.phone || "(Chưa có)"}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400 flex items-center gap-1.5">
                                <MapPin size={13} /> Địa chỉ
                            </span>
                            <span className="text-slate-200 truncate max-w-[160px] text-right">{user?.address || "(Chưa có)"}</span>
                        </div>
                    </div>

                    <div className="w-full bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 text-left">
                        <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                            <CheckCircle2 size={14} className="text-emerald-400" /> Quyền hạn truy cập
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            {user?.role === "ADMIN"
                                ? "Toàn quyền quản trị tài khoản, danh mục, nhà cung cấp và theo dõi dashboard."
                                : "Toàn quyền nhập xuất kho, kiểm soát tồn kho, tạo vận đơn và theo dõi giao hàng."}
                        </p>
                    </div>
                </div>

                {/* Edit Form & Password Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Thông tin cá nhân */}
                    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                            <User size={18} className="text-emerald-400" /> Cập nhật thông tin cá nhân
                        </h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
                                        placeholder="Nguyễn Văn A"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
                                        placeholder="email@wareflow.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
                                        placeholder="0912345678"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Địa chỉ
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition"
                                        placeholder="Hà Nội, Việt Nam"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold transition cursor-pointer shadow-lg shadow-emerald-900/30"
                                >
                                    {savingProfile ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} /> Lưu thay đổi
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Đổi mật khẩu */}
                    <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-lg">
                        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                            <Lock size={18} className="text-indigo-400" /> Đổi mật khẩu
                        </h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                    Mật khẩu hiện tại *
                                </label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Mật khẩu mới * (tối thiểu 6 ký tự)
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                                        Xác nhận mật khẩu mới *
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition cursor-pointer shadow-lg shadow-indigo-900/30"
                                >
                                    {changingPassword ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Đang cập nhật...
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={16} /> Cập nhật mật khẩu
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
