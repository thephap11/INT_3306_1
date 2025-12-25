import React, { useState, useEffect } from 'react';
import { getAllFields, createField, updateField, deleteField, toggleFieldStatus, getFieldStats } from '../../api/adminApi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StatsCard from '../../components/admin/StatsCard';
import Pagination from '../../components/admin/Pagination';
import { showSuccess, showError } from '../../components/admin/Toast';

function FieldManagementPage() {
    const [fields, setFields] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedField, setSelectedField] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, field: null });
    const [formData, setFormData] = useState({
        field_name: '',
        field_address: '',
        field_type: '5',
        price_per_hour: '',
        status: 'active',
        open_time: '06:00',
        close_time: '22:00',
        manager_id: null
    });

    useEffect(() => {
        fetchFields();
        fetchStats();
    }, [currentPage, search, statusFilter]);

    const fetchFields = async () => {
        try {
            setLoading(true);
            const response = await getAllFields({
                page: currentPage,
                limit: 10,
                search,
                status: statusFilter
            });
            setFields(response.data.data.fields);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            showError('Lỗi khi tải danh sách sân bóng');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getFieldStats();
            setStats(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal = (mode, field = null) => {
        setModalMode(mode);
        if (mode === 'edit' && field) {
            setSelectedField(field);
            setFormData({
                field_name: field.field_name || '',
                field_address: field.field_address || '',
                field_type: field.field_type || '5',
                price_per_hour: field.price_per_hour || '',
                status: field.status || 'active',
                open_time: field.open_time || '06:00',
                close_time: field.close_time || '22:00',
                manager_id: field.manager_id || null
            });
        } else {
            setFormData({
                field_name: '',
                field_address: '',
                field_type: '5',
                price_per_hour: '',
                status: 'active',
                open_time: '06:00',
                close_time: '22:00',
                manager_id: null
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                await createField(formData);
                showSuccess('Tạo sân bóng thành công');
            } else {
                await updateField(selectedField.field_id, formData);
                showSuccess('Cập nhật sân bóng thành công');
            }
            setIsModalOpen(false);
            fetchFields();
            fetchStats();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteField(confirmDialog.field.field_id);
            showSuccess('Xóa sân bóng thành công');
            setConfirmDialog({ isOpen: false, field: null });
            fetchFields();
            fetchStats();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleToggleStatus = async (field) => {
        try {
            await toggleFieldStatus(field.field_id);
            showSuccess('Thay đổi trạng thái thành công');
            fetchFields();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const columns = [
        { key: 'field_id', label: 'ID', sortable: true },
        { key: 'field_name', label: 'Tên sân', sortable: true },
        { 
            key: 'location', 
            label: 'Địa chỉ', 
            sortable: true,
            render: (value) => value || 'Chưa cập nhật'
        },
        {
            key: 'manager_name',
            label: 'Quản lý',
            render: (value) => value || 'Chưa phân công'
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (value) => <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: value === 'active' ? '#d1fae5' : value === 'maintenance' ? '#fef3c7' : '#f3f4f6', color: value === 'active' ? '#065f46' : value === 'maintenance' ? '#92400e' : '#374151' }}>{value === 'active' ? 'Hoạt động' : value === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'}</span>
        }
    ];

    const actions = (field) => (
        <>
            <button onClick={() => handleOpenModal('edit', field)} style={{ padding: '6px 12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>✏️ Sửa</button>
            <button onClick={() => handleToggleStatus(field)} style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>🔄</button>
            <button onClick={() => setConfirmDialog({ isOpen: true, field })} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>🗑️</button>
        </>
    );

    return (
        <>
            <header className="page-header">
                <h1>Quản Lý Sân Bóng</h1>
                <button className="btn-primary" onClick={() => handleOpenModal('create')}>+ Thêm Sân Bóng</button>
            </header>
            {stats && (
                <div className="stats-container">
                    <StatsCard title="Tổng số sân" value={stats.total} icon="🏟️" color="blue" />
                    <StatsCard title="Đang hoạt động" value={stats.active} icon="✅" color="green" />
                    <StatsCard title="Bảo trì" value={stats.maintenance} icon="🔧" color="yellow" />
                </div>
            )}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm sân bóng..." style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                </select>
            </div>
            <DataTable columns={columns} data={fields} actions={actions} isLoading={loading} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Thêm sân bóng' : 'Sửa sân bóng'} size="large">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Tên sân *</label>
                        <input 
                            type="text" 
                            value={formData.field_name} 
                            onChange={(e) => setFormData({ ...formData, field_name: e.target.value })} 
                            required 
                            style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }} 
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Địa chỉ</label>
                        <input 
                            type="text" 
                            value={formData.location || ''} 
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                            style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }} 
                            placeholder="Nhập địa chỉ sân bóng"
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Trạng thái</label>
                        <select 
                            value={formData.status} 
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
                            style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                        >
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
                            <option value="maintenance">Bảo trì</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                        <button type="submit" style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</button>
                    </div>
                </form>
            </Modal>
            <ConfirmDialog isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({ isOpen: false, field: null })} onConfirm={confirmDelete} title="Xác nhận xóa" message={`Bạn có chắc chắn muốn xóa sân bóng "${confirmDialog.field?.field_name}"?`} confirmText="Xóa" type="danger" />
        </>
    );
}

export default FieldManagementPage;