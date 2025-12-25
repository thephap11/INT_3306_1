import React, { useState, useEffect } from 'react';
import { 
  getBookings, 
  approveBooking, 
  rejectBooking,
  completeBooking,
  cancelBooking
} from '../../services/managerApi';
import './BookingsManagementPage.css';

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await getBookings(filters);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    if (!confirm('Xác nhận duyệt đơn đặt sân này?')) return;
    
    try {
      await approveBooking(bookingId);
      alert('Đã duyệt đơn đặt sân thành công!');
      fetchBookings();
    } catch (err) {
      console.error('Failed to approve booking:', err);
      alert('Có lỗi khi duyệt đơn đặt sân');
    }
  };

  const handleReject = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    try {
      await rejectBooking(selectedBooking.booking_id, rejectReason);
      alert('Đã từ chối đơn đặt sân!');
      setShowRejectModal(false);
      setRejectReason('');
      fetchBookings();
    } catch (err) {
      console.error('Failed to reject booking:', err);
      alert('Có lỗi khi từ chối đơn đặt sân');
    }
  };

  const handleComplete = async (bookingId) => {
    if (!confirm('Đánh dấu đơn này là đã hoàn thành?')) return;
    
    try {
      await completeBooking(bookingId);
      alert('Đã đánh dấu hoàn thành!');
      fetchBookings();
    } catch (err) {
      console.error('Failed to complete booking:', err);
      alert('Có lỗi khi cập nhật trạng thái');
    }
  };

  const handleCancel = async (bookingId) => {
    const reason = prompt('Lý do hủy đơn (tùy chọn):');
    if (reason === null) return;
    
    try {
      await cancelBooking(bookingId, reason);
      alert('Đã hủy đơn đặt sân!');
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert('Có lỗi khi hủy đơn');
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Chờ duyệt', class: 'badge-pending' },
      confirmed: { text: 'Đã duyệt', class: 'badge-confirmed' },
      completed: { text: 'Hoàn thành', class: 'badge-completed' },
      cancelled: { text: 'Đã hủy', class: 'badge-cancelled' },
      rejected: { text: 'Từ chối', class: 'badge-rejected' }
    };
    const badge = badges[status] || { text: status, class: '' };
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1>Quản lý đơn đặt sân</h1>
        <div className="filter-group">
          <label>Lọc theo trạng thái:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="confirmed">Đã duyệt</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
            <option value="rejected">Từ chối</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : bookings.length === 0 ? (
        <div className="no-data">Không có đơn đặt sân nào</div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Sân</th>
                <th>Khách hàng</th>
                <th>Thời gian bắt đầu</th>
                <th>Thời gian kết thúc</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.booking_id}>
                  <td>{booking.booking_id}</td>
                  <td>
                    <div className="field-info">
                      <strong>{booking.field_name}</strong>
                      <small>{booking.location}</small>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <strong>{booking.customer_name}</strong>
                      <small>{booking.customer_phone}</small>
                      <small>{booking.customer_email}</small>
                    </div>
                  </td>
                  <td>{formatDateTime(booking.start_time)}</td>
                  <td>{formatDateTime(booking.end_time)}</td>
                  <td className="price">{(booking.price || 0).toLocaleString('vi-VN')} VNĐ</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <div className="action-buttons">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(booking.booking_id)}
                            className="btn-approve"
                          >
                            ✓ Duyệt
                          </button>
                          <button 
                            onClick={() => handleReject(booking)}
                            className="btn-reject"
                          >
                            ✗ Từ chối
                          </button>
                        </>
                      )}
                      {booking.status === 'confirmed' && (
                        <>
                          <button 
                            onClick={() => handleComplete(booking.booking_id)}
                            className="btn-complete"
                          >
                            ✓ Hoàn thành
                          </button>
                          <button 
                            onClick={() => handleCancel(booking.booking_id)}
                            className="btn-cancel"
                          >
                            ✗ Hủy
                          </button>
                        </>
                      )}
                      {['completed', 'cancelled', 'rejected'].includes(booking.status) && (
                        <span className="no-action">Không có thao tác</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Từ chối đơn đặt sân</h2>
            <p>Lý do từ chối:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối (tùy chọn)..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={confirmReject} className="btn-confirm">
                Xác nhận từ chối
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn-cancel-modal">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
