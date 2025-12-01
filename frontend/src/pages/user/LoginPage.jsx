import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { showSuccess, showError } from '../../components/Toast'
import ToastContainer from '../../components/Toast'
import './LoginPage.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
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
    setLoading(true)

    // Validation
    if (!formData.username || !formData.password) {
      setError('Vui lòng điền đầy đủ thông tin')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.login(formData)
      
      if (response.success) {
        const user = response.data.user
        
        // Dispatch custom event to update RoleSwitcher
        window.dispatchEvent(new Event('userUpdated'));
        
        // Show success toast based on role
        if (user.role === 'admin') {
          showSuccess(`🎉 Chào mừng Admin ${user.username}! Đăng nhập thành công`)
          navigate('/admin/dashboard')
        } else if (user.role === 'manager') {
          showSuccess(`👔 Chào mừng Manager ${user.username}! Đăng nhập thành công`)
          navigate('/manager/bookings')
        } else {
          showSuccess(`👋 Xin chào ${user.username}! Đăng nhập thành công`)
          navigate('/user')
        }
      } else {
        showError(response.message || 'Đăng nhập thất bại')
      }
    } catch (err) {
      console.error('Login error:', err)
      showError(err.message || 'Có lỗi xảy ra khi đăng nhập')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <ToastContainer />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Đăng nhập</h1>
            <p>Chào mừng bạn quay trở lại!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username hoặc Email</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập username hoặc email"
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
                placeholder="Nhập mật khẩu"
                required
                disabled={loading}
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" disabled={loading} />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/user/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Chưa có tài khoản? <Link to="/user/register">Đăng ký ngay</Link>
            </p>
          </div>

          <div className="auth-divider">
            <span>Hoặc đăng nhập bằng</span>
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