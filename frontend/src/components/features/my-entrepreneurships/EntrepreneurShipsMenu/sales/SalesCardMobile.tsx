import { Calendar, CheckCircle2, Clock, RotateCcw, User } from "lucide-react";
import type { EntrepreneurshipSale } from "../../../../../types";
import { formatCurrency } from "../../../../../utils/format";

interface Props {
  sales: EntrepreneurshipSale[];
  onRefund: (sale: EntrepreneurshipSale) => void;
  selectedSales: string[];
  toggleSelection: (id: string) => void;
  processingIds: string[];
}

export default function SalesCardsMobile({
  sales,
  onRefund,
  selectedSales,
  toggleSelection,
  processingIds,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {sales.map((sale) => {
        const allItemsRefunded = sale.sale_items.every((item) => item.refunded);
        const isEffectivelyRefunded = sale.refunded || allItemsRefunded;
        const canRefund = !sale.payroll_processed && !isEffectivelyRefunded;
        const isProcessing = processingIds.includes(sale.id);
        const itemsTotal = sale.sale_items.reduce((sum, item) => sum + Number(item.subtotal), 0);
        return (
          <div key={sale.id} className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  disabled={!canRefund || isProcessing}
                  checked={selectedSales.includes(sale.id)}
                  onChange={() => toggleSelection(sale.id)}
                  className="w-5 h-5 rounded-lg text-primary cursor-pointer disabled:opacity-30 shrink-0"
                />
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">{sale.users.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">#{sale.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              {isEffectivelyRefunded ? (
                <span className="bg-red-50 text-red-600 p-1.5 rounded-lg shrink-0"><RotateCcw size={16} /></span>
              ) : sale.payroll_processed ? (
                <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg shrink-0"><CheckCircle2 size={16} /></span>
              ) : (
                <span className="bg-amber-50 text-amber-600 p-1.5 rounded-lg shrink-0"><Clock size={16} /></span>
              )}
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-3 space-y-2">
              {sale.sale_items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-[11px]">
                  <span className={`truncate max-w-[70%] ${item.refunded ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className={`font-bold mr-1 ${item.refunded ? 'text-red-400' : 'text-primary'}`}>{item.quantity}x</span>
                    <span className={item.refunded ? 'line-through' : ''}>{item.products.name}</span>
                    {item.refunded && (
                      <span className="text-[8px] font-bold text-red-500 bg-red-100 px-1 py-0.5 rounded ml-1">REEMBOLSADO</span>
                    )}
                  </span>
                  <span className={`font-bold italic ${item.refunded ? 'text-red-300' : 'text-gray-400'}`}>{formatCurrency(item.unit_price)}</span>
                </div>
              ))}
            </div>
            {canRefund && (
              <button
                type="button"
                onClick={() => onRefund(sale)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={14} /> {isProcessing ? "Procesando..." : "Reembolsar"}
              </button>
            )}
            <div className="flex justify-between items-end pt-2 border-t border-gray-50">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Fecha</span>
                <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                  <Calendar size={13} className="text-primary" />
                  {new Date(sale.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total</p>
                <p className="text-lg font-black text-primary leading-tight">{formatCurrency(itemsTotal)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
