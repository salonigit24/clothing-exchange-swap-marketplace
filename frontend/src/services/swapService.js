import api from './api';

export const createSwapRequest = async (data) => {
  const response = await api.post('/swaps', data);
  return response.data;
};

export const getSentSwaps = async () => {
  const response = await api.get('/swaps/sent');
  return response.data;
};

export const getReceivedSwaps = async () => {
  const response = await api.get('/swaps/received');
  return response.data;
};

export const getSwapById = async (id) => {
  const response = await api.get(`/swaps/${id}`);
  return response.data;
};

export const acceptSwap = async (id) => {
  const response = await api.put(`/swaps/${id}/accept`);
  return response.data;
};

export const rejectSwap = async (id) => {
  const response = await api.put(`/swaps/${id}/reject`);
  return response.data;
};

export const cancelSwap = async (id) => {
  const response = await api.put(`/swaps/${id}/cancel`);
  return response.data;
};

export const confirmSwap = async (id, data = {}) => {
  const response = await api.put(`/swaps/${id}/confirm`, data);
  return response.data;
};

export const completeSwap = async (id) => {
  const response = await api.put(`/swaps/${id}/complete`);
  return response.data;
};

export const getSwapHistory = async (status = '') => {
  const response = await api.get('/swaps/history', { params: { status } });
  return response.data;
};
