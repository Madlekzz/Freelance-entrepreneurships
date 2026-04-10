import api from "../config/api";

// Reflejamos exactamente lo que viene del backend
export interface Entrepreneurship {
  id: string;
  owner_id: string;
  name: string;
  description?: string; // Opcional ya que no venía en tu JSON de ejemplo
  is_active: boolean;
  created_at: string;
  users: {
    name: string;
  };
  logo_url?: string;
  // El backend envía este objeto por la relación de Supabase
  products: {
    count: number;
  }[];
  // La propiedad aplanada que agregamos en el controlador
  product_count: number;
}

// Payload para crear/editar (omitimos campos automáticos)
export type EntrepreneurshipPayload = Pick<
  Entrepreneurship,
  "name" | "description" | "logo_url"
>;

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
