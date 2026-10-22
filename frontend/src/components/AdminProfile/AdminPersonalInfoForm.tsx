import { useState } from "react";

export default function AdminPersonalInfoForm() {
    const [name, setName] = useState("Admin Wareflow");
    const [username, setUsername] = useState("admin.wareflow");
    const [email, setEmail] = useState("admin@wareflow.vn");
    const [phone, setPhone] = useState("090 123 4567");
    const [department, setDepartment] = useState("Vận hành hệ thống");

    return (
        <article className="panel form-card">
            <div className="panel-head">
                <div>
                    <h2>Thông tin cá nhân</h2>
                    <p>Cập nhật thông tin hiển thị của bạn trong hệ thống.</p>
                </div>
            </div>
            <div className="form-grid">
                <label>
                    Họ và tên
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    Tên đăng nhập
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    Số điện thoại
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </label>
                <label>
                    Vai trò
                    <input defaultValue="Quản trị viên" disabled />
                </label>
                <label>
                    Phòng ban
                    <input
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </label>
            </div>
        </article>
    );
}
