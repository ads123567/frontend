import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPincodes, createPincode, updatePincode } from '../api/pincodeApi';

export const usePincodes = (params) => {
  return useQuery({
    queryKey: ['pincodes', params],
    queryFn: () => fetchPincodes(params),
  });
};

export const useCreatePincode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPincode,
    onSuccess: () => {
      // Refresh the list immediately after creating
      queryClient.invalidateQueries({ queryKey: ['pincodes'] });
    },
  });
};

export const useUpdatePincode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePincode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pincodes'] });
    },
  });
};