import api from "../config/api";
import type {
  CreateSalePayload,
  EntrepreneurshipSale,
  GlobalSale,
  RefundPayload,
  RefundResponse,
  Sale,
} from "../types";

// --- Interfaces existentes (SIN CAMBIOS) ---

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

/**
 * Reembolsa items de una venta (solo PROVEEDOR dueño del emprendimiento)
 */
export const refundSale = async (
  saleId: string,
  payload?: RefundPayload,
): Promise<RefundResponse> => {
  const { data } = await api.post<RefundResponse>(
    `/sales/${saleId}/refund`,
    payload,
  );
  return data;
};
