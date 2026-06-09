import { Clock, DollarSign, Store } from "lucide-react";
import type { EntrepreneurSummary } from "../../../types";
import { formatCurrency } from "../../../utils/format";
import { StatCard } from "../../shared/StatCard";

interface Props {
  data: EntrepreneurSummary[];
  onSelect: (id: string) => void;
}

export const SummaryMobile = ({ data, onSelect }: Props) => (
  <div className="md:hidden space-y-4">
    {data.map((ent) => (
      <button
        type="button"
        key={ent.id}
        onClick={() => onSelect(ent.id)}
        className="w-full text-left bg-white p-5 rounded-4xl border border-gray-100 shadow-sm active:scale-[0.98] transition-all"
      >
        <div className="flex flex-col items-center text-center gap-3 mb-4">
          <div className="p-3 bg-primary/5 rounded-2xl text-primary">
            <Store size={20} />
          </div>
          <div className="w-full">
            <p className="text-sm font-black text-gray-900 uppercase truncate">
              {ent.name}
            </p>
            <p className="text-[11px] text-gray-400">{ent.ownerName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Clock}
            label="Pendiente"
            value={formatCurrency(ent.pendingPayroll)}
            color="text-amber-600 bg-amber-50 border-amber-100"
            textColor="text-amber-700"
          />
          <StatCard
            icon={DollarSign}
            label="Total Acum."
            value={formatCurrency(ent.totalRevenue)}
            color="text-primary bg-primary/5 border-primary/20"
            textColor="text-primary"
          />
        </div>
      </button>
    ))}
  </div>
);
