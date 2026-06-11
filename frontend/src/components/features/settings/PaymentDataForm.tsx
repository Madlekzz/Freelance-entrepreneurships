import { Banknote, Landmark, Loader2, Save, Smartphone } from "lucide-react";
import { useState } from "react";
import { usePaymentDataSettings } from "../../../hooks/usePaymentDataSettings";
import type { EntrepreneurPaymentData } from "../../../types";

const METHODS = [
  { key: "efectivo" as const, label: "Efectivo", icon: Banknote },
  { key: "binance" as const, label: "Binance", icon: Landmark },
  { key: "pago_movil" as const, label: "Pago Móvil", icon: Smartphone },
];

interface MethodFormProps {
  method: (typeof METHODS)[number]["key"];
  existingData: EntrepreneurPaymentData | undefined;
  saving: boolean;
  onSave: (method: string, formData: Record<string, string>, isActive: boolean) => Promise<void>;
}

function MethodForm({ method, existingData, saving, onSave }: MethodFormProps) {
  const isActive = existingData?.is_active ?? true;
  const existingFields = existingData?.data as Record<string, string> | undefined;

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    if (existingFields) return { ...existingFields };
    return {};
  });
  const [active, setActive] = useState(isActive);

  const handleSave = () => {
    onSave(method, formData, active);
  };

  return (
    <div className="space-y-5">
      {method === "binance" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Binance ID
            </label>
            <input
              type="text"
              value={formData.binance_id ?? ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, binance_id: e.target.value }))}
              placeholder="Ingresa tu Binance ID"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={formData.correo_electronico ?? ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, correo_electronico: e.target.value }))}
              placeholder="correo@ejemplo.com"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      )}

      {method === "pago_movil" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banco
            </label>
            <input
              type="text"
              value={formData.banco ?? ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, banco: e.target.value }))}
              placeholder="Nombre del banco"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número Telefónico
            </label>
            <input
              type="tel"
              value={formData.numero_telefonico ?? ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, numero_telefonico: e.target.value }))}
              placeholder="0412-1234567"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cédula
            </label>
            <input
              type="text"
              value={formData.cedula ?? ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, cedula: e.target.value }))}
              placeholder="V-12345678"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      )}

      {method === "efectivo" && (
        <p className="text-sm text-gray-500 italic">
          No se requieren datos adicionales para el pago en efectivo.
        </p>
      )}

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Activo</span>
        </label>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="cursor-pointer px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function PaymentDataForm() {
  const { paymentData, loading, saving, error, handleUpsert } = usePaymentDataSettings();
  const [activeMethod, setActiveMethod] = useState<(typeof METHODS)[number]["key"]>("efectivo");

  if (loading) {
    return (
      <div className="bg-white rounded-b-2xl p-6 mb-6 flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-b-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Banknote className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Datos de Pago
          </h2>
          <p className="text-sm text-gray-500">
            Configura la información de pago para cada método disponible
          </p>
        </div>
      </div>

      <div className="flex gap-1 -mb-px">
        {METHODS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveMethod(key)}
            className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer rounded-t-xl border-b-2 ${
              activeMethod === key
                ? "bg-white text-primary border-primary shadow-[0_0_12px_rgba(25,106,227,0.3)] relative z-10"
                : "text-gray-500 hover:text-primary border-transparent hover:border-primary/30 hover:shadow-[0_0_8px_rgba(25,106,227,0.15)]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-b-2xl pt-6">
        <MethodForm
          method={activeMethod}
          existingData={paymentData.find((p) => p.payment_method === activeMethod)}
          saving={saving}
          onSave={handleUpsert}
        />
      </div>
    </div>
  );
}
