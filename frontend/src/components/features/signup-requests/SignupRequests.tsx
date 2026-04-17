import { useSignupRequests } from "../../../hooks/useSignupRequests";
import ConfirmationModal from "../../shared/ConfirmationModal";
import SearchInput from "../../shared/SearchInput";
import SignupRequestsDesktop from "./SignupRequestDesktop";
import SignupRequestsEmpty from "./SignupRequestEmpty";
import SignupRequestsMobile from "./SignupRequestMobile";

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

  const hasNoRequests = !isInitialLoading && requests.length === 0;

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="flex flex-col lg:flex-row gap-3 mb-4 items-center bg-white p-4 rounded-4xl md:rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar solicitud por nombre de usuario o correo..."
        />
      </div>

      {/* Vistas Condicionales */}
      {hasNoRequests ? (
        <SignupRequestsEmpty />
      ) : (
        <div className="space-y-4">
          <SignupRequestsDesktop
            requests={requests}
            isLoading={isInitialLoading}
            processingId={processingId}
            onApprove={handleApprove}
            onReject={openRejectModal}
          />
          <SignupRequestsMobile
            requests={requests}
            isLoading={isInitialLoading}
            processingId={processingId}
            onApprove={handleApprove}
            onReject={openRejectModal}
          />
        </div>
      )}

      {/* Modal de Confirmación para Rechazo */}
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
