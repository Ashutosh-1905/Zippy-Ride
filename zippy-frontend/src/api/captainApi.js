import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const registerCaptain = (payload) =>
  axios.post(`${API_BASE_URL}/api/v1/captains/register`, payload);

export const loginCaptain = (payload) =>
  axios.post(`${API_BASE_URL}/api/v1/captains/login`, payload);

export const getCaptainProfile = (token) =>
  axios.get(`${API_BASE_URL}/api/v1/captains/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const logoutCaptain = (token) =>
  axios.post(
    `${API_BASE_URL}/api/v1/captains/logout`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
