import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import type { ConsumerSale } from "../../../types";
import PurchaseItemDetail from "./shared/PurchaseItemDetail";
import StatusBadge from "./shared/StatusBadge";
import TableSkeleton from "./TableSkeleton";

interface Props {
  sales: ConsumerSale[];
  loading: boolean;
  expandedId: string | null;
  onToggle: (id: string) => void;
  fmt: (n: number) => string;
}

export default function MyPurchasesDesktop({
  sales,
  loading,
  expandedId,
  onToggle,
  fmt,
}: Props) {
  if (loading)
    return (
      <div className="hidden md:block bg-white rounded-2xl p-4">
        <TableSkeleton />
      </div>
    );

  return (
    <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="w-10 px-6 py-4"></th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              ID Venta
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sales.map((sale) => (
            <React.Fragment key={sale.id}>
              <tr
                onClick={() => onToggle(sale.id)}
                className={`cursor-pointer transition-colors ${expandedId === sale.id ? "bg-blue-50/30" : "hover:bg-gray-50/50"}`}
              >
                <td className="px-6 py-4">
                  {expandedId === sale.id ? (
                    <ChevronUp size={18} className="text-primary" />
                  ) : (
                    <ChevronDown size={18} className="text-primary" />
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-400">
                  #{sale.id.slice(0, 8)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="opacity-40" />
                    {new Date(sale.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {fmt(sale.total)}
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge processed={sale.payroll_processed} refunded={sale.refunded} />
                </td>
              </tr>
              {expandedId === sale.id && (
                <tr className="bg-gray-50/30">
                  <td colSpan={5} className="px-12 py-6">
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      {sale.sale_items.map((item) => (
                        <PurchaseItemDetail
                          key={item.products.name}
                          item={item}
                          fmt={fmt}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
