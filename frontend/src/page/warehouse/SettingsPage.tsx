import { useState } from "react";
import { Plus } from "lucide-react";
import WorkspaceSection from "../../components/WorkspaceSection/WorkspaceSection";
import CreateModal from "../../components/CreateModal/CreateModal";

export default function SettingsPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="welcome-line">THỨ BA, 21 THÁNG 10, 2026 <span className="live-dot" /> KHO ĐANG HOẠT ĐỘNG</div>
                    <h1>Cài đặt</h1>
                    <p>Quản lý cài đặt và theo dõi hoạt động kho của bạn.</p>
                </div>
                <div className="heading-actions">
                    <button className="button-primary" onClick={() => setShowModal(true)}>
                        <Plus size={17} /> Tạo mới
                    </button>
                </div>
            </div>

            <WorkspaceSection active="Cài đặt" onCreate={() => setShowModal(true)} />
            <CreateModal show={showModal} onClose={() => setShowModal(false)} type="Cài đặt" />
        </>
    );
}
