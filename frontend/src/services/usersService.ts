import api from "../config/api";
import type { ActiveSessionsResponse, Consumer, PublicUser } from "../types";

export async function createUser(
  userData: Partial<PublicUser>,
): Promise<PublicUser> {
  const response = await api.post("/users", userData);
  return response.data;
}

export async function getConsumersList(): Promise<Consumer[]> {
  try {
    // Esta ruta debe coincidir con la que definas en tu index de rutas del backend
    const response = await api.get<Consumer[]>("/users/consumers");
    return response.data;
  } catch (error) {
    console.error("Error al obtener la lista de consumidores:", error);
    throw error;
  }
}

/**
 * Obtiene el perfil completo de un usuario por su ID
 */
export async function getUserProfile(id: string): Promise<PublicUser> {
  const response = await api.get<PublicUser>(`/users/${id}`);
  return response.data;
}

export async function getAllUsers(): Promise<PublicUser[]> {
  const response = await api.get("/users");
  return response.data;
}

export async function getActiveSessions(): Promise<number> {
  try {
    // La ruta debe ser la misma que definiste en tu router de Express para el controlador getActiveSessionsCount
    const response = await api.get<ActiveSessionsResponse>("/users/active");
    return response.data.count;
  } catch (error) {
    console.error("Error al obtener sesiones activas:", error);
    // Re-lanzamos el error para que el interceptor de axios o el hook lo manejen
    throw error;
  }
}

export async function updateUser(
  id: string,
  userData: Partial<PublicUser>,
): Promise<PublicUser> {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
}

export async function deleteUser(id: string): Promise<PublicUser> {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}
