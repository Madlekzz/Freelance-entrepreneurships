import { AlertTriangle, Loader2, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: "danger" | "info";
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  type = "danger",
  isLoading = false,
}: Props) {
  if (!isOpen) return null;

  const colorClass =
    type === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-primary hover:bg-primary-dark";
  const iconColor = type === "danger" ? "text-red-600" : "text-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className={`p-2 rounded-full bg-opacity-10 ${type === "danger" ? "bg-red-100" : "bg-primary/10"}`}
            >
              <AlertTriangle className={iconColor} size={24} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-3">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`cursor-pointer px-6 py-2.5 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 ${colorClass} disabled:opacity-50`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {confirmText}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer px-6 py-2.5 rounded-xl text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-all border border-gray-200 bg-white"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
