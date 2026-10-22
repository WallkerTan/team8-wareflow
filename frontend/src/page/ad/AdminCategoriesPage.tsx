import AdminCategoryGrid from "../../components/AdminCategories/AdminCategoryGrid";
import AdminCategoryTable from "../../components/AdminCategories/AdminCategoryTable";

export default function AdminCategoriesPage() {
    return (
        <section className="screen">
            <div className="heading">
                <div>
                    <p className="crumb">WAREFLOW / QUẢN TRỊ</p>
                    <h1>Danh mục</h1>
                    <p className="sub">
                        Quản lý nhóm phân loại hàng hóa trong toàn bộ hệ thống kho.
                    </p>
                </div>
                <button className="primary" type="button">
                    ＋ Thêm danh mục
                </button>
            </div>
            <AdminCategoryGrid />
            <AdminCategoryTable />
        </section>
    );
}
