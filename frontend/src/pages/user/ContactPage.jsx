import React, { useState } from 'react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './ContactPage.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      alert('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
      setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="contact-page">
      <Navbar />
      
      <div className="contact-container">
        <div className="contact-header">
          <h1>📞 Liên hệ với chúng tôi</h1>
          <p className="header-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>

        <div className="contact-content">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Gửi tin nhắn</h2>
              <p className="form-description">
                Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ.
              </p>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Họ và tên *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123456789"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Chủ đề</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="booking">Đặt sân</option>
                    <option value="payment">Thanh toán</option>
                    <option value="cancel">Hủy/Đổi lịch</option>
                    <option value="complaint">Khiếu nại</option>
                    <option value="feedback">Góp ý</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Nội dung *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    rows="6"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2>📍 Thông tin liên hệ</h2>
              
              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">📞</div>
                  <h3>Hotline</h3>
                  <p className="info-value">0123-456-789</p>
                  <p className="info-sub">Hỗ trợ 24/7</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">📧</div>
                  <h3>Email</h3>
                  <p className="info-value">support@sanbongda.com</p>
                  <p className="info-sub">Phản hồi trong 24h</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">🏢</div>
                  <h3>Văn phòng</h3>
                  <p className="info-value">123 Đường ABC, Q. Cầu Giấy</p>
                  <p className="info-sub">Hà Nội, Việt Nam</p>
                </div>

                <div className="info-card">
                  <div className="info-icon">🕒</div>
                  <h3>Giờ làm việc</h3>
                  <p className="info-value">5:00 - 23:30</p>
                  <p className="info-sub">Hàng ngày (kể cả lễ)</p>
                </div>
              </div>

              {/* Social Media */}
              <div className="social-section">
                <h3>🌐 Kết nối với chúng tôi</h3>
                <div className="social-links">
                  <a href="#" className="social-link facebook">
                    <span className="social-icon">📘</span>
                    Facebook
                  </a>
                  <a href="#" className="social-link zalo">
                    <span className="social-icon">💬</span>
                    Zalo
                  </a>
                  <a href="#" className="social-link instagram">
                    <span className="social-icon">📷</span>
                    Instagram
                  </a>
                  <a href="#" className="social-link youtube">
                    <span className="social-icon">🎥</span>
                    YouTube
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="quick-links-section">
                <h3>🔗 Liên kết nhanh</h3>
                <div className="quick-links">
                  <a href="/user/fields">🏟️ Đặt sân ngay</a>
                  <a href="/user/policy">📋 Chính sách</a>
                  <a href="/user/review">⭐ Đánh giá</a>
                  <a href="/user">🏠 Trang chủ</a>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h2>🗺️ Vị trí của chúng tôi</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.4964469358277!2d105.78518631476282!3d21.01380869358887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab4cd0c66f05%3A0xea31563511af2e8!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgLSBIV1VT!5e0!3m2!1svi!2s!4v1637232845678!5m2!1svi!2s"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps - Vị trí sân bóng"
              ></iframe>
              
              <div className="map-overlay">
                <button 
                  className="btn-directions"
                  onClick={() => window.open('https://www.google.com/maps/dir//21.013800,105.787386', '_blank')}
                >
                  🧭 Chỉ đường
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="faq-section">
            <h2>❓ Câu hỏi thường gặp</h2>
            <div className="faq-grid">
              <div className="faq-card">
                <h3>Làm sao để đặt sân?</h3>
                <p>Truy cập mục "Đặt sân", chọn sân và khung giờ phù hợp, điền thông tin và xác nhận thanh toán.</p>
              </div>

              <div className="faq-card">
                <h3>Thời gian xác nhận đặt sân?</h3>
                <p>Quản lý sẽ xác nhận trong vòng 30 phút. Bạn sẽ nhận được email/SMS thông báo.</p>
              </div>

              <div className="faq-card">
                <h3>Làm sao để hủy/đổi lịch?</h3>
                <p>Liên hệ hotline 0123-456-789 hoặc gửi email. Xem chính sách hủy/đổi lịch để biết thêm chi tiết.</p>
              </div>

              <div className="faq-card">
                <h3>Các hình thức thanh toán?</h3>
                <p>Chấp nhận tiền mặt, chuyển khoản, Momo, ZaloPay, VNPay. Đặt cọc 50% trước.</p>
              </div>

              <div className="faq-card">
                <h3>Sân có cho thuê bóng không?</h3>
                <p>Có, sân cung cấp bóng miễn phí. Bạn cũng có thể mang bóng riêng.</p>
              </div>

              <div className="faq-card">
                <h3>Có bãi đỗ xe không?</h3>
                <p>Có, tất cả các sân đều có bãi đỗ xe rộng rãi và miễn phí cho khách hàng.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}