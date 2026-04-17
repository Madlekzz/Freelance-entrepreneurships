import type { PayrollCycle } from "../types";

export const PAYROLL_CYCLES: (PayrollCycle | null)[] = [
  null,
  { label: "Corte 13 - 26", startDay: 13, endDay: 26 },
  { label: "Corte 26 - 13", startDay: 26, endDay: 13 },
];

export const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
