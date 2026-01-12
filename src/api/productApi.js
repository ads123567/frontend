import api from './baseApi';

export const fetchProducts = async ({ storeId, categoryId, search } = {}) => {
  // If storeId is provided, we use the drill-down endpoint we created earlier
  let url = '/products/';
  if (storeId) {
    url = `/admin/stores/${storeId}/products`;
  }
  
  // Append query params if standard product list
  const params = new URLSearchParams();
  if (categoryId) params.append('category_id', categoryId);
  if (search) params.append('search', search);

  const { data } = await api.get(url, { params });
  return data;
};

export const createProduct = async (productData) => {
  const { data } = await api.post('/admin/products/', productData);
  return data;
};

export const updateProduct = async ({ id, ...updateData }) => {
  const { data } = await api.put(`/admin/products/${id}`, updateData);
  return data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/admin/products/${id}`);
  return data;
};