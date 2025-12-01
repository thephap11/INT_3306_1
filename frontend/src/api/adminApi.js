import api from './axiosInstance';

// ========== DASHBOARD ==========
export const getDashboardStats = () => api.get('/admin/dashboard');
export const getRevenueByDateRange = (startDate, endDate) => 
  api.get('/admin/revenue/date-range', { params: { startDate, endDate } });
export const getRevenueByField = (fieldId, startDate, endDate) => 
  api.get(`/admin/revenue/field/${fieldId}`, { params: { startDate, endDate } });
export const getMonthlyRevenueStats = (year) => 
  api.get('/admin/revenue/monthly', { params: { year } });

// ========== USER MANAGEMENT ==========
export const getAllUsers = (params) => api.get('/admin/users', { params });
export const getUserById = (id) => api.get(`/admin/users/${id}`);
export const createUser = (userData) => api.post('/admin/users', userData);
export const updateUser = (id, userData) => api.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const toggleUserStatus = (id) => api.patch(`/admin/users/${id}/status`);
export const getUserStats = () => api.get('/admin/users/stats');

// ========== FIELD MANAGEMENT ==========
export const getAllFields = (params) => api.get('/admin/fields', { params });
export const getFieldById = (id) => api.get(`/admin/fields/${id}`);
export const createField = (fieldData) => api.post('/admin/fields', fieldData);
export const updateField = (id, fieldData) => api.put(`/admin/fields/${id}`, fieldData);
export const deleteField = (id) => api.delete(`/admin/fields/${id}`);
export const toggleFieldStatus = (id) => api.patch(`/admin/fields/${id}/status`);
export const getFieldStats = () => api.get('/admin/fields/stats');
export const uploadFieldImages = (id, images) => api.post(`/admin/fields/${id}/images`, { images });
export const deleteFieldImage = (imageId) => api.delete(`/admin/fields/images/${imageId}`);

// ========== BOOKING MANAGEMENT ==========
export const getAllBookings = (params) => api.get('/admin/bookings', { params });
export const getBookingById = (id) => api.get(`/admin/bookings/${id}`);
export const updateBookingStatus = (id, status, note) => 
  api.patch(`/admin/bookings/${id}/status`, { status, note });
export const cancelBooking = (id, reason) => 
  api.post(`/admin/bookings/${id}/cancel`, { reason });
export const getBookingStats = () => api.get('/admin/bookings/stats');
export const getBookingsByDateRange = (startDate, endDate) => 
  api.get('/admin/bookings/date-range', { params: { startDate, endDate } });

// ========== EMPLOYEE MANAGEMENT ==========
export const getAllEmployees = (params) => api.get('/admin/employees', { params });
export const getEmployeeById = (id) => api.get(`/admin/employees/${id}`);
export const createEmployee = (employeeData) => api.post('/admin/employees', employeeData);
export const updateEmployee = (id, employeeData) => api.put(`/admin/employees/${id}`, employeeData);
export const deleteEmployee = (id) => api.delete(`/admin/employees/${id}`);
export const assignFieldToEmployee = (employeeId, fieldId) => 
  api.post('/admin/employees/assign-field', { employeeId, fieldId });
export const getEmployeeStats = () => api.get('/admin/employees/stats');
