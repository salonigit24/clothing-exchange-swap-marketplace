import api from './api';

export const getSavedItems = async () => {
  const response = await api.get('/saved');
  return response.data;
};

export const saveItem = async (clothingId) => {
  const response = await api.post(`/saved/${clothingId}`);
  return response.data;
};

export const removeSavedItem = async (clothingId) => {
  const response = await api.delete(`/saved/${clothingId}`);
  return response.data;
};
