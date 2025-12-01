import React, { useEffect, useState } from 'react'
import ApiClient from '../../services/api'
import './ApproveBookingsPage.css'

export default function ApproveBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending') // 'pending', 'all'

  useEffect(() => {
    fetchBookings()
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchBookings, 10000)
    return () => clearInterval(interval)
  }, [filter])

  const fetchBookings = async () => {
    try {
      const data = await ApiClient.get('/manager/bookings')
      setBookings(data)
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
      setLoading(false)
    }
  }

  const handleApprove = async (bookingId) => {
    if (!confirm('Xác nhận duyệt đặt sân này?')) return

    try {
      await ApiClient.put(`/manager/bookings/${bookingId}/approve`)
      alert('Đã duyệt đặt sân thành công!')
      fetchBookings()
    } catch (err) {
      alert('Lỗi: ' + (err.message || 'Không thể duyệt đặt sân'))
    }
  }

  const handleReject = async (bookingId) => {
    const reason = prompt('Lý do từ chối:')
    if (!reason) return

    try {
      await ApiClient.put(`/manager/bookings/${bookingId}/reject`, { reason })
      alert('Đã từ chối đặt sân!')
      fetchBookings()
    } catch (err) {
      alert('Lỗi: ' + (err.message || 'Không thể từ chối'))
    }
  }

  const filteredBookings = filter === 'pending' 
    ? bookings.filter(b => b.status === 'pending')
    : bookings

  if (loading) {
    return <div className="approve-page"><div className="loading">Đang tải...</div></div>
  }

  return (
    <div className="approve-page">
      <div className="approve-header">
        <h1>🏟️ Quản lý đặt sân</h1>
        <div className="filter-tabs">
          <button 
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Chờ duyệt ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            Tất cả ({bookings.length})
          </button>
        </div>
      </div>

      <div className="bookings-list">
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <p>📭 Không có đặt sân nào</p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking.booking_id} className={`booking-card status-${booking.status}`}>
              <div className="booking-header">
                <div className="booking-id">#{booking.booking_id}</div>
                <div className={`status-badge ${booking.status}`}>
                  {booking.status === 'pending' && '⏳ Chờ duyệt'}
                  {booking.status === 'confirmed' && '✅ Đã duyệt'}
                  {booking.status === 'rejected' && '❌ Đã từ chối'}
                  {booking.status === 'cancelled' && '🚫 Đã hủy'}
                </div>
              </div>

              <div className="booking-info">
                <div className="info-row">
                  <span className="label">Sân:</span>
                  <span className="value">{booking.field_name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Thời gian:</span>
                  <span className="value">
                    {new Date(booking.start_time).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Giá:</span>
                  <span className="value highlight">{booking.price?.toLocaleString('vi-VN')} VNĐ</span>
                </div>
                {booking.note && (
                  <div className="info-row">
                    <span className="label">Ghi chú:</span>
                    <span className="value">{booking.note}</span>
                  </div>
                )}
              </div>

              {booking.status === 'pending' && (
                <div className="booking-actions">
                  <button 
                    onClick={() => handleApprove(booking.booking_id)}
                    className="btn-approve"
                  >
                    ✓ Duyệt
                  </button>
                  <button 
                    onClick={() => handleReject(booking.booking_id)}
                    className="btn-reject"
                  >
                    ✗ Từ chối
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}