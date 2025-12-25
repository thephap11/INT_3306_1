import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.jsx'
import ApiClient, { authAPI } from '../../services/api'
import './BookingHistoryPage.modern.css'

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
      minute: '2-digit',
      hour12: false
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
    <div className="booking-history-modern">
      <Navbar />
      
      <div className="history-container">
        {/* Modern Header */}
        <div className="history-header">
          <div className="header-content">
            <div className="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: 40, height: 40}}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <h1>Lịch sử đặt sân</h1>
              <p>Quản lý và theo dõi tất cả các đơn đặt sân của bạn</p>
            </div>
          </div>
          <button className="btn-refresh" onClick={fetchBookingHistory}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            Làm mới
          </button>
        </div>

        {/* Modern Controls */}
        <div className="controls-bar">
          <div className="filter-group">
            <label>Trạng thái:</label>
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
                Đã duyệt ({bookings.filter(b => b.status === 'confirmed').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilterStatus('rejected')}
              >
                Từ chối ({bookings.filter(b => b.status === 'rejected').length})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
                onClick={() => setFilterStatus('cancelled')}
              >
                Đã hủy ({bookings.filter(b => b.status === 'cancelled').length})
              </button>
            </div>
          </div>

          <div className="sort-group">
            <label>Sắp xếp:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="date">Theo ngày đặt</option>
            </select>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="bookings-grid">
          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>Chưa có lịch sử đặt sân</h3>
              <p>
                {filterStatus !== 'all'
                  ? `Bạn chưa có đơn đặt sân nào ở trạng thái "${getStatusInfo(filterStatus).text}"`
                  : 'Hãy bắt đầu đặt sân ngay hôm nay!'}
              </p>
              <button onClick={() => navigate('/user/fields')} className="btn-book-now">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{width: 20, height: 20}}>
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Đặt sân ngay
              </button>
            </div>
          ) : (
            filteredBookings.map(booking => {
              const statusInfo = getStatusInfo(booking.status)
              const canCancel = (booking.status === 'pending' || booking.status === 'confirmed') && new Date(booking.start_time) > new Date()

              return (
                <div key={booking.booking_id} className="booking-card-modern">
                  {/* Card Header */}
                  <div className="booking-header">
                    <div className="booking-id">
                      <span className="label">Mã đặt sân:</span>
                      <span className="value">#{booking.booking_id}</span>
                    </div>
                    <div className={`status-badge status-${booking.status}`}>
                      <span className="badge-icon">{statusInfo.icon}</span>
                      <span>{statusInfo.text}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="booking-body">
                    <div className="field-info">
                      <div className="field-icon">⚽</div>
                      <div>
                        <h3 className="field-name">{booking.field_name || 'Chưa có tên'}</h3>
                        <p className="field-location">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {booking.location || 'Chưa cập nhật địa chỉ'}
                        </p>
                      </div>
                    </div>

                    <div className="booking-details">
                      <div className="detail-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span className="detail-label">Ngày đặt:</span>
                        <span className="detail-value">{formatDate(booking.start_time)}</span>
                      </div>

                      <div className="detail-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span className="detail-label">Khung giờ:</span>
                        <span className="detail-value">
                          {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </span>
                      </div>

                      <div className="detail-row price-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                        <span className="detail-label">Tổng tiền:</span>
                        <span className="detail-value price">{formatPrice(booking.price)}</span>
                      </div>

                      <div className="detail-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                          <polyline points="10 9 9 9 8 9"/>
                        </svg>
                        <span className="detail-label">Ngày tạo:</span>
                        <span className="detail-value">{formatDate(booking.created_at)}</span>
                      </div>
                    </div>

                    {booking.note && (
                      <div className="booking-note">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        <div>
                          <strong>Ghi chú:</strong> {booking.note}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="booking-footer">
                    <div className="booking-actions">
                      <button
                        onClick={() => navigate(`/user/booking-status?id=${booking.booking_id}`)}
                        className="btn-view-details"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Xem chi tiết
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelBooking(booking.booking_id)}
                          className="btn-cancel"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                          Hủy đặt sân
                        </button>
                      )}

                      {booking.status === 'completed' && (
                        <button
                          onClick={() => navigate(`/user/fields/${booking.field_id}`)}
                          className="btn-rebook"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="23 4 23 10 17 10"/>
                            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                          </svg>
                          Đặt lại
                        </button>
                      )}

                      <button
                        onClick={() => navigate('/user/contact')}
                        className="btn-contact"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        Liên hệ
                      </button>
                    </div>
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