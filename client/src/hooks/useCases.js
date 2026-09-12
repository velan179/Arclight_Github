import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { mockCases } from '../services/mockData';

export const useCases = () => {
  return useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      try {
        const res = await api.get('/cases');
        return res.data;
      } catch (err) {
        console.warn('Backend unavailable, utilizing contract mock data:', err);
        return mockCases;
      }
    }
  });
};

export const useCaseDetails = (id) => {
  return useQuery({
    queryKey: ['cases', id],
    queryFn: async () => {
      try {
        const res = await api.get(`/cases/${id}`);
        return res.data;
      } catch (err) {
        return mockCases.find((c) => c.id === id) || mockCases[0];
      }
    },
    enabled: !!id
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCase) => api.post('/cases', newCase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    }
  });
};
