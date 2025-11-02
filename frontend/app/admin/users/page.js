'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyễn Văn An', email: 'nguyenvanan@email.com', phone: '0901234567' },
    { id: 2, name: 'Trần Thị Bình', email: 'tranbinhn@email.com', phone: '0912345678' },
    { id: 3, name: 'Lê Văn Cường', email: 'levancuong@email.com', phone: '0923456789' },
    { id: 4, name: 'Phạm Thị Dung', email: 'phamthidung@email.com', phone: '0934567890' },
    { id: 5, name: 'Hoàng Văn Em', email: 'hoangvanem@email.com', phone: '0945678901' },
    { id: 6, name: 'Vũ Thị Hoa', email: 'vuthihoa@email.com', phone: '0956789012' },
  ]);

  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const showAddUserModal = () => {
    alert('Chức năng thêm người dùng sẽ được triển khai');
  };

  const viewUserInfo = (name) => {
    alert(`Thông tin người dùng: ${name}\n\nSố điện thoại: 0901234567\nEmail: user@email.com\nĐịa chỉ: 123 Đường ABC, Quận 1\nSố lượt đặt: 15 lượt`);
    setActiveMenu(null);
  };

  const deleteUser = (name) => {
    if (confirm(`Bạn có chắc muốn xóa người dùng ${name}?`)) {
      alert(`Đã xóa người dùng ${name}`);
      setActiveMenu(null);
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1>Quản Lý Người Dùng</h1>
          <button className="btn-primary" onClick={showAddUserModal}>
            + Thêm Người Dùng
          </button>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Tổng Người Dùng</h3>
            <p className="stat-number">245</p>
          </div>
          <div className="stat-card">
            <h3>Người Dùng Hoạt Động</h3>
            <p className="stat-number">198</p>
          </div>
          <div className="stat-card">
            <h3>Người Dùng Mới (Tháng)</h3>
            <p className="stat-number">23</p>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="🔍 Tìm kiếm người dùng..." />
        </div>

        <div className="list-container">
          {users.map((user) => (
            <div key={user.id} className="list-item">
              <div className="item-info">
                <h3>{user.name}</h3>
                <p>Email: {user.email} | SĐT: {user.phone}</p>
              </div>
              <div className="item-actions">
                <button className="btn-menu" onClick={() => toggleMenu(user.id)}>
                  ⋮
                </button>
                <div className={`dropdown-menu ${activeMenu === user.id ? 'show' : ''}`}>
                  <a onClick={() => viewUserInfo(user.name)}>👤 Xem thông tin</a>
                  <a onClick={() => deleteUser(user.name)}>🗑️ Xóa người dùng</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
