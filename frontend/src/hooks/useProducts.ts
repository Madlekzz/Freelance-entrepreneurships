// hooks/useProducts.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  createProduct,
  deleteProduct,
  getEntrepreneurshipProducts,
  updateProduct,
} from "../services/productService";
import type { EntrepreneurshipProduct, ProductInput } from "../types";

export function useProducts(entrepreneurshipId?: string) {
  const [products, setProducts] = useState<EntrepreneurshipProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc"); // name-asc, name-desc, price-asc, price-desc, stock-asc, stock-desc
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
  const [stockFilter, setStockFilter] = useState("all"); // all, low-stock

  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    product?: EntrepreneurshipProduct;
  }>({ isOpen: false });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
  }>({
    isOpen: false,
    id: "",
    name: "",
  });

  // 1. Envolvemos la función en useCallback para que su referencia no cambie
  // a menos que cambie el entrepreneurshipId.
  const fetchProducts = useCallback(async () => {
    if (!entrepreneurshipId) return;

    try {
      setLoading(true);
      const data = await getEntrepreneurshipProducts(entrepreneurshipId);
      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  }, [entrepreneurshipId]); // Dependencia del callback

  // 2. Ahora fetchProducts es una dependencia estable y segura para el useEffect.
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const saveProduct = async (data: ProductInput) => {
    if (!entrepreneurshipId) return;

    setIsSaving(true);
    try {
      if (formModal.product?.id) {
        // Actualización
        await updateProduct(formModal.product.id, data);
        toast.success("Producto actualizado correctamente");
      } else {
        // Creación
        await createProduct(data);
        toast.success("Producto creado correctamente");
      }

      await fetchProducts(); // Recargamos la lista
      setFormModal({ isOpen: false }); // Cerramos modal
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al guardar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  const openFormModal = useCallback((product?: EntrepreneurshipProduct) => {
    setFormModal({ isOpen: true, product });
  }, []); // Arreglo vacío porque setFormModal es estable por sí misma

  const closeFormModal = useCallback(() => {
    setFormModal({ isOpen: false });
  }, []);

  const openDeleteModal = (id: string, name: string) =>
    setDeleteModal({ isOpen: true, id, name });
  const closeDeleteModal = () =>
    setDeleteModal({ isOpen: false, id: "", name: "" });

  const confirmDelete = async () => {
    setIsSaving(true);
    try {
      await deleteProduct(deleteModal.id);
      toast.success("Producto eliminado");
      fetchProducts();
      closeDeleteModal();
    } catch {
      toast.error("Error al eliminar");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Busqueda
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // 2. Filtro de Estado
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((p) => p.is_active === isActive);
    }

    // 3. Filtro de Stock
    if (stockFilter === "low-stock") {
      result = result.filter((p) => p.current_stock < 5);
    } else if (stockFilter === "normal-stock") {
      result = result.filter((p) => p.current_stock >= 5);
    }

    // 4. Ordenamiento
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-asc":
          return a.current_stock - b.current_stock;
        case "stock-desc":
          return b.current_stock - a.current_stock;
        default:
          return 0;
      }
    });

    return result;
  }, [products, searchQuery, sortBy, statusFilter, stockFilter]);

  return {
    products: filteredProducts,
    allProductsCount: products.length,
    loading,
    isSaving,
    formModal,
    deleteModal,
    openFormModal,
    closeFormModal,
    openDeleteModal,
    closeDeleteModal,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    stockFilter,
    setStockFilter,
    saveProduct,
    confirmDelete,
    fetchProducts,
  };
}
