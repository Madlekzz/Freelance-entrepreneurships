import { Package, Store } from "lucide-react";
import type { SaleItem } from "../../../../types";

export default function PurchaseItemDetail({
  item,
  fmt,
}: {
  item: SaleItem;
  fmt: (n: number) => string;
}) {
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
