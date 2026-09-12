import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesApi } from '../services/casesApi';
import { agentApi } from '../services/agentApi';

export const useCases = (filters = {}) => {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn: () => casesApi.getCases(filters),
    keepPreviousData: true
  });
};

export const useCaseDetails = (id) => {
  return useQuery({
    queryKey: ['cases', id],
    queryFn: () => casesApi.getCaseById(id),
    enabled: !!id
  });
};

export const useCreateCase = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => casesApi.createCase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    }
  });
};

export const useRunAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ caseId, simulateFailure }) => agentApi.runAgent(caseId, simulateFailure),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['agentEvents'] });
    }
  });
};

export const useAgentEvents = (runId = 'run_9001') => {
  return useQuery({
    queryKey: ['agentEvents', runId],
    queryFn: () => agentApi.getAgentEvents(runId),
    refetchInterval: 10000
  });
};
