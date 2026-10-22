import { Link } from "react-router-dom";

export default function AdminQuickActions() {
    return (
        <article className="panel quick-panel">
            <div className="panel-head">
                <div>
                    <h2>Thao tác nhanh</h2>
                    <p>Quản trị hệ thống nhanh chóng</p>
                </div>
            </div>
            <Link to="/admin/users">
                <span className="quick blue-bg">♙</span>
                <b>Thêm người dùng</b>
                <small>Mời thành viên mới tham gia</small>
                <strong>→</strong>
            </Link>
            <Link to="/admin/categories">
                <span className="quick purple-bg">◇</span>
                <b>Tạo danh mục</b>
                <small>Phân loại và gom nhóm hàng hóa</small>
                <strong>→</strong>
            </Link>
            <Link to="/admin/profile">
                <span className="quick orange-bg">⚙</span>
                <b>Cài đặt tài khoản</b>
                <small>Cập nhật hồ sơ &amp; bảo mật</small>
                <strong>→</strong>
            </Link>
        </article>
    );
}
