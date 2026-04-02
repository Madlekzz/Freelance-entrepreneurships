import { Dropdown, type MenuProps } from "antd";
import {
  ArrowRight,
  Edit2,
  MoreVertical,
  Package,
  Plus,
  Store,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importamos el hook de navegación
import { useEntrepreneurships } from "../../../../hooks/useEntrepreneurship";
import type { Entrepreneurship } from "../../../../services/entrepreneurshipService";
import ConfirmationModal from "../../shared/ConfirmationModal";
import CardSkeleton from "./CardSkeleton";
import EntrepreneurFormModal from "./EntrepreneurFormModal";

export default function MyEntrepreneurships() {
  const navigate = useNavigate(); // Inicializamos navegación
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

  const getActionMenuItems = (biz: Entrepreneurship): MenuProps => ({
    items: [
      {
        key: "edit",
        label: "Editar información",
        icon: <Edit2 size={14} />,
        onClick: (info) => {
          // info.domEvent contiene el evento original
          info.domEvent.stopPropagation();
          openFormModal(biz);
        },
      },
      {
        key: "delete",
        label: "Eliminar emprendimiento",
        icon: <Trash2 size={14} />,
        danger: true,
        onClick: (info) => {
          info.domEvent.stopPropagation();
          openDeleteModal(biz.id, biz.name);
        },
      },
    ],
  });

  const skeletonRows = ["sk-1", "sk-2", "sk-3"];

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => openFormModal()}
          className="cursor-pointer flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-medium"
        >
          <Plus size={18} />
          Nuevo Emprendimiento
        </button>
      </div>

      {/* Grid de Contenido */}
      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skeletonRows.map((id) => (
            <CardSkeleton key={id} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((biz) => (
            <button
              type="button"
              key={biz.id}
              onClick={() => navigate(`/dashboard/entrepreneurships/${biz.id}`)}
              className="group cursor-pointer relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              {/* Menú de Acciones (Dropdown) */}
              <div className="absolute top-5 right-5">
                <Dropdown
                  menu={getActionMenuItems(biz)}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <button
                    type="button"
                    // STOP PROPAGATION: Evita que el click en el menú active la navegación de la card
                    onClick={(e) => e.stopPropagation()}
                    className="cursor-pointer text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                </Dropdown>
              </div>

              {/* Contenido Visual */}
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform">
                <Store size={28} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 leading-tight">
                {biz.name}
              </h3>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50 my-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                    Productos
                  </span>
                  <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    <Package size={14} className="text-primary" />{" "}
                    {biz.product_count}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                    Desde
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    {new Date(biz.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Indicador visual de "Administrar" al final */}
              <div className="mt-auto flex items-center text-primary font-bold text-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Administrar <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
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

      {/* Form Modal */}
      <EntrepreneurFormModal
        key={formModal.biz?.id || "new-entrepreneurship"}
        isOpen={formModal.isOpen}
        biz={formModal.biz}
        isLoading={isDeleting} // Debería ser isSaving de tu hook
        onClose={closeFormModal}
        onSave={async (data) => {
          await saveEntrepreneurship(formModal.biz?.id, data);
        }}
      />
    </div>
  );
}
