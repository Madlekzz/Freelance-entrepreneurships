import { Select } from "antd";
import { CheckCircle2, Loader2, X } from "lucide-react";
import type { ModalStatus } from "../../../hooks/useCheckout";
import type { CatalogProduct, Consumer } from "../../../types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

interface Props {
  isOpen: boolean;
  status: ModalStatus;
  error: string | null;
  loadingCons: boolean;
  consumers: { value: string; label: string }[];
  selectedConsumerId?: string;
  selectedConsumer?: Consumer;
  entries: { product: CatalogProduct; qty: number }[];
  total: number;
  onClose: () => void;
  onConsumerChange: (email: string) => void;
  onConfirm: () => void;
}

export default function CheckoutModal(props: Props) {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-end md:items-center justify-center p-0 md:p-4 transition-all">
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-115 overflow-hidden shadow-xl max-h-[92vh] flex flex-col animate-in slide-in-from-bottom md:zoom-in">
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-white mb-0.5">
              Finalizar compra
            </h2>
            <p className="text-white/60 text-sm">
              {props.status === "success"
                ? "Registro exitoso"
                : "Selecciona el comprador"}
            </p>
          </div>
          {props.status !== "loading" && (
            <button
              type="button"
              onClick={props.onClose}
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* 1. Loading State */}
        {props.status === "loading" && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="text-sm text-gray-400">Registrando tu compra...</p>
          </div>
        )}

        {/* 2. Success State */}
        {props.status === "success" && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-4">
            <CheckCircle2
              size={64}
              className="text-primary/20"
              strokeWidth={1.5}
            />
            <h3 className="font-display text-xl font-bold text-gray-900">
              ¡Compra registrada!
            </h3>
            <p className="text-sm text-gray-400">
              El pedido fue procesado exitosamente y el stock actualizado.
            </p>
            <button
              type="button"
              onClick={props.onClose}
              className="mt-2 w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* 3. Form State (Idle / Error) */}
        {(props.status === "idle" || props.status === "error") && (
          <>
            <div className="flex-1 overflow-y-auto px-6  flex flex-col gap-4 overscroll-contain"></div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="showSearch"
                  className="block text-sm font-medium text-gray-600 mb-1.5"
                >
                  Consumidor
                </label>
                <Select
                  showSearch
                  className="w-full"
                  placeholder="Busca por email o nombre..."
                  loading={props.loadingCons}
                  options={props.consumers}
                  value={props.selectedConsumerId}
                  onChange={props.onConsumerChange}
                  getPopupContainer={(trigger) => trigger.parentElement}
                  listHeight={200}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ height: 42 }}
                />
              </div>

              {props.selectedConsumer && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Nombre</span>
                    <span className="font-medium text-gray-900">
                      {props.selectedConsumer.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Departamento</span>
                    <span className="font-medium text-gray-900">
                      {props.selectedConsumer.departamento}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-primary mb-2.5 uppercase tracking-wider">
                  Resumen
                </p>
                <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto">
                  {props.entries.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600">
                        {product.name} × {qty}
                      </span>
                      <span className="font-medium text-gray-900">
                        {fmt(product.price * qty)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-base text-primary border-t border-blue-200 pt-3 mt-3">
                  <span>Total</span>
                  <span>{fmt(props.total)}</span>
                </div>
              </div>

              {props.error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {props.error}
                </p>
              )}
            </div>

            <div className="px-6 pb-24 flex gap-3">
              <button
                type="button"
                onClick={props.onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={props.onConfirm}
                disabled={!props.selectedConsumerId}
                className="flex-2 py-3 bg-primary hover:bg-primary-dark disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
              >
                Confirmar compra
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
