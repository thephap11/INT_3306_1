import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import './RegisterPage.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    person_name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    // Validation
    if (!formData.person_name || !formData.email || !formData.phone || !formData.username || !formData.password || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, ...registerData } = formData
      const response = await authAPI.register(registerData)
      
      if (response.success) {
        setSuccess(true)
        
        // Chuyển hướng sau 2 giây
        setTimeout(() => {
          navigate('/user/login')
        }, 2000)
      } else {
        setError(response.message || 'Đăng ký thất bại')
      }
    } catch (err) {
      console.error('Register error:', err)
      setError(err.message || 'Có lỗi xảy ra khi đăng ký')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-header">
            <h1>Đăng ký tài khoản</h1>
            <p>Tạo tài khoản mới để bắt đầu đặt sân</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="person_name">Họ và tên</label>
              <input
                id="person_name"
                type="text"
                name="person_name"
                value={formData.person_name}
                onChange={handleChange}
                placeholder="Nhập họ và tên đầy đủ"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập username (3-45 ký tự)"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại (10 chữ số)"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
                disabled={loading}
              />
            </div>

            <div className="form-checkbox">
              <label>
                <input type="checkbox" required disabled={loading} />
                <span>
                  Tôi đồng ý với <Link to="/terms">Điều khoản dịch vụ</Link> và{' '}
                  <Link to="/privacy">Chính sách bảo mật</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Đã có tài khoản? <Link to="/user/login">Đăng nhập ngay</Link>
            </p>
          </div>

          <div className="auth-divider">
            <span>Hoặc đăng ký bằng</span>
          </div>

          <div className="social-login">
            <button className="social-btn google" disabled={loading}>
              <span>🔍</span> Google
            </button>
            <button className="social-btn facebook" disabled={loading}>
              <span>f</span> Facebook
            </button>
          </div>

          <div className="back-home">
            <Link to="/">← Quay lại trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  )
}