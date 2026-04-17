import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  count: number;
  onProcess: () => void;
  isProcessing: boolean;
}

export const BulkActionBanner = ({ count, onProcess, isProcessing }: Props) => {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:relative md:bottom-0 md:left-0 md:right-0 z-40">
      <div className="flex items-center justify-between bg-primary text-white p-4 rounded-2xl shadow-xl md:shadow-none animate-in slide-in-from-bottom duration-300 border border-white/20">
        <span className="text-sm font-bold">
          {count} {count === 1 ? "seleccionada" : "seleccionadas"}
        </span>
        <button
          type="button"
          onClick={onProcess}
          disabled={isProcessing}
          className="bg-white text-primary px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 hover:bg-gray-100 transition-all cursor-pointer disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <CheckCircle2 size={16} />
          )}
          Procesar
        </button>
      </div>
    </div>
  );
};
