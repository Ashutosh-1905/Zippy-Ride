import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 8000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken') || localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default apiClient;
