import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { passwordResetAPI } from '../../services/api'
import './ForgotPasswordPage.css'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: OTP, 3: new password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)

  // Handle countdown for resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!formData.email) {
      setError('Vui lòng nhập email')
      setLoading(false)
      return
    }

    try {
      const response = await passwordResetAPI.forgotPassword(formData.email)
      
      if (response.success) {
        setSuccess('Mã OTP đã được gửi đến email của bạn')
        setStep(2)
        setCountdown(60)
        setCanResend(false)
      } else {
        setError(response.message || 'Có lỗi xảy ra')
      }
    } catch (err) {
      console.error('Request OTP error:', err)
      setError(err.message || 'Không thể gửi mã OTP')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!formData.otp || formData.otp.length !== 6) {
      setError('Vui lòng nhập mã OTP 6 chữ số')
      setLoading(false)
      return
    }

    try {
      const response = await passwordResetAPI.verifyOTP(formData.email, formData.otp)
      
      if (response.success) {
        setSuccess('Xác thực thành công')
        setStep(3)
      } else {
        setError(response.message || 'Mã OTP không hợp lệ')
      }
    } catch (err) {
      console.error('Verify OTP error:', err)
      setError(err.message || 'Mã OTP không hợp lệ hoặc đã hết hạn')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      setLoading(false)
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      setLoading(false)
      return
    }

    try {
      const response = await passwordResetAPI.resetPassword(
        formData.email,
        formData.otp,
        formData.newPassword
      )
      
      if (response.success) {
        setSuccess('Đặt lại mật khẩu thành công!')
        setTimeout(() => {
          navigate('/user/login')
        }, 2000)
      } else {
        setError(response.message || 'Đặt lại mật khẩu thất bại')
      }
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err.message || 'Có lỗi xảy ra khi đặt lại mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await passwordResetAPI.resendOTP(formData.email)
      
      if (response.success) {
        setSuccess('Mã OTP mới đã được gửi')
        setCountdown(60)
        setCanResend(false)
      } else {
        setError(response.message || 'Không thể gửi lại mã OTP')
      }
    } catch (err) {
      console.error('Resend OTP error:', err)
      setError(err.message || 'Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Quên mật khẩu</h1>
            <p>
              {step === 1 && 'Nhập email để nhận mã xác thực'}
              {step === 2 && 'Nhập mã OTP đã gửi đến email'}
              {step === 3 && 'Tạo mật khẩu mới'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="reset-progress">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Email</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">OTP</span>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Mật khẩu</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="auth-form">
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

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">Mã OTP (6 chữ số)</label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Nhập mã OTP"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                  disabled={loading}
                  className="otp-input"
                />
                <small className="form-hint">
                  Mã OTP đã được gửi đến <strong>{formData.email}</strong>
                </small>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
              </button>

              <div className="resend-container">
                {canResend ? (
                  <button 
                    type="button" 
                    onClick={handleResendOTP} 
                    className="resend-btn"
                    disabled={loading}
                  >
                    Gửi lại mã OTP
                  </button>
                ) : (
                  <span className="countdown">
                    Gửi lại sau {countdown}s
                  </span>
                )}
              </div>

              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="back-btn"
                disabled={loading}
              >
                ← Thay đổi email
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <input
                  id="newPassword"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
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
                  placeholder="Nhập lại mật khẩu mới"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          )}

          <div className="auth-footer">
            <p>
              Nhớ mật khẩu? <Link to="/user/login">Đăng nhập ngay</Link>
            </p>
          </div>

          <div className="back-home">
            <Link to="/">← Quay lại trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  )
}