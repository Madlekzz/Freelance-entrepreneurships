import { Loader2, RotateCcw } from "lucide-react";
import type { GlobalSale, SaleItemDetail } from "../../../types";
import { formatCurrency } from "../../../utils/format";

interface Props {
  sales: GlobalSale[];
  selectedSales: string[];
  toggleSelection: (id: string) => void;
  toggleAll: () => void;
  onProcessSingle: (id: string) => void;
  processingIds: string[];
}

export const ConsumerDetailedDesktop = ({
  sales,
  selectedSales,
  toggleSelection,
  toggleAll,
  onProcessSingle,
  processingIds,
}: Props) => (
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-50/50 border-b border-gray-100">
          <th className="px-6 py-4 w-10">
            <input
              type="checkbox"
              onChange={toggleAll}
              checked={
                sales.filter((s) => !s.payroll_processed && !s.refunded).length > 0 &&
                selectedSales.length ===
                  sales.filter((s) => !s.payroll_processed && !s.refunded).length
              }
              className="rounded border-gray-300 text-primary cursor-pointer"
            />
          </th>
          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Productos
          </th>
          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Fecha
          </th>
          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
            Estado/Acción
          </th>
          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
            Monto
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {sales.map((sale) => {
          const isProcessing = processingIds.includes(sale.id);
          return (
            <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  disabled={sale.payroll_processed || sale.refunded || isProcessing}
                  checked={selectedSales.includes(sale.id)}
                  onChange={() => toggleSelection(sale.id)}
                  className="rounded border-gray-300 text-primary cursor-pointer disabled:opacity-30"
                />
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1.5 min-w-55">
                  {sale.sale_items.map((item: SaleItemDetail) => (
                    <div
                      key={item.products.id}
                      className={`flex justify-between items-center gap-3 text-[11px] ${item.refunded ? 'text-red-400' : 'text-gray-600'}`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`font-bold shrink-0 ${item.refunded ? 'text-red-400' : 'text-primary'}`}>
                          {item.quantity}x
                        </span>
                        <span className={`truncate ${item.refunded ? 'line-through' : ''}`}>{item.products.name}</span>
                        {item.refunded && (
                          <span className="text-[8px] font-bold text-red-500 bg-red-100 px-1 py-0.5 rounded shrink-0 ml-1">REEMBOLSADO</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-bold italic shrink-0 ${item.refunded ? 'text-red-300' : 'text-gray-400'}`}>
                        {formatCurrency(item.unit_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-gray-500">
                {new Date(sale.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-center">
                {sale.refunded ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
                    <RotateCcw size={12} /> REEMBOLSADA
                  </span>
                ) : sale.payroll_processed ? (
                  <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100/50">
                    DESCONTADO
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onProcessSingle(sale.id)}
                    disabled={isProcessing}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer min-w-25 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Descontar"
                    )}
                  </button>
                )}
              </td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">
                {formatCurrency(sale.total)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
