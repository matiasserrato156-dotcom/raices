import axios from "axios";

// Detecta automáticamente si estás en localhost o en la IP de la red local (celular)
const host = window.location.hostname || "127.0.0.1";
const baseURL = `http://${host}:8000/api`;

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