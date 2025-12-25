import React, { useState } from 'react'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './ContactPage.modern.css'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
    setSubmitSuccess(false)
    setSubmitError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitSuccess(false)
    setSubmitError('')
    
    if (!formData.name || !formData.phone || !formData.message) {
      setSubmitError('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setSubmitSuccess(true)
      handleReset()
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 5000)
    }, 1500)
  }

  return (
    <div className="contact-page-modern">
      <Navbar />
      
      <div className="contact-container">
        {/* Hero Section */}
        <div className="contact-hero">
          <div className="hero-icon-contact">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h1>Liên hệ với chúng tôi</h1>
          <p>Đội ngũ hỗ trợ khách hàng 24/7 luôn sẵn sàng giải đáp mọi thắc mắc của bạn</p>
        </div>

        {/* Content Grid */}
        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form-section">
            <div className="form-header">
              <h2>Gửi tin nhắn cho chúng tôi</h2>
              <p>Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 24 giờ</p>
            </div>

            {submitSuccess && (
              <div className="success-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <p>Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
              </div>
            )}

            {submitError && (
              <div className="error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p>{submitError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">
                  Họ và tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  Số điện thoại <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912345678"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Chủ đề</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-select"
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
                <label htmlFor="message">
                  Nội dung tin nhắn <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  className="form-textarea"
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button" disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="loading-spinner-modern" style={{width: 20, height: 20}}></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Gửi tin nhắn
                    </>
                  )}
                </button>
                <button type="button" className="reset-button" onClick={handleReset}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                  Làm mới
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            {/* Hotline Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <h3>Hotline</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <div className="info-text">
                    <p className="info-label">Tổng đài hỗ trợ</p>
                    <p className="info-value"><a href="tel:0123456789">0123-456-789</a></p>
                  </div>
                </div>
                <div className="info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div className="info-text">
                    <p className="info-label">Thời gian hỗ trợ</p>
                    <p className="info-value">24/7 - Cả tuần</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <h3>Email</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <div className="info-text">
                    <p className="info-label">Hỗ trợ khách hàng</p>
                    <p className="info-value"><a href="mailto:support@sanbongda.com">support@sanbongda.com</a></p>
                  </div>
                </div>
                <div className="info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div className="info-text">
                    <p className="info-label">Phản hồi trong</p>
                    <p className="info-value">24 giờ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Card */}
            <div className="info-card">
              <div className="info-card-header">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <h3>Văn phòng</h3>
              </div>
              <div className="info-card-body">
                <div className="info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <div className="info-text">
                    <p className="info-label">Địa chỉ</p>
                    <p className="info-value">144 Xuân Thủy, Cầu Giấy, Hà Nội</p>
                  </div>
                </div>
                <div className="info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div className="info-text">
                    <p className="info-label">Giờ hoạt động</p>
                    <p className="info-value">5:00 - 23:30 hàng ngày</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="info-card social-card">
              <div className="info-card-header">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
                  </svg>
                </div>
                <h3>Kết nối với chúng tôi</h3>
              </div>
              <div className="info-card-body">
                <div className="social-links">
                  <a href="#" className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </a>
                  <a href="#" className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.304-1.654a11.882 11.882 0 005.713 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Zalo
                  </a>
                  <a href="#" className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Instagram
                  </a>
                  <a href="#" className="social-link">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <div className="map-header">
            <h2>Vị trí của chúng tôi</h2>
            <p>144 Xuân Thủy, Cầu Giấy, Hà Nội</p>
          </div>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.657827935076!2d105.79277731476334!3d21.047782785993577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab2c2f7f3f69%3A0x6f3d8e3b3d3c3f3f!2zMTQ0IFh1w6JuIFRo4buveSwgROG7i2NoIFbhu41uZywgQ-G6p3UgR2nhuqV5LCBIw6AgTuG7mWk!5e0!3m2!1svi!2s!4v1703308800000!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ vị trí sân bóng - 144 Xuân Thủy, Cầu Giấy"
            ></iframe>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}