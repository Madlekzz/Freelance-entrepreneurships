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
 * Marca items de una venta de pago inmediato como procesados (Pago recibido)
 */
export const processSaleItems = async (
  saleId: string,
  itemIds: number[],
): Promise<{ message: string; processed: number }> => {
  const { data } = await api.patch<{ message: string; processed: number }>(
    `/sales/${saleId}/items/process`,
    { item_ids: itemIds },
  );
  return data;
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

export interface BatchRefundResult {
  saleId: string;
  success: boolean;
  error?: string;
  type?: "full" | "partial";
}

export interface BatchRefundResponse {
  message: string;
  results: BatchRefundResult[];
}

/**
 * Reembolsa multiples ventas en lote (solo PROVEEDOR)
 * Reembolsa TODOS los items del emprendimiento en cada venta
 */
export const refundSalesBatch = async (
  saleIds: string[],
): Promise<BatchRefundResponse> => {
  const { data } = await api.post<BatchRefundResponse>("/sales/batch/refund", {
    saleIds,
  });
  return data;
};
