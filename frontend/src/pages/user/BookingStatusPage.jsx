import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ApiClient from '../../services/api'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import './BookingStatusPage.css'

export default function BookingStatusPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const bookingId = searchParams.get('id')
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pollCount, setPollCount] = useState(0)

  // Polling để check status
  useEffect(() => {
    if (!bookingId) {
      setError('Không tìm thấy mã đặt sân')
      setLoading(false)
      return
    }

    const fetchBooking = async () => {
      try {
        const data = await ApiClient.get(`/user/bookings/${bookingId}`)
        setBooking(data)
        setLoading(false)

        // Nếu đã confirmed hoặc rejected thì dừng polling
        if (data.status === 'confirmed' || data.status === 'rejected' || data.status === 'cancelled') {
          return true // Signal to stop polling
        }
        return false
      } catch (err) {
        console.error('Failed to fetch booking:', err)
        setError(err.message || 'Không thể tải thông tin đặt sân')
        setLoading(false)
        return true // Stop polling on error
      }
    }

    // Initial fetch
    fetchBooking()

    // Poll every 5 seconds, max 60 times (5 minutes)
    const interval = setInterval(async () => {
      setPollCount(prev => prev + 1)
      const shouldStop = await fetchBooking()
      
      if (shouldStop || pollCount >= 60) {
        clearInterval(interval)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [bookingId, pollCount])

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: '⏳',
          text: 'Đang chờ duyệt',
          color: '#f59e0b',
          description: 'Yêu cầu đặt sân của bạn đang được xem xét. Vui lòng đợi quản trị viên xác nhận.'
        }
      case 'confirmed':
        return {
          icon: '✅',
          text: 'Đã xác nhận',
          color: '#10b981',
          description: 'Đặt sân thành công! Vui lòng đến sân đúng giờ.'
        }
      case 'rejected':
        return {
          icon: '❌',
          text: 'Đã từ chối',
          color: '#ef4444',
          description: 'Yêu cầu đặt sân của bạn đã bị từ chối. Vui lòng liên hệ để biết thêm chi tiết.'
        }
      case 'cancelled':
        return {
          icon: '🚫',
          text: 'Đã hủy',
          color: '#6b7280',
          description: 'Đặt sân đã bị hủy.'
        }
      default:
        return {
          icon: '❓',
          text: 'Không xác định',
          color: '#9ca3af',
          description: 'Trạng thái không xác định.'
        }
    }
  }

  if (loading && !booking) {
    return (
      <div className="booking-status-page">
        <Navbar />
        <div className="status-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải thông tin đặt sân...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="booking-status-page">
        <Navbar />
        <div className="status-container">
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <h2>Có lỗi xảy ra</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/user/fields')} className="btn-back">
              Quay lại danh sách sân
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const statusInfo = getStatusInfo(booking?.status)

  return (
    <div className="booking-status-page">
      <Navbar />
      
      <div className="status-container">
        <div className="status-card">
          {/* Status Header */}
          <div className="status-header" style={{ borderColor: statusInfo.color }}>
            <div className="status-icon" style={{ background: statusInfo.color }}>
              {statusInfo.icon}
            </div>
            <h1 style={{ color: statusInfo.color }}>{statusInfo.text}</h1>
            <p className="status-description">{statusInfo.description}</p>
          </div>

          {/* Booking Details */}
          <div className="booking-details">
            <h2>Thông tin đặt sân</h2>
            
            <div className="detail-row">
              <span className="detail-label">Mã đặt sân:</span>
              <span className="detail-value">#{booking?.booking_id}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Sân:</span>
              <span className="detail-value">{booking?.field_name}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Địa điểm:</span>
              <span className="detail-value">{booking?.location}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Thời gian:</span>
              <span className="detail-value">
                {booking?.start_time && new Date(booking.start_time).toLocaleString('vi-VN')}
                {' - '}
                {booking?.end_time && new Date(booking.end_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Giá:</span>
              <span className="detail-value highlight">
                {booking?.price?.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>

            {booking?.note && (
              <div className="detail-row">
                <span className="detail-label">Ghi chú:</span>
                <span className="detail-value">{booking.note}</span>
              </div>
            )}
          </div>

          {/* Polling Indicator */}
          {booking?.status === 'pending' && (
            <div className="polling-indicator">
              <div className="pulse-dot"></div>
              <span>Đang tự động kiểm tra trạng thái...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            {booking?.status === 'pending' && (
              <button 
                onClick={() => window.location.reload()} 
                className="btn-refresh"
              >
                🔄 Làm mới
              </button>
            )}
            
            {/* {booking?.status === 'confirmed' && (
              <button 
                onClick={() => navigate('/user/booking?id=' + bookingId)} 
                className="btn-payment"
              >
                💳 Thanh toán
              </button>
            )} */}

            <button 
              onClick={() => navigate('/user/booking-history')} 
              className="btn-back"
            >
              ← Quay lại
            </button>
          </div>

          {/* Help Text */}
          {booking?.status === 'pending' && (
            <div className="help-text">
              <p>💡 <strong>Mẹo:</strong> Trang này sẽ tự động cập nhật khi quản trị viên duyệt yêu cầu của bạn.</p>
              <p>Thời gian duyệt trung bình: <strong>2-5 phút</strong></p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}