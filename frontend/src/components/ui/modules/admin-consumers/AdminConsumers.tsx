import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  LayoutGrid,
  Loader2,
  Mail,
  PackageCheck,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  type ConsumerSummary,
  useAdminData,
} from "../../../../hooks/useAdminData";
import type { GlobalSale } from "../../../../services/saleService";
import { AdminConsumersSkeleton } from "./AdminConsumersSkeleton";

export default function AdminConsumers() {
  const { consumersSummary, sales, loading, processing, processPayroll } =
    useAdminData();

  const [view, setView] = useState<"summary" | "detailed">("summary");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null,
  );

  // Encontramos al consumidor seleccionado
  const selectedConsumer = useMemo(
    () => consumersSummary.find((c) => c.email === selectedUserEmail),
    [consumersSummary, selectedUserEmail],
  );

  // Filtramos las ventas del consumidor seleccionado
  const detailedSales = useMemo(() => {
    if (!selectedUserEmail) return [];
    return sales.filter((s) => s.users.email === selectedUserEmail);
  }, [sales, selectedUserEmail]);

  if (loading) {
    return <AdminConsumersSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Panel de Consumidores
          </h2>
          <p className="text-sm text-gray-500">
            {view === "summary"
              ? "Control de deducciones y consumos por empleado"
              : `Historial de compras: ${selectedConsumer?.name}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (view === "detailed") {
              setView("summary");
              setSelectedUserEmail(null);
            } else if (selectedUserEmail) {
              setView("detailed");
            }
          }}
          disabled={view === "summary" && !selectedUserEmail}
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          {view === "summary" ? (
            <LayoutGrid size={18} />
          ) : (
            <ArrowLeft size={18} />
          )}
          {view === "summary" ? "Ver detalles" : "Volver al Resumen"}
        </button>
      </div>

      {/* VISTA RESUMIDA */}
      {view === "summary" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Empleado
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Pedidos
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Pendiente Descuento
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Gasto Total
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {consumersSummary.map((consumer: ConsumerSummary) => (
                  <tr
                    key={consumer.email}
                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                      selectedUserEmail === consumer.email ? "bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedUserEmail(consumer.email)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {consumer.name}
                          </p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <Mail size={10} /> {consumer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {consumer.ordersCount} compras
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-amber-600">
                      ${consumer.pendingDeduction.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ${consumer.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {consumer.pendingIds.length > 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              processPayroll(consumer.pendingIds);
                            }}
                            disabled={processing}
                            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-sm shadow-blue-100"
                          >
                            {processing ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CreditCard size={14} />
                            )}
                            Descontar
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium italic">
                            Sin deudas
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA DETALLADA (Historial del Empleado) */}
      {view === "detailed" && selectedUserEmail && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
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
                  {detailedSales.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-16 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <PackageCheck size={48} className="opacity-10" />
                          <p className="text-sm font-medium">
                            No hay compras registradas
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    detailedSales.map((sale: GlobalSale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {sale.sale_items.map((item) => (
                              <p
                                key={item.products.id}
                                className="text-xs text-gray-600 flex items-center gap-1"
                              >
                                <span className="font-bold text-primary bg-primary/5 px-1 rounded">
                                  {item.quantity}x
                                </span>
                                <span className="truncate max-w-50">
                                  {item.products.name}
                                </span>
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(sale.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {sale.payroll_processed ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                              <CheckCircle2 size={12} /> DESCONTADO
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
                              ${sale.total.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono">
                              #{sale.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
