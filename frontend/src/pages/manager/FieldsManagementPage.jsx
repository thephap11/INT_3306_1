import React, { useState, useEffect } from 'react';
import { getFields, createField, updateField, deleteField, updateFieldStatus, getFieldStats } from '../../services/managerApi';
import './FieldsManagementPage.css';

export default function ManagerFieldsPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedField, setSelectedField] = useState(null);
  const [fieldStats, setFieldStats] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ field_name: '', location: '', rental_price: '' });

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await getFields();
      const data = response.success ? response.data : [];
      setFields(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch fields:', err);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (fieldId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const confirmMsg = newStatus === 'active' 
      ? 'Kích hoạt sân này?' 
      : 'Tạm ngưng hoạt động sân này?';
    
    if (!confirm(confirmMsg)) return;
    
    try {
      await updateFieldStatus(fieldId, newStatus);
      alert('Cập nhật trạng thái thành công!');
      fetchFields();
    } catch (err) {
      console.error('Failed to update field status:', err);
      alert('Có lỗi khi cập nhật trạng thái');
    }
  };

  const handleViewStats = async (field) => {
    try {
      setSelectedField(field);
      const response = await getFieldStats(field.field_id);
      setFieldStats(response.success ? response.data : null);
      setShowStatsModal(true);
    } catch (err) {
      console.error('Failed to fetch field stats:', err);
      alert('Có lỗi khi tải thống kê');
    }
  };

  const handleCreateField = () => {
    setFormData({ field_name: '', location: '', rental_price: '' });
    setIsEditing(false);
    setSelectedField(null);
    setShowFormModal(true);
  };

  const handleEditField = (field) => {
    setFormData({ 
      field_name: field.field_name, 
      location: field.location,
      rental_price: field.rental_price || ''
    });
    setIsEditing(true);
    setSelectedField(field);
    setShowFormModal(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    
    if (!formData.field_name.trim() || !formData.location.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (isEditing) {
        await updateField(selectedField.field_id, formData);
        alert('Cập nhật sân thành công!');
      } else {
        await createField(formData);
        alert('Tạo sân mới thành công!');
      }
      setShowFormModal(false);
      fetchFields();
    } catch (err) {
      console.error('Failed to save field:', err);
      alert(isEditing ? 'Có lỗi khi cập nhật sân' : 'Có lỗi khi tạo sân mới');
    }
  };

  const handleDeleteField = async (field) => {
    if (!confirm(`Bạn có chắc muốn xóa sân "${field.field_name}"?`)) return;

    try {
      await deleteField(field.field_id);
      alert('Xóa sân thành công!');
      fetchFields();
    } catch (err) {
      console.error('Failed to delete field:', err);
      alert(err.message || 'Có lỗi khi xóa sân');
    }
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? (
      <span className="status-badge badge-active">Hoạt động</span>
    ) : (
      <span className="status-badge badge-inactive">Tạm ngưng</span>
    );
  };

  return (
    <div className="fields-page">
      <div className="page-header">
        <h1>Quản lý sân bóng</h1>
        <button onClick={handleCreateField} className="btn-create-field">
          ➕ Tạo sân mới
        </button>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : fields.length === 0 ? (
        <div className="no-data">Bạn chưa có sân nào</div>
      ) : (
        <div className="fields-grid">
          {fields.map((field) => (
            <div key={field.field_id} className="field-card">
              <div className="field-header">
                <h3>{field.field_name}</h3>
                {getStatusBadge(field.status)}
              </div>
              
              <div className="field-info">
                <div className="info-row">
                  <span className="label">📍 Địa điểm:</span>
                  <span className="value">{field.location || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-row">
                  <span className="label">🆔 ID:</span>
                  <span className="value">{field.field_id}</span>
                </div>
              </div>

              <div className="field-actions">
                <button 
                  onClick={() => handleViewStats(field)}
                  className="btn-stats"
                >
                  📊 Thống kê
                </button>
                <button 
                  onClick={() => handleEditField(field)}
                  className="btn-edit"
                >
                  ✏️ Sửa
                </button>
                <button 
                  onClick={() => handleToggleStatus(field.field_id, field.status)}
                  className={field.status === 'active' ? 'btn-deactivate' : 'btn-activate'}
                >
                  {field.status === 'active' ? '⏸️ Tạm ngưng' : '▶️ Kích hoạt'}
                </button>
                <button 
                  onClick={() => handleDeleteField(field)}
                  className="btn-delete"
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && selectedField && fieldStats && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Thống kê sân: {selectedField.field_name}</h2>
            
            <div className="stats-grid-modal">
              <div className="stat-item">
                <div className="stat-label">Tổng đơn đặt</div>
                <div className="stat-value">{fieldStats.totalBookings || 0}</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-label">Đã xác nhận</div>
                <div className="stat-value confirmed">{fieldStats.confirmedBookings || 0}</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-label">Hoàn thành</div>
                <div className="stat-value completed">{fieldStats.completedBookings || 0}</div>
              </div>
              
              <div className="stat-item">
                <div className="stat-label">Tổng doanh thu</div>
                <div className="stat-value revenue">
                  {(fieldStats.totalRevenue || 0).toLocaleString('vi-VN')} VNĐ
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowStatsModal(false)}
              className="btn-close-modal"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? 'Cập nhật sân' : 'Tạo sân mới'}</h2>
            
            <form onSubmit={handleSubmitForm}>
              <div className="form-group">
                <label>Tên sân *</label>
                <input
                  type="text"
                  value={formData.field_name}
                  onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                  placeholder="Nhập tên sân"
                  required
                />
              </div>

              <div className="form-group">
                <label>Địa điểm *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Nhập địa điểm"
                  required
                />
              </div>

              <div className="form-group">
                <label>Giá thuê (VNĐ/giờ)</label>
                <input
                  type="number"
                  value={formData.rental_price}
                  onChange={(e) => setFormData({ ...formData, rental_price: e.target.value })}
                  placeholder="Nhập giá thuê"
                  min="0"
                  step="1000"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowFormModal(false)} className="btn-cancel">
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  {isEditing ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
