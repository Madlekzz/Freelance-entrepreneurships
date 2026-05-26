import { Loader2, RotateCcw } from "lucide-react";

interface Props {
  count: number;
  onRefund: () => void;
  isLoading: boolean;
}

export const BulkRefundBanner = ({ count, onRefund, isLoading }: Props) => (
  <div className="fixed bottom-24 left-4 right-4 md:relative md:bottom-0 md:left-0 md:right-0 z-40">
    <div className="flex items-center justify-between bg-red-600 text-white p-4 rounded-2xl shadow-xl md:shadow-none animate-in slide-in-from-bottom duration-300 border border-red-500">
      <span className="text-sm font-bold">
        {count} {count === 1 ? "venta" : "ventas"} seleccionada{count === 1 ? "" : "s"}
      </span>
      <button
        type="button"
        onClick={onRefund}
        disabled={isLoading}
        className="bg-white text-red-600 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <RotateCcw size={16} />
        )}
        Reembolsar selección
      </button>
    </div>
  </div>
);
