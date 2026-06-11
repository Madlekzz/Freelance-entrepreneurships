import api from "../config/api";
import type { EntrepreneurPaymentData } from "../types";

export async function getMyPaymentData(): Promise<EntrepreneurPaymentData[]> {
  const { data } = await api.get<EntrepreneurPaymentData[]>("/entrepreneur-payment-data/me");
  return data;
}

export async function upsertPaymentData(
  method: string,
  payload: { data: Record<string, string>; is_active: boolean }
): Promise<EntrepreneurPaymentData> {
  const { data } = await api.put<EntrepreneurPaymentData>(`/entrepreneur-payment-data/${method}`, payload);
  return data;
}

export async function getPaymentDataByProducts(productIds: string[]): Promise<EntrepreneurPaymentData[]> {
  const { data } = await api.post<EntrepreneurPaymentData[]>("/entrepreneur-payment-data/batch", {
    product_ids: productIds,
  });
  return data;
}
