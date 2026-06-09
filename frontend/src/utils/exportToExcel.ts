import * as XLSX from "xlsx";
import type { GlobalSale, SaleItemDetail } from "../types";

interface ExcelRow {
  "ID Venta": string;
  Cliente: string;
  Email: string;
  Productos: string;
  Fecha: string;
  "Tipo de Pago": string;
  "Estado": string;
  Total: number;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const METHOD_LABELS: Record<string, string> = {
  efectivo: "Efectivo",
  binance: "Binance",
  pago_movil: "Pago Móvil",
};

function getPaymentTypeLabel(sale: GlobalSale): string {
  if (sale.payment_type === "immediate") {
    const method = METHOD_LABELS[sale.payment_method || ""] || "Pago Inmediato";
    return `Inmediato (${method})`;
  }
  return "Crédito (Nómina)";
}

function getSaleStatus(sale: GlobalSale, selectedEntId?: string): string {
  const items = selectedEntId
    ? sale.sale_items.filter(
        (item: SaleItemDetail) =>
          item.products.entrepreneurships.id === selectedEntId,
      )
    : sale.sale_items;
  const allItemsRefunded = items.every((item: SaleItemDetail) => item.refunded);
  if (sale.refunded || allItemsRefunded) return "REEMBOLSADO";
  if (sale.payment_type === "immediate") {
    const allProcessed = items.every((item: SaleItemDetail) => item.entrepreneur_processed || item.refunded);
    if (allProcessed) return "PAGO REALIZADO";
    const someProcessed = items.some((item: SaleItemDetail) => item.entrepreneur_processed);
    if (someProcessed) return `PARCIAL (${items.filter((i) => i.entrepreneur_processed).length}/${items.length})`;
    return "PENDIENTE";
  }
  if (sale.payroll_processed) return "PROCESADO";
  return "PENDIENTE";
}

function formatProducts(sale: GlobalSale, selectedEntId?: string): string {
  const items = selectedEntId
    ? sale.sale_items.filter(
        (item: SaleItemDetail) =>
          item.products.entrepreneurships.id === selectedEntId,
      )
    : sale.sale_items;
  return items
    .map((item: SaleItemDetail) => `${item.quantity}x ${item.products.name}`)
    .join(", ");
}

function getSaleTotal(sale: GlobalSale, selectedEntId?: string): number {
  if (!selectedEntId) return sale.total;
  return sale.sale_items
    .filter(
      (item: SaleItemDetail) =>
        item.products.entrepreneurships.id === selectedEntId,
    )
    .reduce((sum: number, item: SaleItemDetail) => sum + Number(item.subtotal), 0);
}

export function exportSalesToExcel(
  sales: GlobalSale[],
  descriptor: string,
  selectedEntId?: string,
): void {
  const rows: ExcelRow[] = sales.map((sale) => ({
    "ID Venta": `#${sale.id.slice(0, 8).toUpperCase()}`,
    Cliente: sale.users.name,
    Email: sale.users.email,
    Productos: formatProducts(sale, selectedEntId),
    Fecha: formatDate(sale.created_at),
    "Tipo de Pago": getPaymentTypeLabel(sale),
    "Estado": getSaleStatus(sale, selectedEntId),
    Total: getSaleTotal(sale, selectedEntId),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  ws["!cols"] = [
    { wch: 14 },
    { wch: 24 },
    { wch: 32 },
    { wch: 50 },
    { wch: 16 },
    { wch: 22 },
    { wch: 20 },
    { wch: 12 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Ventas");

  const sanitized = descriptor
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const today = new Date().toISOString().split("T")[0];
  const filename = `ventas-${sanitized}-${today}.xlsx`;

  XLSX.writeFile(wb, filename);
}
