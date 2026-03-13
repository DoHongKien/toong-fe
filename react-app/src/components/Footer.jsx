import { Link } from 'react-router-dom'
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react'

const Footer = ({ minimal = false }) => {
  if (minimal) {
    return (
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; 2026 Tổ Kiến Adventure. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <Link to="/" className="logo footer-logo" aria-label="Tổ Kiến Adventure">
              <span className="logo-text text-white">
                Tổ Kiến<span>ADVENTURE</span>
              </span>
            </Link>
            <p>
              Đơn vị tổ chức uy tín, chuyên nghiệp hàng đầu về trekking tại Việt Nam. Giúp bạn kết nối với thiên nhiên
              an toàn và trọn vẹn.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" tabIndex={0}>
                <Facebook />
              </a>
              <a href="#" aria-label="Instagram" tabIndex={0}>
                <Instagram />
              </a>
              <a href="#" aria-label="Youtube" tabIndex={0}>
                <Youtube />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Về Tổ Kiến</h4>
            <ul>
              <li>
                <a href="#" tabIndex={0}>Câu Chuyện Của Chúng Tôi</a>
              </li>
              <li>
                <a href="#" tabIndex={0}>Đội Ngũ</a>
              </li>
              <li>
                <a href="#" tabIndex={0}>Trách Nhiệm Cộng Đồng</a>
              </li>
              <li>
                <a href="#" tabIndex={0}>Quy Định An Toàn</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Tour Nổi Bật</h4>
            <ul>
              <li>
                <a href="#" tabIndex={0}>Tà Năng - Phan Dũng</a>
              </li>
              <li>
                <a href="#" tabIndex={0}>Các Cung Miền Nam</a>
              </li>
              <li>
                <a href="#" tabIndex={0}>Khám Phá Cực Đông</a>
              </li>
              <li>
                <a href="#" tabIndex={0}>Lịch Khởi Hành</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Liên Hệ</h4>
            <ul className="contact-info">
              <li>
                <MapPin /> 123 Đường Adventure, TP.HCM
              </li>
              <li>
                <Phone /> +84 123 456 789
              </li>
              <li>
                <Mail /> hello@toongadventure.com
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Tổ Kiến Adventure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
