
export default function AdminStatCards() {
    return (
        <div className="cards">
            <article className="stat">
                <span className="stat-icon blue">♙</span>
                <small>Tổng Users</small>
                <strong>1,284</strong>
                <label className="up">
                    ↗ 12.8% <i>so với tháng trước</i>
                </label>
            </article>
            <article className="stat">
                <span className="stat-icon green">▣</span>
                <small>Kho đang hoạt động</small>
                <strong>36</strong>
                <label className="up">
                    ↗ 8.2% <i>so với tháng trước</i>
                </label>
            </article>
            <article className="stat">
                <span className="stat-icon orange">◇</span>
                <small>Danh mục</small>
                <strong>128</strong>
                <label className="neutral">12 danh mục mới</label>
            </article>
            <article className="stat">
                <span className="stat-icon purple">◷</span>
                <small>Hoạt động hôm nay</small>
                <strong>842</strong>
                <label className="up">
                    ↗ 18.4% <i>so với hôm qua</i>
                </label>
            </article>
        </div>
    );
}
