import { CheckCircle2, Clock, User } from "lucide-react";
import type { EntrepreneurshipSale } from "../../../../../types"; // Ajusta la ruta según tu proyecto
import { formatCurrency } from "../../../../../utils/format";

interface Props {
  sales: EntrepreneurshipSale[];
}

export default function SalesTableDesktop({ sales }: Props) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Productos
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Estado Nómina
            </th>
            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
              Monto
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sales.map((sale) => (
            <tr
              key={sale.id}
              className="hover:bg-gray-50/50 transition-colors group"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 group-hover:bg-white transition-colors">
                    <User size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {sale.users.name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {sale.users.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1.5 min-w-50">
                  {sale.sale_items.map((item) => (
                    <div
                      key={item.products.id}
                      className="flex justify-between items-center gap-4 text-xs"
                    >
                      <div className="flex items-center gap-1.5 text-gray-600 truncate">
                        <span className="font-bold text-primary bg-primary/5 px-1 rounded shrink-0">
                          {item.quantity}x
                        </span>
                        <span className="truncate">{item.products.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 italic shrink-0">
                        {formatCurrency(item.unit_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                {new Date(sale.created_at).toLocaleDateString(undefined, {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-6 py-4">
                {sale.payroll_processed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                    <CheckCircle2 size={12} /> PROCESADO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-100">
                    <Clock size={12} /> PENDIENTE
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(sale.total)}
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">
                    #{sale.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
