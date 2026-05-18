import { CheckCircle2, Clock, RotateCcw, User } from "lucide-react";
import type { EntrepreneurshipSale } from "../../../../../types";
import { formatCurrency } from "../../../../../utils/format";

interface Props {
  sales: EntrepreneurshipSale[];
  onRefund: (sale: EntrepreneurshipSale) => void;
}

export default function SalesTableDesktop({ sales, onRefund }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Productos</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Acción</th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Monto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sales.map((sale) => {
            const allItemsRefunded = sale.sale_items.every((item) => item.refunded);
            const isEffectivelyRefunded = sale.refunded || allItemsRefunded;
            const canRefund = !sale.payroll_processed && !isEffectivelyRefunded;
            const itemsTotal = sale.sale_items.reduce((sum, item) => sum + Number(item.subtotal), 0);
            return (
              <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-white transition-colors">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{sale.users.name}</p>
                      <p className="text-[11px] text-gray-400">{sale.users.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1.5 min-w-50">
                    {sale.sale_items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600 truncate">
                          <span className={`font-bold shrink-0 px-1 rounded ${item.refunded ? 'text-red-400 bg-red-50' : 'text-primary bg-primary/5'}`}>{item.quantity}x</span>
                          <span className={`truncate ${item.refunded ? 'text-gray-400 line-through' : ''}`}>{item.products.name}</span>
                          {item.refunded && (
                            <span className="text-[8px] font-bold text-red-500 bg-red-100 px-1 py-0.5 rounded shrink-0 ml-1">REEMBOLSADO</span>
                          )}
                        </div>
                        <span className={`text-[10px] font-bold italic shrink-0 ${item.refunded ? 'text-red-300' : 'text-gray-400'}`}>{formatCurrency(item.unit_price)}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                  {new Date(sale.created_at).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  {isEffectivelyRefunded ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold border border-red-100">
                      <RotateCcw size={12} /> REEMBOLSADO
                    </span>
                  ) : sale.payroll_processed ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                      <CheckCircle2 size={12} /> PROCESADO
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">
                      <Clock size={12} /> PENDIENTE
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {canRefund ? (
                    <button
                      type="button"
                      onClick={() => onRefund(sale)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      <RotateCcw size={12} /> Reembolsar
                    </button>
                  ) : (
                    <span className="text-[10px] text-gray-300 italic">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(itemsTotal)}</span>
                    <span className="text-[9px] text-gray-400 font-mono">#{sale.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
