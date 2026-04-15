import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Este interceptor pega el token automáticamente en cada petición
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default client;