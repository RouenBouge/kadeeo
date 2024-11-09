import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export const establishmentService = {
  getAll: async () => {
    const response = await api.get('/establishments');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/establishments/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/establishments', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/establishments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    await api.delete(`/establishments/${id}`);
  },
};

export const participantService = {
  create: async (data: any) => {
    const response = await api.post('/participants', data);
    return response.data;
  },
  getByEstablishment: async (establishmentId: string) => {
    const response = await api.get(`/establishments/${establishmentId}/participants`);
    return response.data;
  },
};