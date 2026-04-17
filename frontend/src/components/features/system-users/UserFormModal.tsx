import { Briefcase, Check, Mail, User as UserIcon } from "lucide-react";
import { AVAILABLE_ROLES, DEPARTMENTS } from "../../../constants";
import type { PublicUser } from "../../../types";
import BaseFormModal from "../../shared/BaseFormModal";
import { useUserForm } from "./hooks/useUserForm";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    user: PublicUser | null,
    formData: Partial<PublicUser>,
  ) => Promise<void>;
  user: PublicUser | null;
  isLoading?: boolean;
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading,
}: UserFormModalProps) {
  const { formData, updateField, handleRoleChange, handleSubmit } = useUserForm(
    {
      user,
      onSave,
    },
  );

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={user ? "Editar Usuario" : "Nuevo Usuario"}
      confirmText={user ? "Guardar Cambios" : "Crear Usuario"}
      isLoading={isLoading}
    >
      {/* Nombre */}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre
        </label>
        <div className="relative">
          <UserIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            id="name"
            required
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            id="email"
            required
            type="email"
            disabled={!!user}
            className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none transition-all text-sm ${
              user
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "focus:ring-2 focus:ring-primary/20 focus:border-primary"
            }`}
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
      </div>

      {/* Departamento */}
      <div className="space-y-1">
        <label
          htmlFor="department"
          className="text-sm font-medium text-gray-700"
        >
          Departamento
        </label>
        <div className="relative">
          <Briefcase
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <select
            id="department"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white cursor-pointer"
            value={formData.departamento}
            onChange={(e) => updateField("departamento", e.target.value)}
          >
            <option value="">Sin asignar</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Roles */}
      <div className="space-y-2">
        <label
          htmlFor="roles"
          className="text-sm font-medium text-gray-700 block"
        >
          Roles Asignados
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_ROLES.map((role) => {
            const isSelected = formData.roles?.includes(role.id);
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleChange(role.id)}
                className={`flex items-center justify-between px-4 py-2 rounded-xl border transition-all text-sm ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary font-medium"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {role.label}
                {isSelected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      </div>
    </BaseFormModal>
  );
}
