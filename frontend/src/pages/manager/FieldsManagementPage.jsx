import React, { useState, useEffect } from 'react';
import { getFields, createField, updateField, deleteField, updateFieldStatus, getFieldStats } from '../../services/managerApi';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Toast from '../../components/admin/Toast';
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
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'field_id', direction: 'asc' });

  useEffect(() => {
    fetchFields();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchFields = async () => {
    try {
      setLoading(true);
      const response = await getFields();
      const data = response.success ? response.data : [];
      setFields(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch fields:', err);
      setFields([]);
      showToast('Không thể tải danh sách sân', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (fieldId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      await updateFieldStatus(fieldId, newStatus);
      showToast('Cập nhật trạng thái thành công!', 'success');
      fetchFields();
    } catch (err) {
      console.error('Failed to update field status:', err);
      showToast('Có lỗi khi cập nhật trạng thái', 'error');
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
      showToast('Có lỗi khi tải thống kê', 'error');
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
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    try {
      if (isEditing) {
        await updateField(selectedField.field_id, formData);
        showToast('Cập nhật sân thành công!', 'success');
      } else {
        await createField(formData);
        showToast('Tạo sân mới thành công!', 'success');
      }
      setShowFormModal(false);
      fetchFields();
    } catch (err) {
      console.error('Failed to save field:', err);
      showToast(isEditing ? 'Có lỗi khi cập nhật sân' : 'Có lỗi khi tạo sân mới', 'error');
    }
  };

  const handleDeleteField = async (field) => {
    try {
      await deleteField(field.field_id);
      showToast('Xóa sân thành công!', 'success');
      fetchFields();
    } catch (err) {
      console.error('Failed to delete field:', err);
      showToast(err.message || 'Có lỗi khi xóa sân', 'error');
    }
  };

  const columns = [
    {
      key: 'field_id',
      label: 'ID',
      sortable: true,
      render: (field) => (
        <span className="badge badge-primary">#{field?.field_id || 'N/A'}</span>
      )
    },
    {
      key: 'field_name',
      label: 'Tên sân',
      sortable: true,
      render: (field) => (
        <div className="field-name-cell">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
          <span>{field?.field_name || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Địa điểm',
      sortable: true,
      render: (field) => (
        <div className="location-cell">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {field?.location || 'Chưa cập nhật'}
        </div>
      )
    },
    {
      key: 'rental_price',
      label: 'Giá thuê',
      sortable: true,
      render: (field) => (
        <div className="price-cell">
          {field?.rental_price ? (
            <>
              <span className="price-value">{field.rental_price.toLocaleString('vi-VN')}</span>
              <span className="price-unit">VNĐ/giờ</span>
            </>
          ) : (
            <span className="no-price">Chưa cập nhật</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Trạng thái',
      sortable: true,
      render: (field) => (
        field?.status === 'active' ? (
          <span className="badge badge-success">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Hoạt động
          </span>
        ) : (
          <span className="badge badge-inactive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Tạm ngưng
          </span>
        )
      )
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (field) => (
        <div className="action-buttons">
          <button 
            onClick={() => handleViewStats(field)}
            className="btn-action btn-stats"
            title="Xem thống kê"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Thống kê
          </button>
          <button 
            onClick={() => handleEditField(field)}
            className="btn-action btn-edit"
            title="Chỉnh sửa"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Sửa
          </button>
          <ConfirmDialog
            title={field.status === 'active' ? 'Tạm ngưng sân' : 'Kích hoạt sân'}
            message={field.status === 'active' 
              ? `Bạn có chắc muốn tạm ngưng sân "${field.field_name}"?` 
              : `Bạn có chắc muốn kích hoạt sân "${field.field_name}"?`}
            onConfirm={() => handleToggleStatus(field.field_id, field.status)}
            confirmText={field.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}
            cancelText="Hủy"
          >
            <button 
              className={`btn-action ${field.status === 'active' ? 'btn-deactivate' : 'btn-activate'}`}
              title={field.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}
            >
              {field.status === 'active' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Tạm ngưng
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Kích hoạt
                </>
              )}
            </button>
          </ConfirmDialog>
          <ConfirmDialog
            title="Xóa sân"
            message={`Bạn có chắc chắn muốn xóa sân "${field.field_name}"? Hành động này không thể hoàn tác.`}
            onConfirm={() => handleDeleteField(field)}
            confirmText="Xóa"
            cancelText="Hủy"
          >
            <button 
              className="btn-action btn-delete"
              title="Xóa sân"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Xóa
            </button>
          </ConfirmDialog>
        </div>
      )
    }
  ];

  return (
    <div className="fields-page">
      <div className="page-header">
        <div className="header-content">
          <h1>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            Quản lý sân bóng
          </h1>
          <p>Quản lý thông tin và trạng thái các sân bóng</p>
        </div>
        <button onClick={handleCreateField} className="btn-create">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Tạo sân mới
        </button>
      </div>

      <DataTable
        columns={columns}
        data={fields}
        loading={loading}
        emptyMessage="Bạn chưa có sân nào"
        sortConfig={sortConfig}
        onSort={setSortConfig}
      />

      {/* Stats Modal */}
      {showStatsModal && selectedField && fieldStats && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content stats-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Thống kê sân: {selectedField.field_name}
              </h2>
            </div>
            
            <div className="modal-body">
              <div className="stats-grid-modal">
                <div className="stat-item stat-total">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="stat-details">
                    <div className="stat-label">Tổng đơn đặt</div>
                    <div className="stat-value">{fieldStats.totalBookings || 0}</div>
                  </div>
                </div>
                
                <div className="stat-item stat-confirmed">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div className="stat-details">
                    <div className="stat-label">Đã xác nhận</div>
                    <div className="stat-value">{fieldStats.confirmedBookings || 0}</div>
                  </div>
                </div>
                
                <div className="stat-item stat-completed">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="stat-details">
                    <div className="stat-label">Hoàn thành</div>
                    <div className="stat-value">{fieldStats.completedBookings || 0}</div>
                  </div>
                </div>
                
                <div className="stat-item stat-revenue">
                  <div className="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div className="stat-details">
                    <div className="stat-label">Tổng doanh thu</div>
                    <div className="stat-value">
                      {(fieldStats.totalRevenue || 0).toLocaleString('vi-VN')} VNĐ
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setShowStatsModal(false)}
                className="btn-close"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showFormModal && (
        <div className="modal-overlay" onClick={() => setShowFormModal(false)}>
          <div className="modal-content form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                {isEditing ? 'Cập nhật sân' : 'Tạo sân mới'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmitForm}>
              <div className="modal-body">
                <div className="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                    </svg>
                    Tên sân *
                  </label>
                  <input
                    type="text"
                    value={formData.field_name}
                    onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                    placeholder="Nhập tên sân"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Địa điểm *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Nhập địa điểm"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    Giá thuê (VNĐ/giờ)
                  </label>
                  <input
                    type="number"
                    value={formData.rental_price}
                    onChange={(e) => setFormData({ ...formData, rental_price: e.target.value })}
                    placeholder="Nhập giá thuê"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowFormModal(false)} className="btn-cancel-modal">
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {isEditing ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
