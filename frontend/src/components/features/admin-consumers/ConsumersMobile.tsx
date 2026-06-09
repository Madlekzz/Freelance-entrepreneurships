import { DollarSign, Hourglass, User } from "lucide-react";
import type { ConsumerSummary } from "../../../types";
import { formatCurrency } from "../../../utils/format";
import { StatCard } from "../../shared/StatCard";

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
        className="w-full text-left bg-white p-5 rounded-4xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3 mb-4">
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
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Hourglass}
            label="Pendiente"
            value={formatCurrency(consumer.pendingDeduction)}
            color="text-amber-600 bg-amber-50 border-amber-100"
            textColor="text-amber-700"
          />
          <StatCard
            icon={DollarSign}
            label="Gasto Total"
            value={formatCurrency(consumer.totalSpent)}
            color="text-primary bg-primary/5 border-primary/20"
            textColor="text-primary"
          />
        </div>
      </button>
    ))}
  </div>
);
