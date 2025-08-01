// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://asistebackend.onrender.com',
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
