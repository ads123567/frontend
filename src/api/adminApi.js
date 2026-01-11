import api from './baseApi';

export const adminApi = {
  // 1. Configure Approval Rules (Auto Approve / MR Logic)
  configureApproval: async (configData) => {
    // configData = { auto_approve_user: true, max_mr_ptr_percent: 5.5 }
    const { data } = await api.post('/admin/configure-approval', configData);
    return data;
  },

  getApprovalSettings: async () => {
    const { data } = await api.get('/admin/configure-approval');
    return data;
  },

  // 2. Get Pending Approvals (Oldest First)
  getPendingOrders: async ({ page = 1, size = 20, role_filter = null }) => {
    const params = { page, size };
    if (role_filter) params.role_filter = role_filter;
    
    const { data } = await api.get('/admin/orders/pending', { params });
    return data;
  },

  // 3. Get All Orders (Global Admin View with Filters)
  getAllOrders: async ({ page = 1, size = 20, role = null, status = null, search = null }) => {
    const params = { page, size };
    if (role) params.role = role;
    if (status) params.status = status;
    if (search) params.search = search;

    const { data } = await api.get('/admin/orders/all', { params });
    return data;
  },

  // 4. Approve or Reject Order
  makeDecision: async ({ orderId, action }) => {
    // action must be 'approve' or 'reject'
    const { data } = await api.put(`/admin/orders/${orderId}/decision`, { action });
    return data;
  }
};