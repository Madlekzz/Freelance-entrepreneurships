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
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header Adaptado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-gray-900">Mis Productos</h2>
        <button
          type="button"
          onClick={() => openFormModal()}
          className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus size={18} /> Agregar Producto
        </button>
      </div>

      {/* BARRA DE FILTROS: Reutilizable y Responsive */}
      <div className="flex flex-col lg:flex-row gap-3 items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar producto..."
        />

        {/* Cambiamos flex-row a flex-col por defecto y volvemos a row en lg */}
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto mt-2 lg:mt-0">
          <div className="w-full lg:w-44 min-w-0">
            <FilterDropdown
              options={STATUS_OPTIONS}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
          <div className="w-full lg:w-44 min-w-0">
            <FilterDropdown
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={setSortBy}
              icon={<ChevronDown size={14} className="text-gray-400" />}
            />
          </div>
        </div>
      </div>

      {/* CONTENEDOR DE PRODUCTOS */}
      <div>
        {/* VISTA DESKTOP: Tabla original */}
        <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
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
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan={5} // Cambiado a 5 para cubrir todas las columnas
                    className="px-6 py-20 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400 italic">
                      <Package size={40} className="opacity-20" />
                      <p>No se encontraron productos.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              className="object-cover w-full h-full"
                              alt=""
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* VISTA MOBILE: Sistema de Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {products.length === 0 ? (
            /* --- EMPTY STATE MOBILE --- */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 mt-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Package size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Sin productos
              </h3>
              <p className="text-sm text-gray-500 max-w-55 leading-relaxed">
                {searchQuery
                  ? `No encontramos resultados para "${searchQuery}"`
                  : "Aún no has agregado productos a tu catálogo."}
              </p>

              {!searchQuery && (
                <button
                  type="button"
                  onClick={() => openFormModal()}
                  className="mt-6 text-primary font-bold text-sm flex items-center gap-2"
                >
                  <Plus size={16} /> Crear mi primer producto
                </button>
              )}
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 relative active:scale-[0.98] transition-transform"
              >
                {/* Imagen */}
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      className="object-cover w-full h-full"
                      alt=""
                    />
                  ) : (
                    <Package size={24} />
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex justify-between items-start pr-8">
                      <h3 className="font-bold text-gray-900 text-sm truncate uppercase tracking-tight">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-primary font-black text-base mt-0.5">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`text-[11px] font-bold ${product.current_stock < 5 ? "text-amber-600 bg-amber-50" : "text-gray-500 bg-gray-50"} px-2 py-0.5 rounded-lg`}
                    >
                      Stock: {product.current_stock}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${product.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}
                    >
                      {product.is_active ? "Activo" : "Pausado"}
                    </span>
                  </div>
                </div>

                {/* Botón de Acciones Flotante en Card */}
                <div className="absolute top-2 right-2">
                  <Dropdown
                    menu={getActionMenuItems(product)}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <button
                      type="button"
                      className="text-gray-400 p-2 rounded-lg active:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </Dropdown>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODALES (Sin cambios en props) */}
      <ProductFormModal
        key={formModal.product?.id || "new-product"}
        isOpen={formModal.isOpen}
        product={formModal.product || null}
        isLoading={isSaving}
        onClose={closeFormModal}
        onSave={saveProduct}
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
