import React, { useState, useEffect } from "react";
import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  assignFieldToEmployee,
  getEmployeeStats,
  getAllFields,
} from "../../api/adminApi";
import DataTable from "../../components/admin/DataTable";
import Modal from "../../components/admin/Modal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import StatsCard from "../../components/admin/StatsCard";
import Pagination from "../../components/admin/Pagination";
import { showSuccess, showError } from "../../components/admin/Toast";

function EmployeeManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    employee: null,
  });
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    person_name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    status: "active",
    address: "",
    sex: "",
    birthday: "",
    fieldId: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchStats();
    fetchFields();
  }, [currentPage, search, statusFilter]);

  const fetchFields = async () => {
    try {
      const response = await getAllFields({ page: 1, limit: 100 });
      setFields(response.data.data.fields || []);
    } catch (error) {
      console.error("Failed to fetch fields:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await getAllEmployees({
        page: currentPage,
        limit: 10,
        search,
        status: statusFilter,
      });
      setEmployees(response.data.data.employees);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      showError("Lỗi khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await getEmployeeStats();
      setStats(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenModal = (mode, employee = null) => {
    setModalMode(mode);
    if (mode === "edit" && employee) {
      setSelectedEmployee(employee);
      setFormData({
        person_name: employee.person_name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        username: employee.username || "",
        password: "",
        status: employee.status || "active",
        address: employee.address || "",
        sex: employee.sex || "",
        birthday: employee.birthday || "",
        fieldId: employee.field?.field_id || "",
      });
    } else {
      setFormData({
        person_name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        status: "active",
        address: "",
        sex: "",
        birthday: "",
        fieldId: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up form data
      const submitData = { ...formData };

      // Handle empty or invalid dates
      if (!submitData.birthday || submitData.birthday === "Invalid date") {
        delete submitData.birthday;
      }

      // Handle empty strings
      if (!submitData.address) delete submitData.address;
      if (!submitData.sex) delete submitData.sex;
      if (!submitData.phone) delete submitData.phone;

      // Extract fieldId for separate assignment
      const fieldIdToAssign = submitData.fieldId;
      delete submitData.fieldId;

      if (modalMode === "create") {
        const response = await createEmployee(submitData);
        showSuccess("Tạo nhân viên thành công");

        // Assign field if selected
        if (fieldIdToAssign) {
          await assignFieldToEmployee(
            response.data.data.person_id,
            fieldIdToAssign
          );
        }
      } else {
        await updateEmployee(selectedEmployee.person_id, submitData);

        // Update field assignment
        if (fieldIdToAssign) {
          await assignFieldToEmployee(
            selectedEmployee.person_id,
            fieldIdToAssign
          );
        }

        showSuccess("Cập nhật nhân viên thành công");
      }
      setIsModalOpen(false);
      fetchEmployees();
      fetchStats();
    } catch (error) {
      showError(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteEmployee(confirmDialog.employee.person_id);
      showSuccess("Xóa nhân viên thành công");
      setConfirmDialog({ isOpen: false, employee: null });
      fetchEmployees();
      fetchStats();
    } catch (error) {
      showError(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const columns = [
    { 
      key: "person_id", 
      label: "ID", 
      sortable: true,
      render: (value) => <span style={{ fontWeight: '600', color: '#667eea' }}>#{value}</span>
    },
    { 
      key: "person_name", 
      label: "Tên", 
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {value?.charAt(0)?.toUpperCase() || 'E'}
          </span>
          {value}
        </span>
      )
    },
    { 
      key: "email", 
      label: "Email", 
      sortable: true,
      render: (value) => (
        <span style={{ color: '#6b7280', fontSize: '13px' }}>
          📧 {value}
        </span>
      )
    },
    { 
      key: "phone", 
      label: "Số điện thoại",
      render: (value) => (
        <span style={{ color: '#6b7280', fontSize: '13px' }}>
          📱 {value || 'Chưa cập nhật'}
        </span>
      )
    },
    {
      key: "field_count",
      label: "Sân quản lý",
      render: (value, row) => {
        if (!value || value === 0) {
          return (
            <span style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: '#f3f4f6',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              ⚠️ Chưa phân công
            </span>
          );
        }
        return (
          <span
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#065f46'
            }}
            title={row.field_names}
          >
            🏟️ {value} sân
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <span className={`status-badge ${value === 'active' ? 'active' : 'inactive'}`}>
          {value === "active" ? "✓ Hoạt động" : "✕ Không hoạt động"}
        </span>
      ),
    },
  ];

  const actions = (employee) => (
    <>
      <button
        onClick={() => handleOpenModal("edit", employee)}
        style={{
          padding: "8px 14px",
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500"
        }}
        title="Chỉnh sửa"
      >
        ✏️ Sửa
      </button>
      <button
        onClick={() => setConfirmDialog({ isOpen: true, employee })}
        style={{
          padding: "8px 14px",
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "500"
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
        <h1>Quản Lý Nhân Viên</h1>
        <button
          className="btn-primary"
          onClick={() => handleOpenModal("create")}
        >
          + Thêm Nhân Viên
        </button>
      </header>
      {stats && (
        <div className="stats-container">
          <StatsCard
            title="Tổng nhân viên"
            value={stats.total}
            icon="👥"
            color="blue"
          />
          <StatsCard
            title="Đang hoạt động"
            value={stats.active}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Không hoạt động"
            value={stats.inactive}
            icon="❌"
            color="red"
          />
        </div>
      )}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Tìm kiếm nhân viên..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>
      <DataTable
        columns={columns}
        data={employees}
        actions={actions}
        isLoading={loading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === "create" ? "Thêm nhân viên" : "Sửa nhân viên"}
        size="large"
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Tên *
              </label>
              <input
                type="text"
                value={formData.person_name}
                onChange={(e) =>
                  setFormData({ ...formData, person_name: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                SĐT
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                pattern="[0-9]{10}"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Username *
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
                disabled={modalMode === "edit"}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>
          {modalMode === "create" && (
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Mật khẩu *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Trạng thái
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "4px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Sân quản lý
              </label>
              <select
                value={formData.fieldId}
                onChange={(e) =>
                  setFormData({ ...formData, fieldId: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              >
                <option value="">Chưa phân công</option>
                {fields.map((field) => (
                  <option key={field.field_id} value={field.field_id}>
                    {field.field_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              marginTop: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: "10px 20px",
                border: "1px solid #e5e7eb",
                background: "white",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              {modalMode === "create" ? "Tạo" : "Cập nhật"}
            </button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, employee: null })}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa nhân viên "${confirmDialog.employee?.person_name}"?`}
        confirmText="Xóa"
        type="danger"
      />
    </>
  );
}

export default EmployeeManagementPage;
