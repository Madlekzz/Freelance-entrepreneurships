import { Calendar, CheckCircle2, Clock, User } from "lucide-react";
import type { EntrepreneurshipSale } from "../../../../../types";
import { formatCurrency } from "../../../../../utils/format";

interface Props {
  sales: EntrepreneurshipSale[];
}

export default function SalesCardsMobile({ sales }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {sales.map((sale) => (
        <div
          key={sale.id}
          className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4"
        >
          {/* Header: Cliente e Indicador de Estado */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                <User size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">
                  {sale.users.name}
                </p>
                <p className="text-[10px] text-gray-400 font-mono">
                  #{sale.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
            {sale.payroll_processed ? (
              <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded-lg shrink-0">
                <CheckCircle2 size={16} />
              </span>
            ) : (
              <span className="bg-amber-50 text-amber-600 p-1.5 rounded-lg shrink-0">
                <Clock size={16} />
              </span>
            )}
          </div>

          {/* Lista de Productos Comprados */}
          <div className="bg-gray-50/50 rounded-2xl p-3 space-y-2">
            {sale.sale_items.map((item) => (
              <div
                key={item.products.id}
                className="flex justify-between items-center text-[11px]"
              >
                <span className="text-gray-600 truncate max-w-[70%]">
                  <span className="font-bold text-primary mr-1">
                    {item.quantity}x
                  </span>
                  {item.products.name}
                </span>
                <span className="font-bold text-gray-400 italic">
                  {formatCurrency(item.unit_price)}
                </span>
              </div>
            ))}
          </div>

          {/* Footer: Fecha y Total */}
          <div className="flex justify-between items-end pt-2 border-t border-gray-50">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Fecha
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                <Calendar size={13} className="text-primary" />
                {new Date(sale.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                Total
              </p>
              <p className="text-lg font-black text-primary leading-tight">
                {formatCurrency(sale.total)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
