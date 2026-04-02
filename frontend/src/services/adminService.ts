import api from "../config/api";

// Definimos la interfaz de la respuesta para tener Tipado Fuerte (TypeScript)
interface UpdatePayrollResponse {
  message: string;
  data: {
    id: string;
    payroll_processed: boolean;
    total: number;
    created_at: string;
  };
}

export async function updatePayrollStatus(
  saleId: string,
): Promise<UpdatePayrollResponse> {
  const { data } = await api.patch<UpdatePayrollResponse>(
    `/sales/${saleId}/payroll`,
  );
  return data;
}
