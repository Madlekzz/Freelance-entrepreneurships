import { CheckCircle2, Clock, Minus, RotateCcw } from "lucide-react";
import type { PaymentMethod, PaymentType, SaleItem } from "../../../../types";

const METHOD_BADGES: Record<string, { label: string; color: string }> = {
  efectivo: { label: "EFECTIVO", color: "bg-amber-100 text-amber-700" },
  binance: { label: "BINANCE", color: "bg-amber-100 text-amber-700" },
  pago_movil: { label: "PAGO MÓVIL", color: "bg-amber-100 text-amber-700" },
};

interface Props {
  processed: boolean;
  refunded?: boolean;
  paymentType?: PaymentType | null;
  saleItems?: SaleItem[];
  processedLabel?: string;
  refundedLabel?: string;
}

export default function StatusBadge({
  processed,
  refunded,
  paymentType,
  saleItems,
  processedLabel = "PROCESADO",
  refundedLabel = "REEMBOLSADO",
}: Props) {
  if (refunded) {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-red-100">
        <RotateCcw size={10} /> {refundedLabel}
      </span>
    );
  }

  if (paymentType === "immediate") {
    const items = saleItems ?? [];
    const allProcessed = items.every((item) => item.entrepreneur_processed || item.refunded);
    const someProcessed = items.some((item) => item.entrepreneur_processed);

    if (allProcessed) {
      return (
        <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-emerald-100">
          <CheckCircle2 size={10} /> PAGO REALIZADO
        </span>
      );
    }
    if (someProcessed) {
      const count = items.filter((item) => item.entrepreneur_processed).length;
      return (
        <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-blue-100">
          <Minus size={10} /> PARCIAL ({count}/{items.length})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-amber-100">
        <Clock size={10} /> PENDIENTE
      </span>
    );
  }

  return processed ? (
    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-emerald-100">
      <CheckCircle2 size={10} /> {processedLabel}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg text-[9px] font-black uppercase border border-amber-100">
      <Clock size={10} /> PENDIENTE
    </span>
  );
}

export function PaymentMethodBadge({
  paymentType,
  paymentMethod,
}: {
  paymentType?: PaymentType | null;
  paymentMethod?: PaymentMethod | null;
}) {
  if (paymentType !== "immediate" || !paymentMethod) return null;
  const badge = METHOD_BADGES[paymentMethod];
  if (!badge) return null;
  return (
    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${badge.color}`}>
      {badge.label}
    </span>
  );
}

export function PaymentTypeLabel({
  paymentType,
  paymentMethod,
}: {
  paymentType?: PaymentType | null;
  paymentMethod?: PaymentMethod | null;
}) {
  if (paymentType === "immediate") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
        INMEDIATO
        <PaymentMethodBadge paymentType={paymentType} paymentMethod={paymentMethod} />
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold text-blue-600">
      CRÉDITO
    </span>
  );
}
