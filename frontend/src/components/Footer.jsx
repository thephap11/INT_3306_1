import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-subscribe">
        <div className="footer-container">
          <div className="subscribe-content">
            <img src="/images/icons/player-icon.svg" alt="Player" className="subscribe-image" />
            <div className="subscribe-text">
              <h3>Đăng mẫu đăng ký sử dụng</h3>
              <p>Nhận thông tin khuyến mãi và ưu đãi miễn phí</p>
            </div>
          </div>
          <div className="subscribe-form">
            <input type="text" placeholder="Họ & Tên *" className="subscribe-input" />
            <input type="tel" placeholder="Số Điện Thoại *" className="subscribe-input" />
            <input type="email" placeholder="Email" className="subscribe-input" />
            <button className="subscribe-btn">Gửi</button>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-section">
            <h4>GIỚI THIỆU</h4>
            <ul>
              <li>Sân sân 24/7 cùng các loại hình đa dạng gồm cỏ nhân tạo sân bãi-cỏ tự nhiên-sân futsal dành cho những ai yêu thích bóng đá</li>
              <li><Link to="/user/fields">Chính sách hoàn tiền</Link></li>
              <li><Link to="/user/fields">Chính sách sử dụng dịch vụ</Link></li>
              <li><Link to="/user/fields">Chính sách bảo mật thông tin</Link></li>
              <li><Link to="/user/fields">Chính sách thanh toán</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>THÔNG TIN</h4>
            <ul>
              <li>📍 Công Ty CP DHPoT Booking 24/7</li>
              <li>📞 Liên: @01234XXXX</li>
              <li>✉️ Email: @DHPoTBooking247.com</li>
              <li>🏢 Địa chỉ: Lô 8-9 khu A1 ĐHQG TP.Dương Quá, Phường Đông Hòa, Thành phố Dĩ An, Tỉnh Bình Dương</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>LIÊN HỆ</h4>
            <p>Nhận tin khuyến mãi</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Email" />
              <button>Gửi ngay</button>
            </div>
            <div className="social-links">
              <h5>TÌM CHÚNG TÔI</h5>
              <div className="social-icons">
                <a href="https://facebook.com" aria-label="Facebook">f</a>
                <a href="https://instagram.com" aria-label="Instagram">📷</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© DHPoT2025 - Hệ thống quản lý sân bóng DHPoT247</p>
        <div className="footer-bottom-links">
          <Link to="/user/fields">Danh sách sân bãi</Link>
          <Link to="/user/booking">Đặt lịch</Link>
          <Link to="/user/support">Liên hệ</Link>
        </div>
      </div>
    </footer>
  )
}