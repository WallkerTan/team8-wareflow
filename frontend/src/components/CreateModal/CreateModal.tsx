import { ArrowDownToLine, ArrowRight, ArrowUpRight, Truck, X } from "lucide-react";

interface CreateModalProps {
    show: boolean;
    onClose: () => void;
    type: string;
}

export default function CreateModal({ show, onClose, type }: CreateModalProps) {
    if (!show) return null;

    const creationLabel = type === "Phiếu xuất" ? "phiếu xuất" : type === "Vận chuyển" ? "đơn giao hàng" : type === "Hàng hóa" ? "sản phẩm" : "phiếu nhập";

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <section className="quick-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Đóng"><X size={18}/></button>
                <span className="modal-icon">{type === "Phiếu xuất" ? <ArrowUpRight size={21}/> : type === "Vận chuyển" ? <Truck size={21}/> : <ArrowDownToLine size={21}/>}</span>
                <div className="panel-kicker">TẠO {creationLabel.toLocaleUpperCase("vi-VN")} MỚI</div>
                <h2>Bắt đầu một {creationLabel}</h2>
                <p>{type === "Phiếu xuất" ? "Tạo phiếu nháp, thêm người nhận và hàng hóa. Tồn kho sẽ được kiểm tra trước khi xác nhận." : type === "Vận chuyển" ? "Tạo đơn giao từ một phiếu xuất đã xác nhận, sau đó cập nhật tài xế và địa chỉ giao." : type === "Hàng hóa" ? "Thêm thông tin sản phẩm vào danh mục kho." : "Tạo phiếu nháp trước, bạn có thể bổ sung thông tin và danh sách hàng hóa ở bước tiếp theo."}</p>
                <label className="modal-field">{type === "Phiếu xuất" ? "Người nhận" : type === "Vận chuyển" ? "Mã phiếu xuất đã xác nhận" : type === "Hàng hóa" ? "Tên sản phẩm" : "Ghi chú phiếu"}<input placeholder={type === "Phiếu xuất" ? "Nhập tên người nhận" : type === "Vận chuyển" ? "Ví dụ: PX-20261021-008" : type === "Hàng hóa" ? "Nhập tên sản phẩm" : "Ví dụ: Nhập hàng đợt tháng 10"}/></label>
                <div className="modal-actions"><button className="button-quiet" onClick={onClose}>Để sau</button><button className="button-primary" onClick={onClose}>Tạo bản nháp <ArrowRight size={15}/></button></div>
            </section>
        </div>
    );
}
