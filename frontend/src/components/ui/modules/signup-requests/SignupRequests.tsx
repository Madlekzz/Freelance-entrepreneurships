import { Building2, Check, Loader2, Mail, UserPlus, X } from "lucide-react";
import { useSignupRequests } from "../../../../hooks/useSignupRequests";
import ConfirmationModal from "../../shared/ConfirmationModal";
import SearchInput from "../../shared/SearchInput";
import RequestRowSkeleton from "./RequestRowSkeleton";

export default function SignupRequests() {
  const {
    requests,
    processingId,
    isRejecting,
    isModalOpen,
    isInitialLoading,
    handleApprove,
    openRejectModal,
    closeRejectModal,
    handleConfirmReject,
    searchQuery,
    setSearchQuery,
  } = useSignupRequests();

  const skeletonRows = ["req-sk-1", "req-sk-2", "req-sk-3"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-3 mb-4 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar solicitud por nombre de usuario o correo..."
        />
      </div>
      <div className="bg-white md:border border-gray-100 rounded-2xl overflow-hidden md:shadow-sm">
        {/* --- VISTA DESKTOP (Tabla) --- */}
        <table className="w-full text-left border-collapse hidden md:table">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Emprendimiento
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
              skeletonRows.map((id) => <RequestRowSkeleton key={id} />)
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-gray-400 italic"
                >
                  No hay solicitudes pendientes por el momento.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className={`hover:bg-gray-50/50 transition-colors ${processingId === request.id ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                        <UserPlus size={16} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate">
                          {request.user_name}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 truncate">
                          <Mail size={12} /> {request.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 size={14} className="text-gray-400" />
                      {request.entrepreneurship_name || (
                        <span className="text-gray-300 italic">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {request.role.map((r) => (
                        <span
                          key={r}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionButtons
                      processingId={processingId}
                      requestId={request.id}
                      onApprove={handleApprove}
                      onReject={openRejectModal}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* --- VISTA MOBILE (Cards) --- */}
        <div className="md:hidden grid grid-cols-1 gap-4 p-1">
          {isInitialLoading ? (
            skeletonRows.map((id) => (
              <div
                key={id}
                className="h-40 bg-gray-100 animate-pulse rounded-2xl"
              />
            ))
          ) : requests.length === 0 ? (
            <div className="py-12 text-center text-gray-400 italic">
              No hay solicitudes pendientes.
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4 ${processingId === request.id ? "opacity-50 pointer-events-none" : ""}`}
              >
                {/* Header: Usuario */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                    <UserPlus size={18} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-gray-900 truncate">
                      {request.user_name}
                    </span>
                    <span className="text-xs text-gray-400 truncate">
                      {request.email}
                    </span>
                  </div>
                </div>

                {/* Detalles: Emprendimiento y Roles */}
                <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-50">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                      Emprendimiento
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Building2 size={12} />
                      <span className="truncate">
                        {request.entrepreneurship_name || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                      Roles
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {request.role.map((r) => (
                        <span
                          key={r}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold uppercase"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer: Acciones */}
                <div className="flex justify-end pt-1">
                  <ActionButtons
                    processingId={processingId}
                    requestId={request.id}
                    onApprove={handleApprove}
                    onReject={openRejectModal}
                    fullWidth // Prop extra para que los botones sean más cómodos en mobile si quieres
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeRejectModal}
        onConfirm={handleConfirmReject}
        isLoading={isRejecting}
        title="Rechazar Solicitud"
        message="¿Estás seguro de que deseas rechazar este acceso? El usuario no recibirá una invitación."
        confirmText="Sí, rechazar"
        type="danger"
      />
    </div>
  );
}

// Componente auxiliar para no repetir la lógica de botones
interface ActionButtonsProps {
  processingId: string | null;
  requestId: string;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => void;
  fullWidth?: boolean;
}

function ActionButtons({
  processingId,
  requestId,
  onApprove,
  onReject,
  fullWidth = false,
}: ActionButtonsProps) {
  return (
    <div className={`flex gap-3 ${fullWidth ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={() => onApprove(requestId)}
        disabled={processingId !== null}
        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
      >
        {processingId === requestId ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <Check size={18} />
            <span className="md:hidden font-bold text-xs uppercase">
              Aprobar
            </span>
          </>
        )}
      </button>
      <button
        type="button"
        onClick={() => onReject(requestId)}
        disabled={processingId !== null}
        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
      >
        <X size={18} />
        <span className="md:hidden font-bold text-xs uppercase">Rechazar</span>
      </button>
    </div>
  );
}
