import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import './ManagerLayout.css';

export default function ManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if user is manager
      if (parsedUser.role !== 'manager') {
        alert('Bạn không có quyền truy cập trang này');
        navigate('/user/login');
      }
    } else {
      navigate('/user/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/user/login');
    }
  };

  const menuItems = [
    { path: '/manager', icon: '📊', label: 'Tổng quan', exact: true },
    { path: '/manager/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/manager/bookings', icon: '📋', label: 'Quản lý đơn đặt' },
    { path: '/manager/fields', icon: '🏟️', label: 'Quản lý sân' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="manager-layout">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">⚽</span>
            {!sidebarCollapsed && <span className="logo-text">DHPoT Manager</span>}
          </div>
          <button 
            className="toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '▶' : '◀'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.person_name?.charAt(0).toUpperCase() || 'M'}
            </div>
            {!sidebarCollapsed && (
              <div className="user-details">
                <div className="user-name">{user?.person_name || 'Manager'}</div>
                <div className="user-role">Quản lý</div>
              </div>
            )}
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            🚪 {!sidebarCollapsed && 'Đăng xuất'}
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <h2 className="page-title">
            {menuItems.find(item => isActive(item.path, item.exact))?.label || 'Manager Panel'}
          </h2>
          <div className="top-bar-actions">
            <span className="user-email">{user?.email}</span>
            <span className="role-badge manager">MANAGER</span>
          </div>
        </div>

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
