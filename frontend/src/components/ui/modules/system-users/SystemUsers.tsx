import {
  Cable,
  Camera,
  Database,
  Edit2,
  FileUser,
  Hammer,
  Landmark,
  type LucideIcon,
  Mail,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useSystemUsers } from "../../../../hooks/useSystemUsers";
import ConfirmationModal from "../../shared/ConfirmationModal";
import SystemUsersSkeleton from "./SystemUsersSkeleton";
import UserFormModal from "./UserFormModal";

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; icon: LucideIcon }
> = {
  it: {
    label: "IT",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: ShieldCheck,
  },
  consumidor: {
    label: "Consumidor",
    color: "bg-green-50 text-green-600 border-green-100",
    icon: Users,
  },
  proveedor: {
    label: "Emprendedor",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    icon: ShoppingBag,
  },
  admin: {
    label: "Administración",
    color: "bg-red-50 text-red-600 border-red-100",
    icon: Landmark,
  },
};

export default function SystemUsers() {
  const { users, loading, search, setSearch, deleteModal, editModal } =
    useSystemUsers();

  const skeletonRows = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];
  const isInitialLoading = loading && users.length === 0;

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header del Módulo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex w-full items-end justify-end">
          <button
            type="button"
            onClick={() => editModal.openCreate()}
            className="cursor-pointer flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-medium"
          >
            <UserPlus size={18} />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Buscar por nombre o correo electrónico..."
          className="w-full outline-none text-sm text-gray-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 relative">
              {isInitialLoading ? (
                // ESTADO 1: Carga inicial (Skeletons)
                skeletonRows.map((id) => <SystemUsersSkeleton key={id} />)
              ) : (
                <>
                  {/* Indicador de carga sutil para actualizaciones/filtros posteriores */}
                  {loading && (
                    <tr className="absolute top-0 left-0 w-full z-10">
                      <td colSpan={4} className="p-0 border-none">
                        <div className="h-0.5 w-full bg-primary/10 overflow-hidden">
                          <div className="h-full bg-primary animate-pulse w-full" />
                        </div>
                      </td>
                    </tr>
                  )}

                  {users.length === 0 ? (
                    // ESTADO 2: Sin resultados
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-20 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search size={24} className="opacity-20" />
                          <p className="text-sm">No se encontraron usuarios.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    // ESTADO 3: Lista de usuarios
                    users.map((user) => (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50/50 transition-all group ${
                          loading
                            ? "opacity-50 pointer-events-none"
                            : "opacity-100"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 leading-none mb-1">
                                {user.name}
                              </p>
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <Mail size={12} />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            {user.departamento?.toUpperCase() === "IT" && (
                              <Cable size={14} className="text-gray-400" />
                            )}
                            {user.departamento?.toUpperCase() ===
                              "MARKETING" && (
                              <Camera size={14} className="text-gray-400" />
                            )}
                            {user.departamento?.toUpperCase() ===
                              "INFRAESTRUCTURA" && (
                              <Hammer size={14} className="text-gray-400" />
                            )}
                            {user.departamento?.toUpperCase() ===
                              "RECLUTAMIENTO" && (
                              <FileUser size={14} className="text-gray-400" />
                            )}
                            {user.departamento?.toUpperCase() === "HR" && (
                              <Users size={14} className="text-gray-400" />
                            )}
                            {user.departamento?.toUpperCase() === "DATA" && (
                              <Database size={14} className="text-gray-400" />
                            )}
                            <span className="capitalize">
                              {user.departamento?.toLowerCase() ||
                                "No asignado"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {user.roles && user.roles.length > 0 ? (
                              user.roles.map((roleId) => {
                                const config = ROLE_CONFIG[
                                  roleId.toLowerCase()
                                ] || {
                                  label: roleId,
                                  color:
                                    "bg-gray-50 text-gray-600 border-gray-100",
                                  icon: ShieldCheck,
                                };
                                const Icon = config.icon;

                                return (
                                  <span
                                    key={roleId}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border ${config.color}`}
                                  >
                                    <Icon size={12} />
                                    {config.label}
                                  </span>
                                );
                              })
                            ) : (
                              <span className="text-gray-400 text-xs italic">
                                Sin roles
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => editModal.openEdit(user)}
                              className="cursor-pointer p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteModal.open(user.id)}
                              className="cursor-pointer p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editModal.isOpen && (
        <UserFormModal
          key={editModal.user?.id || "new"}
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          onSave={(user, data) => editModal.onSave(user, data)}
          user={editModal.user}
          isLoading={loading}
        />
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        isLoading={deleteModal.isLoading}
        onClose={deleteModal.onClose}
        onConfirm={deleteModal.onConfirm}
        title="Eliminar Usuario"
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer y el usuario perderá el acceso al sistema inmediatamente."
        confirmText="Eliminar Usuario"
        type="danger"
      />
    </div>
  );
}
