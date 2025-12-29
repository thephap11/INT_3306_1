import React, { useState, useEffect } from 'react';
import { 
  getBookings, 
  approveBooking, 
  rejectBooking,
  completeBooking,
  cancelBooking
} from '../../services/managerApi';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Toast from '../../components/admin/Toast';
import './BookingsManagementPage.css';

export default function ManagerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'booking_id', direction: 'desc' });

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await getBookings(filters);
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
      showToast('Không thể tải danh sách đơn đặt sân', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    try {
      await approveBooking(bookingId);
      showToast('Đã duyệt đơn đặt sân thành công!', 'success');
      fetchBookings();
    } catch (err) {
      console.error('Failed to approve booking:', err);
      showToast('Có lỗi khi duyệt đơn đặt sân', 'error');
    }
  };

  const handleReject = (booking) => {
    setSelectedBooking(booking);
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    try {
      await rejectBooking(selectedBooking.booking_id, rejectReason);
      showToast('Đã từ chối đơn đặt sân!', 'info');
      setShowRejectModal(false);
      setRejectReason('');
      fetchBookings();
    } catch (err) {
      console.error('Failed to reject booking:', err);
      showToast('Có lỗi khi từ chối đơn đặt sân', 'error');
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await completeBooking(bookingId);
      showToast('Đã đánh dấu hoàn thành!', 'success');
      fetchBookings();
    } catch (err) {
      console.error('Failed to complete booking:', err);
      showToast('Có lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId, '');
      showToast('Đã hủy đơn đặt sân!', 'info');
      fetchBookings();
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      showToast('Có lỗi khi hủy đơn', 'error');
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

  const columns = [
    {
      key: 'booking_id',
      label: 'ID',
      sortable: true,
      render: (booking) => (
        <span className="badge badge-primary">#{booking?.booking_id || 'N/A'}</span>
      )
    },
    {
      key: 'field_name',
      label: 'Sân',
      sortable: true,
      render: (booking) => (
        <div className="field-info">
          <div className="field-name">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            {booking?.field_name || 'N/A'}
          </div>
          <div className="field-location">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {booking?.location || 'N/A'}
          </div>
        </div>
      )
    },
    {
      key: 'customer_name',
      label: 'Khách hàng',
      sortable: true,
      render: (booking) => (
        <div className="customer-info">
          <div className="avatar">
            {booking?.customer_name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="customer-details">
            <div className="customer-name">{booking?.customer_name || 'N/A'}</div>
            <div className="customer-contact">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {booking?.customer_phone || 'N/A'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'start_time',
      label: 'Thời gian',
      sortable: true,
      render: (booking) => (
        <div className="time-info">
          <div className="time-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="time-label">Bắt đầu:</span>
            <span className="time-value">{booking?.start_time ? formatDateTime(booking.start_time) : 'N/A'}</span>
          </div>
          <div className="time-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="time-label">Kết thúc:</span>
            <span className="time-value">{booking?.end_time ? formatDateTime(booking.end_time) : 'N/A'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Giá',
      sortable: true,
      render: (booking) => (
        <div className="price-info">
          <span className="price-value">{(booking?.price || 0).toLocaleString('vi-VN')}</span>
          <span className="price-currency">VNĐ</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      render: (booking) => {
        const statusConfig = {
          pending: { text: 'Chờ duyệt', class: 'badge-warning', icon: '⏳' },
          confirmed: { text: 'Đã duyệt', class: 'badge-info', icon: '✓' },
          completed: { text: 'Hoàn thành', class: 'badge-success', icon: '✓' },
          cancelled: { text: 'Đã hủy', class: 'badge-cancelled', icon: '✗' },
          rejected: { text: 'Từ chối', class: 'badge-danger', icon: '✗' }
        };
        const config = statusConfig[booking?.status] || { text: booking?.status || 'N/A', class: '', icon: '' };
        return (
          <span className={`badge ${config.class}`}>
            {config.icon} {config.text}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (booking) => (
        <div className="action-buttons">
          {booking?.status === 'pending' && (
            <>
              <ConfirmDialog
                title="Xác nhận duyệt"
                message="Bạn có chắc chắn muốn duyệt đơn đặt sân này?"
                onConfirm={() => handleApprove(booking?.booking_id)}
                confirmText="Duyệt"
                cancelText="Hủy"
              >
                <button className="btn-action btn-approve">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Duyệt
                </button>
              </ConfirmDialog>
              <button 
                onClick={() => handleReject(booking)}
                className="btn-action btn-reject"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Từ chối
              </button>
            </>
          )}
          {booking?.status === 'confirmed' && (
            <>
              <ConfirmDialog
                title="Xác nhận hoàn thành"
                message="Đánh dấu đơn đặt sân này là đã hoàn thành?"
                onConfirm={() => handleComplete(booking?.booking_id)}
                confirmText="Hoàn thành"
                cancelText="Hủy"
              >
                <button className="btn-action btn-complete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  Hoàn thành
                </button>
              </ConfirmDialog>
              <ConfirmDialog
                title="Xác nhận hủy"
                message="Bạn có chắc chắn muốn hủy đơn đặt sân này?"
                onConfirm={() => handleCancel(booking?.booking_id)}
                confirmText="Hủy đơn"
                cancelText="Không"
              >
                <button className="btn-action btn-cancel">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  Hủy
                </button>
              </ConfirmDialog>
            </>
          )}
          {['completed', 'cancelled', 'rejected'].includes(booking?.status) && (
            <span className="no-action">—</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Quản lý đơn đặt sân
          </h1>
          <p>Quản lý và xử lý các đơn đặt sân của khách hàng</p>
        </div>
        <div className="filter-section">
          <div className="filter-group">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Trạng thái
            </label>
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
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        emptyMessage="Không có đơn đặt sân nào"
        sortConfig={sortConfig}
        onSort={setSortConfig}
      />

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Từ chối đơn đặt sân
              </h2>
            </div>
            <div className="modal-body">
              <label>Lý do từ chối (tùy chọn):</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối đơn đặt sân..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button onClick={confirmReject} className="btn-confirm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Xác nhận từ chối
              </button>
              <button onClick={() => setShowRejectModal(false)} className="btn-cancel-modal">
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
