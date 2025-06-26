import axios from "axios";
import { toastError } from "../components/ui/toast";

const api = axios.create({
  baseURL: "https://geekyants-ev7r.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
  withCredentials: false,
});

// Automatically attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => {
    // Handle successful responses (optional - you can add success toasts here)
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          toastError("Authentication failed. Please login again.");
          // Optionally redirect to login
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          toastError("You don't have permission to perform this action.");
          break;
        case 404:
          toastError("Resource not found.");
          break;
        case 422:
          toastError(data.message || "Validation error occurred.");
          break;
        case 500:
          toastError("Server error. Please try again later.");
          break;
        default:
          toastError(data.message || "An error occurred. Please try again.");
      }
    } else if (error.request) {
      toastError("Network error. Please check your connection.");
    } else {
      toastError("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export default api;
