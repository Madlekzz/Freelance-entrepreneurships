import { message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  approveAccessRequest,
  getPendingRequests,
  rejectAccessRequest,
  type SignupRequest,
} from "../services/authService";

export const useSignupRequests = () => {
  const [requests, setRequests] = useState<SignupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 1. Estado para el término de búsqueda
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // 2. Lógica de filtrado con useMemo
  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;

    const lowerQuery = searchQuery.toLowerCase();

    return requests.filter((req) => {
      // Filtramos por nombre de usuario o por email
      return (
        req.user_name.toLowerCase().includes(lowerQuery) ||
        req.email.toLowerCase().includes(lowerQuery)
      );
    });
  }, [requests, searchQuery]);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await approveAccessRequest(id);
      const successMsg = "Solicitud aprobada con éxito";
      toast.success(successMsg);
      // Actualizamos la lista base (requests)
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al aprobar";
      message.error(errorMsg);
      toast.error(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (id: string) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const closeRejectModal = () => {
    if (!isRejecting) {
      setIsModalOpen(false);
      setSelectedId(null);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedId) return;
    setIsRejecting(true);
    try {
      await rejectAccessRequest(selectedId);
      // Actualizamos la lista base (requests)
      setRequests((prev) => prev.filter((r) => r.id !== selectedId));
      setIsModalOpen(false);
      toast.success("Solicitud rechazada exitosamente");
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Error al rechazar";
      toast.error(errorMsg);
    } finally {
      setIsRejecting(false);
      setSelectedId(null);
    }
  };

  return {
    // Retornamos las solicitudes filtradas
    requests: filteredRequests,
    // Retornamos la lista original por si necesitas contar el total real
    rawRequests: requests,
    loading,
    searchQuery,
    setSearchQuery,
    processingId,
    isRejecting,
    isModalOpen,
    isInitialLoading: loading && requests.length === 0,
    handleApprove,
    openRejectModal,
    closeRejectModal,
    handleConfirmReject,
    refresh: fetchRequests,
  };
};
