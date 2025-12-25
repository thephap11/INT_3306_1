import React, { useState, useEffect } from 'react';
import { getAllBookings, getBookingById, updateBookingStatus, cancelBooking, getBookingStats } from '../../api/adminApi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StatsCard from '../../components/admin/StatsCard';
import Pagination from '../../components/admin/Pagination';
import { showSuccess, showError } from '../../components/admin/Toast';

function BookingManagementPage() {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, booking: null, action: null });
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    useEffect(() => {
        fetchBookings();
        fetchStats();
    }, [currentPage, search, statusFilter]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await getAllBookings({
                page: currentPage,
                limit: 10,
                search,
                status: statusFilter
            });
            setBookings(response.data.data.bookings);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            showError('Lỗi khi tải danh sách đặt sân');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getBookingStats();
            setStats(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewDetail = async (booking) => {
        try {
            const response = await getBookingById(booking.booking_id);
            setSelectedBooking(response.data.data);
            setIsDetailModalOpen(true);
        } catch (error) {
            showError('Lỗi khi tải chi tiết đặt sân');
        }
    };

    const handleUpdateStatus = async (status) => {
        try {
            await updateBookingStatus(confirmDialog.booking.booking_id, status, 'Xác nhận bởi admin');
            showSuccess('Cập nhật trạng thái thành công');
            setConfirmDialog({ isOpen: false, booking: null, action: null });
            fetchBookings();
            fetchStats();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleOpenCancelModal = (booking) => {
        setBookingToCancel(booking);
        setIsCancelModalOpen(true);
        setCancelReason('');
    };

    const handleCancelBooking = async () => {
        if (!cancelReason.trim()) {
            showError('Vui lòng nhập lý do hủy');
            return;
        }
        
        try {
            await cancelBooking(bookingToCancel.booking_id, cancelReason.trim());
            showSuccess('Hủy đặt sân thành công');
            setIsCancelModalOpen(false);
            setBookingToCancel(null);
            setCancelReason('');
            fetchBookings();
            fetchStats();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return { bg: '#fef3c7', color: '#92400e' };
            case 'confirmed': return { bg: '#dbeafe', color: '#1e40af' };
            case 'completed': return { bg: '#d1fae5', color: '#065f46' };
            case 'cancelled': return { bg: '#fee2e2', color: '#991b1b' };
            default: return { bg: '#f3f4f6', color: '#374151' };
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Đã xác nhận';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const columns = [
        { key: 'booking_id', label: 'ID', sortable: true },
        {
            key: 'customer_name',
            label: 'Khách hàng',
            render: (value) => value || 'N/A'
        },
        {
            key: 'field_name',
            label: 'Sân',
            render: (value) => value || 'N/A'
        },
        {
            key: 'start_time',
            label: 'Ngày đặt',
            render: (value) => value ? new Date(value).toLocaleDateString('vi-VN', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            }) : 'N/A'
        },
        {
            key: 'price',
            label: 'Tổng tiền',
            render: (value) => value ? `${Number(value).toLocaleString()} VNĐ` : '0 VNĐ'
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (value) => {
                const { bg, color } = getStatusColor(value);
                return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: bg, color }}>{getStatusText(value)}</span>;
            }
        }
    ];

    const actions = (booking) => (
        <>
            <button 
                onClick={() => handleViewDetail(booking)} 
                style={{ 
                    padding: '8px 14px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
                👁️ Xem
            </button>
            {booking.status === 'pending' && (
                <button 
                    onClick={() => setConfirmDialog({ isOpen: true, booking, action: 'confirm' })} 
                    style={{ 
                        padding: '8px 14px', 
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontSize: '13px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    ✅ Xác nhận
                </button>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
                <button 
                    onClick={() => handleOpenCancelModal(booking)} 
                    style={{ 
                        padding: '8px 14px', 
                        background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '8px', 
                        cursor: 'pointer', 
                        fontSize: '13px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    ❌ Hủy
                </button>
            )}
        </>
    );

    return (
        <>
            <header className="page-header">
                <h1>Quản Lý Đặt Sân</h1>
            </header>
            {stats && (
                <div className="stats-container">
                    <StatsCard title="Tổng đặt sân" value={stats.total} icon="📋" color="blue" />
                    <StatsCard title="Chờ xác nhận" value={stats.pending} icon="⏳" color="yellow" />
                    <StatsCard title="Đã xác nhận" value={stats.confirmed} icon="✅" color="green" />
                    <StatsCard title="Đã hoàn thành" value={stats.completed} icon="🏆" color="purple" />
                </div>
            )}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm đặt sân..." style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
            </div>
            <DataTable columns={columns} data={bookings} actions={actions} isLoading={loading} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {selectedBooking && (
                <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Chi tiết đặt sân" size="large">
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {/* Thông tin booking */}
                        <div style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '20px',
                            borderRadius: '12px',
                            marginBottom: '8px'
                        }}>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '24px' }}>#{selectedBooking.booking_id}</h3>
                            <p style={{ margin: 0, opacity: 0.9 }}>Mã đặt sân</p>
                        </div>

                        {/* Customer info */}
                        <div style={{ 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '12px', 
                            padding: '16px',
                            background: '#f9fafb'
                        }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '16px' }}>👤 Thông tin khách hàng</h4>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#6b7280' }}>Họ tên:</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBooking.customer_name || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#6b7280' }}>Email:</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBooking.customer_email || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#6b7280' }}>Số điện thoại:</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBooking.customer_phone || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Field info */}
                        <div style={{ 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '12px', 
                            padding: '16px',
                            background: '#f0fdf4'
                        }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '16px' }}>⚽ Thông tin sân</h4>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#6b7280' }}>Tên sân:</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBooking.field_name || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#6b7280' }}>Địa điểm:</span>
                                    <span style={{ fontWeight: '600' }}>{selectedBooking.location || 'N/A'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Booking time */}
                        <div style={{ 
                            border: '2px solid #e5e7eb', 
                            borderRadius: '12px', 
                            padding: '16px',
                            background: '#eff6ff'
                        }}>
                            <h4 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '16px' }}>🕒 Thời gian đặt</h4>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#6b7280' }}>Bắt đầu:</span>
                                    <span style={{ fontWeight: '600' }}>
                                        {selectedBooking.start_time ? new Date(selectedBooking.start_time).toLocaleString('vi-VN') : 'N/A'}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#6b7280' }}>Kết thúc:</span>
                                    <span style={{ fontWeight: '600' }}>
                                        {selectedBooking.end_time ? new Date(selectedBooking.end_time).toLocaleString('vi-VN') : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price and status */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ 
                                border: '2px solid #10b981', 
                                borderRadius: '12px', 
                                padding: '16px',
                                background: '#d1fae5',
                                textAlign: 'center'
                            }}>
                                <div style={{ color: '#065f46', fontSize: '14px', marginBottom: '8px' }}>Tổng tiền</div>
                                <div style={{ color: '#047857', fontSize: '24px', fontWeight: '700' }}>
                                    {Number(selectedBooking.price || 0).toLocaleString()} VNĐ
                                </div>
                            </div>
                            <div style={{ 
                                border: '2px solid #3b82f6', 
                                borderRadius: '12px', 
                                padding: '16px',
                                background: '#dbeafe',
                                textAlign: 'center'
                            }}>
                                <div style={{ color: '#1e40af', fontSize: '14px', marginBottom: '8px' }}>Trạng thái</div>
                                <div style={{ color: '#1e3a8a', fontSize: '18px', fontWeight: '700' }}>
                                    {getStatusText(selectedBooking.status)}
                                </div>
                            </div>
                        </div>

                        {/* Note */}
                        {selectedBooking.note && (
                            <div style={{ 
                                border: '2px solid #f59e0b', 
                                borderRadius: '12px', 
                                padding: '16px',
                                background: '#fef3c7'
                            }}>
                                <h4 style={{ margin: '0 0 8px 0', color: '#92400e', fontSize: '16px' }}>📝 Ghi chú</h4>
                                <p style={{ margin: 0, color: '#78350f', whiteSpace: 'pre-wrap' }}>{selectedBooking.note}</p>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, booking: null, action: null })}
                onConfirm={() => handleUpdateStatus('confirmed')}
                title="Xác nhận đặt sân"
                message="Bạn có chắc chắn muốn xác nhận đặt sân này? Khách hàng sẽ nhận được thông báo xác nhận."
                confirmText="Xác nhận"
                type="success"
            />

            {/* Cancel Booking Modal */}
            <Modal 
                isOpen={isCancelModalOpen} 
                onClose={() => {
                    setIsCancelModalOpen(false);
                    setBookingToCancel(null);
                    setCancelReason('');
                }} 
                title="Hủy đặt sân"
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ 
                        padding: '16px', 
                        background: '#fee2e2', 
                        borderRadius: '8px',
                        borderLeft: '4px solid #dc2626'
                    }}>
                        <p style={{ margin: 0, color: '#991b1b', fontSize: '14px', fontWeight: '500' }}>
                            ⚠️ Bạn đang hủy đặt sân #{bookingToCancel?.booking_id}
                        </p>
                    </div>

                    <div>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '8px', 
                            fontWeight: '600',
                            color: '#374151',
                            fontSize: '14px'
                        }}>
                            Lý do hủy <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Vui lòng nhập lý do hủy đặt sân (ví dụ: khách yêu cầu hủy, thời tiết xấu, sân bảo trì...)"
                            rows="4"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e5e7eb',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        />
                        <p style={{ 
                            margin: '8px 0 0 0', 
                            fontSize: '12px', 
                            color: '#6b7280' 
                        }}>
                            Lý do hủy sẽ được gửi đến khách hàng
                        </p>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        justifyContent: 'flex-end',
                        paddingTop: '12px',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <button
                            onClick={() => {
                                setIsCancelModalOpen(false);
                                setBookingToCancel(null);
                                setCancelReason('');
                            }}
                            style={{
                                padding: '10px 20px',
                                background: '#f3f4f6',
                                color: '#374151',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                            onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                        >
                            Đóng
                        </button>
                        <button
                            onClick={handleCancelBooking}
                            style={{
                                padding: '10px 20px',
                                background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                            }}
                        >
                            ❌ Xác nhận hủy
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default BookingManagementPage;