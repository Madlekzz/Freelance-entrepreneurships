import { Dropdown, type MenuProps } from "antd";
import {
  ChevronDown,
  Edit2,
  MoreVertical,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../../../../hooks/useProducts";
import type { EntrepreneurshipProduct } from "../../../../../services/productService";
import ConfirmationModal from "../../../shared/ConfirmationModal";
import FilterDropdown from "../../../shared/FilterDropdown";
import SearchInput from "../../../shared/SearchInput";
import ProductFormModal from "./ProductFormModal";
import ProductTableSkeleton from "./ProductTableSkeleton";

export default function MyProducts() {
  const { id: entrepreneurshipId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    SORT_OPTIONS,
    STATUS_OPTIONS,
    formModal,
    deleteModal,
    isSaving,
    openFormModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    saveProduct,
    confirmDelete,
  } = useProducts(entrepreneurshipId);

  const getActionMenuItems = (product: EntrepreneurshipProduct): MenuProps => ({
    items: [
      {
        key: "edit",
        label: "Editar producto",
        icon: <Edit2 size={14} />,
        onClick: (info) => {
          info.domEvent.stopPropagation();
          openFormModal(product);
        },
      },
      {
        key: "delete",
        label: "Eliminar producto",
        icon: <Trash2 size={14} />,
        danger: true,
        onClick: (info) => {
          info.domEvent.stopPropagation();
          openDeleteModal(product.id, product.name);
        },
      },
    ],
  });

  useEffect(() => {
    // Verificamos explícitamente el valor
    if (location.state?.openModal === true) {
      openFormModal();

      // Limpiamos el estado inmediatamente después de ejecutar la acción
      // Esto previene que se vuelva a ejecutar si el componente se re-renderiza por otra razón
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.openModal, openFormModal, navigate, location.pathname]);

  if (loading) return <ProductTableSkeleton />;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Mis Productos</h2>
        <button
          type="button"
          onClick={() => openFormModal()}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Agregar Producto
        </button>
      </div>

      {/* BARRA DE FILTROS REUTILIZABLE */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar producto por nombre..."
        />

        <div className="flex gap-2 w-full sm:w-auto">
          <FilterDropdown
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <FilterDropdown
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
            icon={<ChevronDown size={14} className="text-gray-400" />}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      {product.image ? (
                        <img
                          alt="imagen del producto"
                          src={product.image}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      ) : (
                        <Package size={20} />
                      )}
                    </div>
                    <span className="font-semibold text-gray-700">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-600">
                  ${product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-sm font-bold ${product.current_stock < 5 ? "text-amber-500" : "text-gray-500"}`}
                  >
                    {product.current_stock} un.
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${product.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}
                  >
                    {product.is_active ? "Activo" : "Pausado"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Dropdown
                    menu={getActionMenuItems(product)}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <MoreVertical size={18} />
                    </button>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            No hay productos registrados.
          </div>
        )}
      </div>

      <ProductFormModal
        key={formModal.product?.id || "new-product"} // Crucial para resetear el estado interno
        isOpen={formModal.isOpen}
        product={formModal.product || null}
        isLoading={isSaving}
        onClose={closeFormModal}
        onSave={saveProduct} // La lógica de si es update o create ya está en el hook
        entrepreneurshipId={entrepreneurshipId ?? ""}
      />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        isLoading={isSaving}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar "${deleteModal.name}"?`}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}
