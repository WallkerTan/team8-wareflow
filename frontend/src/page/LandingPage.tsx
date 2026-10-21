import React from "react";
import "./landingPage.css";
const LandingPage = () => {
    return (
        <>
            <header className="navbar">
                <a className="logo" href="#">
                    <span>W</span>ware<b>flow</b>
                </a>
                <nav>
                    <a href="#features">Tính năng</a>
                    <a href="#process">Quy trình</a>
                    <a href="#contact">Liên hệ</a>
                </nav>
                <div className="nav-actions">
                    <a href="#contact">Đăng nhập</a>
                    <a className="button small" href="#contact">
                        Dùng thử miễn phí <strong>→</strong>
                    </a>
                </div>
            </header>
            <main>
                <section className="hero">
                    <div className="hero-copy">
                        <p className="eyebrow">
                            <i /> QUẢN LÝ KHO THẾ HỆ MỚI
                        </p>
                        <h1>
                            Vận hành kho
                            <br />
                            <em>thông minh hơn.</em>
                        </h1>
                        <p className="lead">
                            Wareflow giúp bạn kiểm soát hàng tồn, đơn hàng và
                            logistics trong một nền tảng đơn giản, trực quan và
                            hiệu quả.
                        </p>
                        <div className="actions">
                            <a className="button" href="#contact">
                                Bắt đầu miễn phí <strong>→</strong>
                            </a>
                            <a className="watch" href="#process">
                                ◉ &nbsp; Xem cách hoạt động
                            </a>
                        </div>
                        <p className="proof">
                            <span className="avatars">
                                <b>AN</b>
                                <b>MK</b>
                                <b>LT</b>
                                <b>+</b>
                            </span>
                            <span>
                                <strong>2,000+</strong> doanh nghiệp đang vận
                                hành cùng Wareflow
                            </span>
                        </p>
                    </div>
                    <div className="dashboard-wrap">
                        <div className="dashboard">
                            <div className="window-bar">
                                <span>● ● ●</span>
                                <small>wareflow / dashboard</small>
                                <b>•••</b>
                            </div>
                            <div className="dash-layout">
                                <aside>
                                    <a className="dash-brand">
                                        <span>W</span> wareflow
                                    </a>
                                    <label>WORKSPACE</label>
                                    <a className="selected">
                                        ⌂ &nbsp; Tổng quan
                                    </a>
                                    <a>▦ &nbsp; Kho hàng</a>
                                    <a>□ &nbsp; Đơn hàng</a>
                                    <a>↗ &nbsp; Vận chuyển</a>
                                    <a>▤ &nbsp; Báo cáo</a>
                                    <div className="aside-bottom">
                                        <label>HỆ THỐNG</label>
                                        <a>⚙ &nbsp; Cài đặt</a>
                                    </div>
                                </aside>
                                <div className="dash-main">
                                    <div className="greeting">
                                        <div>
                                            <small>
                                                THỨ HAI, 21 THÁNG 10, 2026
                                            </small>
                                            <h3>
                                                Chào buổi sáng, Minh <em>✦</em>
                                            </h3>
                                        </div>
                                        <span className="user">M</span>
                                    </div>
                                    <div className="dash-title">
                                        <div>
                                            <h2>Tổng quan</h2>
                                            <p>
                                                Theo dõi hoạt động kho của bạn
                                                hôm nay.
                                            </p>
                                        </div>
                                        <button>Tuần này⌄</button>
                                    </div>
                                    <div className="metrics">
                                        <article className="blue">
                                            <span>↗</span>
                                            <small>Đơn chờ xử lý</small>
                                            <strong>128</strong>
                                            <label>
                                                +12% so với tuần trước
                                            </label>
                                        </article>
                                        <article className="green">
                                            <span>✓</span>
                                            <small>Đang vận chuyển</small>
                                            <strong>64</strong>
                                            <label>
                                                +12% so với tuần trước
                                            </label>
                                        </article>
                                        <article className="orange">
                                            <span>◔</span>
                                            <small>Giao đúng hạn</small>
                                            <strong>98.6%</strong>
                                            <label>
                                                +2.4% so với tuần trước
                                            </label>
                                        </article>
                                    </div>
                                    <div className="panels">
                                        <article className="chart-card">
                                            <div className="panel-title">
                                                <div>
                                                    <b>Luồng hàng hóa</b>
                                                    <small>
                                                        Hiệu suất xử lý theo
                                                        ngày
                                                    </small>
                                                </div>
                                                <span>
                                                    ● Xuất kho &nbsp; <i>●</i>{" "}
                                                    Nhập kho
                                                </span>
                                            </div>
                                            <div className="chart">
                                                <div className="bars">
                                                    <i
                                                        style={{
                                                            height: "40%",
                                                        }}
                                                    />
                                                    <i
                                                        style={{
                                                            height: "62%",
                                                        }}
                                                    />
                                                    <i
                                                        style={{
                                                            height: "48%",
                                                        }}
                                                    />
                                                    <i
                                                        style={{
                                                            height: "76%",
                                                        }}
                                                    />
                                                    <i
                                                        style={{
                                                            height: "56%",
                                                        }}
                                                    />
                                                    <i
                                                        style={{
                                                            height: "88%",
                                                        }}
                                                    />
                                                    <i
                                                        style={{
                                                            height: "68%",
                                                        }}
                                                    />
                                                </div>
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
                                        </article>
                                        <article className="stock-card">
                                            <div className="panel-title">
                                                <div>
                                                    <b>Tình trạng tồn kho</b>
                                                    <small>
                                                        Phân bổ theo danh mục
                                                    </small>
                                                </div>
                                                <b>•••</b>
                                            </div>
                                            <div className="donut">
                                                <strong>
                                                    12.8K<small>Sản phẩm</small>
                                                </strong>
                                            </div>
                                            <p>
                                                ● Điện tử <b>42%</b>
                                            </p>
                                            <p>
                                                ● Gia dụng <b>28%</b>
                                            </p>
                                            <p>
                                                ● Thời trang <b>30%</b>
                                            </p>
                                        </article>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="trusted">
                    <span>
                        Được tin dùng bởi các đội ngũ đang phát triển nhanh
                    </span>
                    <div>
                        <b>Northstar</b>
                        <b>Veloce</b>
                        <b>morrow</b>
                        <b>ELEMENT</b>
                        <b>orbit</b>
                    </div>
                </section>
                <section className="features" id="features">
                    <div>
                        <small>01</small>
                        <h2>
                            Mọi thứ bạn cần.
                            <br />
                            <em>Trong một nơi.</em>
                        </h2>
                    </div>
                    <p>
                        Từ nhập kho đến giao hàng, Wareflow kết nối toàn bộ quy
                        trình để đội ngũ của bạn luôn đi trước một bước.
                    </p>
                    <a href="#process">↗</a>
                </section>
                <section className="process" id="process">
                    <p className="eyebrow">QUY TRÌNH LIỀN MẠCH</p>
                    <h2>
                        Ít thao tác hơn.
                        <br />
                        <em>Nhiều kết quả hơn.</em>
                    </h2>
                    <div className="steps">
                        <div>
                            <b>01</b>
                            <span>Nhập kho</span>
                        </div>
                        <div>
                            <b>02</b>
                            <span>Điều phối</span>
                        </div>
                        <div>
                            <b>03</b>
                            <span>Giao hàng</span>
                        </div>
                    </div>
                </section>
            </main>
            <footer id="contact">
                <a className="logo" href="#">
                    <span>W</span>ware<b>flow</b>
                </a>
                <p>Simplify your flow.</p>
                <a className="button small" href="mailto:hello@wareflow.vn">
                    Liên hệ với chúng tôi →
                </a>
            </footer>
        </>
    );
};

export default LandingPage;
