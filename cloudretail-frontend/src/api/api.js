import axios from "axios";
import { getToken, clearToken } from "../utils/auth";

const api = axios.create({
  baseURL:
    "https://ecs-express-gateway-alb-a67697af-979833518.us-east-1.elb.amazonaws.com",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
