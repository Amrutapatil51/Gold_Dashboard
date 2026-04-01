import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  login: async (userData) => {
    const response = await api.post('/auth/login', userData);
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('user');
  },
};

// Market Services
export const marketService = {
  getPrice: async () => {
    const response = await api.get('/market/price');
    return response.data;
  },
  getNews: async () => {
    const response = await api.get('/news');
    return response.data;
  },
};

// Portfolio Services
export const portfolioService = {
  getItems: async () => {
    const response = await api.get('/portfolio');
    return response.data;
  },
  addItem: async (itemData) => {
    const response = await api.post('/portfolio', itemData);
    return response.data;
  },
  deleteItem: async (id) => {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  },
};

// Alert Services
export const alertService = {
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data;
  },
  createAlert: async (alertData) => {
    const response = await api.post('/alerts', alertData);
    return response.data;
  },
  deleteAlert: async (id) => {
    const response = await api.delete(`/alerts/${id}`);
    return response.data;
  },
};

export default api;
