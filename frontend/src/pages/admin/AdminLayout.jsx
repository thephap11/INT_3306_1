import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const navItems = [
    { to: '/admin/dashboard', label: '📊 Dashboard', icon: '📊' },
    { to: '/admin/fields', label: '🏟️ Quản Lý Sân Bóng', icon: '🏟️' },
    { to: '/admin/users', label: '👥 Quản Lý Người Dùng', icon: '👥' },
    { to: '/admin/employees', label: '👔 Quản Lý Nhân Viên', icon: '👔' },
    { to: '/admin/bookings', label: '📋 Quản Lý Đặt Sân', icon: '📋' }
];

function AdminLayout() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{"person_name":"Admin","role":"admin"}');

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };

    return (
        <div className="container admin-container">
            <nav className="sidebar">
                <div className="logo">
                    <h2 style={{ margin: '0', fontSize: '24px', color: '#1e40af' }}>⚽ Admin Panel</h2>
                    <div style={{ marginTop: '8px', padding: '8px', background: '#f0f9ff', borderRadius: '6px', fontSize: '13px' }}>
                        <div style={{ fontWeight: '600', color: '#374151' }}>{currentUser.person_name}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'capitalize' }}>{currentUser.role}</div>
                    </div>
                </div>
                <ul className="nav-menu">
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) => isActive ? 'active' : ''}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        🚪 Đăng xuất
                    </button>
                </div>
            </nav>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminLayout;