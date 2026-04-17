import { Calendar } from "lucide-react";
import type { GlobalSale, SaleItemDetail } from "../../../types";
import { formatCurrency } from "../../../utils/format";

interface Props {
  sales: GlobalSale[];
  selectedSales: string[];
  toggleSelection: (id: string) => void;
  onProcessSingle: (id: string) => void;
  processingIds: string[];
}

export const DetailedMobile = ({
  sales,
  selectedSales,
  toggleSelection,
  onProcessSingle,
  processingIds,
}: Props) => (
  <div className="md:hidden space-y-4 p-4">
    {sales.map((sale) => (
      <div
        key={sale.id}
        className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4"
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              disabled={
                sale.payroll_processed || processingIds.includes(sale.id)
              }
              checked={selectedSales.includes(sale.id)}
              onChange={() => toggleSelection(sale.id)}
              className="w-5 h-5 rounded-lg text-primary"
            />
            <div className="min-w-0">
              <p className="text-sm font-black text-gray-900 truncate">
                {sale.users.name}
              </p>
              <p className="text-[10px] text-gray-400 font-mono">
                #{sale.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
          {sale.payroll_processed ? (
            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[9px] font-black italic">
              LIQUIDADO
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onProcessSingle(sale.id)}
              disabled={processingIds.includes(sale.id)}
              className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer disabled:opacity-50"
            >
              {processingIds.includes(sale.id) ? "..." : "LIQUIDAR"}
            </button>
          )}
        </div>

        <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-2xl">
          {sale.sale_items.map((item: SaleItemDetail) => (
            <div
              key={item.products.id}
              className="text-[11px] text-gray-600 flex justify-between"
            >
              <span>
                <b className="text-primary">{item.quantity}x</b>{" "}
                {item.products.name}
              </span>
              <span className="text-gray-400 font-mono">
                ${item.unit_price}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Fecha
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
              <Calendar size={13} className="text-primary" />{" "}
              {new Date(sale.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Monto
            </p>
            <p className="text-xl font-black text-gray-900">
              {formatCurrency(sale.total)}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
);
