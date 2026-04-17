import { Check, Loader2, X } from "lucide-react";

interface ActionButtonsProps {
  processingId: string | null;
  requestId: string;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => void;
  fullWidth?: boolean;
}

export default function ActionButtons({
  processingId,
  requestId,
  onApprove,
  onReject,
  fullWidth = false,
}: ActionButtonsProps) {
  const isProcessing = processingId === requestId;
  const isAnyProcessing = processingId !== null;

  return (
    <div className={`flex gap-3 ${fullWidth ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={() => onApprove(requestId)}
        disabled={isAnyProcessing}
        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {isProcessing ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <Check size={18} />
            <span className="md:hidden font-bold text-xs uppercase">
              Aprobar
            </span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => onReject(requestId)}
        disabled={isAnyProcessing}
        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        <X size={18} />
        <span className="md:hidden font-bold text-xs uppercase">Rechazar</span>
      </button>
    </div>
  );
}
