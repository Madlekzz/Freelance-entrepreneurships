import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  PackageCheck,
  RotateCcw,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  type ConsumerSummary,
  useAdminData,
} from "../../../../hooks/useAdminData";
import type { GlobalSale } from "../../../../services/saleService";
import FilterDropdown from "../../shared/FilterDropdown";
import SearchInput from "../../shared/SearchInput";
import { AdminConsumersSkeleton } from "./AdminConsumersSkeleton";

export default function AdminConsumers() {
  const {
    consumersSummary,
    sales,
    loading,
    processingIds,
    processPayroll,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useAdminData();

  const [view, setView] = useState<"summary" | "detailed">("summary");
  const [selectedUserEmail, setSelectedUserEmail] = useState<string | null>(
    null,
  );
  const [selectedSales, setSelectedSales] = useState<string[]>([]);

  // Consumidor seleccionado
  const selectedConsumer = useMemo(
    () => consumersSummary.find((c) => c.email === selectedUserEmail),
    [consumersSummary, selectedUserEmail],
  );

  // Ventas detalladas aplicando los filtros actuales de la vista
  const detailedSales = useMemo(() => {
    if (!selectedUserEmail) return [];

    return sales.filter((s) => {
      const matchesUser = s.users.email === selectedUserEmail;

      // Filtro de estado
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "pending"
            ? !s.payroll_processed
            : s.payroll_processed;

      // Filtro de búsqueda (por nombre de producto o ID)
      const matchesSearch =
        s.sale_items.some((item) =>
          item.products.name.toLowerCase().includes(searchQuery.toLowerCase()),
        ) || s.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesUser && matchesStatus && matchesSearch;
    });
  }, [sales, selectedUserEmail, statusFilter, searchQuery]);

  // Lógica de Selección
  const toggleSaleSelection = (saleId: string) => {
    setSelectedSales((prev) =>
      prev.includes(saleId)
        ? prev.filter((id) => id !== saleId)
        : [...prev, saleId],
    );
  };

  const toggleAllVisible = () => {
    const pendingSalesIds = detailedSales
      .filter((s) => !s.payroll_processed)
      .map((s) => s.id);

    if (selectedSales.length === pendingSalesIds.length) {
      setSelectedSales([]);
    } else {
      setSelectedSales(pendingSalesIds);
    }
  };

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
            setView("summary");
            setSelectedUserEmail(null);
            setSelectedSales([]);
          }}
          disabled={view === "summary"}
          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all disabled:opacity-0 cursor-pointer"
        >
          <ArrowLeft size={18} />
          Volver al Resumen
        </button>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={
            view === "summary"
              ? "Buscar por nombre o correo del empleado..."
              : "Buscar por producto..."
          }
        />

        {view === "detailed" && (
          <div className="flex gap-2 w-full lg:w-auto">
            <FilterDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "Todos los estados", value: "all" },
                { label: "Pendientes", value: "pending" },
                { label: "Procesados", value: "processed" },
              ]}
            />
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer"
              title="Limpiar filtros"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ACCIÓN MASIVA */}
      {selectedSales.length > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 p-4 rounded-2xl animate-in slide-in-from-top duration-300">
          <span className="text-sm font-medium text-primary">
            {selectedSales.length} ventas seleccionadas para descontar
          </span>
          <button
            type="button"
            onClick={async () => {
              await processPayroll(selectedSales);
              setSelectedSales([]);
            }}
            disabled={processingIds.length > 0}
            className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {processingIds.length > 0 ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Procesar selección
          </button>
        </div>
      )}

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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {consumersSummary.map((consumer: ConsumerSummary) => (
                  <tr
                    key={consumer.email}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => {
                      setSelectedUserEmail(consumer.email);
                      setView("detailed");
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA DETALLADA */}
      {view === "detailed" && selectedUserEmail && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-right duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 w-10">
                    <input
                      type="checkbox"
                      onChange={toggleAllVisible}
                      checked={
                        detailedSales.filter((s) => !s.payroll_processed)
                          .length > 0 &&
                        selectedSales.length ===
                          detailedSales.filter((s) => !s.payroll_processed)
                            .length
                      }
                      className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Productos
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                    Acción
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
                      colSpan={6}
                      className="px-6 py-16 text-center text-gray-400"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <PackageCheck size={48} className="opacity-10" />
                        <p className="text-sm font-medium">
                          No se encontraron ventas con los filtros aplicados
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  detailedSales.map((sale: GlobalSale) => {
                    const isProcessing = processingIds.includes(sale.id);
                    return (
                      <tr
                        key={sale.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            disabled={sale.payroll_processed || isProcessing}
                            checked={selectedSales.includes(sale.id)}
                            onChange={() => toggleSaleSelection(sale.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-30"
                          />
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
                                <span className="truncate max-w-40">
                                  {item.products.name}
                                </span>
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                          <div className="flex items-center gap-2">
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
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => processPayroll([sale.id])}
                            disabled={isProcessing || sale.payroll_processed}
                            className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {isProcessing ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <CreditCard size={14} />
                            )}
                            Descontar
                          </button>
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
