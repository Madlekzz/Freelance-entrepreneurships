import { Loader2, type LucideIcon, Save, X } from "lucide-react";
import type React from "react";

interface BaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.SubmitEvent) => void;
  title: string;
  confirmText?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  maxWidth?: "md" | "lg" | "xl";
}

export default function BaseFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  confirmText = "Guardar",
  isLoading = false,
  children,
  maxWidth = "md",
}: BaseFormModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-2xl shadow-xl w-full ${maxWidthClasses[maxWidth]} overflow-hidden animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar space-y-3">
            {children}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4 border-t border-gray-50 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 p-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 p-2 bg-primary text-white rounded-xl hover:bg-primary-dark font-medium transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
