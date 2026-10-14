import api from './api';

export const getClothes = async (params = {}) => {
  const response = await api.get('/clothing', { params });
  return response.data;
};

export const getClothingById = async (id) => {
  const response = await api.get(`/clothing/${id}`);
  return response.data;
};

export const createClothing = async (formData) => {
  const response = await api.post('/clothing', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateClothing = async (id, formData) => {
  const response = await api.put(`/clothing/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteClothing = async (id) => {
  const response = await api.delete(`/clothing/${id}`);
  return response.data;
};

export const getMyListings = async () => {
  const response = await api.get('/clothing/my-listings');
  return response.data;
};

export const toggleAvailability = async (id) => {
  const response = await api.put(`/clothing/${id}/toggle-status`);
  return response.data;
};

export const calculateSwapValue = async (data) => {
  const response = await api.post('/clothing/calculate-value', data);
  return response.data;
};
