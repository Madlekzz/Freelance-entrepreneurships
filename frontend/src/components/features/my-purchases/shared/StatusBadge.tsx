import { CheckCircle2, Clock } from "lucide-react";

export default function StatusBadge({ processed }: { processed: boolean }) {
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
