export type Product = { sku: string; name: string; category: string; stock: number; unit: string; price: string; tone: string; mark: string };

export const initialProducts: Product[] = [
    { sku: "EL-2048", name: "Tai nghe không dây AirBeat Pro", category: "Điện tử", stock: 8, unit: "cái", price: "1.290.000₫", tone: "violet", mark: "AB" },
    { sku: "HH-0812", name: "Bình giữ nhiệt Luma 650ml", category: "Gia dụng", stock: 24, unit: "cái", price: "385.000₫", tone: "mint", mark: "Lu" },
    { sku: "PK-3301", name: "Túi tote Canvas Everyday", category: "Phụ kiện", stock: 126, unit: "cái", price: "149.000₫", tone: "peach", mark: "To" },
    { sku: "EL-1105", name: "Đèn bàn Lumio Mini", category: "Điện tử", stock: 4, unit: "cái", price: "620.000₫", tone: "blue", mark: "Lm" },
    { sku: "GD-0920", name: "Hộp bảo quản Fresh Set (3 món)", category: "Gia dụng", stock: 58, unit: "bộ", price: "220.000₫", tone: "yellow", mark: "Fr" },
];

export const inventoryCatalog: Product[] = Array.from({ length: 1284 }, (_, index) => {
    const product = initialProducts[index % initialProducts.length];
    const batch = Math.floor(index / initialProducts.length);
    return {
        ...product,
        sku: index < initialProducts.length ? product.sku : `${product.sku}-${String(batch + 1).padStart(3, "0")}`,
        name: index < initialProducts.length ? product.name : `${product.name} · lô ${String(batch + 1).padStart(2, "0")}`,
        stock: index < 12 ? (index % 2 === 0 ? 4 : 8) : product.stock <= 10 ? 14 + batch % 30 : product.stock,
    };
});
