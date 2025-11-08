import axios from "axios";

const api = axios.create({
  baseURL: "https://farmerconnect-backend.onrender.com", // backend URL
  withCredentials: true,             // ✅ send cookies automatically
});

export default api;
