import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kittyeats_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const recipeService = {
  getAll: (params) => api.get('/api/recipes', { params }),
  getById: (id) => api.get(`/api/recipes/${id}`),
  create: (formData) => api.post('/api/recipes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/api/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/api/recipes/${id}`),
  toggleLike: (id) => api.post(`/api/recipes/${id}/like`),
  toggleSave: (id) => api.post(`/api/recipes/${id}/save`),
  getSaved: () => api.get('/api/recipes/user/saved'),
  getByAuthor: (authorId) => api.get(`/api/recipes/author/${authorId}`),
};

export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

export const userService = {
  getProfile: (id) => api.get(`/api/users/${id}`),
  updateProfile: (data) => api.put('/api/users/profile', data),
};

export default api;
