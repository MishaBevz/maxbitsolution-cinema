import axios from 'axios';

// Общая точка входа для запросов к backend API

export const API_URL = 'http://localhost:3022';

const client = axios.create({
  baseURL: API_URL,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      }
    }
    return Promise.reject(error);
  }
);

export default client;
