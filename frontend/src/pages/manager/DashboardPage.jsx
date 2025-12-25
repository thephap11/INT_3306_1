import React, { useState, useEffect } from 'react';
import { getDashboardStats, getRevenueByDateRange } from '../../services/managerApi';
import './DashboardPage.css';

export default function ManagerDashboardPage() {
  const [stats, setStats] = useState({
    totalFields: 0,
    activeFields: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    rejectedBookings: 0,
    todayBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      console.log('Dashboard data received:', data);
      
      // Convert all values to numbers explicitly
      setStats({
        totalFields: Number(data.totalFields) || 0,
        activeFields: Number(data.activeFields) || 0,
        totalBookings: Number(data.totalBookings) || 0,
        pendingBookings: Number(data.pendingBookings) || 0,
        confirmedBookings: Number(data.confirmedBookings) || 0,
        completedBookings: Number(data.completedBookings) || 0,
        cancelledBookings: Number(data.cancelledBookings) || 0,
        rejectedBookings: Number(data.rejectedBookings) || 0,
        todayBookings: Number(data.todayBookings) || 0,
        totalRevenue: Number(data.totalRevenue) || 0,
        monthlyRevenue: Number(data.monthlyRevenue) || 0
      });
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchDashboardStats} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Tổng quan hệ thống</h1>
        <p>Thống kê quản lý sân bóng của bạn</p>
      </div>

      <div className="stats-grid">
        {/* Field Stats */}
        <div className="stat-card stat-primary">
          <div className="stat-icon">🏟️</div>
          <div className="stat-details">
            <h3>Tổng số sân</h3>
            <p className="stat-number">{stats.totalFields || 0}</p>
            <span className="stat-subtitle">Sân đang hoạt động: {stats.activeFields || 0}</span>
          </div>
        </div>

        {/* Booking Stats */}
        <div className="stat-card stat-info">
          <div className="stat-icon">📋</div>
          <div className="stat-details">
            <h3>Tổng đơn đặt</h3>
            <p className="stat-number">{stats.totalBookings || 0}</p>
            <span className="stat-subtitle">Hôm nay: {stats.todayBookings || 0}</span>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="stat-card stat-warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-details">
            <h3>Chờ duyệt</h3>
            <p className="stat-number">{stats.pendingBookings || 0}</p>
            <span className="stat-subtitle">Cần xử lý</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="stat-card stat-success">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <h3>Doanh thu tháng này</h3>
            <p className="stat-number">{(stats.monthlyRevenue || 0).toLocaleString('vi-VN')} VNĐ</p>
            <span className="stat-subtitle">Tổng: {(stats.totalRevenue || 0).toLocaleString('vi-VN')} VNĐ (confirmed + completed)</span>
          </div>
        </div>
      </div>

      <div className="stats-grid secondary-stats">
        <div className="stat-card-small stat-confirmed">
          <h4>Đã xác nhận</h4>
          <p>{stats.confirmedBookings || 0}</p>
        </div>

        <div className="stat-card-small stat-completed">
          <h4>Hoàn thành</h4>
          <p>{stats.completedBookings || 0}</p>
        </div>

        <div className="stat-card-small stat-cancelled">
          <h4>Đã hủy</h4>
          <p>{stats.cancelledBookings || 0}</p>
        </div>

        <div className="stat-card-small stat-rejected">
          <h4>Từ chối</h4>
          <p>{stats.rejectedBookings || 0}</p>
        </div>
      </div>
    </div>
  );
}
