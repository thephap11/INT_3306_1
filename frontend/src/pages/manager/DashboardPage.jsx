import React, { useState, useEffect } from "react";
import {
  getDashboardStats,
  getRevenueByDateRange,
} from "../../services/managerApi";
import "./DashboardPage.css";

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
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [bookingTrend, setBookingTrend] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
    generateMockChartData();
  }, []);

  const generateMockChartData = () => {
    // Generate last 7 days data
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const revenue = days.map(() => Math.floor(Math.random() * 10000000) + 2000000);
    const bookings = days.map(() => Math.floor(Math.random() * 15) + 5);
    
    setRevenueData(revenue);
    setBookingTrend(bookings);
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();

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
        monthlyRevenue: Number(data.monthlyRevenue) || 0,
      });
      setError(null);
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Không thể tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const getMaxValue = (arr) => Math.max(...arr, 1);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="modern-loading">
          <div className="modern-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <p className="loading-text">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button onClick={fetchDashboardStats} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  const bookingSuccessRate = stats.totalBookings > 0 
    ? ((stats.confirmedBookings + stats.completedBookings) / stats.totalBookings * 100).toFixed(1)
    : 0;

  return (
    <div className="dashboard-page modern-dashboard">
      <div className="dashboard-header modern-header">
        <div>
          <h1>📊 Tổng quan hệ thống</h1>
          <p className="header-subtitle">Thống kê quản lý sân bóng của bạn</p>
        </div>
        <button onClick={fetchDashboardStats} className="refresh-btn">
          🔄 Làm mới
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid modern-stats-grid">
        <div className="stat-card modern-stat-card stat-primary">
          <div className="stat-header">
            <span className="stat-icon gradient-icon-blue">🏟️</span>
            <span className="stat-trend positive">+{stats.activeFields}</span>
          </div>
          <div className="stat-details">
            <h3>Tổng số sân</h3>
            <p className="stat-number">{stats.totalFields || 0}</p>
            <div className="stat-progress">
              <div 
                className="stat-progress-bar blue" 
                style={{ width: `${(stats.activeFields / (stats.totalFields || 1)) * 100}%` }}
              ></div>
            </div>
            <span className="stat-subtitle">
              ✓ Đang hoạt động: {stats.activeFields || 0}
            </span>
          </div>
        </div>

        <div className="stat-card modern-stat-card stat-info">
          <div className="stat-header">
            <span className="stat-icon gradient-icon-purple">📋</span>
            <span className="stat-trend positive">+{stats.todayBookings}</span>
          </div>
          <div className="stat-details">
            <h3>Tổng đơn đặt</h3>
            <p className="stat-number">{stats.totalBookings || 0}</p>
            <div className="stat-progress">
              <div 
                className="stat-progress-bar purple" 
                style={{ width: `${Math.min(stats.todayBookings * 10, 100)}%` }}
              ></div>
            </div>
            <span className="stat-subtitle">
              📅 Hôm nay: {stats.todayBookings || 0} đơn
            </span>
          </div>
        </div>

        <div className="stat-card modern-stat-card stat-warning">
          <div className="stat-header">
            <span className="stat-icon gradient-icon-orange">⏳</span>
            {stats.pendingBookings > 0 && <span className="stat-badge urgent">{stats.pendingBookings}</span>}
          </div>
          <div className="stat-details">
            <h3>Chờ duyệt</h3>
            <p className="stat-number">{stats.pendingBookings || 0}</p>
            <div className="stat-progress">
              <div 
                className="stat-progress-bar orange" 
                style={{ width: stats.pendingBookings > 0 ? '100%' : '0%' }}
              ></div>
            </div>
            <span className="stat-subtitle">
              ⚡ Cần xử lý ngay
            </span>
          </div>
        </div>

        <div className="stat-card modern-stat-card stat-success">
          <div className="stat-header">
            <span className="stat-icon gradient-icon-green">💰</span>
            <span className="stat-trend positive">+{bookingSuccessRate}%</span>
          </div>
          <div className="stat-details">
            <h3>Doanh thu tháng</h3>
            <p className="stat-number stat-money">
              {(stats.monthlyRevenue || 0).toLocaleString("vi-VN")}đ
            </p>
            <div className="stat-progress">
              <div 
                className="stat-progress-bar green" 
                style={{ width: `${(stats.monthlyRevenue / (stats.totalRevenue || 1)) * 100}%` }}
              ></div>
            </div>
            <span className="stat-subtitle">
              📈 Tổng tích lũy: {(stats.totalRevenue || 0).toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>📈 Doanh thu 7 ngày qua</h3>
            <span className="chart-period">Tuần này</span>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                <div key={day} className="bar-item">
                  <div className="bar-wrapper">
                    <div 
                      className="bar bar-revenue"
                      style={{ 
                        height: `${(revenueData[index] / getMaxValue(revenueData)) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                      title={`${revenueData[index]?.toLocaleString('vi-VN')}đ`}
                    >
                      <span className="bar-value">{(revenueData[index] / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                  <span className="bar-label">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>📊 Lượng đặt sân 7 ngày qua</h3>
            <span className="chart-period">Tuần này</span>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                <div key={day} className="bar-item">
                  <div className="bar-wrapper">
                    <div 
                      className="bar bar-booking"
                      style={{ 
                        height: `${(bookingTrend[index] / getMaxValue(bookingTrend)) * 100}%`,
                        animationDelay: `${index * 0.1}s`
                      }}
                      title={`${bookingTrend[index]} đơn`}
                    >
                      <span className="bar-value">{bookingTrend[index]}</span>
                    </div>
                  </div>
                  <span className="bar-label">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="stats-grid secondary-stats modern-secondary">
        <div className="stat-card-small modern-small-card stat-confirmed">
          <div className="small-card-icon">✓</div>
          <div className="small-card-content">
            <h4>Đã xác nhận</h4>
            <p>{stats.confirmedBookings || 0}</p>
            <span className="small-percentage">{stats.totalBookings > 0 ? ((stats.confirmedBookings / stats.totalBookings) * 100).toFixed(0) : 0}%</span>
          </div>
        </div>

        <div className="stat-card-small modern-small-card stat-completed">
          <div className="small-card-icon">🎯</div>
          <div className="small-card-content">
            <h4>Hoàn thành</h4>
            <p>{stats.completedBookings || 0}</p>
            <span className="small-percentage">{stats.totalBookings > 0 ? ((stats.completedBookings / stats.totalBookings) * 100).toFixed(0) : 0}%</span>
          </div>
        </div>

        <div className="stat-card-small modern-small-card stat-cancelled">
          <div className="small-card-icon">✕</div>
          <div className="small-card-content">
            <h4>Đã hủy</h4>
            <p>{stats.cancelledBookings || 0}</p>
            <span className="small-percentage">{stats.totalBookings > 0 ? ((stats.cancelledBookings / stats.totalBookings) * 100).toFixed(0) : 0}%</span>
          </div>
        </div>

        <div className="stat-card-small modern-small-card stat-rejected">
          <div className="small-card-icon">⛔</div>
          <div className="small-card-content">
            <h4>Từ chối</h4>
            <p>{stats.rejectedBookings || 0}</p>
            <span className="small-percentage">{stats.totalBookings > 0 ? ((stats.rejectedBookings / stats.totalBookings) * 100).toFixed(0) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="summary-section">
        <div className="summary-card">
          <h3>📌 Tổng kết nhanh</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span className="summary-label">Tỷ lệ thành công</span>
              <span className="summary-value success">{bookingSuccessRate}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Sân hoạt động</span>
              <span className="summary-value primary">{stats.activeFields}/{stats.totalFields}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Đơn hôm nay</span>
              <span className="summary-value info">{stats.todayBookings}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Cần duyệt</span>
              <span className="summary-value warning">{stats.pendingBookings}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
