import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
// Keys for caching
export const ADMIN_KEYS = {
  all: ['admin'],
  settings: ['admin', 'settings'], 
  pending: (filters) => ['admin', 'orders', 'pending', filters],
  allOrders: (filters) => ['admin', 'orders', 'all', filters],
};

// --- HOOKS ---

// 1. Hook to View Pending Orders
export const usePendingOrders = (filters = { page: 1, size: 20, role_filter: null }) => {
  return useQuery({
    queryKey: ADMIN_KEYS.pending(filters),
    queryFn: () => adminApi.getPendingOrders(filters),
    keepPreviousData: true, // UX: Keep old data while fetching next page
  });
};

// 2. Hook to View All Orders (Global Admin View)
export const useAllOrders = (filters = { page: 1, size: 20, role: null, status: null, search: null }) => {
  return useQuery({
    queryKey: ADMIN_KEYS.allOrders(filters),
    queryFn: () => adminApi.getAllOrders(filters),
    keepPreviousData: true,
  });
};

// 3. Mutation to Approve/Reject Order
export const useAdminDecision = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminApi.makeDecision,
    onSuccess: () => {
      // Invalidate both Pending list and All Orders list so they refresh automatically
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      
      // Optional: Add Toast Notification here
      // toast.success("Order status updated successfully!");
    },
    onError: (error) => {
      console.error("Failed to update order:", error);
    }
  });
};

// 4. Mutation to Configure Rules
export const useConfigureApproval = () => {
  return useMutation({
    mutationFn: adminApi.configureApproval,
    onSuccess: (data) => {
       console.log("Configuration Updated:", data.message);
    }
  });
};

export const useGetApprovalSettings = () => {
  return useQuery({
    queryKey: ADMIN_KEYS.settings,
    queryFn: adminApi.getApprovalSettings,
    refetchOnWindowFocus: false,
  });
};