import { User } from "lucide-react";
import type { ConsumerSummary } from "../../../types";
import { formatCurrency } from "../../../utils/format";

export const ConsumersMobile = ({
  data,
  onSelect,
}: {
  data: ConsumerSummary[];
  onSelect: (email: string) => void;
}) => (
  <div className="md:hidden space-y-4">
    {data.map((consumer) => (
      <button
        type="button"
        key={consumer.email}
        onClick={() => onSelect(consumer.email)}
        className="bg-white p-5 rounded-4xl border border-gray-100 shadow-sm w-full text-left space-y-4 active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/5 rounded-2xl text-primary">
            <User size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-gray-900 uppercase truncate">
              {consumer.name}
            </p>
            <p className="text-[11px] text-gray-400 truncate">
              {consumer.email}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Pendiente
            </p>
            <p className="text-sm font-black text-amber-600">
              {formatCurrency(consumer.pendingDeduction)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Gasto Total
            </p>
            <p className="text-sm font-black text-gray-900">
              {formatCurrency(consumer.totalSpent)}
            </p>
          </div>
        </div>
      </button>
    ))}
  </div>
);
