import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { SaleItemDetail } from "../../../../../types";
import { formatCurrency } from "../../../../../utils/format";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (itemIds: number[]) => void;
  isLoading: boolean;
  saleItems: SaleItemDetail[];
  saleTotal: number;
  saleId: string;
}

export default function RefundSaleModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  saleItems,
  saleId,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [step, setStep] = useState<"select" | "confirm">("select");

  if (!isOpen) return null;

  const activeItems = saleItems.filter((item) => !item.refunded);
  const allSelected =
    activeItems.length > 0 && selectedIds.length === activeItems.length;
  const refundTotal = saleItems
    .filter((item) => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + (item.subtotal ?? item.quantity * item.unit_price), 0);

  const handleToggleItem = (itemId: number) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(saleItems.map((item) => item.id));
    }
  };

  const handleContinue = () => {
    if (selectedIds.length > 0) {
      setStep("confirm");
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedIds);
  };

  const handleClose = () => {
    setSelectedIds([]);
    setStep("select");
    onClose();
  };

  const displayId = saleId.slice(0, 8).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {step === "select" ? (
          <>
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 rounded-xl text-red-500">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Reembolsar productos
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    #{displayId}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-3">
              <p className="text-sm text-gray-600">
                Selecciona los productos que deseas reembolsar de esta venta:
              </p>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="w-4 h-4 rounded text-primary cursor-pointer"
                />
                <span className="text-sm font-bold text-gray-700">
                  {allSelected ? "Deseleccionar todos" : "Seleccionar todos"}
                </span>
              </label>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {saleItems.map((item) => {
                  const isRefunded = item.refunded;
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center gap-3 p-3 border rounded-xl transition-colors ${
                        isRefunded
                          ? "border-red-100 bg-red-50/50 cursor-not-allowed"
                          : "border-gray-100 cursor-pointer hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => handleToggleItem(item.id)}
                        disabled={isRefunded}
                        className="w-4 h-4 rounded text-primary cursor-pointer shrink-0 disabled:opacity-30"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={`text-sm font-medium truncate ${
                              isRefunded
                                ? "text-gray-400 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {item.products.name}
                          </p>
                          {isRefunded && (
                            <span className="text-[9px] font-bold text-red-500 bg-red-100 px-1.5 py-0.5 rounded shrink-0">
                              REEMBOLSADO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {item.quantity}x ${item.unit_price.toLocaleString()} c/u
                        </p>
                      </div>
                      <span
                        className={`text-sm font-bold shrink-0 ${
                          isRefunded ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        {formatCurrency(
                          item.subtotal ?? item.quantity * item.unit_price,
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">A reembolsar</p>
                <p className="text-xl font-black text-red-500">
                  {formatCurrency(refundTotal)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={selectedIds.length === 0}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Continuar
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-500">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Confirmar reembolso
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    #{displayId}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                <p className="text-sm font-medium text-amber-800">
                  ¿Estás seguro de reembolsar los siguientes productos?
                </p>
              </div>

              <div className="space-y-2">
                {saleItems
                  .filter((item) => selectedIds.includes(item.id))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.products.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.quantity}x ${item.unit_price.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {formatCurrency(
                          item.subtotal ?? item.quantity * item.unit_price,
                        )}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                <p className="text-sm font-bold text-gray-700">
                  Total a reembolsar
                </p>
                <p className="text-xl font-black text-red-500">
                  {formatCurrency(refundTotal)}
                </p>
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStep("select")}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null}
                {isLoading ? "Reembolsando..." : "Confirmar reembolso"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
