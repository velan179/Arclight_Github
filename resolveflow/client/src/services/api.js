import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('resolveflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const casesApi = {
  list: () => api.get('/cases').then((r) => r.data.data.cases),
  get: (id) => api.get(`/cases/${id}`).then((r) => r.data.data.case),
  create: (data) => api.post('/cases', data).then((r) => r.data.data.case),
};

export const agentApi = {
  run: (payload) => api.post('/agent/run', payload).then((r) => r.data.data),
  getRun: (id) => api.get(`/agent/runs/${id}`).then((r) => r.data.data.run),
  getEvents: (id) => api.get(`/agent/runs/${id}/events`).then((r) => r.data.data.events),
};

export const enterpriseApi = {
  getCustomer: (id) => api.get(`/customers/${id}`).then((r) => r.data.data.customer),
  getOrder: (id) => api.get(`/orders/${id}`).then((r) => r.data.data.order),
  getInventory: (id) => api.get(`/inventory/${id}/availability`).then((r) => r.data.data.availability),
  getPolicies: () => api.get('/policies').then((r) => r.data.data.policies),
  setChaos: (flags) => api.post('/inventory/chaos', flags).then((r) => r.data.data),
};

export const healthApi = {
  check: () => api.get('/health').then((r) => r.data.data),
};

export default api;
