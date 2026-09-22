import axios from "axios";

// En producción usamos el backend de Render.
// En desarrollo usamos el backend local.
const baseURL = import.meta.env.PROD
  ? "https://raices-backend-final.onrender.com/api"
  : `http://${window.location.hostname || "127.0.0.1"}:8000/api`;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Agregar automáticamente el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;