'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([
    {
      id: 'booking1',
      customer: 'Nguyễn Văn An',
      phone: '0901234567',
      field: 'Sân Bóng Thiên Long',
      address: '123 Đường Nguyễn Văn A, Quận 1',
      date: '20/10/2025',
      time: '18:00 - 20:00 (2 giờ)',
      price: '400,000 VNĐ',
      status: 'Đã xác nhận',
      statusClass: 'status-confirmed'
    },
    {
      id: 'booking2',
      customer: 'Trần Thị Bình',
      phone: '0912345678',
      field: 'Sân Bóng Hoàng Gia',
      address: '456 Đường Lê Văn B, Quận 2',
      date: '21/10/2025',
      time: '16:00 - 18:00 (2 giờ)',
      price: '350,000 VNĐ',
      status: 'Chờ xác nhận',
      statusClass: 'status-pending'
    },
    {
      id: 'booking3',
      customer: 'Lê Văn Cường',
      phone: '0923456789',
      field: 'Sân Bóng Phú Thọ',
      address: '789 Đường Trần Văn C, Quận 3',
      date: '20/10/2025',
      time: '19:00 - 21:00 (2 giờ)',
      price: '450,000 VNĐ',
      status: 'Đã xác nhận',
      statusClass: 'status-confirmed'
    },
    {
      id: 'booking4',
      customer: 'Phạm Thị Dung',
      phone: '0934567890',
      field: 'Sân Bóng Đại Nam',
      address: '321 Đường Phan Văn D, Quận 4',
      date: '22/10/2025',
      time: '17:00 - 19:00 (2 giờ)',
      price: '380,000 VNĐ',
      status: 'Đã xác nhận',
      statusClass: 'status-confirmed'
    },
    {
      id: 'booking5',
      customer: 'Hoàng Văn Em',
      phone: '0945678901',
      field: 'Sân Bóng Hòa Bình',
      address: '654 Đường Võ Văn E, Quận 5',
      date: '19/10/2025',
      time: '18:00 - 20:00 (2 giờ)',
      price: '400,000 VNĐ',
      status: 'Đã hoàn thành',
      statusClass: 'status-completed'
    },
    {
      id: 'booking6',
      customer: 'Vũ Thị Hoa',
      phone: '0956789012',
      field: 'Sân Bóng Thiên Long',
      address: '123 Đường Nguyễn Văn A, Quận 1',
      date: '23/10/2025',
      time: '15:00 - 17:00 (2 giờ)',
      price: '350,000 VNĐ',
      status: 'Chờ xác nhận',
      statusClass: 'status-pending'
    }
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showAddBookingModal = () => {
    alert('Chức năng thêm đặt sân sẽ được triển khai');
  };

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeBookingModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const confirmBooking = () => {
    alert('Đã xác nhận đặt sân!');
    closeBookingModal();
  };

  const cancelBooking = () => {
    if (confirm('Bạn có chắc muốn hủy đặt sân này?')) {
      alert('Đã hủy đặt sân!');
      closeBookingModal();
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1>Quản Lý Đặt Sân</h1>
          <button className="btn-primary" onClick={showAddBookingModal}>
            + Thêm Đặt Sân
          </button>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Tổng Lượt Đặt (Tháng)</h3>
            <p className="stat-number">156</p>
          </div>
          <div className="stat-card">
            <h3>Đặt Sân Hôm Nay</h3>
            <p className="stat-number">8</p>
          </div>
          <div className="stat-card">
            <h3>Doanh Thu (Tháng)</h3>
            <p className="stat-number">89.5</p>
            <span style={{ fontSize: '0.8em', color: '#FFC107' }}>triệu VNĐ</span>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="🔍 Tìm kiếm đặt sân..." />
        </div>

        <div className="bookings-container">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="booking-card"
              onClick={() => showBookingDetails(booking)}
            >
              <div className="booking-header">
                <h3>{booking.customer}</h3>
                <span className={`booking-status ${booking.statusClass}`}>
                  {booking.statusClass === 'status-confirmed' ? '✓ ' : booking.statusClass === 'status-pending' ? '⏳ ' : '✓ '}
                  {booking.status}
                </span>
              </div>
              <div className="booking-info">
                <p className="field-name">🏟️ {booking.field}</p>
                <p className="booking-date">📅 {booking.date} - {booking.time.split(' (')[0]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Chi Tiết Đặt Sân */}
        <div className={`modal ${showModal ? 'show' : ''}`} onClick={closeBookingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeBookingModal}>&times;</span>
            <h2>Chi Tiết Đặt Sân</h2>
            {selectedBooking && (
              <>
                <div className="booking-details">
                  <div className="detail-row">
                    <span className="detail-label">Người đặt:</span>
                    <span className="detail-value">{selectedBooking.customer}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Số điện thoại:</span>
                    <span className="detail-value">{selectedBooking.phone}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Sân bóng:</span>
                    <span className="detail-value">{selectedBooking.field}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Địa chỉ sân:</span>
                    <span className="detail-value">{selectedBooking.address}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Ngày đặt:</span>
                    <span className="detail-value">{selectedBooking.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Khung giờ:</span>
                    <span className="detail-value">{selectedBooking.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Giá sân:</span>
                    <span className="detail-value detail-price">{selectedBooking.price}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Trạng thái:</span>
                    <span className="detail-value">{selectedBooking.status}</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn-primary" onClick={confirmBooking}>Xác nhận</button>
                  <button className="btn-secondary" onClick={cancelBooking}>Hủy đặt sân</button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
