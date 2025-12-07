import dotenv from "dotenv"
dotenv.config();
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // e.g. http://localhost:5000/api
  headers: {
    "Content-Type": "application/json",
  },
});

// OPTIONAL: Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
