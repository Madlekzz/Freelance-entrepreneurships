import { Store } from "lucide-react";
import { useState } from "react";
import type { Entrepreneurship } from "../../../types";
import BaseFormModal from "../../shared/BaseFormModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string }) => Promise<void>;
  biz: Entrepreneurship | null;
  isLoading?: boolean;
}

export default function EntrepreneurFormModal({
  isOpen,
  onClose,
  onSave,
  biz,
  isLoading,
}: Props) {
  // Inicializamos el estado directamente desde la prop biz
  const [name, setName] = useState(biz?.name || "");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await onSave({ name });
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={biz ? "Editar Emprendimiento" : "Nuevo Emprendimiento"}
      confirmText={biz ? "Guardar Cambios" : "Crear Emprendimiento"}
      isLoading={isLoading}
    >
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nombre del Negocio
        </label>
        <div className="relative">
          <Store
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            required
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            placeholder="Ej. Mi Tienda de Ropa"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <p className="text-xs text-gray-500">
          Este nombre será visible para todos los clientes en el catálogo.
        </p>
      </div>
    </BaseFormModal>
  );
}
