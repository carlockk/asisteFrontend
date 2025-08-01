// src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://asistebackend.onrender.com', // ✅ coloca tu URL real si es distinta
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
