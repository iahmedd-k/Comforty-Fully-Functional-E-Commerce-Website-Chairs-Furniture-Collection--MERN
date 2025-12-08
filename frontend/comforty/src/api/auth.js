import api from "../api/axios.js";

export const login = (data) => api.post("/user/login", data);

export const register = (data) => api.post("/user/signup", data);

export const forgotPassword = (email) =>
  api.post("/user/forgot-password", { email });
