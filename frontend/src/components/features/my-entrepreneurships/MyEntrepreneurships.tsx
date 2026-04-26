import { Plus } from "lucide-react";
import { useEntrepreneurships } from "../../../hooks/useEntrepreneurship";
import ConfirmationModal from "../../shared/ConfirmationModal";
import EntrepreneurFormModal from "./EntrepreneurFormModal";
import EntrepreneurshipGrid from "./EntrepreneurshipGrid";

export default function MyEntrepreneurships() {
  const {
    items,
    loading,
    deleteModal,
    isDeleting,
    formModal,
    saveEntrepreneurship,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    openFormModal,
  } = useEntrepreneurships();

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => openFormModal()}
          className="cursor-pointer flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-medium active:scale-95"
        >
          <Plus size={18} />
          Nuevo Emprendimiento
        </button>
      </div>

      {/* Grid de Contenido Extraído */}
      <EntrepreneurshipGrid
        items={items}
        loading={loading}
        searchQuery=""
        onAddEntrepreneurship={() => openFormModal()}
        onEdit={openFormModal}
        onDelete={openDeleteModal}
      />

      {/* Modales de Gestión */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        isLoading={isDeleting}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Eliminar Emprendimiento"
        message={`¿Estás seguro de que deseas eliminar "${deleteModal.name}"? Esta acción borrará permanentemente todos los productos y registros asociados.`}
        confirmText="Eliminar"
        type="danger"
      />

      <EntrepreneurFormModal
        key={formModal.biz?.id || "new-entrepreneurship"}
        isOpen={formModal.isOpen}
        biz={formModal.biz}
        isLoading={loading} // Aquí podrías usar un isSaving si tu hook lo tiene
        onClose={closeFormModal}
        onSave={async (data) => {
          await saveEntrepreneurship(formModal.biz?.id, data);
        }}
      />
    </div>
  );
}
