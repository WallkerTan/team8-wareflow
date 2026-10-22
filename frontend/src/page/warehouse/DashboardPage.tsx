import { useState } from "react";
import { ArrowLeftRight, Plus } from "lucide-react";
import MetricGrid from "../../components/MetricGrid/MetricGrid";
import InventoryTable from "../../components/InventoryTable/InventoryTable";
import CreateModal from "../../components/CreateModal/CreateModal";

export default function DashboardPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="welcome-line">THỨ BA, 21 THÁNG 10, 2026 <span className="live-dot" /> KHO ĐANG HOẠT ĐỘNG</div>
                    <h1>Chào buổi sáng, Minh Anh <span>✳</span></h1>
                    <p>Một vòng nhìn nhanh để bạn nắm kho hôm nay.</p>
                </div>
                <div className="heading-actions">
                    <button className="button-quiet"><ArrowLeftRight size={16} /> Điều chỉnh tồn</button>
                    <button className="button-primary" onClick={() => setShowModal(true)}><Plus size={17} /> Tạo phiếu nhập</button>
                </div>
            </div>

            <MetricGrid />
            <InventoryTable onCreateProduct={() => setShowModal(true)} />
            <CreateModal show={showModal} onClose={() => setShowModal(false)} type="Phiếu nhập" />
        </>
    );
}
