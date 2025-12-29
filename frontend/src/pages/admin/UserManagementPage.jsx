import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser, toggleUserStatus, getUserStats } from '../../api/adminApi';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import StatsCard from '../../components/admin/StatsCard';
import Pagination from '../../components/admin/Pagination';
import { showSuccess, showError } from '../../components/admin/Toast';

function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, user: null });
    const [formData, setFormData] = useState({
        person_name: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        role: 'user',
        status: 'active',
        address: '',
        sex: '',
        birthday: ''
    });

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [currentPage, search, roleFilter, statusFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await getAllUsers({
                page: currentPage,
                limit: 10,
                search,
                role: roleFilter,
                status: statusFilter
            });
            setUsers(response.data.data.users);
            setTotalPages(response.data.data.totalPages);
        } catch (error) {
            showError('Lỗi khi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await getUserStats();
            setStats(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenModal = (mode, user = null) => {
        setModalMode(mode);
        if (mode === 'edit' && user) {
            setSelectedUser(user);
            setFormData({
                person_name: user.person_name || '',
                email: user.email || '',
                phone: user.phone || '',
                username: user.username || '',
                password: '',
                role: user.role || 'user',
                status: user.status || 'active',
                address: user.address || '',
                sex: user.sex || '',
                birthday: user.birthday || ''
            });
        } else {
            setFormData({
                person_name: '',
                email: '',
                phone: '',
                username: '',
                password: '',
                role: 'user',
                status: 'active',
                address: '',
                sex: '',
                birthday: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'create') {
                await createUser(formData);
                showSuccess('Tạo người dùng thành công');
            } else {
                await updateUser(selectedUser.person_id, formData);
                showSuccess('Cập nhật người dùng thành công');
            }
            setIsModalOpen(false);
            fetchUsers();
            fetchStats();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteUser(confirmDialog.user.person_id);
            showSuccess('Xóa người dùng thành công');
            setConfirmDialog({ isOpen: false, user: null });
            fetchUsers();
            fetchStats();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await toggleUserStatus(user.person_id);
            showSuccess('Thay đổi trạng thái thành công');
            fetchUsers();
        } catch (error) {
            showError(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const columns = [
        { 
            key: 'person_id', 
            label: 'ID', 
            sortable: true,
            render: (value) => <span style={{ fontWeight: '600', color: '#667eea' }}>#{value}</span>
        },
        { 
            key: 'person_name', 
            label: 'Tên', 
            sortable: true,
            render: (value) => (
                <span style={{ 
                    fontWeight: '600', 
                    color: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>
                        {value?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                    {value}
                </span>
            )
        },
        { 
            key: 'email', 
            label: 'Email', 
            sortable: true,
            render: (value) => (
                <span style={{ color: '#6b7280', fontSize: '13px' }}>
                    📧 {value}
                </span>
            )
        },
        { 
            key: 'phone', 
            label: 'Số điện thoại',
            render: (value) => (
                <span style={{ color: '#6b7280', fontSize: '13px' }}>
                    📱 {value || 'Chưa cập nhật'}
                </span>
            )
        },
        {
            key: 'role',
            label: 'Vai trò',
            render: (value) => (
                <span className={`role-badge ${value}`}>
                    {value === 'admin' ? '👑 Admin' : value === 'manager' ? '🎯 Quản lý' : '👤 Người dùng'}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Trạng thái',
            render: (value) => (
                <span className={`status-badge ${value === 'active' ? 'active' : 'inactive'}`}>
                    {value === 'active' ? '✓ Hoạt động' : '✕ Không hoạt động'}
                </span>
            )
        }
    ];

    const actions = (user) => (
        <>
            <button 
                onClick={() => handleOpenModal('edit', user)} 
                style={{ 
                    padding: '8px 14px', 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '13px',
                    fontWeight: '500'
                }}
                title="Chỉnh sửa"
            >
                ✏️ Sửa
            </button>
            <button 
                onClick={() => handleToggleStatus(user)} 
                style={{ 
                    padding: '8px 14px', 
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '13px',
                    fontWeight: '500'
                }}
                title="Đổi trạng thái"
            >
                🔄
            </button>
            <button 
                onClick={() => setConfirmDialog({ isOpen: true, user })} 
                style={{ 
                    padding: '8px 14px', 
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer', 
                    fontSize: '13px',
                    fontWeight: '500'
                }}
                title="Xóa"
            >
                🗑️
            </button>
        </>
    );

    return (
        <>
            <header className="page-header">
                <h1>Quản Lý Người Dùng</h1>
                <button className="btn-primary" onClick={() => handleOpenModal('create')}>+ Thêm Người Dùng</button>
            </header>
            {stats && (
                <div className="stats-container">
                    <StatsCard title="Tổng người dùng" value={stats.total} icon="👥" color="blue" />
                    <StatsCard title="Đang hoạt động" value={stats.active} icon="✅" color="green" />
                    <StatsCard title="Không hoạt động" value={stats.inactive} icon="❌" color="red" />
                </div>
            )}
            <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Tìm kiếm..." style={{ flex: 1, padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <option value="">Tất cả vai trò</option>
                    <option value="user">Người dùng</option>
                    <option value="manager">Quản lý</option>
                    <option value="admin">Admin</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                </select>
            </div>
            <DataTable columns={columns} data={users} actions={actions} isLoading={loading} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Thêm người dùng' : 'Sửa người dùng'} size="large">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div><label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Tên *</label><input type="text" value={formData.person_name} onChange={(e) => setFormData({ ...formData, person_name: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }} /></div>
                        <div><label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Email *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }} /></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div><label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>SĐT</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} pattern="[0-9]{10}" style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }} /></div>
                        <div><label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Username *</label><input type="text" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required disabled={modalMode === 'edit'} style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }} /></div>
                    </div>
                    {modalMode === 'create' && <div style={{ marginBottom: '16px' }}><label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Mật khẩu *</label><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }} /></div>}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div><label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Vai trò</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }}><option value="user">Người dùng</option><option value="manager">Quản lý</option><option value="admin">Admin</option></select></div>
                        <div><label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>Trạng thái</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }}><option value="active">Hoạt động</option><option value="inactive">Không hoạt động</option></select></div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', border: '1px solid #e5e7eb', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>Hủy</button>
                        <button type="submit" style={{ padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</button>
                    </div>
                </form>
            </Modal>
            <ConfirmDialog isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({ isOpen: false, user: null })} onConfirm={confirmDelete} title="Xác nhận xóa" message={`Bạn có chắc chắn muốn xóa người dùng "${confirmDialog.user?.person_name}"?`} confirmText="Xóa" type="danger" />
        </>
    );
}

export default UserManagementPage;