import { Dropdown, type MenuProps } from "antd";
import { Calendar, CheckCircle2, MoreVertical, RotateCcw } from "lucide-react";
import type { GlobalSale, SaleItemDetail } from "../../../types";
import { formatCurrency } from "../../../utils/format";
import StatusBadge, { PaymentTypeLabel } from "../my-purchases/shared/StatusBadge";

interface Props {
  sales: GlobalSale[];
  selectedSales: string[];
  toggleSelection: (id: string) => void;
  onProcessSingle: (id: string) => void;
  onRefund: (sale: GlobalSale) => void;
  processingIds: string[];
  selectedEntId?: string | null;
}

export const DetailedMobile = ({ sales, selectedSales, toggleSelection, onProcessSingle, onRefund, processingIds, selectedEntId }: Props) => {
  const getActionMenu = (sale: GlobalSale): MenuProps => {
    const allRefunded = sale.sale_items.every((item) => item.refunded);
    const isEffectivelyRefunded = sale.refunded || allRefunded;
    const items: MenuProps["items"] = [];

    if (sale.payment_type !== "immediate" && !sale.payroll_processed && !isEffectivelyRefunded) {
      items.push({
        key: "liquidate",
        icon: <CheckCircle2 size={14} />,
        label: "Liquidar",
        onClick: () => onProcessSingle(sale.id),
      });
    }

    if (!sale.payroll_processed && !isEffectivelyRefunded) {
      items.push({
        key: "refund",
        icon: <RotateCcw size={14} />,
        label: "Reembolsar",
        onClick: () => onRefund(sale),
      });
    }

    return { items };
  };

  return (
    <div className="md:hidden space-y-4 p-4">
      {sales.map((sale) => {
        const visibleItems = sale.sale_items.filter(
          (item: SaleItemDetail) => !selectedEntId || item.products.entrepreneurships.id === selectedEntId,
        );
        const allVisibleItemsRefunded = visibleItems.every((item: SaleItemDetail) => item.refunded);
        const isEffectivelyRefunded = sale.refunded || allVisibleItemsRefunded;
        const visibleItemsTotal = visibleItems.reduce((sum: number, item: SaleItemDetail) => sum + Number(item.subtotal), 0);
        const isImmediate = sale.payment_type === "immediate";
        const canLiquidate = !isImmediate && !sale.payroll_processed && !isEffectivelyRefunded;
        const canRefund = !sale.payroll_processed && !isEffectivelyRefunded;
        const showActions = canLiquidate || canRefund;
        const menu = getActionMenu(sale);
        return (
        <div key={sale.id} className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <input type="checkbox"
                disabled={sale.payroll_processed || isEffectivelyRefunded || processingIds.includes(sale.id) || isImmediate}
                checked={selectedSales.includes(sale.id)}
                onChange={() => toggleSelection(sale.id)}
                className="w-5 h-5 rounded-lg text-primary cursor-pointer disabled:opacity-30" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-black text-gray-900 truncate">{sale.users.name}</p>
                  <PaymentTypeLabel paymentType={sale.payment_type} paymentMethod={sale.payment_method} />
                </div>
                <p className="text-[10px] text-gray-400 font-mono">#{sale.id.slice(0, 8).toUpperCase()}</p>
                {sale.note && (
                  <p className="text-[10px] text-gray-500 italic mt-0.5 truncate">"{sale.note}"</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge
                processed={sale.payroll_processed}
                refunded={sale.refunded}
                paymentType={sale.payment_type}
                saleItems={sale.sale_items}
              />
              {showActions && (
                <Dropdown menu={menu} trigger={["click"]} placement="bottomRight">
                  <button
                    type="button"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-300 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </Dropdown>
              )}
            </div>
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
};