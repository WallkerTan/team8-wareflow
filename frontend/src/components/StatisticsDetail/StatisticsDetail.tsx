import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, MoreHorizontal } from "lucide-react";
import { inventoryCatalog } from "../../data/inventoryData";

function StatisticsDetail({ title }: { title: string }) {
    const [range, setRange] = useState("30");
    const [showList, setShowList] = useState(false);
    const detail = title === "Giá trị tồn kho";
    const low = title === "Sắp hết hàng";
    const processing = title === "Phiếu đang xử lý";
    const pointCount = range === "7" ? 7 : range === "month" ? 21 : 30;
    const chartData = useMemo(
        () =>
            Array.from({ length: pointCount }, (_, index) => {
                const phase =
                    range === "7"
                        ? index * 1.37
                        : range === "month"
                          ? index * 0.79
                          : index * 0.57;
                const inbound =
                    330 +
                    Math.round((Math.sin(phase) + 1) * 255) +
                    ((index * 47) % 170);
                const outbound =
                    190 +
                    Math.round((Math.cos(phase * 0.83) + 1) * 155) +
                    ((index * 31) % 110);
                return { inbound, outbound };
            }),
        [pointCount, range],
    );
    const chartMax =
        Math.ceil(
            Math.max(
                ...chartData.map((item) =>
                    Math.max(item.inbound, item.outbound),
                ),
            ) / 200,
        ) * 200;
    const chartTicks = [
        chartMax,
        Math.round((chartMax * 2) / 3),
        Math.round(chartMax / 3),
        0,
    ];
    const chartLabel =
        range === "7"
            ? "7 ngày gần nhất"
            : range === "month"
              ? "Tháng 10 · 21 ngày"
              : "30 ngày gần nhất";
    const axisPoints = [
        ...new Set([
            0,
            Math.round((pointCount - 1) / 3),
            Math.round(((pointCount - 1) * 2) / 3),
            pointCount - 1,
        ]),
    ];
    const axisLabel = (index: number) =>
        range === "7"
            ? ["T4", "T5", "T6", "T7", "CN", "T2", "Hôm nay"][index]
            : range === "month"
              ? `${String(index + 1).padStart(2, "0")} Th10`
              : index < 9
                ? `${String(index + 22).padStart(2, "0")} Th9`
                : `${String(index - 8).padStart(2, "0")} Th10`;
    const updatedTime = new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const inboundTotal = chartData.reduce((sum, item) => sum + item.inbound, 0);
    const outboundTotal = chartData.reduce(
        (sum, item) => sum + item.outbound,
        0,
    );
    const activeSku = Math.round(1284 * (pointCount / 30) * 0.78);
    const detectedLow = Math.round(pointCount * 0.4);
    const incomingValue = inboundTotal * 0.045;
    const outgoingValue = outboundTotal * 0.045;
    const formatValue = (value: number) =>
        value.toLocaleString("vi-VN", { maximumFractionDigits: 1 });
    const summaryCards = low
        ? [
              ["SKU chạm ngưỡng trong kỳ", String(detectedLow), "sản phẩm"],
              [
                  "Ngày phát sinh cảnh báo",
                  String(
                      chartData.filter(
                          (item) => item.outbound > item.inbound * 0.7,
                      ).length,
                  ),
                  "ngày",
              ],
              [
                  "Đã được bổ sung",
                  String(Math.max(1, Math.round(detectedLow * 0.35))),
                  "sản phẩm",
              ],
              ["Mức tồn tối thiểu", "≤ 10", "đơn vị"],
          ]
        : processing
          ? [
                [
                    "Tổng phiếu trong kỳ",
                    String(Math.round((inboundTotal + outboundTotal) / 950)),
                    "phiếu",
                ],
                ["Phiếu nhập", String(Math.round(inboundTotal / 950)), "phiếu"],
                [
                    "Phiếu xuất",
                    String(Math.round(outboundTotal / 950)),
                    "phiếu",
                ],
                [
                    "Chờ xác nhận",
                    String(Math.max(1, Math.round(pointCount / 12))),
                    "phiếu",
                ],
            ]
          : detail
            ? [
                  [
                      "Giá trị nhập kỳ này",
                      `${formatValue(incomingValue)}`,
                      "triệu ₫",
                  ],
                  [
                      "Giá trị xuất kỳ này",
                      `${formatValue(outgoingValue)}`,
                      "triệu ₫",
                  ],
                  [
                      "Chênh lệch giá trị",
                      `${formatValue(incomingValue - outgoingValue)}`,
                      "triệu ₫",
                  ],
                  [
                      "Ngày có giao dịch",
                      String(
                          chartData.filter(
                              (item) => item.inbound + item.outbound > 800,
                          ).length,
                      ),
                      "ngày",
                  ],
              ]
            : [
                  [
                      "SKU có phát sinh",
                      activeSku.toLocaleString("vi-VN"),
                      "SKU",
                  ],
                  [
                      "Lượt nhập quy đổi",
                      Math.round(inboundTotal / 10).toLocaleString("vi-VN"),
                      "đơn vị",
                  ],
                  [
                      "Lượt xuất quy đổi",
                      Math.round(outboundTotal / 10).toLocaleString("vi-VN"),
                      "đơn vị",
                  ],
                  [
                      "Nhóm hàng hoạt động",
                      String(
                          Math.min(8, Math.max(2, Math.ceil(pointCount / 4))),
                      ),
                      "nhóm",
                  ],
              ];
    const breakdownRows = low
        ? [
              ["Tai nghe AirBeat Pro", "8 / 10 cái", "low"],
              ["Đèn bàn Lumio Mini", "4 / 8 cái", "low"],
              ["Cáp sạc Type-C 2m", "6 / 10 sợi", "low"],
              ["Loa bluetooth Mini", "9 / 10 cái", "low"],
          ]
        : processing
          ? [
                [
                    "Phiếu nhập",
                    String(Math.round(inboundTotal / 950)),
                    "tone-blue",
                ],
                [
                    "Phiếu xuất",
                    String(Math.round(outboundTotal / 950)),
                    "tone-green",
                ],
                [
                    "Chờ xác nhận",
                    String(Math.max(1, Math.round(pointCount / 12))),
                    "tone-orange",
                ],
                [
                    "Đã xử lý",
                    String(
                        Math.max(
                            0,
                            Math.round((inboundTotal + outboundTotal) / 950) -
                                Math.round(pointCount / 12),
                        ),
                    ),
                    "tone-gray",
                ],
            ]
          : ["Điện tử", "Gia dụng", "Phụ kiện", "Khác"].map((name, group) => {
                const amount = chartData.reduce(
                    (sum, item, index) =>
                        sum +
                        ((index + group) % 4 === 0 ? item.inbound : 0) +
                        ((index + group + 1) % 4 === 0 ? item.outbound : 0),
                    0,
                );
                const total = inboundTotal + outboundTotal;
                return [
                    name,
                    `${Math.round((amount / total) * 100)}%`,
                    ["tone-blue", "tone-green", "tone-orange", "tone-gray"][
                        group
                    ],
                ];
            });
    return (
        <section className="statistics-detail">
            <div className="stats-detail-toolbar">
                <div>
                    <b>
                        {detail
                            ? "Tổng quan giá trị hàng hóa"
                            : low
                              ? "Theo dõi mức tồn tối thiểu"
                              : processing
                                ? "Tiến độ xử lý chứng từ"
                                : "Phân bố hàng hóa trong kho"}
                    </b>
                    <span>Dữ liệu cập nhật lúc {updatedTime} hôm nay</span>
                </div>
                <select
                    aria-label="Khoảng thời gian"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                >
                    <option value="30">30 ngày gần nhất</option>
                    <option value="7">7 ngày gần nhất</option>
                    <option value="month">Tháng này</option>
                </select>
            </div>
            <div className="stats-detail-cards">
                {summaryCards.map((item) => (
                    <article key={item[0]}>
                        <span>{item[0]}</span>
                        <b>
                            {item[1]} <small>{item[2]}</small>
                        </b>
                    </article>
                ))}
            </div>
            <div className="stats-detail-grid">
                <article className="stats-chart-card">
                    <div className="stats-section-title">
                        <div>
                            <b>
                                {low
                                    ? "Biến động hàng sắp hết"
                                    : processing
                                      ? "Phiếu theo ngày"
                                      : detail
                                        ? "Biến động giá trị tồn kho"
                                        : "Biến động số lượng sản phẩm"}
                            </b>
                            <small>
                                {low
                                    ? "Số lượng hàng dưới ngưỡng cảnh báo"
                                    : processing
                                      ? `Số phiếu nhập và xuất · ${chartLabel}`
                                      : detail
                                        ? `Giá trị nhập và xuất · ${chartLabel}`
                                        : `Số lượng nhập và xuất · ${chartLabel}`}
                            </small>
                        </div>
                        <span className="chart-legend">
                            <i /> Nhập kho <i /> Xuất kho
                        </span>
                    </div>
                    <div className="stats-chart">
                        <div className="chart-y">
                            {chartTicks.map((tick) => (
                                <span key={tick}>
                                    {tick.toLocaleString("vi-VN")}
                                </span>
                            ))}
                        </div>
                        <div className="stats-chart-bars">
                            {chartData.map((item, index) => (
                                <span
                                    key={`${range}-${index}`}
                                    title={`${axisLabel(index)} · Nhập ${item.inbound} · Xuất ${item.outbound}`}
                                >
                                    <i
                                        style={{
                                            height: `${Math.max(4, (item.inbound / chartMax) * 100)}%`,
                                        }}
                                    />
                                    <b
                                        style={{
                                            height: `${Math.max(4, (item.outbound / chartMax) * 100)}%`,
                                        }}
                                    />
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="chart-x">
                        {axisPoints.map((index) => (
                            <span key={index}>{axisLabel(index)}</span>
                        ))}
                    </div>
                </article>
                <article className="stats-breakdown">
                    <div className="stats-section-title">
                        <div>
                            <b>
                                {low
                                    ? "Mặt hàng cần chú ý"
                                    : processing
                                      ? "Theo chứng từ"
                                      : "Theo danh mục"}
                            </b>
                            <small>
                                {low
                                    ? `${detectedLow} SKU từng chạm ngưỡng trong ${chartLabel.toLowerCase()}`
                                    : processing
                                      ? `Tổng hợp trong ${chartLabel.toLowerCase()}`
                                      : `Tỷ trọng hoạt động trong ${chartLabel.toLowerCase()}`}
                            </small>
                        </div>
                        <button aria-label="Tùy chọn">
                            <MoreHorizontal size={17} />
                        </button>
                    </div>
                    {breakdownRows.map((row) => (
                        <div className="breakdown-row" key={row[0]}>
                            <i className={`breakdown-dot ${row[2]}`} />
                            <span>{row[0]}</span>
                            <b>{row[1]}</b>
                        </div>
                    ))}
                    <button
                        className="breakdown-link"
                        onClick={() => setShowList((value) => !value)}
                    >
                        {showList
                            ? "Thu gọn danh sách"
                            : "Xem danh sách chi tiết"}{" "}
                        <ArrowRight size={14} />
                    </button>
                </article>
            </div>
            {showList && (
                <section className="stats-detail-list">
                    <div>
                        <b>
                            {low
                                ? "Sản phẩm cần theo dõi"
                                : processing
                                  ? "Chứng từ trong kỳ"
                                  : detail
                                    ? "Giao dịch nhập xuất"
                                    : "Sản phẩm theo danh mục"}
                        </b>
                        <small>{chartLabel} · dữ liệu minh họa</small>
                    </div>
                    {low ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>SẢN PHẨM</th>
                                    <th>MÃ SKU</th>
                                    <th>TỒN HIỆN TẠI</th>
                                    <th>MỨC CẢNH BÁO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventoryCatalog
                                    .filter((item) => item.stock <= 10)
                                    .slice(0, detectedLow)
                                    .map((item) => (
                                        <tr key={item.sku}>
                                            <td>{item.name}</td>
                                            <td>{item.sku}</td>
                                            <td>
                                                {item.stock} {item.unit}
                                            </td>
                                            <td>10 {item.unit}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        {processing
                                            ? "MÃ CHỨNG TỪ"
                                            : detail
                                              ? "MÃ GIAO DỊCH"
                                              : "DANH MỤC"}
                                    </th>
                                    <th>THỜI GIAN</th>
                                    <th>{processing ? "LOẠI" : "SỐ LƯỢNG"}</th>
                                    <th>GIÁ TRỊ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chartData
                                    .slice(0, Math.min(8, chartData.length))
                                    .map((item, index) => (
                                        <tr key={`${range}-${index}`}>
                                            <td>
                                                {processing
                                                    ? `${index % 2 ? "PX" : "PN"}-202610${String(21 - index).padStart(2, "0")}-${String(index + 1).padStart(3, "0")}`
                                                    : detail
                                                      ? `GD-${String(index + 1).padStart(4, "0")}`
                                                      : [
                                                            "Điện tử",
                                                            "Gia dụng",
                                                            "Phụ kiện",
                                                            "Khác",
                                                        ][index % 4]}
                                            </td>
                                            <td>{axisLabel(index)}</td>
                                            <td>
                                                {item.inbound} nhập ·{" "}
                                                {item.outbound} xuất
                                            </td>
                                            <td>
                                                {formatValue(
                                                    (item.inbound -
                                                        item.outbound) *
                                                        0.045,
                                                )}{" "}
                                                triệu ₫
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </section>
            )}
            <div className="stats-note">
                <AlertTriangle size={16} />
                <span>
                    <b>Gợi ý:</b>{" "}
                    {low
                        ? "Lập phiếu nhập cho các mặt hàng chạm ngưỡng tối thiểu để duy trì nguồn cung."
                        : processing
                          ? "Hai phiếu nháp đang chờ hoàn tất thông tin để xác nhận."
                          : "Bạn có thể lọc và đối chiếu dữ liệu ở các mục tương ứng trong menu."}
                </span>
            </div>
        </section>
    );
}

export default StatisticsDetail;
