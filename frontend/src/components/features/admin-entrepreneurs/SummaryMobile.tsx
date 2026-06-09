import { Store } from "lucide-react";
import type { EntrepreneurSummary } from "../../../types";
import { formatCurrency } from "../../../utils/format";

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
        className="bg-white p-5 rounded-4xl w-full border border-gray-100 shadow-sm space-y-4 active:scale-[0.98] transition-all text-left"
      >
        <div className="flex flex-col items-center text-center gap-3">
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
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-50">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Pendiente
            </p>
            <p className="text-sm font-black text-amber-600">
              {formatCurrency(ent.pendingPayroll)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase">
              Total Acum.
            </p>
            <p className="text-sm font-black text-gray-900">
              {formatCurrency(ent.totalRevenue)}
            </p>
          </div>
        </div>
      </button>
    ))}
  </div>
);
