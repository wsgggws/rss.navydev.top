import axios from "axios";
import { useAuthStore } from "../stores/auth";

// 创建 Axios 实例
const api = axios.create({
  baseURL: "http://localhost:8000", // ✅ 替换为你的实际后端地址
  timeout: 10000,
});

// 请求拦截器：自动附加 token
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const auth = useAuthStore();
      auth.logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;
