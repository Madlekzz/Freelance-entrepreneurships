import {
  Cable,
  Camera,
  Database,
  Edit2,
  FileUser,
  Hammer,
  Landmark,
  type LucideIcon,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useSystemUsers } from "../../../../hooks/useSystemUsers";
import ConfirmationModal from "../../shared/ConfirmationModal";
import SearchInput from "../../shared/SearchInput";
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
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Header y Buscador (Se mantienen para funcionalidad) */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          Usuarios
        </h1>
        <button
          type="button"
          onClick={() => editModal.openCreate()}
          className="cursor-pointer flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-medium"
        >
          <UserPlus size={18} />
          <span className="hidden sm:inline">Nuevo Usuario</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-4 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar producto..."
        />
      </div>

      {/* --- VISTA DESKTOP (Tabla Limpia) --- */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                Roles
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isInitialLoading ? (
              skeletonRows.map((id) => <SystemUsersSkeleton key={id} />)
            ) : users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-all group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <DepartmentBadge dept={user.departamento} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles?.map((r) => (
                        <RoleBadge key={r} roleId={r} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <ActionButtons
                        onEdit={() => editModal.openEdit(user)}
                        onDelete={() => deleteModal.open(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- VISTA MOBILE (Cards con Manejo de Texto Largo) --- */}
      <div className="md:hidden grid grid-cols-1 gap-10 px-4 pt-6">
        {isInitialLoading ? (
          skeletonRows
            .slice(0, 3)
            .map((id) => (
              <div
                key={id}
                className="h-56 bg-gray-100 animate-pulse rounded-[2.5rem]"
              />
            ))
        ) : users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="relative group">
              {/* BOTÓN ELIMINAR */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteModal.open(user.id);
                }}
                className="absolute -top-4 -right-2 z-30 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-200 active:scale-90 transition-transform border-[6px] border-white"
              >
                <Trash2 size={20} />
              </button>

              {/* CARD PRINCIPAL */}
              <button
                type="button"
                onClick={() => editModal.openEdit(user)}
                className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-6 active:bg-gray-50 active:scale-[0.97] transition-all text-left w-full"
              >
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-white shadow-md shrink-0">
                    {user.name.charAt(0)}
                  </div>

                  <div className="min-w-0 w-full">
                    <h3 className="text-xl font-extrabold text-gray-900 wrap-break-word leading-tight mb-1">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-400 break-all leading-tight opacity-80">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* CUERPO */}
                <div className="space-y-6 pt-4 border-t border-gray-50">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] uppercase font-black text-gray-400 tracking-[0.15em] opacity-70">
                      Departamento
                    </span>
                    <div className="flex items-center">
                      <DepartmentBadge dept={user.departamento} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <span className="text-[11px] uppercase font-black text-gray-400 tracking-[0.15em] opacity-70">
                      Roles Asignados
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {user.roles?.map((roleId) => (
                        <RoleBadge key={roleId} roleId={roleId} />
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))
        ) : (
          /* --- MENSAJE DE LISTA VACÍA --- */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Users size={32} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No se encontraron usuarios
            </h3>
            <p className="text-sm text-gray-500 max-w-50 leading-relaxed">
              Intenta ajustar los filtros o realiza una nueva búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* MODALES: Asegúrate de que estén aquí y reciban las props del hook */}
      {editModal.isOpen && (
        <UserFormModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          onSave={editModal.onSave}
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
        message="¿Estás seguro de que deseas eliminar este usuario?"
        type="danger"
      />
    </div>
  );
}

// ── Componentes de Soporte ──────────────────────────────────────────────────

function ActionButtons({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="p-2.5 text-gray-400 hover:text-primary hover:bg-white rounded-xl transition-all active:scale-90 shadow-sm md:shadow-none md:cursor-pointer"
      >
        <Edit2 size={20} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all active:scale-90 shadow-sm md:shadow-none md:cursor-pointer"
      >
        <Trash2 size={20} />
      </button>
    </>
  );
}

// ... (RoleBadge y DepartmentBadge se mantienen igual, solo ajusta paddings si lo deseas)

function RoleBadge({ roleId }: { roleId: string }) {
  const config = ROLE_CONFIG[roleId.toLowerCase()] || {
    label: roleId,
    color: "bg-gray-50 text-gray-600 border-gray-100",
    icon: ShieldCheck,
  };
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-tight ${config.color}`}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
}

function DepartmentBadge({ dept }: { dept?: string }) {
  const DEPT_ICONS: Record<string, LucideIcon> = {
    IT: Cable,
    MARKETING: Camera,
    INFRAESTRUCTURA: Hammer,
    RECLUTAMIENTO: FileUser,
    HR: Users,
    DATA: Database,
  };
  const Icon = DEPT_ICONS[dept?.toUpperCase() || ""] || FileUser;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
      <Icon size={14} className="text-gray-400" />
      <span className="capitalize">{dept?.toLowerCase() || "No asignado"}</span>
    </div>
  );
}
