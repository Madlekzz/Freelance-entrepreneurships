import { Calendar, RotateCcw } from "lucide-react";
import type { GlobalSale, SaleItemDetail } from "../../../types";
import { formatCurrency } from "../../../utils/format";

interface Props {
  sales: GlobalSale[];
  selectedSales: string[];
  toggleSelection: (id: string) => void;
  onProcessSingle: (id: string) => void;
  onRefund: (sale: GlobalSale) => void;
  processingIds: string[];
  selectedEntId?: string | null;
}

export const DetailedMobile = ({ sales, selectedSales, toggleSelection, onProcessSingle, onRefund, processingIds, selectedEntId }: Props) => (
  <div className="md:hidden space-y-4 p-4">
    {sales.map((sale) => {
      const visibleItems = sale.sale_items.filter(
        (item: SaleItemDetail) => !selectedEntId || item.products.entrepreneurships.id === selectedEntId,
      );
      const allVisibleItemsRefunded = visibleItems.every((item: SaleItemDetail) => item.refunded);
      const isEffectivelyRefunded = sale.refunded || allVisibleItemsRefunded;
      const visibleItemsTotal = visibleItems.reduce((sum: number, item: SaleItemDetail) => sum + Number(item.subtotal), 0);
      return (
      <div key={sale.id} className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <input type="checkbox" disabled={sale.payroll_processed || isEffectivelyRefunded || processingIds.includes(sale.id)}
              checked={selectedSales.includes(sale.id)} onChange={() => toggleSelection(sale.id)} className="w-5 h-5 rounded-lg text-primary" />
            <div className="min-w-0">
              <p className="text-sm font-black text-gray-900 truncate">{sale.users.name}</p>
              <p className="text-[10px] text-gray-400 font-mono">#{sale.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
          {isEffectivelyRefunded ? (
            <span className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-[9px] font-black italic flex items-center gap-1"><RotateCcw size={12} /> REEMBOLSADO</span>
          ) : sale.payroll_processed ? (
            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[9px] font-black italic">LIQUIDADO</span>
          ) : (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => onProcessSingle(sale.id)} disabled={processingIds.includes(sale.id)}
                className="bg-green-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer disabled:opacity-50">
                {processingIds.includes(sale.id) ? "..." : "LIQUIDAR"}
              </button>
              <button type="button" onClick={() => onRefund(sale)} disabled={processingIds.includes(sale.id)}
                className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer disabled:opacity-50">
                REEMBOLSAR
              </button>
            </div>
          )}
        </div>
        <div className="space-y-1.5 bg-gray-50/50 p-3 rounded-2xl">
          {sale.sale_items
            .filter((item: SaleItemDetail) => !selectedEntId || item.products.entrepreneurships.id === selectedEntId)
            .map((item: SaleItemDetail) => (
            <div key={item.products.id} className={`text-[11px] flex justify-between ${item.refunded ? 'text-red-400' : 'text-gray-600'}`}>
              <span>
                <b className={item.refunded ? 'text-red-400' : 'text-primary'}>{item.quantity}x</b>{" "}
                <span className={item.refunded ? 'line-through' : ''}>{item.products.name}</span>
                {item.refunded && (
                  <span className="text-[8px] font-bold text-red-500 bg-red-100 px-1 py-0.5 rounded ml-1">REEMBOLSADO</span>
                )}
              </span>
              <span className={`font-mono ${item.refunded ? 'text-red-300' : 'text-gray-400'}`}>{formatCurrency(item.unit_price)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Fecha</p>
            <div className="flex items-center gap-1.5 text-xs text-gray-700 font-bold">
              <Calendar size={13} className="text-primary" /> {new Date(sale.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">Monto</p>
            <p className="text-xl font-black text-gray-900">{formatCurrency(visibleItemsTotal)}</p>
          </div>
        </div>
      </div>
      );
    })}
  </div>
);
