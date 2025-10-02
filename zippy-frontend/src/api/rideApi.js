import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const getFareEstimate = (pickup, destination, token) =>
  axios.get(`${API_BASE_URL}/api/v1/rides/get-fare`, {
    params: { pickup, destination },
    headers: { Authorization: `Bearer ${token}` },
  });

export const requestRide = (data, token) =>
  axios.post(`${API_BASE_URL}/api/v1/rides/request-ride`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
