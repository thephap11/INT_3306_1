import React, { useState, useEffect } from "react";
import { getDashboardStats, getRevenueByDateRange } from "../../api/adminApi";
import StatsCard from "../../components/admin/StatsCard";
import { showError } from "../../components/admin/Toast";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchDashboardStats();
  }, [dateRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashboardRes, revenueRes] = await Promise.all([
        getDashboardStats(),
        getRevenueByDateRange(dateRange.startDate, dateRange.endDate),
      ]);

      const dashboardData = dashboardRes.data.data || dashboardRes.data;
      const revenueData = revenueRes.data.data || revenueRes.data;

      // Ensure we have valid data before setting
      if (!dashboardData || typeof dashboardData !== "object") {
        throw new Error("Invalid dashboard data received");
      }

      setStats({
        totalUsers: Number(dashboardData.totalUsers) || 0,
        regularUsers: Number(dashboardData.regularUsers) || 0,
        totalManagers: Number(dashboardData.totalManagers) || 0,
        totalAdmins: Number(dashboardData.totalAdmins) || 0,
        activeUsers: Number(dashboardData.activeUsers) || 0,
        totalFields: Number(dashboardData.totalFields) || 0,
        activeFields: Number(dashboardData.activeFields) || 0,
        maintenanceFields: Number(dashboardData.maintenanceFields) || 0,
        inactiveFields: Number(dashboardData.inactiveFields) || 0,
        totalBookings: Number(dashboardData.totalBookings) || 0,
        pendingBookings: Number(dashboardData.pendingBookings) || 0,
        confirmedBookings: Number(dashboardData.confirmedBookings) || 0,
        completedBookings: Number(dashboardData.completedBookings) || 0,
        cancelledBookings: Number(dashboardData.cancelledBookings) || 0,
        rejectedBookings: Number(dashboardData.rejectedBookings) || 0,
        todayBookings: Number(dashboardData.todayBookings) || 0,
        totalRevenue: Number(dashboardData.totalRevenue) || 0,
        monthlyRevenue: Number(dashboardData.monthlyRevenue) || 0,
        revenue: {
          totalRevenue: Number(revenueData?.totalRevenue) || 0,
          totalBookings: Number(revenueData?.totalBookings) || 0,
          bookings: revenueData?.bookings || [],
        },
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      setError(error.message || "Lỗi khi tải dữ liệu dashboard");
      showError("Lỗi khi tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <img 
          src="/images/admin/loading-animation.svg" 
          alt="Loading" 
          style={{ width: '200px', height: '150px', marginBottom: '20px' }}
        />
        <div style={{ fontSize: "18px", color: "#6b7280", fontWeight: "500" }}>
          Đang tải dữ liệu dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h2 style={{ color: "#dc2626", marginBottom: "8px" }}>
          Lỗi tải dữ liệu
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>{error}</p>
        <button
          onClick={fetchDashboardStats}
          style={{
            padding: "12px 24px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <>
      <header 
        className="page-header"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '25px',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>📊</div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Dashboard - Tổng Quan Hệ Thống</h1>
        </div>
      </header>

      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
          background: "white",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <span style={{ fontWeight: "600", color: "#374151" }}>
          Khoảng thời gian:
        </span>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) =>
            setDateRange({ ...dateRange, startDate: e.target.value })
          }
          style={{
            padding: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
          }}
        />
        <span style={{ color: "#6b7280" }}>đến</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) =>
            setDateRange({ ...dateRange, endDate: e.target.value })
          }
          style={{
            padding: "8px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
          }}
        />
      </div>

      {/* Stats Cards */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          📊 Tổng Quan Hệ Thống
        </h2>
        <div className="stats-container">
          <StatsCard
            title="Tổng người dùng"
            value={stats.totalUsers || 0}
            icon="👥"
            color="blue"
            subtitle={`${stats.activeUsers || 0} đang hoạt động`}
          />
          <StatsCard
            title="Tổng sân bóng"
            value={stats.totalFields || 0}
            icon="🏟️"
            color="green"
            subtitle={`${stats.activeFields || 0} đang hoạt động`}
          />
          <StatsCard
            title="Tổng đặt sân"
            value={stats.totalBookings || 0}
            icon="📋"
            color="purple"
            subtitle={`${stats.pendingBookings || 0} chờ xác nhận`}
          />
          <StatsCard
            title="Doanh thu"
            value={`${Number(stats.totalRevenue || 0).toLocaleString()}`}
            icon="💰"
            color="yellow"
            subtitle="VNĐ (confirmed + completed)"
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {/* Booking Status Pie Chart */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
              color: "#111827",
            }}
          >
            📈 Trạng Thái Đặt Sân
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Chờ xác nhận",
                    value: stats.pendingBookings || 0,
                  },
                  {
                    name: "Đã xác nhận",
                    value: stats.confirmedBookings || 0,
                  },
                  {
                    name: "Hoàn thành",
                    value: stats.completedBookings || 0,
                  },
                  { name: "Đã hủy", value: stats.cancelledBookings || 0 },
                  { name: "Từ chối", value: stats.rejectedBookings || 0 },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#fbbf24" />
                <Cell fill="#3b82f6" />
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
                <Cell fill="#6b7280" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Field Status Pie Chart */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
              color: "#111827",
            }}
          >
            🏟️ Trạng Thái Sân Bóng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Hoạt động", value: stats.activeFields || 0 },
                  { name: "Bảo trì", value: stats.maintenanceFields || 0 },
                  {
                    name: "Không hoạt động",
                    value: stats.inactiveFields || 0,
                  },
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#f59e0b" />
                <Cell fill="#6b7280" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Distribution Bar Chart */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
              color: "#111827",
            }}
          >
            👥 Phân Loại Người Dùng
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: "Users", value: stats.regularUsers || 0 },
                { name: "Managers", value: stats.totalManagers || 0 },
                { name: "Admins", value: stats.totalAdmins || 0 },
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                <Cell fill="#3b82f6" />
                <Cell fill="#10b981" />
                <Cell fill="#ef4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "20px",
              color: "#111827",
            }}
          >
            💰 Doanh Thu Theo Thời Gian
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={
                stats.revenue?.bookings?.slice(0, 10).map((booking) => ({
                  date: new Date(booking.booking_date).toLocaleDateString(
                    "vi-VN"
                  ),
                  revenue: Number(booking.total_price) || 0,
                })) || []
              }
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString()} VNĐ`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Doanh thu"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Summary */}
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          💵 Doanh Thu Theo Khoảng Thời Gian
        </h2>
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                color: "white",
              }}
            >
              <div style={{ fontSize: "14px", marginBottom: "8px", opacity: 0.9 }}>
                Tổng doanh thu
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>
                {Number(stats.revenue?.totalRevenue || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px", opacity: 0.8 }}>
                VNĐ
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "12px",
                color: "white",
              }}
            >
              <div style={{ fontSize: "14px", marginBottom: "8px", opacity: 0.9 }}>
                Số lượt đặt
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>
                {stats.revenue?.totalBookings || 0}
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px", opacity: 0.8 }}>
                Bookings
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                borderRadius: "12px",
                color: "#92400e",
              }}
            >
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                Trung bình/đặt
              </div>
              <div style={{ fontSize: "32px", fontWeight: "700" }}>
                {stats.revenue?.totalBookings > 0 &&
                stats.revenue?.totalRevenue > 0
                  ? Math.round(
                      Number(stats.revenue.totalRevenue) /
                        Number(stats.revenue.totalBookings)
                    ).toLocaleString()
                  : 0}
              </div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>VNĐ</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
