export default function AdminActivityChart() {
    return (
        <article className="panel chart-panel">
            <div className="panel-head">
                <div>
                    <h2>Hoạt động hệ thống</h2>
                    <p>Lượt truy cập và thao tác trong 7 ngày qua</p>
                </div>
                <select aria-label="Khoảng thời gian" defaultValue="7 ngày qua">
                    <option>7 ngày qua</option>
                    <option>30 ngày qua</option>
                </select>
            </div>
            <div className="chart">
                <div className="y">
                    <span>800</span>
                    <span>600</span>
                    <span>400</span>
                    <span>200</span>
                    <span>0</span>
                </div>
                <div className="bars">
                    <i style={{ height: "42%" }} title="T2: 42%" />
                    <i style={{ height: "58%" }} title="T3: 58%" />
                    <i style={{ height: "48%" }} title="T4: 48%" />
                    <i style={{ height: "74%" }} title="T5: 74%" />
                    <i style={{ height: "63%" }} title="T6: 63%" />
                    <i style={{ height: "88%" }} title="T7: 88%" />
                    <i style={{ height: "78%" }} title="CN: 78%" />
                </div>
                <div className="days">
                    <span>T2</span>
                    <span>T3</span>
                    <span>T4</span>
                    <span>T5</span>
                    <span>T6</span>
                    <span>T7</span>
                    <span>CN</span>
                </div>
            </div>
        </article>
    );
}
