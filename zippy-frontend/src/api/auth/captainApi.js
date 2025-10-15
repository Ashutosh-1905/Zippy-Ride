import apiClient from "../apiClient";

export const registerCaptain = (payload) =>
  apiClient.post("/api/v1/captains/register", payload);

export const loginCaptain = (payload) =>
  apiClient.post("/api/v1/captains/login", payload);

export const getCaptainProfile = () =>
  apiClient.get("/api/v1/captains/profile");

export const logoutCaptain = () =>
  apiClient.post("/api/v1/captains/logout");
