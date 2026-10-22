import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowDownToLine, ArrowRight, ArrowUpRight, Boxes, Package, X } from "lucide-react";

export default function MetricGrid() {
    const navigate = useNavigate();

    return (
        <>
            <section className="metric-grid" aria-label="Tổng quan kho" onClick={e => { const card = (e.target as HTMLElement).closest<HTMLElement>(".metric-card"); if (card) { const title = card.querySelector(".metric-head")?.textContent ?? "Chi tiết"; navigate(`/warehouse/statistics?title=${encodeURIComponent(title)}`); } }}>
                <article className="metric-card"><div className="metric-head"><span>Tổng sản phẩm</span><span className="metric-icon icon-indigo"><Package size={17}/></span></div><div className="metric-value">1.284 <small>SKU</small></div><div className="metric-foot"><span className="trend-up"><ArrowUpRight size={13}/> 8,2%</span><span>so với tháng trước</span><div className="sparkline spark-indigo"><i/><i/><i/><i/><i/><i/><i/><i/></div></div></article>
                <article className="metric-card"><div className="metric-head"><span>Giá trị tồn kho</span><span className="metric-icon icon-green"><Boxes size={17}/></span></div><div className="metric-value">842,6 <small>triệu ₫</small></div><div className="metric-foot"><span className="trend-up"><ArrowUpRight size={13}/> 4,6%</span><span>so với tháng trước</span><div className="sparkline spark-green"><i/><i/><i/><i/><i/><i/><i/><i/></div></div></article>
                <article className="metric-card metric-warning"><div className="metric-head"><span>Sắp hết hàng</span><span className="metric-icon icon-orange"><AlertTriangle size={17}/></span></div><div className="metric-value">12 <small>sản phẩm</small></div><div className="metric-foot"><span className="warning-text">Cần được bổ sung</span><button onClick={e => { e.stopPropagation(); navigate("/warehouse/inventory"); }}>Xem danh sách <ArrowRight size={13}/></button><div className="sparkline spark-orange"><i/><i/><i/><i/><i/><i/><i/><i/></div></div></article>
                <article className="metric-card"><div className="metric-head"><span>Phiếu đang xử lý</span><span className="metric-icon icon-sky"><ArrowDownToLine size={17}/></span></div><div className="metric-value">07 <small>phiếu</small></div><div className="metric-foot"><span className="neutral-dot"/> 3 phiếu nhập <span className="foot-sep">·</span> 4 phiếu xuất<div className="sparkline spark-sky"><i/><i/><i/><i/><i/><i/><i/><i/></div></div></article>
            </section>
            <section className="insight-row"><div className="insight-icon"><AlertTriangle size={18}/></div><div className="insight-copy"><b>12 mặt hàng đang ở mức tồn thấp</b><span>Kiểm tra danh sách và lên kế hoạch nhập bổ sung để tránh gián đoạn đơn hàng.</span></div><button onClick={() => navigate("/warehouse/inventory")}>Xem mặt hàng <ArrowRight size={15}/></button><button className="dismiss-alert" aria-label="Đóng thông báo"><X size={16}/></button></section>
        </>
    );
}
