import ApiClient from './api';

// Dashboard APIs
export const getDashboardStats = async () => {
  const response = await ApiClient.get('/manager/dashboard/stats');
  return response;
};

export const getRevenueByDateRange = async (startDate, endDate) => {
  const response = await ApiClient.get('/manager/dashboard/revenue', {
    params: { startDate, endDate }
  });
  return response;
};

export const getMonthlyRevenue = async (year) => {
  const response = await ApiClient.get('/manager/dashboard/monthly-revenue', {
    params: { year }
  });
  return response;
};

// Booking APIs
export const getBookings = async (filters = {}) => {
  const response = await ApiClient.get('/manager/bookings', {
    params: filters
  });
  return response;
};

export const getBookingById = async (id) => {
  const response = await ApiClient.get(`/manager/bookings/${id}`);
  return response;
};

export const approveBooking = async (id) => {
  const response = await ApiClient.put(`/manager/bookings/${id}/approve`);
  return response;
};

export const rejectBooking = async (id, reason) => {
  const response = await ApiClient.put(`/manager/bookings/${id}/reject`, { reason });
  return response;
};

export const completeBooking = async (id) => {
  const response = await ApiClient.put(`/manager/bookings/${id}/complete`);
  return response;
};

export const cancelBooking = async (id, reason) => {
  const response = await ApiClient.put(`/manager/bookings/${id}/cancel`, { reason });
  return response;
};

// Field APIs
export const getFields = async () => {
  const response = await ApiClient.get('/manager/fields');
  return response;
};

export const getFieldById = async (id) => {
  const response = await ApiClient.get(`/manager/fields/${id}`);
  return response;
};

export const updateFieldStatus = async (id, status) => {
  const response = await ApiClient.put(`/manager/fields/${id}/status`, { status });
  return response;
};

export const getFieldStats = async (id) => {
  const response = await ApiClient.get(`/manager/fields/${id}/stats`);
  return response;
};

export const createField = async (fieldData) => {
  const response = await ApiClient.post('/manager/fields', fieldData);
  return response;
};

export const updateField = async (id, fieldData) => {
  const response = await ApiClient.put(`/manager/fields/${id}`, fieldData);
  return response;
};

export const deleteField = async (id) => {
  const response = await ApiClient.delete(`/manager/fields/${id}`);
  return response;
};

export default {
  getDashboardStats,
  getRevenueByDateRange,
  getMonthlyRevenue,
  getBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  completeBooking,
  cancelBooking,
  getFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
  updateFieldStatus,
  getFieldStats
};
