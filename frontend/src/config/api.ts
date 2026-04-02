import axios from "axios";
import { type ApiErrorResponse, AppError } from "../types";
import { supabase } from "./supabaseClient"; // Importamos tu cliente existente

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. INTERCEPTOR DE SOLICITUD: Inyectar el Token
api.interceptors.request.use(
  async (config) => {
    // Obtenemos la sesión actual de forma asíncrona
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 2. INTERCEPTOR DE RESPUESTA: Manejo de errores (Tu código original)
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    let customMessage = "Error inesperado";
    let status: number | undefined;

    if (axios.isAxiosError(error)) {
      // Tipamos la respuesta del servidor
      const serverData = error.response?.data as ApiErrorResponse | undefined;
      status = error.response?.status;
      customMessage =
        serverData?.error ??
        serverData?.message ??
        error.message ??
        customMessage;
    }

    // Retornamos nuestra clase personalizada en lugar de any
    return Promise.reject(new AppError(customMessage, status));
  },
);

export default api;
