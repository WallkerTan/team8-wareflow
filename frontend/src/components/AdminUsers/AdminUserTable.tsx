import { useState } from "react";

const usersData = [
    {
        id: "1",
        avatar: "NT",
        avatarBg: "blue-bg",
        name: "Nguyễn Thành",
        role: "Admin",
        roleClass: "admin",
        email: "thanh.nguyen@wareflow.vn",
        joinDate: "21/10/2026",
        status: "Hoạt động",
        statusClass: "good",
    },
    {
        id: "2",
        avatar: "LM",
        avatarBg: "purple-bg",
        name: "Lê Minh",
        role: "Quản lý kho",
        roleClass: "manager",
        email: "minh.le@wareflow.vn",
        joinDate: "18/10/2026",
        status: "Hoạt động",
        statusClass: "good",
    },
    {
        id: "3",
        avatar: "HP",
        avatarBg: "orange-bg",
        name: "Hoàng Phúc",
        role: "Nhân viên",
        roleClass: "staff",
        email: "phuc.hoang@wareflow.vn",
        joinDate: "12/10/2026",
        status: "Chờ xác thực",
        statusClass: "pending",
    },
];

export default function AdminUserTable() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = usersData.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <article className="panel table-panel">
            <div className="panel-head">
                <div>
                    <h2>Danh sách người dùng</h2>
                    <p>Thông tin tài khoản và quyền truy cập hiện tại</p>
                </div>
                <div className="table-tools">
                    <label>
                        ⌕{" "}
                        <input
                            placeholder="Tìm theo tên, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </label>
                    <button className="filter" type="button">
                        ☷ Bộ lọc
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>NGƯỜI DÙNG</th>
                        <th>VAI TRÒ</th>
                        <th>EMAIL</th>
                        <th>NGÀY THAM GIA</th>
                        <th>TRẠNG THÁI</th>
                        <th>THAO TÁC</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <span className={`mini-avatar ${user.avatarBg}`}>
                                    {user.avatar}
                                </span>
                                <b>{user.name}</b>
                            </td>
                            <td>
                                <mark className={`role ${user.roleClass}`}>
                                    {user.role}
                                </mark>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.joinDate}</td>
                            <td>
                                <mark className={`status ${user.statusClass}`}>
                                    {user.status}
                                </mark>
                            </td>
                            <td>•••</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                Hiển thị 1–{filteredUsers.length} trong 1,284 users
                <button type="button">‹</button>
                <button type="button" className="current">
                    1
                </button>
                <button type="button">2</button>
                <button type="button">3</button>
                <button type="button">›</button>
            </div>
        </article>
    );
}
