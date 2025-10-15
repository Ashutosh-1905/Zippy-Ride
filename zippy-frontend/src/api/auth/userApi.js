import apiClient from "../apiClient";

export const registerUser = (payload) =>
  apiClient.post("/api/v1/users/register", payload);

export const loginUser = (payload) =>
  apiClient.post("/api/v1/users/login", payload);

export const getUserProfile = () => apiClient.get("/api/v1/users/profile");

export const logoutUser = () => apiClient.post("/api/v1/users/logout");
