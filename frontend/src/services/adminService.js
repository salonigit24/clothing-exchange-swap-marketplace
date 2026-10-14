import api from './api';

export const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await api.put(`/admin/users/${id}/toggle-status`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAdminClothing = async (params = {}) => {
  const response = await api.get('/admin/clothing', { params });
  return response.data;
};

export const updateAdminClothingStatus = async (id, status) => {
  const response = await api.put(`/admin/clothing/${id}/status`, { status });
  return response.data;
};

export const getAdminSwaps = async (params = {}) => {
  const response = await api.get('/admin/swaps', { params });
  return response.data;
};

export const getAdminReports = async (params = {}) => {
  const response = await api.get('/admin/reports', { params });
  return response.data;
};

export const updateAdminReport = async (id, data) => {
  const response = await api.put(`/admin/reports/${id}`, data);
  return response.data;
};
