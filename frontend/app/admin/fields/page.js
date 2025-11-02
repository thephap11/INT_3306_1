'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

export default function FieldsPage() {
  const [fields, setFields] = useState([
    { id: 1, name: 'Sân Bóng Thiên Long', address: '123 Đường Nguyễn Văn A, Quận 1' },
    { id: 2, name: 'Sân Bóng Hoàng Gia', address: '456 Đường Lê Văn B, Quận 2' },
    { id: 3, name: 'Sân Bóng Phú Thọ', address: '789 Đường Trần Văn C, Quận 3' },
    { id: 4, name: 'Sân Bóng Đại Nam', address: '321 Đường Phan Văn D, Quận 4' },
    { id: 5, name: 'Sân Bóng Hòa Bình', address: '654 Đường Võ Văn E, Quận 5' },
  ]);

  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const showAddModal = () => {
    alert('Chức năng thêm sân bóng sẽ được triển khai');
  };

  const deleteField = (name) => {
    if (confirm(`Bạn có chắc muốn xóa sân bóng ${name}?`)) {
      alert(`Đã xóa sân bóng ${name}`);
      setActiveMenu(null);
    }
  };

  const editField = (name) => {
    const newName = prompt(`Nhập tên mới cho sân bóng ${name}:`);
    if (newName) {
      alert(`Đã đổi tên sân bóng thành: ${newName}`);
      setActiveMenu(null);
    }
  };

  const viewRevenue = (name) => {
    alert(`Xem doanh thu của sân ${name}\n\nDoanh thu tháng này: 45,000,000 VNĐ\nLượt đặt: 120 lượt`);
    setActiveMenu(null);
  };

  return (
    <div className="container">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1>Quản Lý Sân Bóng</h1>
          <button className="btn-primary" onClick={showAddModal}>
            + Thêm Sân Bóng
          </button>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Tổng Số Sân</h3>
            <p className="stat-number">12</p>
          </div>
          <div className="stat-card">
            <h3>Sân Đang Hoạt Động</h3>
            <p className="stat-number">10</p>
          </div>
          <div className="stat-card">
            <h3>Sân Bảo Trì</h3>
            <p className="stat-number">2</p>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="🔍 Tìm kiếm sân bóng..." />
        </div>

        <div className="list-container">
          {fields.map((field) => (
            <div key={field.id} className="list-item">
              <div className="item-info">
                <h3>{field.name}</h3>
                <p>Địa chỉ: {field.address}</p>
              </div>
              <div className="item-actions">
                <button className="btn-menu" onClick={() => toggleMenu(field.id)}>
                  ⋮
                </button>
                <div className={`dropdown-menu ${activeMenu === field.id ? 'show' : ''}`}>
                  <a onClick={() => deleteField(field.name)}>🗑️ Xóa sân bóng</a>
                  <a onClick={() => editField(field.name)}>✏️ Thay đổi tên</a>
                  <a onClick={() => viewRevenue(field.name)}>💰 Quản lý doanh thu</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
