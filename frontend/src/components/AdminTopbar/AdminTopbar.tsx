import { Link } from "react-router-dom";

export default function AdminTopbar() {
    return (
        <header className="topbar">
            <Link to="/admin" className="mobile-logo logo">
                <span>W</span>
                <strong>
                    ware<span>flow</span>
                </strong>
            </Link>
            <div className="top-right">
                <button
                    className="search"
                    type="button"
                    aria-label="Tìm kiếm nhanh"
                >
                    ⌕ <span>Tìm kiếm nhanh</span>
                    <kbd>⌘ K</kbd>
                </button>
                <button
                    className="bell"
                    type="button"
                    aria-label="Thông báo"
                >
                    ♧<i />
                </button>
                <Link to="/admin/profile" className="user" style={{ textDecoration: "none" }}>
                    <span className="avatar">AD</span>
                    <span>
                        <b>Admin</b>
                        <small>Quản trị viên</small>
                    </span>
                    ⌄
                </Link>
            </div>
        </header>
    );
}
