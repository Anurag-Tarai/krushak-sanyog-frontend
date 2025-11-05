import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // backend URL
  withCredentials: true,             // ✅ send cookies automatically
});

export default api;
