import {
  FacebookFilled,
  YoutubeFilled,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      {/* === ROW 1: Main Footer Content === */}
      <div className="footer__main">
        <div className="footer__container">
          {/* Cột 1: Về GearVN */}
          <div className="footer__col">
            <h4 className="footer__heading">VỀ TTG SHOP</h4>
            <ul className="footer__links">
              <li>
                <a href="#">Giới thiệu</a>
              </li>
              <li>
                <a href="#">Tuyển dụng</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
            </ul>
          </div>

          {/* Cột 2: Chính sách */}
          <div className="footer__col">
            <h4 className="footer__heading">CHÍNH SÁCH</h4>
            <ul className="footer__links">
              <li>
                <a href="#">Chính sách bảo hành</a>
              </li>
              <li>
                <a href="#">Chính sách giao hàng</a>
              </li>
              <li>
                <a href="#">Chính sách bảo mật</a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Thông tin */}
          <div className="footer__col">
            <h4 className="footer__heading">THÔNG TIN</h4>
            <ul className="footer__links">
              <li>
                <a href="#">Hệ thống cửa hàng</a>
              </li>
              <li>
                <a href="#">Hướng dẫn mua hàng</a>
              </li>
              <li>
                <a href="#">Hướng dẫn thanh toán</a>
              </li>
              <li>
                <a href="#">Hướng dẫn trả góp</a>
              </li>
              <li>
                <a href="#">Tra cứu địa chỉ bảo hành</a>
              </li>
              <li>
                <a href="#">Build PC</a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Tổng đài hỗ trợ */}
          <div className="footer__col">
            <h4 className="footer__heading">
              TỔNG ĐÀI HỖ TRỢ{" "}
              <span className="footer__heading-sub">(8:00 - 21:00)</span>
            </h4>
            <ul className="footer__contact">
              <li>
                <PhoneOutlined className="footer__contact-icon" />
                <span className="footer__contact-label">Mua hàng:</span>
                <a href="tel:19005301" className="footer__contact-value">
                  1900.5301
                </a>
              </li>
              <li>
                <PhoneOutlined className="footer__contact-icon" />
                <span className="footer__contact-label">Bảo hành:</span>
                <a href="tel:19005325" className="footer__contact-value">
                  1900.5325
                </a>
              </li>
              <li>
                <PhoneOutlined className="footer__contact-icon" />
                <span className="footer__contact-label">Khiếu nại:</span>
                <a href="tel:18006173" className="footer__contact-value">
                  1800.6173
                </a>
              </li>
              <li>
                <MailOutlined className="footer__contact-icon" />
                <span className="footer__contact-label">Email:</span>
                <a
                  href="mailto:cskh@gearvn.com"
                  className="footer__contact-value"
                >
                  cskh@ttgshop.com
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 5: Vận chuyển + Thanh toán */}
          <div className="footer__col footer__col--badges">
            <div className="footer__badge-group">
              <h4 className="footer__heading">ĐƠN VỊ VẬN CHUYỂN</h4>
              <div className="footer__badge-list">
                <span className="footer__badge footer__badge--img">
                  <img src="https://th.bing.com/th/id/OIP.1W15HgCGGPM_56XZdGJ2bQHaEO?w=325&h=185&c=7&r=0&o=7&pid=1.7&rm=3" alt="GHN Express" />
                </span>
                <span className="footer__badge footer__badge--img">
                  <img src="https://th.bing.com/th/id/OIP.LRlpEBUR4n4_jX6du4LDhAHaCF?w=339&h=98&c=7&r=0&o=7&pid=1.7&rm=3" alt="EMS" />
                </span>
                <span className="footer__badge footer__badge--gvn">
                  <strong>GVN</strong><small>LOGISTIC</small>
                </span>
              </div>
            </div>
            <div className="footer__badge-group">
              <h4 className="footer__heading">CÁCH THỨC THANH TOÁN</h4>
              <div className="footer__badge-list">
                <span className="footer__badge footer__badge--banking">🏦 Internet Banking</span>
                <span className="footer__badge footer__badge--img">
                  <img src="https://th.bing.com/th/id/ODF.Dv1k0m5_D3wHpb6C8UVy6A?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2" alt="JCB" />
                </span>
                <span className="footer__badge footer__badge--img">
                  <img src="https://th.bing.com/th/id/OIP.kyLKiccpv-QRkzV9nvv9KAHaEK?w=308&h=180&c=7&r=0&o=7&pid=1.7&rm=3" alt="MasterCard" />
                </span>
                <span className="footer__badge footer__badge--img">
                  <img src="https://tse1.mm.bing.net/th/id/OIP.U4frfNbAF0UkeZ5Ii62SPQHaB_?r=0&w=750&h=202&rs=1&pid=ImgDetMain&o=7&rm=3" alt="ZaloPay" />
                </span>
                <span className="footer__badge footer__badge--cash">💵 Tiền mặt</span>
                <span className="footer__badge footer__badge--installment">Trả góp <strong>0%</strong></span>
                <span className="footer__badge footer__badge--img">
                  <img src="https://th.bing.com/th/id/OIP.ygZGQKeZ0aBwHS7e7wbJVgHaDA?w=346&h=142&c=7&r=0&o=7&pid=1.7&rm=3" alt="VISA" />
                </span>
                <span className="footer__badge footer__badge--img">
                  <img src="https://th.bing.com/th/id/OIP.-DhgkiQDEdoru7CJdZrwEAHaHa?w=177&h=180&c=7&r=0&o=7&pid=1.7&rm=3" alt="MoMo" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === ROW 2: Bottom bar === */}
      <div className="footer__bottom">
        <div className="footer__container">
          <div className="footer__social">
            <span className="footer__social-label">KẾT NỐI VỚI CHÚNG TÔI</span>
            <div className="footer__social-icons">
              <a
                href="#"
                className="footer__social-icon footer__social-icon--facebook"
                aria-label="Facebook"
              >
                <FacebookFilled />
              </a>
              <a
                href="#"
                className="footer__social-icon footer__social-icon--tiktok"
                aria-label="TikTok"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
                </svg>
              </a>
              <a
                href="#"
                className="footer__social-icon footer__social-icon--youtube"
                aria-label="YouTube"
              >
                <YoutubeFilled />
              </a>
              <a
                href="#"
                className="footer__social-icon footer__social-icon--zalo"
                aria-label="Zalo"
              >
                <span style={{ fontSize: 11, fontWeight: 700 }}>Zalo</span>
              </a>
              <a
                href="#"
                className="footer__social-icon footer__social-icon--community"
                aria-label="Cộng đồng"
              >
                <TeamOutlined />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
