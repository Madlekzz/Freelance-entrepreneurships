import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createEntrepreneurship,
  deleteEntrepreneurship,
  type Entrepreneurship,
  getMyEntrepreneurships,
  updateEntrepreneurship,
} from "../services/entrepreneurshipService";

export function useEntrepreneurships() {
  const [items, setItems] = useState<Entrepreneurship[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    id: null,
    name: "",
  });

  // Estado para el modal de formulario (Crear/Editar)
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    biz: Entrepreneurship | null;
  }>({
    isOpen: false,
    biz: null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getMyEntrepreneurships();
      setItems(data);
    } catch {
      toast.error("Error cargando emprendimientos.");
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    fetchData();
  }, []);

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, id, name });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null, name: "" });
  };

  const openFormModal = (biz: Entrepreneurship | null = null) =>
    setFormModal({ isOpen: true, biz });
  const closeFormModal = () => setFormModal({ isOpen: false, biz: null });

  const confirmDelete = async () => {
    if (!deleteModal.id) return;

    try {
      setIsDeleting(true);
      await deleteEntrepreneurship(deleteModal.id);
      toast.success(`${deleteModal.name} eliminado con exito.`);
      await fetchData(); // Refrescar lista
      closeDeleteModal();
    } catch {
      toast.error("Error eliminando el emprendimiento");
    } finally {
      setIsDeleting(false);
    }
  };

  const saveEntrepreneurship = async (
    id: string | undefined,
    data: { name: string },
  ) => {
    setIsSaving(true);
    try {
      if (id) {
        // MODO EDICIÓN
        const updated = await updateEntrepreneurship(id, data);
        setItems((prev) =>
          prev.map((item) => (item.id === id ? updated : item)),
        );
        toast.success("Emprendimiento actualizado con éxito");
        await fetchData();
      } else {
        // MODO CREACIÓN
        const created = await createEntrepreneurship(data);
        setItems((prev) => [created, ...prev]);
        toast.success("Emprendimiento creado con éxito");
        await fetchData();
      }
      closeFormModal();
    } catch (error) {
      console.error(error);
      toast.error("Hubo un error al intentar guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    items,
    loading,
    isDeleting,
    deleteModal,
    formModal,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    openFormModal,
    closeFormModal,
    isSaving,
    saveEntrepreneurship,
    fetchData,
  };
}
