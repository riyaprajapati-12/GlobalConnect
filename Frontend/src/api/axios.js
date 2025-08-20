import axios from "axios";

const API = axios.create({
  baseURL: "https://globalconnect-aatv.onrender.com/api", // backend ka base URL
});

// Agar token chahiye to har request me add karne ke liye:
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
