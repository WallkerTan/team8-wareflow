import { useState } from "react";

const categoryList = [
    {
        id: "1",
        name: "Điện tử",
        description: "Thiết bị công nghệ và phụ kiện",
        products: 248,
        createdAt: "03/03/2025",
        status: "Đang dùng",
        statusClass: "good",
        icon: "▣",
        iconBg: "blue-bg",
    },
    {
        id: "2",
        name: "Gia dụng",
        description: "Đồ dùng nhà bếp và thiết bị gia đình",
        products: 186,
        createdAt: "03/03/2025",
        status: "Đang dùng",
        statusClass: "good",
        icon: "◇",
        iconBg: "purple-bg",
    },
];

export default function AdminCategoryTable() {
    const [search, setSearch] = useState("");

    const filtered = categoryList.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <article className="panel table-panel">
            <div className="panel-head">
                <div>
                    <h2>
                        Tất cả danh mục <span className="count">128</span>
                    </h2>
                    <p>
                        Theo dõi số lượng hàng hóa và trạng thái theo từng nhóm.
                    </p>
                </div>
                <label className="table-search">
                    ⌕{" "}
                    <input
                        placeholder="Tìm danh mục..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>TÊN DANH MỤC</th>
                        <th>MÔ TẢ</th>
                        <th>SẢN PHẨM</th>
                        <th>NGÀY TẠO</th>
                        <th>TRẠNG THÁI</th>
                        <th>THAO TÁC</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((cat) => (
                        <tr key={cat.id}>
                            <td>
                                <span className={`mini-icon ${cat.iconBg}`}>
                                    {cat.icon}
                                </span>
                                <b>{cat.name}</b>
                            </td>
                            <td>{cat.description}</td>
                            <td>
                                <strong>{cat.products}</strong> sản phẩm
                            </td>
                            <td>{cat.createdAt}</td>
                            <td>
                                <mark className={`status ${cat.statusClass}`}>
                                    {cat.status}
                                </mark>
                            </td>
                            <td>•••</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </article>
    );
}
