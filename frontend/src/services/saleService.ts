import api from "../config/api";

// --- Interfaces existentes (SIN CAMBIOS) ---
interface CreateSalePayload {
  consumer_id: string;
  items: SaleItemPayload[];
}

export interface SaleItemPayload {
  product_id: string;
  quantity: number;
}

export interface Sale {
  id: string;
  consumer_id: string;
  total_amount: number;
  payroll_processed: boolean;
  created_at: string;
}

export interface SaleItemDetail {
  quantity: number;
  unit_price: number;
  subtotal: number;
  products: {
    id: string;
    name: string;
    entrepreneurship_id: string;
  };
}

export interface EntrepreneurshipSale {
  id: string;
  created_at: string;
  total: number;
  payroll_processed: boolean;
  users: {
    id: string;
    name: string;
    email: string;
  };
  sale_items: SaleItemDetail[];
}

// --- Nueva Interfaz para la Vista Global del Admin (GET /sales) ---

export interface GlobalSale {
  id: string;
  created_at: string;
  total: number;
  payroll_processed: boolean;
  users: {
    id: string;
    name: string;
    email: string;
  };
  sale_items: {
    quantity: number;
    unit_price: number;
    subtotal: number;
    products: {
      id: string;
      name: string;
      entrepreneurships: {
        // Estructura anidada del JSON de /sales
        id: string;
        name: string;
        owner_id: string;
      };
    };
  }[];
}

// --- Funciones del Service ---

export async function createSale(payload: CreateSalePayload): Promise<Sale> {
  const { data } = await api.post<Sale>("/sales", payload);
  return data;
}

export const getConsumerPurchases = async (consumerId: string) => {
  const response = await api.get(`/sales/consumer/${consumerId}`);
  return response.data;
};

/**
 * Obtiene las ventas filtradas por un emprendimiento específico
 */
export const getSalesByEntrepreneurship = async (
  entrepreneurshipId: string,
): Promise<EntrepreneurshipSale[]> => {
  const response = await api.get(
    `/sales/entrepreneurship/${entrepreneurshipId}`,
  );
  return response.data;
};

/**
 * Obtiene todas las ventas de la base de datos (Vista Admin)
 */
export const getAllSales = async (): Promise<GlobalSale[]> => {
  const { data } = await api.get<GlobalSale[]>("/sales");
  return data;
};
