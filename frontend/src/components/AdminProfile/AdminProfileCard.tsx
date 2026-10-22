
export default function AdminProfileCard() {
    return (
        <article className="panel profile-card">
            <div className="cover" />
            <div className="profile-main">
                <div className="profile-avatar">AD</div>
                <h2>Admin Wareflow</h2>
                <p className="role-text">
                    Quản trị viên <span>● Đang hoạt động</span>
                </p>
                <p className="muted">Thành viên từ tháng 03, 2025</p>
            </div>
            <div className="profile-stats">
                <div>
                    <b>842</b>
                    <small>Hoạt động</small>
                </div>
                <div>
                    <b>98.6%</b>
                    <small>Hiệu suất</small>
                </div>
                <div>
                    <b>12</b>
                    <small>Quyền quản trị</small>
                </div>
            </div>
        </article>
    );
}
