import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api'; // Usa variable o proxy
console.log("API Base URL:", API_URL); // Para depuración

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta (opcional, para manejo global de 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('API Error 401: Unauthorized. Token might be invalid or expired.');
      // Podrías desloguear aquí si es necesario, pero cuidado con loops
      // localStorage.removeItem('authToken');
      // window.location.href = '/'; // Redirigir a home
    }
    return Promise.reject(error);
  }
);

export default api;