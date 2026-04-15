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
import type { ConsumerSale, SaleItem } from "../../../../types";
import SearchInput from "../../shared/SearchInput";
import TableSkeleton from "./TableSkeleton";

export default function MyPurchases() {
  const { sales, loading, searchQuery, setSearchQuery } = useConsumerSales();
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
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          Mis Compras
        </h1>
        <p className="text-sm text-gray-400">
          Historial detallado de tus pedidos
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-4 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por producto o ID de la venta..."
        />
      </div>

      <div className="bg-white md:border border-gray-100 rounded-4xl md:rounded-2xl overflow-hidden md:shadow-sm">
        {/* --- VISTA DESKTOP (Tabla) --- */}
        <div className="hidden md:block">
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
              {loading ? (
                <TableSkeleton />
              ) : sales.length === 0 ? (
                <EmptyState isTable />
              ) : (
                sales.map((sale) => (
                  <DesktopRow
                    key={sale.id}
                    sale={sale}
                    isExpanded={expandedId === sale.id}
                    onToggle={() => toggleRow(sale.id)}
                    fmt={fmt}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- VISTA MOBILE (Cards Expansibles) --- */}
        <div className="md:hidden space-y-4 p-1">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-100 animate-pulse rounded-4xl"
                />
              ))}
            </div>
          ) : sales.length === 0 ? (
            <div className="py-20 text-center">
              <EmptyState />
            </div>
          ) : (
            sales.map((sale) => (
              <MobilePurchaseCard
                key={sale.id}
                sale={sale}
                isExpanded={expandedId === sale.id}
                onToggle={() => toggleRow(sale.id)}
                fmt={fmt}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── COMPONENTES AUXILIARES ──────────────────────────────────────────────────
interface DesktopRowProps {
  sale: ConsumerSale;
  isExpanded: boolean;
  onToggle: () => void;
  fmt: (n: number) => string;
}
function DesktopRow({ sale, isExpanded, onToggle, fmt }: DesktopRowProps) {
  return (
    <React.Fragment>
      <tr
        onClick={onToggle}
        className={`cursor-pointer transition-colors ${isExpanded ? "bg-blue-50/30" : "hover:bg-gray-50/50"}`}
      >
        <td className="px-6 py-4">
          {isExpanded ? (
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
        <td className="px-6 py-4 font-bold text-gray-900">{fmt(sale.total)}</td>
        <td className="px-6 py-4 text-center">
          <StatusBadge processed={sale.payroll_processed} />
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-gray-50/30">
          <td colSpan={5} className="px-12 py-6">
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              {sale.sale_items.map((item) => (
                <ItemDetail key={item.products.name} item={item} fmt={fmt} />
              ))}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

interface MobilePurchaseCardProps {
  sale: ConsumerSale;
  isExpanded: boolean;
  onToggle: () => void;
  fmt: (n: number) => string;
}

function MobilePurchaseCard({
  sale,
  isExpanded,
  onToggle,
  fmt,
}: MobilePurchaseCardProps) {
  return (
    <div
      className={`bg-white border transition-all duration-300 rounded-4xl overflow-hidden ${isExpanded ? "border-primary shadow-md" : "border-gray-100 shadow-sm"}`}
    >
      <button
        type="button"
        className="p-5 flex items-center gap-3 justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isExpanded ? "bg-primary text-white" : "bg-gray-50 text-gray-400"}`}
          >
            <ShoppingBag size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-mono text-gray-400">
              #{sale.id.slice(0, 8)}
            </p>
            <p className="font-bold text-gray-900">{fmt(sale.total)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge processed={sale.payroll_processed} />
          {isExpanded ? (
            <ChevronUp size={16} className="text-primary" />
          ) : (
            <ChevronDown size={16} className="text-gray-300" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-5 pb-5 pt-2 space-y-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between text-[10px] uppercase font-black text-gray-400 tracking-widest border-t border-gray-50 pt-4 mb-2">
            <span>Productos</span>
            <span>{new Date(sale.created_at).toLocaleDateString()}</span>
          </div>
          {sale.sale_items.map((item) => (
            <div
              key={item.products.name}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {item.products.name}
                </p>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Store size={10} /> {item.products.entrepreneurships.name}
                </p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs font-bold text-primary">
                  {fmt(item.unit_price * item.quantity)}
                </p>
                <p className="text-[10px] text-gray-400">{item.quantity} u.</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ processed }: { processed: boolean }) {
  return processed ? (
    <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-green-100">
      <CheckCircle2 size={10} /> Procesado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-amber-100">
      <Clock size={10} /> Pendiente
    </span>
  );
}

interface itemDetailProps {
  item: SaleItem;
  fmt: (n: number) => string;
}

function ItemDetail({ item, fmt }: itemDetailProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
          <Package size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">
            {item.products.name}
          </h4>
          <p className="text-[10px] text-gray-400 flex items-center gap-1 uppercase tracking-tighter">
            <Store size={10} /> {item.products.entrepreneurships.name}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-medium text-gray-400">
          {item.quantity} x {fmt(item.unit_price)}
        </p>
        <p className="text-sm font-bold text-primary">
          {fmt(item.quantity * item.unit_price)}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ isTable = false }: { isTable?: boolean }) {
  const content = (
    <div className="py-4 text-center text-gray-400 italic flex flex-col items-center w-full">
      <ShoppingBag className="mb-3 opacity-20" size={48} />
      <p>No se encontraron compras.</p>
    </div>
  );

  if (isTable) {
    return (
      <tr>
        <td colSpan={5} className="py-10">
          {content}
        </td>
      </tr>
    );
  }

  return content;
}
