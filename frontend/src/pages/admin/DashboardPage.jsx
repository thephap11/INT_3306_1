import React, { useState, useEffect } from "react";
import { getDashboardStats, getRevenueByDateRange } from "../../api/adminApi";
import StatsCard from "../../components/admin/StatsCard";
import { showError } from "../../components/admin/Toast";

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
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <div style={{ fontSize: "18px", color: "#6b7280" }}>
          <div
            className="spinner"
            style={{
              border: "4px solid #f3f4f6",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          Đang tải dữ liệu...
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
      <header className="page-header">
        <h1>Dashboard - Tổng Quan</h1>
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
            title="Doanh thu (Đã duyệt)"
            value={`${Number(stats.totalRevenue || 0).toLocaleString()}`}
            icon="💰"
            color="yellow"
            subtitle="VNĐ (confirmed + completed)"
          />
        </div>
      </div>

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
                background: "#f0f9ff",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Tổng doanh thu (Đã duyệt)
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#1e40af",
                }}
              >
                {Number(stats.revenue?.totalRevenue || 0).toLocaleString()} VNĐ
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "#f0fdf4",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Số lượt đặt (Khoảng thời gian)
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#065f46",
                }}
              >
                {stats.revenue?.totalBookings || 0}
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "#fef3c7",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Trung bình/đặt
              </div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#92400e",
                }}
              >
                {stats.revenue?.totalBookings > 0 &&
                stats.revenue?.totalRevenue > 0
                  ? Math.round(
                      Number(stats.revenue.totalRevenue) /
                        Number(stats.revenue.totalBookings)
                    ).toLocaleString()
                  : 0}{" "}
                VNĐ
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          📈 Trạng Thái Đặt Sân
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #fbbf24",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "4px",
              }}
            >
              Chờ xác nhận
            </div>
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#92400e" }}
            >
              {stats.pendingBookings || 0}
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #3b82f6",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "4px",
              }}
            >
              Đã xác nhận
            </div>
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#1e40af" }}
            >
              {stats.confirmedBookings || 0}
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #10b981",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "4px",
              }}
            >
              Đã hoàn thành
            </div>
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#065f46" }}
            >
              {stats.completedBookings || 0}
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              borderLeft: "4px solid #ef4444",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "4px",
              }}
            >
              Đã hủy
            </div>
            <div
              style={{ fontSize: "32px", fontWeight: "700", color: "#991b1b" }}
            >
              {stats.cancelledBookings || 0}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          🏟️ Trạng Thái Sân Bóng
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>✅</div>
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "4px",
              }}
            >
              Đang hoạt động
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: "700", color: "#065f46" }}
            >
              {stats.activeFields || 0}
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>🔧</div>
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "4px",
              }}
            >
              Đang bảo trì
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: "700", color: "#92400e" }}
            >
              {stats.maintenanceFields || 0}
            </div>
          </div>
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>❌</div>
            <div
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: "4px",
              }}
            >
              Không hoạt động
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: "700", color: "#6b7280" }}
            >
              {stats.inactiveFields || 0}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "16px",
            color: "#111827",
          }}
        >
          👥 Phân Tích Người Dùng
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
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                flex: 1,
                borderRight: "1px solid #e5e7eb",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Người dùng
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#3b82f6",
                }}
              >
                {stats.regularUsers || 0}
              </div>
              <div
                style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}
              >
                Users
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                flex: 1,
                borderRight: "1px solid #e5e7eb",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Quản lý
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#10b981",
                }}
              >
                {stats.totalManagers || 0}
              </div>
              <div
                style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}
              >
                Managers
              </div>
            </div>
            <div style={{ textAlign: "center", flex: 1, padding: "16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: "8px",
                }}
              >
                Quản trị
              </div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#ef4444",
                }}
              >
                {stats.totalAdmins || 0}
              </div>
              <div
                style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}
              >
                Admins
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
