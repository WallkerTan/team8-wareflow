import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeftRight } from "lucide-react";
import StatisticsDetail from "../../components/StatisticsDetail/StatisticsDetail";

export default function StatisticsPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const title = searchParams.get("title") || "Giá trị tồn kho";

    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="welcome-line">THỨ BA, 21 THÁNG 10, 2026 <span className="live-dot" /> KHO ĐANG HOẠT ĐỘNG</div>
                    <h1>{title}</h1>
                    <p>Phân tích chi tiết dữ liệu và biến động trong kho.</p>
                </div>
                <div className="heading-actions">
                    <button className="button-quiet" onClick={() => navigate("/warehouse")}>
                        <ArrowLeftRight size={16} /> Quay lại tổng quan
                    </button>
                </div>
            </div>

            <StatisticsDetail title={title} />
        </>
    );
}
