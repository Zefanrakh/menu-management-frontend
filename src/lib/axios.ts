import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Ganti dengan URL API NestJS Anda
  timeout: 5000, // Timeout 5 detik
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
