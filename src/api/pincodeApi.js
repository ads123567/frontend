import api from './baseApi';

export const fetchPincodes = async ({ skip = 0, limit = 100 } = {}) => {
  const { data } = await api.get(`/admin/pincodes/?skip=${skip}&limit=${limit}`);
  return data;
};

export const createPincode = async (pincodeData) => {
  const { data } = await api.post('/admin/pincodes/', pincodeData);
  return data;
};

export const updatePincode = async ({ id, ...updateData }) => {
  const { data } = await api.put(`/admin/pincodes/${id}`, updateData);
  return data;
};