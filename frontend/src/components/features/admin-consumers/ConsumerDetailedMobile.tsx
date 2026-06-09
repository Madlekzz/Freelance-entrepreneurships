import { Calendar, Loader2, RotateCcw } from "lucide-react";
import type { GlobalSale, SaleItemDetail } from "../../../types";
import { formatCurrency } from "../../../utils/format";

interface Props {
  sales: GlobalSale[];
  selectedSales: string[];
  toggleSelection: (id: string) => void;
  onProcessSingle: (id: string) => void;
  onRefund: (sale: GlobalSale) => void;
  processingIds: string[];
}

export const ConsumerDetailedMobile = ({
  sales,
  selectedSales,
  toggleSelection,
  onProcessSingle,
  onRefund,
  processingIds,
}: Props) => (
  <div className="md:hidden space-y-4">
    {sales.map((sale) => {
      const isProcessing = processingIds.includes(sale.id);
      const allItemsRefunded = sale.sale_items.every((item: SaleItemDetail) => item.refunded);
      const isEffectivelyRefunded = sale.refunded || allItemsRefunded;
      return (
        <div
          key={sale.id}
          className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                disabled={sale.payroll_processed || isEffectivelyRefunded || isProcessing}
                checked={selectedSales.includes(sale.id)}
                onChange={() => toggleSelection(sale.id)}
                className="w-5 h-5 rounded-lg border-gray-200 text-primary cursor-pointer"
              />
              <div className="min-w-0">
                <p className="text-xs font-black text-gray-900 uppercase">
                  Ticket
                </p>
                <p className="text-[10px] text-gray-400 font-mono">
                  #{sale.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            {isEffectivelyRefunded ? (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-1 rounded-lg text-[9px] font-black italic">
                <RotateCcw size={12} /> REEMBOLSADA
              </span>
            ) : sale.payroll_processed ? (
              <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[9px] font-black italic">
                DESCONTADO
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onProcessSingle(sale.id)}
                  disabled={isProcessing}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    "DESCONTAR"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onRefund(sale)}
                  disabled={isProcessing}
                  className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  REEMBOLSAR
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
            {sale.sale_items.map((item: SaleItemDetail) => (
              <div
                key={item.products.id}
                className={`text-[11px] flex justify-between gap-2 ${item.refunded ? 'text-red-400' : 'text-gray-600'}`}
              >
                <span className="truncate">
                  <b className={item.refunded ? 'text-red-400' : 'text-primary'}>{item.quantity}x</b>{" "}
                  <span className={item.refunded ? 'line-through' : ''}>{item.products.name}</span>
                  {item.refunded && (
                    <span className="text-[8px] font-bold text-red-500 bg-red-100 px-1 py-0.5 rounded ml-1">REEMBOLSADO</span>
                  )}
                </span>
                <span className={`font-mono shrink-0 ${item.refunded ? 'text-red-300' : 'text-gray-400'}`}>
                  {formatCurrency(item.unit_price)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Fecha
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                <Calendar size={13} className="text-primary" />
                {new Date(sale.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                Monto
              </p>
              <p className="text-lg font-black text-gray-900 leading-none">
                {formatCurrency(sale.total)}
              </p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);
