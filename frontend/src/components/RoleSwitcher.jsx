import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RoleSwitcher.css';

const RoleSwitcher = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    updateUser();

    // Listen for storage changes and custom user update events
    window.addEventListener('storage', updateUser);
    window.addEventListener('userUpdated', updateUser);

    return () => {
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('userUpdated', updateUser);
    };
  }, []);

  if (!user) return null;

  const currentRole = location.pathname.split('/')[1]; // admin, manager, or user

  const getRoleAccess = (userRole) => {
    switch (userRole) {
      case 'admin':
        return ['admin', 'manager', 'user'];
      case 'manager':
        return ['manager', 'user'];
      case 'user':
        return ['user'];
      default:
        return ['user'];
    }
  };

  const accessibleRoles = getRoleAccess(user.role);

  const roleConfig = {
    admin: {
      label: 'Quản trị viên',
      icon: '👨‍💼',
      color: '#8b5cf6',
      path: '/admin/dashboard'
    },
    manager: {
      label: 'Quản lý',
      icon: '👔',
      color: '#3b82f6',
      path: '/manager/bookings'
    },
    user: {
      label: 'Người dùng',
      icon: '👤',
      color: '#10b981',
      path: '/'
    }
  };

  const handleRoleSwitch = (role) => {
    navigate(roleConfig[role].path);
  };

  // Hide on login/register pages
  if (location.pathname.includes('/login') || location.pathname.includes('/register')) {
    return null;
  }

  return (
    <div className="role-switcher">
      <div className="role-switcher-container">
        {Object.keys(roleConfig).map((role) => {
          const isAccessible = accessibleRoles.includes(role);
          const isActive = currentRole === role;
          const config = roleConfig[role];

          return (
            <button
              key={role}
              className={`role-btn ${isActive ? 'active' : ''} ${!isAccessible ? 'disabled' : ''}`}
              onClick={() => isAccessible && handleRoleSwitch(role)}
              disabled={!isAccessible}
              style={{
                '--role-color': config.color,
                cursor: isAccessible ? 'pointer' : 'not-allowed',
                opacity: isAccessible ? 1 : 0.4
              }}
              title={!isAccessible ? 'Bạn không có quyền truy cập' : config.label}
            >
              <span className="role-icon">{config.icon}</span>
              <span className="role-label">{config.label}</span>
              {isActive && <span className="active-indicator">●</span>}
            </button>
          );
        })}
      </div>
      <div className="current-user-info">
        <span className="user-role-badge" style={{ background: roleConfig[user.role]?.color || '#6b7280' }}>
          {user.role.toUpperCase()}
        </span>
        <span className="user-name">{user.username || user.email}</span>
      </div>
    </div>
  );
};

export default RoleSwitcher;
