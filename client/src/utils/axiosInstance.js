import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

const AUTH_ROUTES = [
  "/auth/send-otp",
  "/auth/verify-otp",
  "/auth/signup",
  "/auth/login",
  "/auth/reset-password",
  "/auth/change-password",
];

const isAuthRoute = (url = "") =>
  AUTH_ROUTES.some((route) => url.includes(route));

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ONLY attach valid JWT token
    if (
      token &&
      token !== "null" &&
      token !== "undefined" &&
      token.split(".").length === 3
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;
    const requestUrl = config?.url || "";

    if (!response) {
      toast.error("Network error");
      return Promise.reject(error);
    }

    if (isAuthRoute(requestUrl)) {
      return Promise.reject(error);
    }

    if (response.status === 401) {
      toast.error("Session expired. Please login again.");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("persist:root");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;