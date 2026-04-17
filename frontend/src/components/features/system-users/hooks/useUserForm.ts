import { useState } from "react";
import type { PublicUser } from "../../../../types";

interface UseUserFormProps {
  user: PublicUser | null;
  onSave: (
    user: PublicUser | null,
    formData: Partial<PublicUser>,
  ) => Promise<void>;
}

export function useUserForm({ user, onSave }: UseUserFormProps) {
  // El estado se inicializa una sola vez por cada "instancia" del componente
  const [formData, setFormData] = useState<Partial<PublicUser>>({
    name: user?.name || "",
    email: user?.email || "",
    departamento: user?.departamento || "",
    roles: user?.roles || [],
  });

  const updateField = <K extends keyof PublicUser>(
    field: K,
    value: PublicUser[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleChange = (roleId: string) => {
    const currentRoles = Array.isArray(formData.roles) ? formData.roles : [];
    const newRoles = currentRoles.includes(roleId)
      ? currentRoles.filter((r) => r !== roleId)
      : [...currentRoles, roleId];

    updateField("roles", newRoles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(user, formData);
  };

  return {
    formData,
    updateField,
    handleRoleChange,
    handleSubmit,
  };
}
