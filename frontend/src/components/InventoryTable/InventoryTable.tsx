import { useMemo, useState } from "react";
import { ChevronDown, MoreHorizontal, Plus, Search, SlidersHorizontal } from "lucide-react";
import { inventoryCatalog } from "../../data/inventoryData";

interface InventoryTableProps {
    onCreateProduct: () => void;
}

export default function InventoryTable({ onCreateProduct }: InventoryTableProps) {
    const [category, setCategory] = useState("Tất cả danh mục");
    const [query, setQuery] = useState("");
    const [inventoryTab, setInventoryTab] = useState("Tất cả");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredProducts = useMemo(() => inventoryCatalog.filter(p => (category === "Tất cả danh mục" || p.category === category) && (inventoryTab !== "Sắp hết" || p.stock <= 10) && (inventoryTab !== "Còn hàng" || p.stock > 10) && `${p.name} ${p.sku}`.toLowerCase().includes(query.toLowerCase())), [category, inventoryTab, query]);
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
    const products = useMemo(() => filteredProducts.slice((page - 1) * pageSize, page * pageSize), [filteredProducts, page, pageSize]);
    const pageItems: (number | string)[] = totalPages <= 5 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [...new Set([1, Math.max(2, page - 1), page, Math.min(totalPages - 1, page + 1), totalPages])].sort((a, b) => a - b).flatMap((value, i, list) => i > 0 && value - list[i - 1] > 1 ? ["…", value] : [value]);
    const setInventoryFilter = (next: string) => { setInventoryTab(next); setPage(1); };

    return (
        <section className="inventory-panel">
            <div className="panel-heading"><div><div className="panel-kicker">QUẢN LÝ DANH MỤC</div><h2>Hàng hóa trong kho <span className="count-pill">1.284</span></h2><p>Theo dõi số lượng và tình trạng hàng hóa của bạn.</p></div><button className="button-outline" onClick={onCreateProduct}><Plus size={15}/> Thêm sản phẩm</button></div>
            <div className="table-tools"><div className="table-tabs"><button className={inventoryTab === "Tất cả" ? "tab-active" : ""} onClick={() => setInventoryFilter("Tất cả")}>Tất cả <span>1.284</span></button><button className={inventoryTab === "Còn hàng" ? "tab-active" : ""} onClick={() => setInventoryFilter("Còn hàng")}>Còn hàng</button><button className={inventoryTab === "Sắp hết" ? "tab-active" : ""} onClick={() => setInventoryFilter("Sắp hết")}>Sắp hết <span className="tab-alert">12</span></button></div><div className="filter-tools"><label className="product-search"><Search size={16}/><input id="product-search" placeholder="Tìm theo tên, mã SKU..." value={query} onChange={e => { setQuery(e.target.value); setPage(1); }}/><kbd>/</kbd></label><label className="category-select"><SlidersHorizontal size={15}/><select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}><option>Tất cả danh mục</option><option>Điện tử</option><option>Gia dụng</option><option>Phụ kiện</option></select><ChevronDown size={13}/></label></div></div>
            <div className="table-scroll"><table className="product-table"><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả"/></th><th>SẢN PHẨM</th><th>DANH MỤC</th><th>TỒN KHO</th><th>GIÁ THAM KHẢO</th><th>TRẠNG THÁI</th><th/></tr></thead><tbody>{products.map((product) => <tr key={product.sku}><td><input type="checkbox" aria-label={`Chọn ${product.name}`}/></td><td><div className="product-cell"><span className={`product-thumb ${product.tone}`}>{product.mark}</span><span><b>{product.name}</b><small>{product.sku}</small></span></div></td><td><span className="category-tag">{product.category}</span></td><td><b className={`stock-number ${product.stock <= 10 ? "stock-low" : ""}`}>{product.stock}</b> <span className="stock-unit">{product.unit}</span></td><td className="price-cell">{product.price}</td><td><span className={`status-pill ${product.stock <= 10 ? "status-low" : "status-good"}`}><i/>{product.stock <= 10 ? "Sắp hết hàng" : "Đang bán"}</span></td><td><button className="row-more" aria-label="Tùy chọn"><MoreHorizontal size={18}/></button></td></tr>)}</tbody></table>{products.length === 0 && <div className="empty-state">Không tìm thấy sản phẩm phù hợp.</div>}</div>
            <div className="table-footer"><span>Hiển thị <b>{filteredProducts.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, filteredProducts.length)}</b> trong <b>{filteredProducts.length.toLocaleString("vi-VN")}</b> sản phẩm</span><div className="pagination"><button aria-label="Trang trước" disabled={page <= 1} onClick={() => setPage(value => Math.max(1, value - 1))}>←</button>{pageItems.map((item, index) => typeof item === "number" ? <button key={item} className={page === item ? "page-selected" : ""} aria-current={page === item ? "page" : undefined} onClick={() => setPage(item)}>{item}</button> : <span key={`gap-${index}`}>…</span>)}<button aria-label="Trang sau" disabled={page >= totalPages} onClick={() => setPage(value => Math.min(totalPages, value + 1))}>→</button></div><label className="rows-select"><select aria-label="Số dòng mỗi trang" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}><option value={5}>5 / trang</option><option value={10}>10 / trang</option><option value={20}>20 / trang</option><option value={50}>50 / trang</option></select><ChevronDown size={13}/></label></div>
        </section>
    );
}
