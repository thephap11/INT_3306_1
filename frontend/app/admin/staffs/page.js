'use client';

import { useState } from 'react';
import Sidebar from '../../../components/Sidebar';

export default function StaffsPage() {
  const [staffs, setStaffs] = useState([
    { id: 1, name: 'Đỗ Văn Khoa', position: 'Quản lý sân', phone: '0967890123' },
    { id: 2, name: 'Bùi Thị Mai', position: 'Lễ tân', phone: '0978901234' },
    { id: 3, name: 'Ngô Văn Nam', position: 'Bảo vệ', phone: '0989012345' },
    { id: 4, name: 'Đinh Thị Oanh', position: 'Kế toán', phone: '0990123456' },
    { id: 5, name: 'Lý Văn Phúc', position: 'Bảo trì', phone: '0901234560' },
  ]);

  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const showAddEmployeeModal = () => {
    alert('Chức năng thêm nhân viên sẽ được triển khai');
  };

  const viewEmployeeInfo = (name) => {
    alert(`Thông tin nhân viên: ${name}\n\nChức vụ: Quản lý sân\nSố điện thoại: 0967890123\nEmail: employee@email.com\nNgày vào làm: 01/01/2023`);
    setActiveMenu(null);
  };

  const viewWorkTime = (name) => {
    alert(`Thời gian làm việc của ${name}\n\nCa làm: 08:00 - 17:00\nNgày làm việc: Thứ 2 - Thứ 6\nTổng giờ tháng này: 176 giờ`);
    setActiveMenu(null);
  };

  const viewSalary = (name) => {
    alert(`Mức lương của ${name}\n\nLương cơ bản: 8,000,000 VNĐ\nPhụ cấp: 1,500,000 VNĐ\nTổng lương: 9,500,000 VNĐ`);
    setActiveMenu(null);
  };

  const deleteEmployee = (name) => {
    if (confirm(`Bạn có chắc muốn xóa nhân viên ${name}?`)) {
      alert(`Đã xóa nhân viên ${name}`);
      setActiveMenu(null);
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <main className="main-content">
        <header className="page-header">
          <h1>Quản Lý Nhân Viên</h1>
          <button className="btn-primary" onClick={showAddEmployeeModal}>
            + Thêm Nhân Viên
          </button>
        </header>

        <div className="stats-container">
          <div className="stat-card">
            <h3>Tổng Nhân Viên</h3>
            <p className="stat-number">28</p>
          </div>
          <div className="stat-card">
            <h3>Nhân Viên Đang Làm</h3>
            <p className="stat-number">25</p>
          </div>
          <div className="stat-card">
            <h3>Tổng Lương (Tháng)</h3>
            <p className="stat-number">185</p>
            <span style={{ fontSize: '0.8em', color: '#FFC107' }}>triệu VNĐ</span>
          </div>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="🔍 Tìm kiếm nhân viên..." />
        </div>

        <div className="list-container">
          {staffs.map((staff) => (
            <div key={staff.id} className="list-item">
              <div className="item-info">
                <h3>{staff.name}</h3>
                <p>Chức vụ: {staff.position} | SĐT: {staff.phone}</p>
              </div>
              <div className="item-actions">
                <button className="btn-menu" onClick={() => toggleMenu(staff.id)}>
                  ⋮
                </button>
                <div className={`dropdown-menu ${activeMenu === staff.id ? 'show' : ''}`}>
                  <a onClick={() => viewEmployeeInfo(staff.name)}>👤 Xem thông tin</a>
                  <a onClick={() => viewWorkTime(staff.name)}>⏰ Thời gian làm việc</a>
                  <a onClick={() => viewSalary(staff.name)}>💵 Mức lương</a>
                  <a onClick={() => deleteEmployee(staff.name)}>🗑️ Xóa nhân viên</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
