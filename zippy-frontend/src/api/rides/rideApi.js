
// import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_BASE_URL;

// export const getFareEstimate = (pickup, destination, token) =>
//   axios.get(`${API_BASE_URL}/api/v1/rides/get-fare`, {
//     params: { pickup, destination },
//     headers: { Authorization: `Bearer ${token}` },
//   });

// export const requestRide = (data, token) =>
//   axios.post(`${API_BASE_URL}/api/v1/rides/request-ride`, data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

import apiClient from "../apiClient";

// Get fare estimate for the given pickup and destination
export const getFareEstimate = (pickup, destination) =>
  apiClient.get("/api/v1/rides/get-fare", {
    params: { pickup, destination },
  });

// Request a ride with the ride data
export const requestRide = (data) => apiClient.post("/api/v1/rides/request-ride", data);
