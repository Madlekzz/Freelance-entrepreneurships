import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  LayoutGrid,
  Loader2,
  PackageCheck,
  Store,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  type EntrepreneurSummary,
  useAdminData,
} from "../../../../hooks/useAdminData";
import type { GlobalSale } from "../../../../services/saleService";
import { AdminConsumersSkeleton } from "../admin-consumers/AdminConsumersSkeleton";

export default function AdminEntrepreneurs() {
  const { entrepreneursSummary, sales, loading, processing, processPayroll } =
    useAdminData();

  const [view, setView] = useState<"summary" | "detailed">("summary");
  const [selectedEntId, setSelectedEntId] = useState<string | null>(null);

  const selectedEntrepreneur = useMemo(
    () => entrepreneursSummary.find((e) => e.id === selectedEntId),
    [entrepreneursSummary, selectedEntId],
  );

  const detailedSales = useMemo(() => {
    if (!selectedEntId) return [];
    return sales.filter((s) =>
      s.sale_items.some(
        (item) => item.products.entrepreneurships.id === selectedEntId,
      ),
    );
  }, [sales, selectedEntId]);

  if (loading) {
    return <AdminConsumersSkeleton />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Panel de Emprendedores
          </h2>
          <p className="text-sm text-gray-500">
            {view === "summary"
              ? "Resumen de liquidaciones por negocio"
              : `Ventas detalladas de: ${selectedEntrepreneur?.name}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (view === "detailed") {
              setView("summary");
              setSelectedEntId(null);
            } else if (selectedEntId) {
              setView("detailed");
            }
          }}
          disabled={view === "summary" && !selectedEntId}
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          {view === "summary" ? (
            <LayoutGrid size={18} />
          ) : (
            <ArrowLeft size={18} />
          )}
          {view === "summary" ? "Ver Detalle" : "Volver al Resumen"}
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
                    Negocio
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Ventas
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Pendiente Nómina
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                    Total Acumulado
                  </th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {entrepreneursSummary.map((ent: EntrepreneurSummary) => (
                  <tr
                    key={ent.id}
                    className={`hover:bg-gray-50/50 transition-colors cursor-pointer ${
                      selectedEntId === ent.id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedEntId(ent.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                          <Store size={16} />
                        </div>
                        <span className="font-bold text-gray-900">
                          {ent.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {ent.salesCount} pedidos
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-amber-600">
                      ${ent.pendingPayroll.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ${ent.totalRevenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {ent.pendingIds.length > 0 ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              processPayroll(ent.pendingIds);
                            }}
                            disabled={processing}
                            className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 transition-all disabled:opacity-50"
                          >
                            {processing ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                            Liquidar
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium italic">
                            Al día
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

      {/* VISTA DETALLADA */}
      {view === "detailed" && selectedEntId && (
        <div className="space-y-6 animate-in slide-in-from-right duration-300">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
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
                  {detailedSales.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <PackageCheck size={48} className="opacity-10" />
                          <p className="text-sm font-medium">
                            No hay ventas registradas
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
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
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
                          <div className="space-y-1">
                            {sale.sale_items.map((item) => (
                              <p
                                key={item.products.id}
                                className="text-xs text-gray-600 flex items-center gap-1"
                              >
                                <span className="font-bold text-primary bg-primary/5 px-1 rounded">
                                  {item.quantity}x
                                </span>
                                <span className="truncate max-w-37.5">
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
