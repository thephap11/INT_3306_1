import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import ApiClient, { authAPI } from '../../services/api'
import './BookingHistoryPage.css'

export default function BookingHistoryPage() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    // Kiểm tra đăng nhập
    if (!authAPI.isAuthenticated()) {
      navigate('/user/login')
      return
    }

    fetchBookingHistory()
  }, [navigate])

  const fetchBookingHistory = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const currentUser = authAPI.getCurrentUser()
      if (!currentUser) {
        navigate('/user/login')
        return
      }

      // Get all bookings for current user
      const response = await ApiClient.get(`/user/bookings/history?customer_id=${currentUser.person_id}`)
      setBookings(response || [])
    } catch (err) {
      console.error('Failed to fetch booking history:', err)
      setError('Không thể tải lịch sử đặt sân')
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { text: 'Chờ duyệt', class: 'status-pending', icon: '⏳' },
      confirmed: { text: 'Đã xác nhận', class: 'status-confirmed', icon: '✅' },
      rejected: { text: 'Đã từ chối', class: 'status-rejected', icon: '❌' },
      cancelled: { text: 'Đã hủy', class: 'status-cancelled', icon: '🚫' },
      completed: { text: 'Hoàn thành', class: 'status-completed', icon: '🎉' }
    }
    return statusMap[status] || { text: status, class: 'status-unknown', icon: '❓' }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đặt sân này?')) {
      return
    }

    try {
      await ApiClient.put(`/user/bookings/${bookingId}`, {
        status: 'cancelled'
      })
      
      alert('Hủy đặt sân thành công')
      fetchBookingHistory()
    } catch (err) {
      console.error('Failed to cancel booking:', err)
      alert('Không thể hủy đặt sân: ' + (err.message || 'Vui lòng thử lại'))
    }
  }

  const filteredBookings = bookings
    .filter(booking => {
      if (filterStatus === 'all') return true
      return booking.status === filterStatus
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at)
      } else if (sortBy === 'date') {
        return new Date(b.start_time) - new Date(a.start_time)
      }
      return 0
    })

  if (loading) {
    return (
      <div className="booking-history-page">
        <Navbar />
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải lịch sử đặt sân...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="booking-history-page">
        <Navbar />
        <div className="container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            <button onClick={fetchBookingHistory} className="btn-retry">
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="booking-history-page">
      <Navbar />
      
      <div className="history-container">
        <div className="history-header">
          <h1>📅 Lịch sử đặt sân</h1>
          <p className="subtitle">Quản lý và theo dõi các lần đặt sân của bạn</p>
        </div>

        {/* Filters and Stats */}
        <div className="history-controls">
          <div className="filter-section">
            <label>Lọc theo trạng thái:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                Tất cả ({bookings.length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                onClick={() => setFilterStatus('pending')}
              >
                Chờ duyệt ({bookings.filter(b => b.status === 'pending').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'confirmed' ? 'active' : ''}`}
                onClick={() => setFilterStatus('confirmed')}
              >
                Đã xác nhận ({bookings.filter(b => b.status === 'confirmed').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilterStatus('rejected')}
              >
                Đã từ chối ({bookings.filter(b => b.status === 'rejected').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
                onClick={() => setFilterStatus('cancelled')}
              >
                Đã hủy ({bookings.filter(b => b.status === 'cancelled').length})
              </button>
            </div>
          </div>

          <div className="sort-section">
            <label htmlFor="sort">Sắp xếp:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="date">Ngày đặt sân</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bookings-list">
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Chưa có lịch sử đặt sân</h3>
              <p>Bạn chưa có đơn đặt sân nào {filterStatus !== 'all' ? `ở trạng thái "${getStatusInfo(filterStatus).text}"` : ''}</p>
              <button onClick={() => navigate('/user/fields')} className="btn-browse">
                Đặt sân ngay
              </button>
            </div>
          ) : (
            filteredBookings.map(booking => {
              const statusInfo = getStatusInfo(booking.status)
              const canCancel = booking.status === 'pending' || booking.status === 'confirmed'
              const isPast = new Date(booking.start_time) < new Date()

              return (
                <div key={booking.booking_id} className={`booking-card ${statusInfo.class}`}>
                  <div className="booking-card-header">
                    <div className="booking-id">
                      <span className="label">Mã đặt sân:</span>
                      <span className="value">#{booking.booking_id}</span>
                    </div>
                    <div className={`booking-status ${statusInfo.class}`}>
                      <span className="status-icon">{statusInfo.icon}</span>
                      <span className="status-text">{statusInfo.text}</span>
                    </div>
                  </div>

                  <div className="booking-card-body">
                    <div className="field-info">
                      <h3 className="field-name">{booking.field_name || 'Chưa có tên'}</h3>
                      <p className="field-location">📍 {booking.location || 'Chưa cập nhật'}</p>
                    </div>

                    <div className="booking-details">
                      <div className="detail-row">
                        <span className="icon">📅</span>
                        <span className="label">Ngày đặt:</span>
                        <span className="value">{formatDate(booking.start_time)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="icon">⏰</span>
                        <span className="label">Giờ:</span>
                        <span className="value">
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="icon">💰</span>
                        <span className="label">Giá:</span>
                        <span className="value price">{formatPrice(booking.price)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="icon">📝</span>
                        <span className="label">Ngày tạo:</span>
                        <span className="value">{formatDate(booking.created_at)}</span>
                      </div>
                    </div>

                    {booking.note && (
                      <div className="booking-note">
                        <strong>Ghi chú:</strong> {booking.note}
                      </div>
                    )}
                  </div>

                  <div className="booking-card-footer">
                    <button
                      onClick={() => navigate(`/user/booking-status?id=${booking.booking_id}`)}
                      className="btn-view"
                    >
                      Xem chi tiết
                    </button>
                    
                    {canCancel && isPast && (
                      <button
                        onClick={() => handleCancelBooking(booking.booking_id)}
                        className="btn-cancel"
                      >
                        Hủy đặt sân
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}