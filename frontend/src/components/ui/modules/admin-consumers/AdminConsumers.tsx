import { Dropdown } from "antd";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Filter,
  Loader2,
  Mail,
  Package,
  PackageCheck,
  RotateCcw,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAdminData } from "../../../../hooks/useAdminData";
import SearchInput from "../../shared/SearchInput";
import { AdminConsumersSkeleton } from "./AdminConsumersSkeleton";

export default function AdminConsumers() {
  const {
    consumersSummary,
    fullConsumersSummary,
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
    () => fullConsumersSummary.find((c) => c.email === selectedUserEmail),
    [fullConsumersSummary, selectedUserEmail],
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 md:pb-0">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-4xl md:rounded-3xl border border-gray-100 shadow-sm gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 leading-tight">
            Panel de Consumidores
          </h2>
          <p className="text-xs md:text-sm text-gray-500 max-w-62.5 md:max-w-none">
            {view === "summary"
              ? "Control de deducciones y consumos por empleado"
              : `Historial de compras: ${selectedConsumer?.name}`}
          </p>
        </div>

        {view === "detailed" && (
          <button
            type="button"
            onClick={() => {
              setView("summary");
              setSelectedUserEmail(null);
              setSelectedSales([]);
            }}
            className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all w-full sm:w-auto justify-center cursor-pointer"
          >
            <ArrowLeft size={16} />
            Volver al Resumen
          </button>
        )}
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={
            view === "summary"
              ? "Buscar por nombre o correo..."
              : "Buscar por producto o ID..."
          }
        />

        {view === "detailed" && (
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="col-span-1 lg:w-48">
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "all",
                      label: "Todos los estados",
                      onClick: () => setStatusFilter("all"),
                    },
                    { type: "divider" },
                    {
                      key: "pending",
                      label: "Pendientes",
                      onClick: () => setStatusFilter("pending"),
                    },
                    {
                      key: "processed",
                      label: "Procesados",
                      onClick: () => setStatusFilter("processed"),
                    },
                  ],
                }}
                trigger={["click"]}
                getPopupContainer={(triggerNode) =>
                  triggerNode.parentNode as HTMLElement
                }
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 truncate">
                    {/* Usamos un icono representativo para estado, ej. Filter o Activity */}
                    <Filter size={16} className="text-primary shrink-0" />
                    <span className="truncate">
                      {statusFilter === "all"
                        ? "Todos los estados"
                        : statusFilter === "pending"
                          ? "Pendientes"
                          : "Procesados"}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>
              </Dropdown>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all cursor-pointer border border-gray-100 lg:border-none"
              title="Limpiar filtros"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* ACCIÓN MASIVA FLOTANTE (Móvil) / Barra (Desktop) */}
      {selectedSales.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 md:relative md:bottom-0 md:left-0 md:right-0 z-40">
          <div className="flex items-center justify-between bg-primary text-white p-4 rounded-2xl shadow-xl md:shadow-none animate-in slide-in-from-bottom duration-300 border border-white/20">
            <span className="text-sm font-bold">
              {selectedSales.length}{" "}
              {selectedSales.length === 1 ? "seleccionada" : "seleccionadas"}
            </span>
            <button
              type="button"
              onClick={async () => {
                await processPayroll(selectedSales);
                setSelectedSales([]);
              }}
              disabled={processingIds.length > 0}
              className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-gray-100 transition-all cursor-pointer"
            >
              {processingIds.length > 0 ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Procesar
            </button>
          </div>
        </div>
      )}

      {/* CONTENIDO DE DATOS */}
      <div className="min-h-100">
        {/* VISTA RESUMIDA (SUMMARY) */}
        {view === "summary" && (
          <div className="grid grid-cols-1 gap-4 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-sm overflow-hidden">
            {/* Tabla Desktop */}
            <div className="hidden md:block overflow-x-auto">
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
                      Pendiente
                    </th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">
                      Gasto Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {consumersSummary.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5} // Cambiado a 5 para cubrir todas las columnas
                        className="px-6 py-20 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 italic">
                          <Package size={40} className="opacity-20" />
                          <p>No se encontraron consumidores.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    consumersSummary.map((consumer) => (
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
                        <td className="px-6 py-4 text-right text-gray-500 text-sm">
                          {consumer.ordersCount} compras
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-amber-600">
                          ${consumer.pendingDeduction.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">
                          ${consumer.totalSpent.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4">
              {consumersSummary.map((consumer) => (
                <button
                  type="button"
                  key={consumer.email}
                  onClick={() => {
                    setSelectedUserEmail(consumer.email);
                    setView("detailed");
                  }}
                  className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm w-full text-left space-y-4 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                      <User size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">
                        {consumer.name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {consumer.email}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Pendiente
                      </p>
                      <p className="text-sm font-black text-amber-600">
                        ${consumer.pendingDeduction.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Gasto Total
                      </p>
                      <p className="text-sm font-black text-gray-900">
                        ${consumer.totalSpent.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VISTA DETALLADA (DETAILED) */}
        {view === "detailed" && selectedUserEmail && (
          <div className="space-y-4 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-sm overflow-hidden animate-in slide-in-from-right duration-300">
            {/* Tabla Desktop */}
            <div className="hidden md:block overflow-x-auto">
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
                  {detailedSales.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5} // Cambiado a 5 para cubrir todas las columnas
                        className="px-6 py-20 text-center"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-400 italic">
                          <Package size={40} className="opacity-20" />
                          <p>No se encontraron compras.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    detailedSales.map((sale) => {
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
                              className="rounded border-gray-300 text-primary cursor-pointer disabled:opacity-30"
                            />
                          </td>
                          <td className="px-6 py-4">
                            {sale.sale_items.map((item) => (
                              <p
                                key={item.products.id}
                                className="text-[11px] text-gray-600"
                              >
                                <span className="font-bold text-primary">
                                  {item.quantity}x
                                </span>{" "}
                                {item.products.name}
                              </p>
                            ))}
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {new Date(sale.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {sale.payroll_processed ? (
                              <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold">
                                DESCONTADO
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => processPayroll([sale.id])}
                                disabled={isProcessing}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer"
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
                            ${sale.total.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards Mobile */}
            <div className="md:hidden space-y-4">
              {detailedSales.length === 0 ? (
                <div className="py-20 text-center text-gray-400">
                  <PackageCheck size={48} className="mx-auto opacity-10 mb-2" />
                  <p className="text-sm">Sin registros para mostrar</p>
                </div>
              ) : (
                detailedSales.map((sale) => {
                  const isProcessing = processingIds.includes(sale.id);
                  return (
                    <div
                      key={sale.id}
                      className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            disabled={sale.payroll_processed || isProcessing}
                            checked={selectedSales.includes(sale.id)}
                            onChange={() => toggleSaleSelection(sale.id)}
                            className="w-5 h-5 rounded-lg border-gray-200 text-primary cursor-pointer"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-black text-gray-900 uppercase">
                              Ticket
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono">
                              #{sale.id.slice(0, 8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                        {sale.payroll_processed ? (
                          <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[9px] font-black italic">
                            DESCONTADO
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => processPayroll([sale.id])}
                            disabled={isProcessing}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm active:scale-95 transition-all cursor-pointer"
                          >
                            {isProcessing ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              "DESCONTAR"
                            )}
                          </button>
                        )}
                      </div>

                      <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-2xl border border-gray-100/50">
                        {sale.sale_items.map((item) => (
                          <div
                            key={item.products.id}
                            className="text-[11px] text-gray-600 flex justify-between gap-2"
                          >
                            <span className="truncate">
                              <b className="text-primary">{item.quantity}x</b>{" "}
                              {item.products.name}
                            </span>
                            <span className="font-mono text-gray-400 shrink-0">
                              ${item.unit_price}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Fecha
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
                            <Calendar size={13} className="text-primary" />
                            {new Date(sale.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            Monto
                          </p>
                          <p className="md:text-xl text-lg font-black text-gray-900 leading-none">
                            ${sale.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
