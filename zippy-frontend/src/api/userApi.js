import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const registerUser = (payload) =>
  axios.post(`${API_BASE_URL}/api/v1/users/register`, payload);

export const loginUser = (payload) =>
  axios.post(`${API_BASE_URL}/api/v1/users/login`, payload);

export const getUserProfile = (token) =>
  axios.get(`${API_BASE_URL}/api/v1/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const logoutUser = (token) =>
  axios.post(
    `${API_BASE_URL}/api/v1/users/logout`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
