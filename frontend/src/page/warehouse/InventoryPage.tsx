import { useState } from "react";
import { Plus } from "lucide-react";
import InventoryTable from "../../components/InventoryTable/InventoryTable";
import CreateModal from "../../components/CreateModal/CreateModal";

export default function InventoryPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="welcome-line">THỨ BA, 21 THÁNG 10, 2026 <span className="live-dot" /> KHO ĐANG HOẠT ĐỘNG</div>
                    <h1>Hàng hóa</h1>
                    <p>Quản lý hàng hóa và theo dõi hoạt động kho của bạn.</p>
                </div>
                <div className="heading-actions">
                    <button className="button-primary" onClick={() => setShowModal(true)}>
                        <Plus size={17} /> Thêm sản phẩm
                    </button>
                </div>
            </div>

            <InventoryTable onCreateProduct={() => setShowModal(true)} />
            <CreateModal show={showModal} onClose={() => setShowModal(false)} type="Hàng hóa" />
        </>
    );
}
