import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.your-backend.com", // TODO: change to your backend
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
