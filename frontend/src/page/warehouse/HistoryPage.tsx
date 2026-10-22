import WorkspaceSection from "../../components/WorkspaceSection/WorkspaceSection";

export default function HistoryPage() {
    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="welcome-line">THỨ BA, 21 THÁNG 10, 2026 <span className="live-dot" /> KHO ĐANG HOẠT ĐỘNG</div>
                    <h1>Lịch sử</h1>
                    <p>Quản lý lịch sử và theo dõi hoạt động kho của bạn.</p>
                </div>
                <div className="heading-actions" />
            </div>

            <WorkspaceSection active="Lịch sử" onCreate={() => {}} />
        </>
    );
}
