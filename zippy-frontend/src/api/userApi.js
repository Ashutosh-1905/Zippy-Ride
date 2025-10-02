import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const registerUser = (payload) => API.post('/api/v1/users/register', payload);
export const loginUser = (payload) => API.post('/api/v1/users/login', payload);
export const getUserProfile = (token) =>
  API.get('/api/v1/users/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });
export const logoutUser = (token) =>
  API.post('/api/v1/users/logout', {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
