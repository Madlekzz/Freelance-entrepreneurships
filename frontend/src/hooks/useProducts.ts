import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  createComposedProduct,
  deleteComposedProduct,
  updateComposedProduct,
} from "../services/composedProductService";
import {
  createProduct,
  deleteProduct,
  getEntrepreneurshipProducts,
  updateProduct,
} from "../services/productService";
import type {
  ComposedProductInput,
  EntrepreneurshipProduct,
  ProductInput,
} from "../types";

function isComposedInput(
  data: ProductInput | ComposedProductInput,
): data is ComposedProductInput {
  return "components" in data;
}

export function useProducts(entrepreneurshipId?: string) {
  const [products, setProducts] = useState<EntrepreneurshipProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

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

  const fetchProducts = useCallback(async () => {
    if (!entrepreneurshipId) return;

    try {
      setLoading(true);
      const data = await getEntrepreneurshipProducts(entrepreneurshipId);
      setProducts(data);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los productos. Verifica tu conexión e intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [entrepreneurshipId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const saveProduct = async (
    data: ProductInput | ComposedProductInput,
  ) => {
    if (!entrepreneurshipId) return;

    setIsSaving(true);
    try {
      if (formModal.product?.id) {
        if (isComposedInput(data)) {
          await updateComposedProduct(formModal.product.id, data);
          toast.success("Combo actualizado correctamente");
        } else {
          await updateProduct(formModal.product.id, data);
          toast.success("Producto actualizado correctamente");
        }
      } else {
        if (isComposedInput(data)) {
          await createComposedProduct(data);
          toast.success("Combo creado correctamente");
        } else {
          await createProduct(data);
          toast.success("Producto creado correctamente");
        }
      }

      await fetchProducts();
      setFormModal({ isOpen: false });
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al guardar el producto. Verifica los datos e intenta de nuevo.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const openFormModal = useCallback((product?: EntrepreneurshipProduct) => {
    setFormModal({ isOpen: true, product });
  }, []);

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
      const product = products.find((p) => p.id === deleteModal.id);
      if (product?.is_composed) {
        await deleteComposedProduct(deleteModal.id);
        toast.success("Combo eliminado");
      } else {
        await deleteProduct(deleteModal.id);
        toast.success("Producto eliminado");
      }
      fetchProducts();
      closeDeleteModal();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar el producto. Intenta de nuevo más tarde.";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      result = result.filter((p) => p.is_active === isActive);
    }

    if (stockFilter === "low-stock") {
      result = result.filter((p) => p.current_stock < 5);
    } else if (stockFilter === "normal-stock") {
      result = result.filter((p) => p.current_stock >= 5);
    }

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
