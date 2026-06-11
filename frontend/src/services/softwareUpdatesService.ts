import api from "../config/api";
import type { SoftwareUpdate } from "../types";

export async function getCurrentMonthUpdates(): Promise<SoftwareUpdate[]> {
  const { data } = await api.get<SoftwareUpdate[]>("/software-updates/current-month");
  return data;
}
