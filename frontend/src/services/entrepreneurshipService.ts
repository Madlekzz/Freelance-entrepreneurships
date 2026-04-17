import api from "../config/api";
import type { Entrepreneurship } from "../types";

// Reflejamos exactamente lo que viene del backend

/**
 * Obtiene los emprendimientos del usuario autenticado (/me)
 */
export const getMyEntrepreneurships = async (): Promise<Entrepreneurship[]> => {
  const { data } = await api.get<Entrepreneurship[]>("/entrepreneurships/me");
  return data;
};

export const getEntrepreneurshipById = async (
  id: string,
): Promise<Entrepreneurship> => {
  const { data } = await api.get<Entrepreneurship>(`/entrepreneurships/${id}`);
  return data;
};

export async function createEntrepreneurship(
  entrepreneurshipData: Partial<Entrepreneurship>,
) {
  const { data } = await api.post(`/entrepreneurships/`, entrepreneurshipData);
  return data;
}

export async function updateEntrepreneurship(
  id: string,
  entrepreneurshipData: Partial<Entrepreneurship>,
) {
  const { data } = await api.put(
    `/entrepreneurships/${id}`,
    entrepreneurshipData,
  );
  return data;
}

/**
 * Elimina un emprendimiento
 */
export const deleteEntrepreneurship = async (id: string): Promise<void> => {
  await api.delete(`/entrepreneurships/${id}`);
};
