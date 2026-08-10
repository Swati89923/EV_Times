import axios from "axios";

// Base URL is environment-driven so the same build can point at
// local dev, staging, or production without code changes.
// See /.env.example for the variable to set.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Attach the JWT automatically if present, instead of every
// caller having to read localStorage itself.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("ev_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling: if the token is rejected, clear the
// stale session so the UI doesn't keep showing a logged-in state
// against a backend that no longer recognizes the token.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ev_token");
      localStorage.removeItem("ev_email");
      localStorage.removeItem("ev_role");
      window.dispatchEvent(new Event("ev-auth-expired"));
    }
    return Promise.reject(error);
  }
);

export default API;
