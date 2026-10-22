
const categories = [
    {
        id: "1",
        name: "Điện tử",
        products: "248 sản phẩm",
        icon: "▣",
        iconBg: "blue-bg",
    },
    {
        id: "2",
        name: "Gia dụng",
        products: "186 sản phẩm",
        icon: "◇",
        iconBg: "purple-bg",
    },
    {
        id: "3",
        name: "Thời trang",
        products: "124 sản phẩm",
        icon: "▤",
        iconBg: "orange-bg",
    },
    {
        id: "4",
        name: "Thực phẩm",
        products: "96 sản phẩm",
        icon: "♧",
        iconBg: "green-bg",
    },
];

export default function AdminCategoryGrid() {
    return (
        <div className="category-grid">
            {categories.map((cat) => (
                <article key={cat.id} className="category-card">
                    <span className={`cat-icon ${cat.iconBg}`}>{cat.icon}</span>
                    <div>
                        <h3>{cat.name}</h3>
                        <p>{cat.products}</p>
                    </div>
                    <b>→</b>
                </article>
            ))}
        </div>
    );
}
