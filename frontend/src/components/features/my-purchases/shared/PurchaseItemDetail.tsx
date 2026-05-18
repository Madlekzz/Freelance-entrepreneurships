import { Package, RotateCcw, Store } from "lucide-react";
import type { SaleItem } from "../../../../types";

export default function PurchaseItemDetail({
  item,
  fmt,
}: {
  item: SaleItem;
  fmt: (n: number) => string;
}) {
  return (
    <div className={`bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm ${item.refunded ? 'border-red-100 bg-red-50/30' : 'border-gray-100'}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${item.refunded ? 'bg-red-100 text-red-400' : 'bg-gray-50 text-gray-400'}`}>
          <Package size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-bold ${item.refunded ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {item.products.name}
            </h4>
            {item.refunded && (
              <span className="inline-flex items-center gap-0.5 text-[8px] font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase">
                <RotateCcw size={8} /> Reembolsado
              </span>
            )}
          </div>
          <p className={`text-[10px] flex items-center gap-1 uppercase tracking-tighter ${item.refunded ? 'text-red-300' : 'text-gray-400'}`}>
            <Store size={10} /> {item.products.entrepreneurships.name}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-[10px] font-medium ${item.refunded ? 'text-red-300' : 'text-gray-400'}`}>
          {item.quantity} x {fmt(item.unit_price)}
        </p>
        <p className={`text-sm font-bold ${item.refunded ? 'text-red-400 line-through' : 'text-primary'}`}>
          {fmt(item.quantity * item.unit_price)}
        </p>
      </div>
    </div>
  );
}
