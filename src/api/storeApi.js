import api from './baseApi';

export const fetchStores = async ({ pincodeId, skip = 0, limit = 100 } = {}) => {
  const params = new URLSearchParams({ skip, limit });
  if (pincodeId) params.append('pincode_id', pincodeId);
  
  const { data } = await api.get(`/admin/stores/?${params.toString()}`);
  return data;
};

export const createStore = async (storeData) => {
  const { data } = await api.post('/admin/stores/', storeData);
  return data;
};

export const updateStore = async ({ id, ...updateData }) => {
  const { data } = await api.put(`/admin/stores/${id}`, updateData);
  return data;
};