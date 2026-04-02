import { Briefcase, Check, Mail, User as UserIcon } from "lucide-react";
import { useState } from "react";
import type { User } from "../../../../services/usersService";
import BaseFormModal from "../../shared/BaseFormModal"; // Ajusta la ruta según tu carpeta

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User | null, formData: Partial<User>) => Promise<void>;
  user: User | null;
  isLoading?: boolean;
}

const AVAILABLE_ROLES = [
  { id: "CONSUMIDOR", label: "Consumidor" },
  { id: "IT", label: "IT" },
  { id: "PROVEEDOR", label: "Emprendedor" },
  { id: "ADMIN", label: "Administración" },
];

export default function UserFormModal({
  isOpen,
  onClose,
  onSave,
  user,
  isLoading,
}: UserFormModalProps) {
  // Estado local simplificado (el reseteo se maneja con la 'key' en el padre)
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || "",
    email: user?.email || "",
    departamento: user?.departamento || "",
    roles: user?.roles || [],
  });

  const handleRoleChange = (roleId: string) => {
    const currentRoles = Array.isArray(formData.roles) ? formData.roles : [];
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((r) => r !== roleId)
      : [...currentRoles, roleId];

    setFormData({ ...formData, roles: newRoles });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    await onSave(user, formData);
  };

  return (
    <BaseFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={user ? "Editar Usuario" : "Nuevo Usuario"}
      confirmText={user ? "Guardar Cambios" : "Crear Usuario"}
      isLoading={isLoading}
    >
      {/* --- CAMPOS DEL FORMULARIO --- */}

      {/* Nombre */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
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
            className={`w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm ${user ? "bg-gray-50" : ""}`}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={!!user}
          />
        </div>
      </div>

      {/* Departamento */}
      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium text-gray-700 mb-1"
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
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none bg-white cursor-pointer"
            value={formData.departamento}
            onChange={(e) =>
              setFormData({ ...formData, departamento: e.target.value })
            }
          >
            <option value="">Sin asignar</option>
            <option value="IT">IT</option>
            <option value="MARKETING">Marketing</option>
            <option value="HR">HR</option>
            <option value="DATA">Data</option>
            <option value="INFRAESTRUCTURA">Infraestructura</option>
            <option value="ADMIN">Administración</option>
          </select>
        </div>
      </div>

      {/* Roles */}
      <div>
        <label
          htmlFor="roles"
          className="block text-sm font-medium text-gray-700 mb-2"
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
