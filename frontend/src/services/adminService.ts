import api from "../config/api";
import type { UpdatePayrollResponse } from "../types";

export async function updatePayrollStatus(
  saleId: string,
): Promise<UpdatePayrollResponse> {
  const { data } = await api.patch<UpdatePayrollResponse>(
    `/sales/${saleId}/payroll`,
  );
  return data;
}
