
export default function AdminUserStats() {
    return (
        <div className="cards">
            <article className="stat">
                <span className="stat-icon blue">♙</span>
                <small>Tổng người dùng</small>
                <strong>1,284</strong>
                <label className="up">↗ 12.8%</label>
            </article>
            <article className="stat">
                <span className="stat-icon green">✓</span>
                <small>Đang hoạt động</small>
                <strong>1,196</strong>
                <label className="up">93.1% tổng số</label>
            </article>
            <article className="stat">
                <span className="stat-icon orange">!</span>
                <small>Chờ xác thực</small>
                <strong>42</strong>
                <label className="warning">Cần xử lý</label>
            </article>
            <article className="stat">
                <span className="stat-icon purple">♧</span>
                <small>Quản trị viên</small>
                <strong>12</strong>
                <label className="neutral">3 nhóm quyền</label>
            </article>
        </div>
    );
}
