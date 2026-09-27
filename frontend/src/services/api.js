import axios from "axios";

// Base URL points at the Express/Node REST API (see backend README).
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT (issued by the Express auth routes) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ridego_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized 401 handling: drop the stale token and bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("ridego_token");
      localStorage.removeItem("ridego_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (payload) => api.post("/auth/register", payload),
  me: () => api.get("/auth/me"),
};

export const rideAPI = {
  estimateFare: (payload) => api.post("/rides/estimate", payload),
  bookRide: (payload) => api.post("/rides", payload),
  getRide: (rideId) => api.get(`/rides/${rideId}`),
  getHistory: () => api.get("/rides/history"),
  cancelRide: (rideId) => api.patch(`/rides/${rideId}/cancel`),
};

export const driverAPI = {
  getRequests: () => api.get("/driver/requests"),
  acceptRide: (rideId) => api.patch(`/driver/rides/${rideId}/accept`),
  completeRide: (rideId) => api.patch(`/driver/rides/${rideId}/complete`),
  getEarnings: (range) => api.get(`/driver/earnings`, { params: { range } }),
};

export const adminAPI = {
  getUsers: () => api.get("/admin/users"),
  getDrivers: () => api.get("/admin/drivers"),
  getVehicles: () => api.get("/admin/vehicles"),
  getRides: () => api.get("/admin/rides"),
};

export default api;
