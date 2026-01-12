import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStores, createStore, updateStore } from '../api/storeApi';

export const useStores = (params) => {
  return useQuery({
    // Include params in key so it refetches when filter changes
    queryKey: ['stores', params], 
    queryFn: () => fetchStores(params),
    enabled: !!params, // Only fetch if params exist (optional)
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stores'] });
    },
  });
};