import { Building2, Check, Loader2, Mail, UserPlus, X } from "lucide-react";
import { useSignupRequests } from "../../../../hooks/useSignupRequests";
import ConfirmationModal from "../../shared/ConfirmationModal";
import RequestRowSkeleton from "./RequestRowSkeleton";

export default function SignupRequests() {
  const {
    requests,
    loading,
    processingId,
    isRejecting,
    isModalOpen,
    isInitialLoading,
    handleApprove,
    openRejectModal,
    closeRejectModal,
    handleConfirmReject,
  } = useSignupRequests();

  const skeletonRows = ["req-sk-1", "req-sk-2", "req-sk-3"];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
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
          <tbody className="divide-y divide-gray-50 relative">
            {isInitialLoading ? (
              skeletonRows.map((id) => <RequestRowSkeleton key={id} />)
            ) : (
              <>
                {/* Feedback visual para recargas posteriores */}
                {loading && requests.length > 0 && (
                  <tr className="absolute top-0 left-0 w-full z-10">
                    <td colSpan={4} className="p-0 border-none">
                      <div className="h-0.5 w-full bg-primary/10 overflow-hidden">
                        <div className="h-full bg-primary animate-pulse w-full" />
                      </div>
                    </td>
                  </tr>
                )}

                {requests.length === 0 ? (
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
                      className={`hover:bg-gray-50/50 transition-colors ${
                        processingId === request.id
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                            <UserPlus size={16} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">
                              {request.user_name}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
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
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(request.id)}
                            disabled={processingId !== null}
                            className="p-2 bg-green-50 cursor-pointer text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all disabled:opacity-50"
                          >
                            {processingId === request.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Check size={18} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => openRejectModal(request.id)}
                            disabled={processingId !== null}
                            className="p-2 bg-red-50 cursor-pointer text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                          >
                            <X size={18} />
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

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeRejectModal}
        onConfirm={handleConfirmReject}
        isLoading={isRejecting}
        title="Rechazar Solicitud"
        message="¿Estás seguro de que deseas rechazar este acceso? El usuario no recibirá una invitación y su registro quedará marcado como rechazado."
        confirmText="Sí, rechazar"
        type="danger"
      />
    </div>
  );
}
