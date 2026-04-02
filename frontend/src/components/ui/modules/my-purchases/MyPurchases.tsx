import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  ShoppingBag,
  Store,
} from "lucide-react";
import React, { useState } from "react";
import { useConsumerSales } from "../../../../hooks/useCustomerSales";
import type { ConsumerSale } from "../../../../types";
import TableSkeleton from "./TableSkeleton";

export default function MyPurchases() {
  const { sales, loading } = useConsumerSales();
  // Estado para controlar qué venta está expandida
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="w-10 px-6 py-4"></th>{" "}
              {/* Espacio para la flecha */}
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
            {loading ? (
              <TableSkeleton />
            ) : sales.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-16 text-center text-gray-400 italic"
                >
                  <ShoppingBag className="mx-auto mb-3 opacity-20" size={40} />
                  No tienes compras registradas.
                </td>
              </tr>
            ) : (
              sales.map((sale: ConsumerSale) => (
                <React.Fragment key={sale.id}>
                  {/* Fila Principal */}
                  <tr
                    onClick={() => toggleRow(sale.id)}
                    className={`cursor-pointer transition-colors ${expandedId === sale.id ? "bg-blue-50/30" : "hover:bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-4 text-gray-400">
                      {expandedId === sale.id ? (
                        <ChevronUp size={18} className="text-primary" />
                      ) : (
                        <ChevronDown size={18} className="text-primary" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-gray-400">
                        #{sale.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(sale.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-gray-900">
                        {fmt(sale.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {sale.payroll_processed ? (
                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-green-100">
                          <CheckCircle2 size={12} /> Procesado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-[10px] font-bold uppercase border border-amber-100">
                          <Clock size={12} /> Pendiente
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Fila Desglosable (Contenido) */}
                  {expandedId === sale.id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={5} className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          {sale.sale_items.map((item) => (
                            <div
                              key={item.products.name}
                              className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/5 rounded-lg text-primary">
                                  <Package size={20} />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-gray-900">
                                    {item.products.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Store size={10} />{" "}
                                    {item.products.entrepreneurships.name}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-medium text-gray-400">
                                  {item.quantity} x {fmt(item.unit_price)}
                                </p>
                                <p className="text-sm font-bold text-primary">
                                  {fmt(item.quantity * item.unit_price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
