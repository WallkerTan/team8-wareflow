import { useState } from "react";
import { Plus } from "lucide-react";
import WorkspaceSection from "../../components/WorkspaceSection/WorkspaceSection";
import CreateModal from "../../components/CreateModal/CreateModal";

export default function ShippingPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="welcome-line">THỨ BA, 21 THÁNG 10, 2026 <span className="live-dot" /> KHO ĐANG HOẠT ĐỘNG</div>
                    <h1>Vận chuyển</h1>
                    <p>Quản lý vận chuyển và theo dõi hoạt động kho của bạn.</p>
                </div>
                <div className="heading-actions">
                    <button className="button-primary" onClick={() => setShowModal(true)}>
                        <Plus size={17} /> Tạo đơn giao
                    </button>
                </div>
            </div>

            <WorkspaceSection active="Vận chuyển" onCreate={() => setShowModal(true)} />
            <CreateModal show={showModal} onClose={() => setShowModal(false)} type="Vận chuyển" />
        </>
    );
}
