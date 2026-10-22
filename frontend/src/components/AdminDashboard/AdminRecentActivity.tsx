import { Link } from "react-router-dom";

export default function AdminRecentActivity() {
    return (
        <article className="panel activity-panel">
            <div className="panel-head">
                <div>
                    <h2>Hoạt động gần đây</h2>
                    <p>Cập nhật thời gian thực từ các tài khoản quản trị</p>
                </div>
                <Link className="link" to="/admin/users">
                    Xem tất cả →
                </Link>
            </div>
            <div className="activity-row">
                <span className="activity-avatar green-bg">NT</span>
                <div>
                    <b>Nguyễn Thành đã tạo tài khoản</b>
                    <small>Quản trị viên · 5 phút trước</small>
                </div>
                <em className="done">Hoàn tất</em>
            </div>
            <div className="activity-row">
                <span className="activity-avatar blue-bg">LM</span>
                <div>
                    <b>Lê Minh cập nhật danh mục Điện tử</b>
                    <small>Quản lý kho · 32 phút trước</small>
                </div>
                <em className="info">Đã cập nhật</em>
            </div>
            <div className="activity-row">
                <span className="activity-avatar orange-bg">HP</span>
                <div>
                    <b>Hoàng Phúc thay đổi quyền truy cập</b>
                    <small>Quản trị viên · 1 giờ trước</small>
                </div>
                <em className="warning">Cần kiểm tra</em>
            </div>
        </article>
    );
}
